
import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PieceRental } from '@model/piece-rental';
import { Rental } from '@model/rental';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { PieceService } from '@service/piece/piece.service';
import { RentalService } from '@service/rental/rental.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-piece-add',
  templateUrl: './piece-add.component.html',
  styleUrls: ['./piece-add.component.scss']
})
export class PieceAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = '';
  form: FormGroup;
  submit: boolean = false;
  edit: boolean = false;
  rental: Rental;
  piece: PieceRental;
  required = Globals.required;
  global = {country: Globals.country, device: Globals.device}

  constructor(
    
    public toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private pieceService: PieceService,
    private rentalService: RentalService,
    private uploadService: UploaderService
  ) {
    this.edit = this.pieceService.edit;
    this.piece = this.pieceService.getPiece();
    this.rental = this.rentalService.getRental();
    this.title = (!this.edit) ? 'Ajouter une pièce a une locative' : 'Modifier une pièce de la locative ' + this.piece?.libelle;
    this.newForm();
    if(this.rental){
      this.f.rental.setValue(this.rental.uuid)
    }
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      folderUuid: [null],
      numero: [null, [Validators.required]],
      rental: [null, [Validators.required]],
      libelle: [null, [Validators.required]],
      description: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    });
  }
  editForm() {
    if (this.edit) {
      const data = {...this.pieceService.getPiece()};
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder ? data?.folder?.uuid : null);
    }
  }
  files(data) {
    if(data && data !== null){
      data.forEach(item => {
        this.folder.push(
          this.formBuild.group({
            uuid: [item?.uuid, [Validators.required]],
            name: [item?.name],
            path: [item?.path]
          })
        );
      });
    }
  }
  upload(files) {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value) {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, {[property]: value});
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }
  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      this.pieceService.add(this.form.value).subscribe(
        res => {
          if (res?.status === 'success') {
            this.activeModal.dismiss();
            this.emitter.emit({action: this.edit ? 'PIECE_UPDATED' : 'PIECE_ADD', payload: res?.data});
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.toast('Votre formualire n\'est pas valide.', 'Attention !', 'warning');
      return;
    }
  }
  onConfirme() {
    Swal.fire({
      title: '',
      text: 'Confirmez-vous l\'enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.onSubmit();
      }
    });
  }
  onClose(){
    if (!this.edit && this.form.value.folderUuid) {
      var data = {uuid: this.form.value.folderUuid, path: 'locative'}
      this.uploadService.getDelete(data).subscribe((res: any) => {
        if (res) {
          if (res?.status === 'success') {
            this.activeModal.close(res);
            this.form.reset()
            this.activeModal.close('ferme');
          }
        }
        return res
      });
    }else{
      this.form.reset()
      this.activeModal.close('ferme');
    }
  }
  onReset(){
    if (this.form.value.folderUuid) {
      this.toast('Impossible de de vider le formulaire lorsque un upload a été éffectué', 'Une erreur a été rencontrée', 'warning');
    }else{
      this.form.reset()
      this.form.controls['folderUuid'].setValue(null);
    }
  }
  toast(msg, title, type) {
    if (type == 'info') {
      this.toastr.info(msg, title);
    } else if (type == 'success') {
      this.toastr.success(msg, title);
    } else if (type == 'warning') {
      this.toastr.warning(msg, title);
    } else if (type == 'error') {
      this.toastr.error(msg, title);
    }
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }
  get f() { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}
