import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Syndic } from '@model/syndic/syndic';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanComptableService } from '@service/configuration/plan-comptable.service';
import { CountryService } from '@service/country/country.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { TantiemeService } from '@service/syndic/tantieme.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { OwnerCoService } from '@service/owner-co/owner-co.service';


@Component({
  selector: 'app-syndic-add',
  templateUrl: './syndic-add.component.html',
  styleUrls: ['./syndic-add.component.scss']
})
export class SyndicAddComponent implements OnInit {

  form: FormGroup
  submit: boolean = false
  edit: boolean =false
  syndic: Syndic
  title: string = ''
  countrys: any[] = []
  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;
  map?: any;
  mois = [
    {label: 'Janvier', value: 1},
    {label: 'février', value: 2},
    {label: 'Mars', value: 3},
    {label: 'Avril', value: 4},
    {label: 'Mai', value: 5},
    {label: 'Juin', value: 6},
    {label: 'Juillet', value: 7},
    {label: 'Août', value: 8},
    {label: 'Septembre', value: 9},
    {label: 'Octobre', value: 10},
    {label: 'Novembre', value: 11},
    {label: 'Décembre', value: 12},
  ]
  currentYear: any;
  agency = Globals.user.agencyKey
  contactPrSyndicSelected: any
  tantiemeSelected: any
  coproprietaireSelected: any
  tantiemes = [
    {label: 'Tantième 1', value: 'Tantième 1'},
    {label: 'Tantième 2', value: 'Tantième 2'},
    {label: 'Tantième 3', value: 'Tantième 4'},
  ]

  mode = [
    {label: 'Millièmes', value: 'TANTIEME'},
    {label: 'Montant fixe', value: 'MONTANT_FIXE'}
  ]
  accountSelected:any
  libelleSyndic: string = ''
  modeTantieme = true;
  ownersCo: any[] = []

  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private syndicService: SyndicService,
    public uploadService: UploaderService,
    private countryService: CountryService,
    private tantiemeService: TantiemeService,
    private planComptableService: PlanComptableService,
    public ownerCoService: OwnerCoService,
  ) {
    this.edit = this.syndicService.edit
    this.syndic = this.syndicService.getSyndic()
    const nom = this.syndic ? this.syndic.nom : ''
    this.title = (!this.edit) ? 'Ajouter un nouveau syndic' : 'Modifier le syndic ' + nom;
    this.countryService.getList().subscribe((res: any) => {
      this.countrys = res
    })
    this.tantiemeService.getList(null, null).subscribe((res: any) => {
      this.tantiemes = res
    })
   
    this.currentYear = new Date().getFullYear();
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      nom: [null, [Validators.required]],
      pays: [null, [Validators.required]],
      ville: [null, [Validators.required]],
      commune: [null, [Validators.required]],
      quartier: [null],
      debutExercice: [null],
      tantieme: [null],
      lng: [null],
      lat: [null],
      zoom: [null],
      agency: [this.agency],
      folderUuid: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      account: [null],
      numero:[null],
      cheque: [null, [Validators.required]],
      mode: ['TANTIEME', [Validators.required]],
      cotisation: [0, [Validators.required, Validators.min(0)]],
    })
  }

  editForm(){
    if (this.edit) {
      const data = {...this.syndicService.getSyndic()};
      this.syndicService.getSingle(data.uuid).subscribe((res: any) => {
        this.generateNumero((data.auxiliairy ? data.auxiliairy.uuid : null), data.nom)
        if (data.account) {
          this.accountSelected = {
            title: data.account.searchableTitle,
            detail: data.account.searchableDetail
          }
        }
        this.form.patchValue(res);
        this.syndic = res
        this.f.cotisation.setValue(res?.montantCotisation);
        this.tantiemeService.getList(null, null).subscribe((res: any) => {
          this.tantiemes = res
        })
        this.tantiemeService.getTantiemeTrustee(data.uuid).subscribe((res: any) => {
          let dataUuid = []
          res.forEach((element: any) => {
            dataUuid.push(element.uuid)
          })
          this.f.tantieme.setValue(dataUuid)
        })
        res.pays = res.pays ? res.pays.uuid : null
        this.countryService.getList().subscribe((res: any) => {
          this.countrys = res
        })
        this.contactPrSyndicSelected = res.contactPrSyndic
        this.f.folderUuid.setValue(res?.folder?.uuid);
        this.f.pays.setValue(res.pays)
      })
    }
  }

  onLibelleSyndic(libelle){
    this.libelleSyndic = libelle
  }

  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      const syndic = this.form.getRawValue();
      this.syndicService.add(syndic).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.close('SYNDIC');
            this.emitter.emit({ action: this.edit ? 'SYNDIC_UPDATED' : 'SYNDIC_ADD', payload: res?.data });
            if(!this.edit){
              Swal.fire(
                'Félicitations',
                'Vous venez de créer un syndic, vous pouvez à présent créer les copropriétaires et les lots!',
                'success'
              )
            }
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.emitter.stopLoading();
      this.toast('Certaines informations obligatoires sont manquantes ou mal formatées', 'Formulaire invalide', 'warning');
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

  setContact(event, type: string) {
    let value = null;
    if (type === 'contactPrSyndic') {
      value = this.form.get('contactPrSyndic').value
    }
    let valeur = (this.edit && event === null) ? value : event;
    if (type === 'contactPrSyndic') {
      this.form.get('contactPrSyndic').setValue(valeur)
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

  onReset() {
    if (this.form.value.folderUuid) {
      this.toast('Impossible de de vider le formulaire lorsque un upload a été éffectué', 'Une erreur a été rencontrée', 'warning');
    } else {
      this.form.reset()
      this.formBuild.array([])
      this.form.controls['folderUuid'].setValue(null);
    }
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

  onClose() {
    if (!this.edit && this.form.value.folderUuid) {
      var data = { uuid: this.form.value.folderUuid, path: 'locataire' }
      this.uploadService.getDelete(data).subscribe((res: any) => {
        if (res) {
          if (res?.status === 'success') {
            this.form.reset()
            this.modal.close('ferme');
          }
        }
        return res
      });
    } else {
      this.form.reset()
      this.modal.close('ferme');
    }
  }

  // onClose(){
  //   this.form.reset()
  //   this.modal.close('ferme');
  // }

  setAccountUuid(uuid) {
    if(uuid){
      this.f.account.setValue(uuid);
      if (this.f.nom.value) {
        this.generateNumero(uuid, this.f.nom.value)
      }
    } else {
      this.f.account.setValue(null);
    }
  }

  onNomChange() {
    let accountUuid = this.f.account.value
    let libelle = this.f.nom.value
    if (accountUuid && libelle) {
      this.generateNumero(accountUuid, libelle)
    }
  }

  onChangeTypeCotisation(value) {
    if(value == 'MONTANT_FIXE'){
      this.modeTantieme = false;
    } else {
      this.modeTantieme = true;
    }
  }

  generateNumero(uuid, libelle) {
    if (uuid && libelle) {
      this.planComptableService.getSingle(uuid).subscribe((res) => {
        if (res) {
          let string = res.baseNumero.toString()
          let label_prefix = libelle.substring(0, 3).toUpperCase();
          let numero = string + label_prefix;

          if (numero.length < 6) {
            while (numero.length < 6) {
              string += "0";
              numero = string + label_prefix;
            }
          } else if (numero.length > 6) {
            let difference = numero.length - 6;
            string = string.slice(0, -difference);
            numero = string + label_prefix;
          }

          this.f.numero.setValue(numero)
        }
      })
    }
  }

  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }

}
