
import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Ressource } from '@model/ressource';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { RessourceTiersService } from '@service/ressource-tiers/ressource-tiers.service';
import { TicketService } from '@service/ticket/ticket.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.scss']
})
export class RapportComponent implements OnInit {
  publicUrl = environment.publicUrl;
  form: FormGroup;
  title = null;
  submit = false;
  Types = []
  evalutions = []
  immobilisationRow = []
  objet: Object[] = [];
  fileT: any;
  objetSelected: any;
  ressource: Ressource;
  edit: boolean = false;

  constructor(
  private router: Router,
  private FormBuild: FormBuilder,
  private modalService: NgbModal,
  private formBuild: FormBuilder,
  public modal: NgbActiveModal,
  public ticketService: TicketService,
  public toastr: ToastrService,
  private emitter: EmitterService,
  public uploadService: UploaderService
  ) {
    this.title = "Fermer le ticket";
    this.newForm()

  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {}


  ngOnInit(): void {

  }


  editer (){

  }

  loadfile($event){

  }
  onAdd(){}
  newForm() {
    this.form = this.FormBuild.group({
      id: [null],
      uuid: [null],
      aboutie:[null, [Validators.required]],
      objet: [null,[Validators.required]],
      description: [null,[Validators.required]],
      files: this.FormBuild.array([]),
      folders: this.FormBuild.array([]),
      ticket: [this.ticketService.uuid]
    });
  }
  onClose() {
    this.form.reset()
    this.modal.close('ferme');
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
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.ticketService.ferme(this.form.value).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: 'TICKET_FERME', payload: res?.data});
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.toast('Votre formualire n\'est pas valide.', 'Attention !', 'warning');
      return;
    }
  }
  upload(files): void {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value): void {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, {[property]: value});
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }
  showFile(item) {
    const fileByFolder = this.uploadService.getDataFileByFolder();
    this.fileT = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }

  closeViewer() {
    this.fileT = '';
    this.uploadService.setDataFileByFolder('');
  }

  files(data) {
    if (data && data !== null) {
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

  onReset() {
    this.form.reset()
  }

toast(msg, title, type): void {
    if (type === 'info') {
      this.toastr.info(msg, title);
    } else if (type === 'success') {
      this.toastr.success(msg, title);
    } else if (type === 'warning') {
      this.toastr.warning(msg, title);
    } else if (type === 'error') {
      this.toastr.error(msg, title);
    }
  }
  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }

}

