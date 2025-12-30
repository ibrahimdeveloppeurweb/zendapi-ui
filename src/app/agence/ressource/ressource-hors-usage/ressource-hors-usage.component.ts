import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Ressource } from '@model/ressource';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { RessourceTiersService } from '@service/ressource-tiers/ressource-tiers.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-ressource-hors-usage',
  templateUrl: './ressource-hors-usage.component.html',
  styleUrls: ['./ressource-hors-usage.component.scss']
})
export class RessourceHorsUsageComponent implements OnInit {
  ESCAPE_KEYCODE = 27;
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
  ressource: Ressource
  fileO: any;
  edit: boolean = false;

  constructor(
  private router: Router,
  private FormBuild: FormBuilder,
  private modalService: NgbModal,
  private formBuild: FormBuilder,
  public modal: NgbActiveModal,
  public ressourceService: RessourceTiersService,
  public toastr: ToastrService,
  private emitter: EmitterService,
  public uploadService: UploaderService
  ) {
    this.title = "Mettre hors d'usage";
    this.newForm()

  }


  ngOnInit(): void {

  }







  onAdd(){}
  newForm() {
    this.form = this.FormBuild.group({
      id: [null],
      uuid: [null],
      objet: [null],
      description: [null],
      folderUuid: [null],
      files: this.FormBuild.array([]),
      folders: this.FormBuild.array([]),
      ressource: [this.ressourceService.uuid]
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
      const form = this.form.getRawValue();
      this.ressourceService.hs(form).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: 'RESSOURCE_HORS_SERVICE', payload: res?.data});
            this.router.navigate(['/admin/ressource'])
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.toast('Votre formualire n\'est pas valide.', 'Attention !', 'warning');
      return;
    }
  }


  loadfile(data) {
    if (data && data !== null) {
      const file = data.todo.file
      this.file.push(
        this.formBuild.group({
          uniqId: [data.todo.uniqId, [Validators.required]],
          fileName: [file.name, [Validators.required]],
          fileSize: [file.size, [Validators.required]],
          fileType: [file.type, [Validators.required]],
          loaded: [data.todo.loaded, [Validators.required]],
          chunk: [data.chunk, [Validators.required]],
        })
      );
    }
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
  upload(files): void {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value): void {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, { [property]: value });
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }


  showFile(item) {
    const fileByFolder = this.uploadService.getDataFileByFolder();
    this.fileO = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.fileO = '';
    this.uploadService.setDataFileByFolder('');
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
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
