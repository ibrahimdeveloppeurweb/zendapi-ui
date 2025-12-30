import { ToastrService } from 'ngx-toastr';
import { Ressource } from '@model/ressource';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import { SousFamille } from '@model/sous-famille';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, HostListener, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { FamilleService } from '@service/famille/famille.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SousFamilleService } from '@service/sousFamille/sous-famille.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RessourceTiersService } from '@service/ressource-tiers/ressource-tiers.service';
import { SousFamilleAddComponent } from '@agence/ressource/sousFamille/sous-famille-add/sous-famille-add.component';


@Component({
  selector: 'app-ressource-add',
  templateUrl: './ressource-add.component.html',
  styleUrls: ['./ressource-add.component.scss']
})
export class RessourceAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  form: FormGroup;
  submit = false;
  required = Globals.required;
  title = null; 
  familleSelected: any; 
  sousFamilleSelected: any; 
  type = '';
  edit: boolean = false;
  sousFamilles: SousFamille[] = [];
  sousFamille: SousFamille;

  immobilisationRow = [
    {label: 'Corporelle', value: 'CORPORELLE'},
    {label: 'Incorporelle', value: 'INCORPORELLE'},
  ];
  Types = [
    {label: 'Ressource de base', value: 'BASE'},
    {label: 'Ressource composite', value: 'COMPOSITE'}
  ]
  evalutions = [
    {label: 'FIFO', value: 'FIFO'},
    {label: 'PEPS', value: 'PEPS'},
    {label: 'LIFO', value: 'LIFO'},
  ]
  fileT: any;
  publicUrl = environment.publicUrl;
  ressource: Ressource
  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public uploadService: UploaderService,
    private familleService: FamilleService,
    private sousFamilleService: SousFamilleService,
    private ressourceService: RessourceTiersService
  ) { 
    this.edit = this.ressourceService.edit
    this.ressource = this.ressourceService.getRessource()
    this.title = (!this.edit) ? 'Ajouter une ressource' : 'Modifier la ressource ' ;
    this.newForm()
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'SOUS_ADD') {
        this.sousFamilles.unshift(data.payload);
      }
    });
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      qte: [0],
      prix: [0],
      type: [null],
      unite: [null],
      methode: [null],
      folderUuid: [null],
      description: [null],
      codeGestion: [null],
      preCode: [null],
      postCode: [null,[Validators.required]],
      immobilisation: [null],
      libelle: [null, [Validators.required]],
      famille: [null, [Validators.required]],
      sousFamille: [null, [Validators.required]],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    });

  }
  editForm() {
    if (this.edit) {
      const data = {...this.ressourceService.getRessource()};
      this.form.patchValue(data);
      this.loadSousFamille(data.sousFamille.famille.uuid)
      this.f.famille.setValue(data.sousFamille.famille.uuid)
      this.f.sousFamille.setValue(data.sousFamille.uuid)
      this.familleSelected = {
        photoSrc: data.sousFamille.famille.photoSrc,
        title: data.sousFamille.famille.searchableTitle,
        detail: data.sousFamille.famille.searchableDetail
      };
      this.sousFamilleSelected = data.sousFamille.uuid,
      this.f.preCode.setValue(data.codeGestion)
    }
  }
  setFamilleUuid(uuid){
    if(uuid){
      this.f.famille.setValue(uuid)
      this.loadSousFamille(uuid)
    }else{
      this.f.famille.setValue(null)
      this.familleSelected = null
      this.sousFamilles = []
    }
  }

  onInputChangePostCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.f.codeGestion.setValue(this.f.preCode.value+input.value.toUpperCase())
  }

  loadSousFamille(uuid){
    if(uuid){
      this.sousFamilleService.getList(uuid).subscribe((res: any)=> {
        this.sousFamilles = res;
        } , error => {}
      );
    }
  }
  onChangeSousFamille($event){
     if($event){
        this.sousFamilleService.getSingle($event).subscribe((res: any)=> {
          } , error => {}
        );
      }
      
  }
  onAdd(){
    this.modale(SousFamilleAddComponent, 'modal-basic-title', 'md', true, 'static')
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
      const form = this.form.value;
      this.ressourceService.add(form).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: this.edit ? 'RESSOURCE_UPDATED' : 'RESSOURCE_ADD', payload: res?.data});
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
    if(data && data !== null){
      const file = data.todo.file
      this.file.push(
        this.formBuild.group({
          uniqId: [data.todo.uniqId, [Validators.required]],
          fileName: [file?.name, [Validators.required]],
          fileSize: [file?.size, [Validators.required]],
          fileType: [file?.type, [Validators.required]],
          loaded: [data?.todo.loaded, [Validators.required]],
          chunk: [data?.chunk, [Validators.required]],
        })
      );
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
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }
  onClose() {
    this.ressourceService.setRessource(null)
    this.form.reset()
    this.modal.close('ferme');
  }
  onReset() {
    this.form.reset()
  }
  modale(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
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
