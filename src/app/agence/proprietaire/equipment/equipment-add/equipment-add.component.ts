import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { RentalService } from '@service/rental/rental.service';
import { Rental } from '@model/rental';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { UploaderService } from '@service/uploader/uploader.service';
import { ToastrService } from 'ngx-toastr';
import { EmitterService } from '@service/emitter/emitter.service';
import { PieceService } from '@service/piece/piece.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { PieceRental } from '@model/piece-rental';
import { Equipment } from '@model/equipment';
import { PieceAddComponent } from '@agence/proprietaire/piece/piece-add/piece-add.component';

@Component({
  selector: 'app-equipment-add',
  templateUrl: './equipment-add.component.html',
  styleUrls: ['./equipment-add.component.scss']
})
export class EquipmentAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = '';
  form: FormGroup;
  submit: boolean = false;
  edit: boolean = false;
  ownerUuid ?: null;
  isLoadingRental = false;
  rental: Rental;
  houseSelected: any
  equipment: Equipment;
  rentals: Rental[] = [];
  piecesRow: PieceRental[] = [];
  piece: PieceRental;
  required = Globals.required;
  global = {country: Globals.country, device: Globals.device}
  modalResult: NgbModalRef;
  documentSelected: any = "";

  constructor(
    public toastr: ToastrService,
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private pieceService: PieceService,
    private rentalService: RentalService,
    private uploadService: UploaderService
  ) {
    this.edit = this.rentalService.edit;
    this.rental = this.rentalService.getRental();
    this.title = (!this.edit) ? 'Ajouter un équipement a une locative' : 'Modifier un équipement de la locative ' + this.equipment?.libelle;
    this.newForm();
    console.log(this.rental)
    if(this.rental){
      this.f.house.setValue(this.rental.house.uuid)
      this.loadRentals()
      this.f.rental.setValue(this.rental.uuid)
      this.houseSelected = this.rental.house
      this.load()
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
      house: [null],
      rental: [null, [Validators.required]],
      pieces: this.formBuild.array([]),
    });
  }
  editForm() {
    if (this.edit) {
      const data = {...this.rentalService.getRental()};
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder ? data?.folder?.uuid : null);
    }
  }
  load() {
    this.rental.pieces.forEach((piece) => {
      let options = this.formBuild.array([]);
      piece.options.forEach((x) => {
        options.push(
          this.formBuild.group({
            uuid: [x?.uuid],
            id: [x?.id],
            libelle: [x?.description],
            equipment: [x?.equipment?.uuid, [Validators.required]],
            equipmentSelected: [{title: x?.equipment.searchableTitle, detail: x?.equipment.searchableDetail}],
          })
        )
      })
      this.pieces.push(
        this.formBuild.group({
          id: [piece?.id],
          uuid: [piece?.uuid],
          libelle: [piece?.libelle, [Validators.required]],
          options: options
        })
      )
    });
  }
  setHouseUuid(uuid) {
    if(uuid){
      this.f.house.setValue(uuid);
      this.loadRentals();
    }else{
      this.f.rental.setValue(null);
      this.f.rental.setValue(null);
      this.rentals = [];
      this.rental = null;
    }
  }
  setEquipmentUuid(uuid, props) {
    if(uuid){
      props.get("equipment").setValue(uuid);
    }else{
      props.get("equipment").setValue(null);
    }
  }
  loadRentals() {
    this.isLoadingRental = true;
    if (!this.f.house.value) {
      this.isLoadingRental = false;
      this.rentals = [];
      return;
    }
    this.rentalService.getList(null, this.f.house.value).subscribe(res => {
      this.isLoadingRental = false;
      return this.rentals = res;
    }, error => {
      this.isLoadingRental = false;
    });
  }
  selectRental(event) {
    this.rental = this.rentals.find(
      item => {
        if (item.uuid === event.target.value) { return item; }
      }
    );
    this.form.get('rental').setValue(this.rental ? this.rental.uuid : null);
  }
  onAddPiece() {
    return this.pieces.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        libelle: [null, [Validators.required]],
        equipements: this.formBuild.array([
          this.formBuild.group({
            uuid: [null],
            id: [null],
            file: [null],
            code: [null, [Validators.required]],
            libelle: [null, [Validators.required]],
            equipment: [null],
            equipmentSelected: [null],
          })
        ]),
      })
    );
  }
  itemEquipement(count: number): FormGroup[] {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(
        this.formBuild.group({
          uuid: [null],
          id: [null],
          file: [null],
          code: [null, [Validators.required]],
          libelle: [null, [Validators.required]],
          equipment: [null],
          equipmentSelected: [null],
        })
      );
    }
    return arr;
  }
  onAddEquipement(piece, count: number) {
    for (let i = 0; i < count; i++) {
      // @ts-ignore
      this.pieces.at(piece).get('equipements').push(
        this.formBuild.group({
          uuid: [null],
          id: [null],
          file: [null],
          code: [null, [Validators.required]],
          libelle: [null, [Validators.required]],
          equipment: [null],
          equipmentSelected: [null],
        })
      );
    }
  }
  onDeletePiece(row) {
    this.pieces.removeAt(row);
  }
  onDelete(room, equipment) {
    // @ts-ignore
    this.pieces.at(room).get('equipements').removeAt(equipment);
  }
  handleUpload(event, row) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.documentSelected = reader.result;
      row.get("file").setValue(this.documentSelected);
    };
  }
  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      this.rentalService.add(this.form.value).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modale.dismiss();
            this.modale.close('ferme');
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
            this.form.reset()
            this.modale.close('ferme');
          }
        }
        return res
      });
    }else{
      this.form.reset()
      this.modale.close('ferme');
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
  get pieces() { return this.form.get('pieces') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}
