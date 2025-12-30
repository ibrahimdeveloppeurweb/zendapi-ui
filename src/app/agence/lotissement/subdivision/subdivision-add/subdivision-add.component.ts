import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { Subdivision } from '@model/subdivision';
import { Globals } from '@theme/utils/globals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { EmitterService } from '@service/emitter/emitter.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { UploaderService } from '@service/uploader/uploader.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-subdivision-add',
  templateUrl: './subdivision-add.component.html',
  styleUrls: ['./subdivision-add.component.scss']
})
export class SubdivisionAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = ""
  edit: boolean = false
  subdivision: Subdivision
  form: FormGroup
  submit: boolean = false
  required = Globals.required
  homeTypeSelected?: any;
  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;
  map ?: any;
  etatRow = [
    {label: "INDISPONIBLE", value: "INDISPONIBLE"},
    {label: "DISPONIBLE", value: "DISPONIBLE"}
  ]
  typeRow = [
    {label: "RURAL", value: "RURAL"},
    {label: "URBAIN", value: "URBAIN"}
  ]
  espaceRow = [
    {label: "OUI", value: true},
    {label: "NON", value: false}
  ]

  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    public uploadService: UploaderService,
    private subdivisionService: SubdivisionService,
    private emitter: EmitterService
  ) {
    this.edit = this.subdivisionService.edit
    this.subdivision = this.subdivisionService.getSubdivision()
    this.title = (!this.edit) ? "Ajouter un lotissement" : "Modifier le lotissement "+this.subdivision?.nom;
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      type: ["RURAL", [Validators.required]],
      nom: [null, [Validators.required]],
      etat: ["DISPONIBLE", [Validators.required]],
      date: [null, [Validators.required]],
      superficie: [null, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      hectare: [null],
      are: [null],
      centiare: [null],
      nbrIlot: [null, [Validators.required]],
      ville: [null, [Validators.required]] ,
      commune: [null, [Validators.required]] ,
      quartier: [null, [Validators.required]],
      lng: [null],
      lat: [null],
      zoom: [null],
      folderUuid: [null],
      isOffre: [null, [Validators.required]],
      dateOffre: [null],
      islets: this.formBuild.array([]),
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    });
    this.form.get('isOffre').valueChanges.subscribe(res => {
      if(res === 'OUI') {
        this.form.get('dateOffre').setValidators(Validators.required);
      } else {
        this.form.get('dateOffre').clearValidators();
      }
      this.form.get('dateOffre').updateValueAndValidity();
    })
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.subdivisionService.getSubdivision() }
      this.lat = data.lat ? data.lat : Globals.lat;
      this.lng = data.lng ? data.lng : Globals.lng;
      this.form.get('uuid').setValue(this.subdivision.uuid);
      data.date = DateHelperService.fromJsonDate(data.date);
      this.form.patchValue(data)
      this.f.folderUuid.setValue(data?.folder?.uuid);
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.subdivisionService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.getRawValue().uuid) {
            this.emitter.emit({action: 'SUBDIVISION_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'SUBDIVISION_ADD', payload: res?.data});
          }
        }
      }, error => {});
    } else {
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
  onChangeIlot() {
    this.islet.controls.length = 0;
    var nbr = (this.f.nbrIlot.value >= 0) ? this.f.nbrIlot.value : 0;
    if (this.islet.controls.length < nbr) {
      for (let i = 0; i < nbr; i++) {
        var num = i + 1;
        this.islet.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            numero: [{value: num, disabled: true}, [Validators.required]],
            montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            nbrLot: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            espace: [false, [Validators.required]],
            superficie: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            superficieI: [this.f.superficie.value, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          })
        );
      }
      return this.islet;
    } else if (nbr === 0) {
      let i = this.islet.controls.length - (nbr === 0 ? 1 : nbr);
      return this.islet.removeAt(i);
    } else {
      return this.islet.controls.splice(0, this.islet.controls.length);
    }
  }
  onChangeEspace(item){
    if(item.get('espace').value === 'true'){
      item.get('montant').disable()
      item.get('superficie').disable()
    } else {
      item.get('montant').enable()
      item.get('superficie').enable()
    }
    item.get('montant').setValue(0)
    item.get('superficie').setValue(0)
  }
  loadfile(data) {
    if(data && data !== null){
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
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }
  onClose(){
    if (!this.edit && this.form.value.folderUuid) {
      var data = {uuid: this.form.value.folderUuid, path: 'locative'}
      this.uploadService.getDelete(data).subscribe((res: any) => {
        if (res) {
          if (res?.status === 'success') {
            this.form.reset()
            this.modal.close('ferme');
          }
        }
        return res
      });
    }else{
      this.form.reset()
      this.modal.close('ferme');
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
  updateGeo(event): void {
    const lat = event.coords.lat;
    const lng = event.coords.lng;
    this.lat = lat;
    this.lng = lng;
    this.form.controls.lat.setValue(event.coords.lat);
    this.form.controls.lng.setValue(event.coords.lng);
  }
  updateZoom(event): void {
    this.form.controls.zoom.setValue(event);
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

  get f() { return this.form.controls; }
  get islet() { return this.form.get('islets') as FormArray; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }

}
