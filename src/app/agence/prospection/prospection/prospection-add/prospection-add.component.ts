import { Ville } from '@model/ville';
import { Common } from '@model/common';
import { Quartier } from '@model/quartier';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { VilleService } from '@service/ville/ville.service';
import { CommonService } from '@service/common/common.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { QuartierService } from '@service/quartier/quartier.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProspectionService } from '@service/prospection/prospection.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CityAddComponent } from '@agence/parametre/city/city-add/city-add.component';
import { CommonAddComponent, } from '@agence/parametre/common/common-add/common-add.component';
import { NeighborhoodAddComponent, } from '@agence/parametre/neighborhood/neighborhood-add/neighborhood-add.component';

@Component({
  selector: 'app-prospection-add',
  templateUrl: './prospection-add.component.html',
  styleUrls: ['./prospection-add.component.scss']
})
export class ProspectionAddComponent implements OnInit {

  title = null;
  type = '';
  status = 'ACHAT';
  edit: boolean = false;
  disponible: string = '';
  completed: boolean = false;
  transformation: boolean = false;
  prospect: any;
  form: FormGroup;
  submit = false;
  required = Globals.required;
  publicUrl = environment.publicUrl;
  citySelected:any;
  commonSelected:any;
  cities: Ville[] = [];
  ville: Ville;
  common: Common;
  commons: Common[] = [];
  quartiers: Quartier[] = [];
  quartier: Quartier;
  civilityRow = [
    { label: 'Monsieur', value: 'Mr' },
    { label: 'Madame', value: 'Mme' },
    { label: 'Mademoiselle', value: 'Mlle' }
  ];
  sourceRow = [
    { label: 'Panneau Publicitaire', value: 'Panneau Publicitaire' },
    { label: 'Facebook Lead', value: 'Facebook Lead' },
    { label: 'SeneWeb', value: 'SeneWeb' },
    { label: 'Pro-active', value: 'Pro-active' },
    { label: 'Recommandation', value: 'Recommandation' },
    { label: 'Bureau', value: 'Bureau' },
    { label: 'Newsletter', value: 'Newsletter' },
    { label: 'WhatsApp', value: 'WhatsApp' },
    { label: 'Appel', value: 'Appel' },
    { label: 'Parrainage', value: 'Parrainage' },
    { label: 'Bouche a oreille', value: 'Bouche a oreille' },
    { label: 'Emailing ', value: 'Emailing ' }
  ];
  booleanRow = [
    { label: 'OUI', value: 'OUI' },
    { label: 'NON', value: 'NON' }
  ];
  typeRow = [
    { label: 'Locataire', value: 'Locataire' },
    { label: 'Propriétaire', value: 'Propriétaire' },
    { label: 'Client', value: 'Client' },

  ];
  professionRow = [
    { label: 'Fonctionnaire', value: 'Fonctionnaire' },
    { label: "Chef d'entreprise", value: "Chef d'entreprise" },
    { label: "Profession libérales" , value: "Profession libérales" },
    { label: "Cadre supérieur secteur privé", value: "Cadre supérieur secteur privé" },
    { label: "Commerçants", value: "Commerçants" },
    { label: 'Autre, à préciser', value: 'Autre, à préciser' }
  ];
  maritalRow = [
    { label: 'Célibataire', value: 'Célibataire' },
    { label: 'Marié(e)', value: 'Marié(e)' },
    { label: 'Veuve', value: 'Veuve' },
    { label: 'Veuf', value: 'Veuf' }
  ];
  professionnelleRow = [
    { label: 'Agent de l\'Etat', value: 'Agent de l\'Etat' },
    { label: 'Agent(e) du secteur privé', value: 'Agent(e) du secteur privé' },
    { label: 'Artisan(e)', value: 'Artisan(e)' },
    { label: 'Agriculteur', value: 'Agriculteur' },
    { label: 'Profession libérale', value: 'Profession libérale' },
    { label: 'Commerçant(e)', value: 'Commerçant(e)' },
    { label: 'Autre, à préciser', value: 'Autre, à préciser' },
  ]

  pieceRow = [
    { label: 'CNI', value: 'CNI' },
    { label: 'ONI', value: 'ONI' },
    { label: 'Carte Consulaire', value: 'Carte Consulaire' },
    { label: 'Passeport', value: 'Passeport' },
    { label: 'Permis de conduire', value: 'Permis de conduire' },
    { label: 'Autres pieces', value: 'Autres' }
  ];
  checking = []
  fileO: any;
  besoinRow = [
    { label: 'LOCATION', value: 'LOCATION'},
    { label: 'GESTION', value: 'GESTION'},
    { label: 'ACHAT', value: 'ACHAT'}

  ]
  bienRow = [
    {label: 'OUI', value: 'OUI'},
    {label: 'NON', value: 'NON'}
  ]

  numbWhatsappSelected: string = null;
  telephoneSelected: string = null;
  quartierSelected:any;
  selected: null;
  
  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private villeService: VilleService,
    private commonService: CommonService,
    public uploadService: UploaderService,
    private quartierService: QuartierService,
    public prospectionService: ProspectionService
  ) {
    this.edit = this.prospectionService.edit;
    this.completed = this.prospectionService.completed;
    this.transformation = this.prospectionService.transformation;
    this.type = this.prospectionService.type;
    this.status = this.prospectionService.status;
    this.prospect = this.prospectionService.getProspection();
    if (this.transformation ) {
      this.title = 'Conversion du prospect en client';
    }else {
      this.title = (!this.edit) ? 'Ajouter un prospect' : 'Modifier le prospect ' + this.prospect.nom;
    }
    this.newForm()
    this.checkForm(this.prospect);
  }

  ngOnInit(): void {
    this.loadCitys()
    this.loadQuartier()
    this.editForm()
    this.updateDatas()
  }

  updateDatas(){
    this.emitter.event.subscribe((data) => {
      if (data.action === 'CITY_ADD') {
        this.cities.push(data.payload);
      }
      if (data.action === 'COMMON_ADD') {
        const com = data.payload
        console.log(this.f.city.value, com)
        if(this.f.city.value === com.city.uuid){
          this.commons.push(com);
        }
      }
      if (data.action === 'QUARTIER_ADD'){
        const neig = data.payload
        console.log(this.f.common.value, neig)
        if (this.f.common.value === neig.common.uuid){
          this.quartiers.push(neig);
        }
      }
    });
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      bien:[null],
      uuid: [null],
      revenueL:[0],
      city: [null],
      email: [null],
      bienM: [null],
      niveau:[null],
      typeP: [null],
      enfant: [null],
      common: [null],
      besoin: [null],
      type: this.type,
      statutM: [null],
      contact: [null],
      pourcentage: [0],
      nbEnfant: [null],
      nbrPiece: [null],
      quartier: [null],
      folderUuid: [null],
      nbrLocative:[null],
      commentaire:[null],
      profession: [null],
      autresSource: [null],
      numbWhatsapp: [null],
      site: ['BACK-OFFICE'],
      disponible: [this.disponible],
      min: [0, [Validators.required]],
      max: [0, [Validators.required]],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      nom: [null, [Validators.required]],
      source: [null, [Validators.required]],
      civilite: ['Mr', [Validators.required]],
      telephone: [null, [Validators.required]],
      status: [this.status, [Validators.required]],
      sexe: [{ value: 'Masculin', disabled: true }, [Validators.required]],
      superficie: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
    })
  }

  editForm(){
    if (this.edit) {
      const data = {...this.prospectionService.getProspection()};
      data.dateN = DateHelperService.fromJsonDate(data?.dateN);
      data.dateExpire = DateHelperService.fromJsonDate(data?.dateExpire);
      data.dateEmission = DateHelperService.fromJsonDate(data?.dateEmission);
      this.form.patchValue(data);
    }
  }
  checkForm(item){
    if(this.edit){
      if (!item.civilite || item.civilite === undefined ||  item.civilite === null || item.civilite === "null") { this.checking.push("Civilité") }
      if (!item.nom || item.nom === undefined ||  item.nom === null || item.nom === "null") { this.checking.push("Nom") }
      if (!item.email || item.email === undefined ||  item.email === null || item.email === "null") { this.checking.push("Adresse Email") }
      if (!item.telephone || item.telephone === undefined &&  item.telephone === null || item.telephone === "null") { this.checking.push("Numero de Telephone")  }
      if (!item.sexe || item.sexe === undefined || item.sexe === null || item.sexe === "null") {  this.checking.push("Sexe")  }
      if (!item.dateN || item.dateN === undefined || item.dateN === null || item.dateN === "null") { this.checking.push("Date de Naissance") }
      if (!item.lieuN || item.lieuN === undefined || item.lieuN === null || item.lieuN === "null") {  this.checking.push("Lieu de Naissance")  }
      if (!item.nationalite || item.nationalite === undefined || item.nationalite === null || item.nationalite === "null") {  this.checking.push("La nationalité")  }
      if (!item.adresse || item.adresse === undefined || item.adresse === null || item.adresse === "null") {  this.checking.push("L'adresse")  }
      if (!item.profession || item.profession === undefined || item.profession === null || item.profession === "null") {  this.checking.push("La profession")  }
      if (!item.situation || item.situation === undefined || item.situation === null || item.situation === "null") {  this.checking.push("La situation matrimoniale")  }
      if (!item.pays || item.pays === undefined || item.pays === null || item.pays === "null") {  this.checking.push("Le pays de residence")  }
      if (!item.paysDeli || item.paysDeli === undefined || item.paysDeli === null || item.paysDeli === "null") {  this.checking.push("Le pays de delivrance")  }
      if (!item.piece || item.piece === undefined || item.piece === null || item.piece === "null") {  this.checking.push("La nature de piece")  }
      if (!item.numPiece || item.numPiece === undefined || item.numPiece === null || item.numPiece === "null") {  this.checking.push("Le numero de piece")  }
      if (!item.dateExpire || item.dateExpire === undefined || item.dateExpire === null || item.dateExpire === "null") {  this.checking.push("La date d'expiration de la piece")  }
      if (!item.dateEmission || item.dateEmission === undefined || item.dateEmission === null || item.dateEmission === "null") {  this.checking.push("La date d'emission de la piece")  }
    }
  }

  onChange(champ): any {
    if (champ === 'type') {
      return this.type = this.f.type.value;
    }
  }
  onChangeType($event) {
    const value = $event.target.value;
    let besoinValue;
  
    if (value === 'Locataire') {
      besoinValue = 'LOCATION';
    } else if (value === 'Propriétaire') {
      besoinValue = 'GESTION';
    } else if (value === 'Client'){
      besoinValue = 'ACHAT'
    }
  
    if (besoinValue) {
      this.form.get('besoin').setValue(besoinValue);
      this.form.get('besoin').disable();
    }
  }
  onChangeLocative(){

  }
  loadNiveau(){}
  
  onAdd(type){
    if(type === "VILLE"){
      this.modale(CityAddComponent, 'modal-basic-title', 'md', true, 'static');
    }else if (type === "COMMUNE") {
      this.modale(CommonAddComponent, 'modal-basic-title', 'md', true, 'static');
    } else if (type === "QUARTIER") {
      this.modale(NeighborhoodAddComponent, 'modal-basic-title', 'md', true, 'static');
    }
  }
  
  modale(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  
  selectCity(value) {
    this.cities = [];
    this.ville = null;
    this.f.city.setValue(null);
    if (!this.edit) {
      this.ville = this.cities.find(item => {
        if (item.uuid === value) {
          this.f.ville.setValue(item.libelle);
          return item;
        }
      });
    }
  }
  loadCitys() {
    // if (!this.edit) {
      this.villeService.getList().subscribe(res => {
        this.cities = res;
        return this.cities;

      }, error => { });
    // }
  }
  selectQuartier(value) {
    this.quartiers = [];
    this.quartier = null;

    this.f.quartier.setValue(null);
    if (!this.edit) {
      this.quartier = this.quartiers.find(item => {
        if (item.uuid === value) {
          this.f.quartier.setValue(item.libelle);
          return item;
        }
      });
    }
    this.f.quartier.setValue(value);
  }
  setCityUuid($event) {
    const value = $event.target.value;
    if (value) {
    console.log(value);

      this.f.city.setValue(value)
      this.loadCommons(value)
    } else {
      this.f.city.setValue(null)
      this.selected = null
      this.commons = []

    }
  }

  onChangeCommon($event){
    if($event){
      this.commonService.getSingle($event).subscribe((res: any)=> {
        } , error => {}
      );
    }
  }
  onChangeVille($event){
    if($event){
      this.villeService.getSingle($event).subscribe((res: any)=> {
        } , error => {}
      );
    }
  }
  onChangeQuartier($event){
    if($event){
      this.quartierService.getSingle($event).subscribe((res: any)=> {
        } , error => {}
      );
    }
  }
  onSelectCity($event) {
    const value = $event.target.value;
    if (value) {
      this.f.city.setValue(value)
      this.loadCommons(value)
    } else {
      this.f.city.setValue(null)
      this.selected = null
      this.commons = []

    }
  }
  loadCommons(city: Ville) {
    console.log(city);
    
    this.commonService.getList(city).subscribe(res => {
      this.commons = res;
      return this.commons;
    }, error => { });
    this.form.get('libelle').reset();
  }
  
  loadQuartier() {
    this.quartierService.getList().subscribe(res => {
      this.quartiers = res;
      return this.quartiers;
    }, error => { });
    this.form.get('libelle').reset();
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

  onConvertir(){
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
        this.submit = true;
        this.emitter.loading();
        if (this.form.valid) {
          const data = this.form.getRawValue();
          this.prospectionService.convertir(data).subscribe(
            res => {
              if (res?.status === 'success') {
                this.modal.dismiss();
                this.modal.close('ferme');
                this.emitter.emit({ action: 'CUSTOMER_ADD', payload: res?.data });
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
    });

  }

  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      const data = this.form.getRawValue();
      this.prospectionService.add(data).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({ action: this.edit ? 'PROSPECT_UPDATED' : 'PROSPECT_ADD', payload: res?.data });
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

  onSexe() {
    if (this.f.civilite.value === 'Mr') {
      this.f.sexe.setValue('Masculin');
    } else if (this.f.civilite.value === 'Mme') {
      this.f.sexe.setValue('Féminin');
    } else if (this.f.civilite.value === 'Mlle') {
      this.f.sexe.setValue('Féminin');
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
      this.form.reset()
      this.modal.close('ferme');
  }
  onReset() {
      this.form.reset()
  }

  showFile(item) {
    const fileByFolder = this.uploadService.getDataFileByFolder();
    this.fileO = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.fileO = '';
    this.uploadService.setDataFileByFolder('');
  }
  setContact(event, type: string) {
    let value = null;
  
    if (this.form) {
      if (type === 'telephone') {
        const telephoneControl = this.form.get('telephone');
        value = telephoneControl ? telephoneControl.value : null;
      } else if (type === 'numbWhatsapp') {
        const whatsappControl = this.form.get('numbWhatsapp');
        value = whatsappControl ? whatsappControl.value : null;
      }
    }
  
    let valeur = (this.edit && event === null) ? value : event;
  
    if (type === 'telephone') {
      const telephoneControl = this.form.get('telephone');
      if (telephoneControl) {
        telephoneControl.setValue(valeur);
      }
    } else if (type === 'numbWhatsapp') {
      const whatsappControl = this.form.get('numbWhatsapp');
      if (whatsappControl) {
        whatsappControl.setValue(valeur);
      }
    }
  }
  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }

}
