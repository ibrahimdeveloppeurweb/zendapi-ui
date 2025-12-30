import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { Budget } from '@model/budget';
import { Syndic } from '@model/syndic/syndic';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BudgetService } from '@service/budget/budget.service';
import { EmitterService } from '@service/emitter/emitter.service'
import { OwnerService } from '@service/owner/owner.service';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { HomeCoService } from '@service/syndic/home-co.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { TantiemeService } from '@service/syndic/tantieme.service';
import { TenantService } from '@service/tenant/tenant.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { Globals } from '@theme/utils/globals';
import { OwnerCoService } from '@service/owner-co/owner-co.service';

@Component({
  selector: 'app-syndic-condominium-add',
  templateUrl: './syndic-condominium-add.component.html',
  styleUrls: ['./syndic-condominium-add.component.scss']
})
export class SyndicCondominiumAddComponent implements OnInit {

  form: FormGroup
  edit: boolean = false
  copropriete: any
  title: string = ''
  currentSyndic: any
  submit: boolean = false
  voir: boolean = false
  countrys= []
  owners: any[] = []
  types = [
    {label: 'Vertical', value: 'VERTICAL'},
    {label: 'Horizontal', value: 'HORIZONTAL'},
  ]
  numerotationRow = [
    { label: 'ALPHABET', value: 1 },
    { label: 'LIBRE SAISIE', value: 2 }
  ];
  typeRows = [
    {
      label: 'Habitation',
      type: [
        { label: 'APPARTEMENT', value: 'APPARTEMENT' },
        { label: 'PALIER', value: 'PALIER' },
        { label: 'VILLA', value: 'VILLA' },
        { label: 'STUDIO', value: 'STUDIO' },
      ]
    },
    {
      label: 'Commercial',
      type: [
        { label: 'MAGASIN', value: 'MAGASIN' },
        { label: 'BUREAU', value: 'BUREAU' },
        { label: 'SURFACE', value: 'SURFACE' },
        { label: 'RESTAURANT', value: 'RESTAURANT' },
        { label: 'HALL', value: 'HALL' },
        { label: 'SALLE CONFERENCE', value: 'SALLE CONFERENCE' },
        { label: 'PARKING', value: 'PARKING' }
      ]
    }
  ];
  typeRow = [
    {
      label: 'Habitation',
      type: [
        { label: 'APPARTEMENT', value: 'APPARTEMENT' },
        { label: 'PALIER', value: 'PALIER' },
      ]
    },
    {
      label: 'Commercial',
      type: [
        { label: 'MAGASIN', value: 'MAGASIN' },
        { label: 'BUREAU', value: 'BUREAU' },
        { label: 'SURFACE', value: 'SURFACE' },
        { label: 'RESTAURANT', value: 'RESTAURANT' },
        { label: 'HALL', value: 'HALL' },
        { label: 'SALLE CONFERENCE', value: 'SALLE CONFERENCE' },
        { label: 'PARKING', value: 'PARKING' }
      ]
    }
  ];
  numRow = [];
  boolRow = [
    { label: 'NON', value: false },
    { label: 'OUI', value: true }
  ];
  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;
  map?: any;
  agency = Globals.user.agencyKey
  contactSelected: any
  required = Globals.required
  ownerSelected: any
  currentOwnerItem: any
  currentTenantItem: any
  publicUrl = environment.publicUrl;
  tantiemeSelected: any
  tantiemes = []
  tantiemess = []
  categorieType: boolean = false
  advance: boolean = false
  syndics: any[] = []
  isBudgetValide = false;
  numLotHidden = true;
  budget: Budget;
  syndic: Syndic;
  showMilliemes = true;

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private modalService: NgbModal,
    private emitter: EmitterService,
    public uploadService: UploaderService,
    private homeCoService: HomeCoService,
    private ownerService: OwnerService,
    private syndicService: SyndicService,
    private tenantService: TenantService,
    private tantiemeService: TantiemeService,
    private coproprieteService: CoproprieteService,
    private budgetService: BudgetService,
    private ownerCoService: OwnerCoService
  ) {
    this.edit = this.coproprieteService.edit
    this.syndic = this.syndicService.getSyndic();
    if(this.syndic && this.syndic.mode === 'MONTANT_FIXE') {
      this.showMilliemes = false;
    }
    this.copropriete = this.coproprieteService.getCopropriete()
    const lot = this.copropriete ? this.copropriete.nom : ''
    this.title = (!this.edit) ? 'Ajouter un nouveau lot' : 'Modifier le lot ' + lot;
    this.getListSyndic()
    this.newForm()
    if(this.coproprieteService.type === 'SYNDIC'){
      this.f.syndic.setValue(this.coproprieteService.uuidSyndic)
      this.tantiemeService.getTantiemeTrustee(this.coproprieteService.uuidSyndic).subscribe((res: any) => {
        return this.tantiemes = res
      })

      this.ownerService.getList(this.coproprieteService.uuidSyndic).subscribe((res: any) => {
        return this.owners = res
      })
      this.coproprieteService.type = null
      this.coproprieteService.uuidSyndic = null
    }
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      syndic: [null, [Validators.required]],
      agency: [this.agency],
      nom: [null, [Validators.required]],
      type: [null, [Validators.required]],
      nbrAppartements: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      numerotation: [2],
      superficie: [0,  [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      ville: [null],
      commune: [null],
      quartier: [null],
      zoom: [null],
      angle: [false],
      presEau: [false],
      piedsEau: [false],
      bordureVoie: [false],
      terreFerme: [false],
      distanceEau: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      distanceRoute: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      ecole: [false],
      marche: [false],
      basFond: [false],
      village: [null],
      nbrPiece: [1],
      numPorte: [null],
      salleEau: [false],
      nbrParking: [false],
      nbrNiveau: [null],
      jardin: [false],
      piscine: [false],
      folderUuid: [null],
      categorie: [],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      appartements: this.formBuild.array([]),
      tantiemes: this.formBuild.array(this.itemComposite()),
      owner: [null],
      visuel: [null]
    })
    this.form.get('type').valueChanges.subscribe(res => {
      this.form.get('owner').setValue('');
      this.form.get('categorie').setValue('');
      if (res === 'HORIZONTAL') {
        this.form.get('owner').setValidators(Validators.required);
        this.form.get('categorie').setValidators(Validators.required);
      } else {
        this.form.get('owner').clearValidators();
        this.form.get('categorie').clearValidators();
      }
      this.form.get('owner').updateValueAndValidity();
      this.form.get('categorie').updateValueAndValidity();
    })
  }

  editForm(){
    if (this.edit) {
      const data = {...this.coproprieteService.getCopropriete()};
      console.log(data);
      
      this.getCurrentBudget();
      if(data.type === 'HORIZONTAL'){
        this.form.patchValue(data);
        this.getListSyndic()
        this.types = [
          {label: 'Horizontal', value: 'HORIZONTAL'},
        ]
        this.currentSyndic = {
          title: data.trustee ? data?.trustee?.nom : null,
          detail: data.trustee ? data?.trustee?.nom : null
        }

        data.trustee = data?.trustee ? data.trustee.uuid : null
        this.f.syndic.setValue(data.trustee)

        this.ownerSelected = {
          title: data.ownerCo ? data?.ownerCo?.nom : null,
          detail: data.ownerCo ? data?.ownerCo?.type + ' ' + data?.ownerCo?.telephone : null
        }

        data.ownerCo = data?.ownerCo ? data.ownerCo.uuid : null
        this.f.owner.setValue(data.ownerCo)
        this.f.folderUuid.setValue(data?.folder?.uuid);

        this.setSyndicUuid(data.trustee)
        this.tantieme.controls = [];
        data.tantiemes.forEach((item) => {
          this.tantieme.push(
            this.formBuild.group({
              uuid: [item.uuid],
              type: [item.typeTantieme.uuid],
              libelle: [item.type],
              valeur: [item.valeur],
            })
          )
        })
      }else if (data.type === 'VERTICAL') {
        this.edit = true
        this.form.patchValue(data);
        this.getListSyndic()
        this.types = [
          {label: 'Vertical', value: 'VERTICAL'},
        ]
        this.f.type.setValue(data.type)
        this.currentSyndic = {
          title: data.trustee ? data?.trustee?.nom : null,
          detail: data.trustee ? data?.trustee?.nom : null
        }
        data.trustee = data?.trustee ? data.trustee.uuid : null
        this.f.syndic.setValue(data.trustee)
        this.f.folderUuid.setValue(data?.folder?.uuid);
        this.tantiemeService.getTantiemeTrustee(data?.trustee).subscribe((res: any) => {
          return this.tantiemes = res
        })
        this.homeCoService.getList(data.trustee, data.uuid, null, null).subscribe((res: any) => {
          return this.f.visuel.setValue(res.length)
        })
      }
     }
  }

  getCurrentBudget(){
    this.budget = this.syndicService.getCurrentBudget();
    if(this.budget && this.budget !== null){
      if(this.budget.etat == 'VALIDE') this.isBudgetValide = true;
    }
    else{
      this.isBudgetValide = false;
    }
  }

  getListSyndic(){
    this.syndicService.getList(null).subscribe((res : any) => {
      return this.syndics = res
    })
  }

  setSyndicUuid(uuid){
    if(uuid){
      this.syndicService.uuid = uuid
      this.tantiemeService.getTantiemeTrustee(uuid).subscribe((res: any) => {
        return this.tantiemes = res
      })

      this.ownerCoService.getList(null,this.syndicService.uuid).subscribe((res: any) => {
        console.log(res);
        
        return this.owners = res
      })
    }
  }

  onChangeTantiemeResidence(type){
    if(type === 'HORIZONTAL'){
      this.numLotHidden = true;
      this.tantiemeService.getTantiemeTrustee(this.syndicService.uuid).subscribe((res: any) => {
        this.tantieme.controls = []
        res.forEach((item) => {
          this.tantieme.push(
            this.formBuild.group({
              uuid: [null],
              type: [item.uuid],
              libelle: [item.libelle],
              valeur: [0],
            })
          );
        });
      })
      return this.tantieme
    } else if(type === 'VERTICAL'){
      this.numLotHidden = false;
      this.form.get('nom').clearValidators();
      this.form.get('nom').updateValueAndValidity();
    }
  }

  natureChange(){
    this.f.nbrAppartements.reset()
    this.f.nbrAppartements.setValue(0)
    this.advance = !this.advance
  }

  itemComposite(): FormGroup[] {
    const arr: any[] = [];
    if (!this.edit) {
      this.tantiemes.push(
        this.formBuild.group({
          uuid: [null],
          type: [null],
          libelle: [null],
          valeur: [0],
        })
      )
    }
    return arr
  }

  setContact(event, type: string) {
    let value = null;
    if (type === 'contact') {
      value = this.form.get('contact').value
    }
    let valeur = (this.edit && event === null) ? value : event;
    if (type === 'contact') {
      this.form.get('contact').setValue(valeur)
    }
  }

  setOwnerUuid(uuid){
    if(uuid){
      this.f.owner.setValue(uuid)
    }else{
      this.f.owner.setValue(null)
    }
  }

  setOwnerItemUuid(uuid){
    console.log('setOwnerItemUuid',uuid)
    if (uuid) {
      this.f.owner.setValue(uuid)
    } else {
      this.f.owner.setValue(null)
    }
  }

  setTenantItemUuid(uuid, i) {
    if (uuid) {
      i.get('tenant').setValue(uuid)
    } else {
      i.get('tenant').setValue(null)
    }
  }

  addOwnerTenant(type) {
    if(type === 'PROPRIETAIRE'){
      this.ownerService.edit = false;
      window.open('/#/admin/proprietaire/');
    }else if (type = 'LOCATAIRE'){
      this.tenantService.edit = false;
      window.open('/#/admin/locataire/');
    }
  }

  onChangeAppartement() {
    const nbr = this.f.nbrAppartements.value >= 0 ? this.f.nbrAppartements.value : 0;
    const currentLength = this.appartement.controls.length;

    if (currentLength < nbr) {
      for (let i = currentLength; i < nbr; i++) {
        const num = i + 1;
        const tantiemeArray = this.onChangeTantieme(num);
        this.appartement.push(
          this.formBuild.group({
            id: [null],
            uuid: [null],
            lot: [null, [Validators.required]],
            type: ['APPARTEMENT', [Validators.required]],
            porte: [num, [Validators.required]],
            piece: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            superficie: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            numerotation: [null],
            owner: [null, [Validators.required]],
            tenant: [null],
            tantieme: tantiemeArray,
          })
        );
      }
    } else if (currentLength > nbr) {
      const diff = currentLength - nbr;
      for (let i = 0; i < diff; i++) {
        this.appartement.removeAt(this.appartement.controls.length - 1);
      }
    }
  }

  onChangeTantiemeVertical(event: any, parent: FormGroup, labelControl: FormControl, appartementIndex: number) {
    const tantiemeArray = parent.get('tantieme') as FormArray;
    const index = tantiemeArray.controls.findIndex(control => control.get('valeur') === labelControl);
    const tantiemeControl = tantiemeArray.controls[index] as FormGroup;
    const valeurControl = tantiemeControl.get('valeur');
    const valeurSaisie = event;
    valeurControl.patchValue(parseInt(valeurSaisie));
    this.onChangeTantieme(appartementIndex);
  }

  onChangeTantiemeHorizontal(value: any, item: FormGroup, t: FormControl, index: number) {
    const valeurControl = item.get('valeur') as FormControl;
    valeurControl.patchValue(parseInt(value));
  }

  onChangeTantieme(nbr: number) {
    const tantiemeArray = this.formBuild.array([]);

    this.tantiemes.forEach((item) => {
      tantiemeArray.push(
        this.formBuild.group({
          uuid: [null],
          type: [item.uuid],
          libelle: [item.libelle],
          valeur: [0, [Validators.required]],
        })
      );
    });

    if (nbr) {
      for (let i = 0; i < nbr; i++) {
        const tantiemeGroup = tantiemeArray.controls[i] as FormGroup;
        if (tantiemeGroup) {
          tantiemeGroup.addControl('valeur', new FormControl(null));
        }
      }
    }

    return tantiemeArray;
  }

  onChangeNumerotation(): string[] | number[] {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    if (this.f.numerotation.value == 1) {
      return this.numRow = alphabet.map(x => x);
    } else if (this.f.numerotation.value == 2) {
      return this.numRow = [];
    }
  }

  onChangeNum(row) {
    var num = row.value.porte.toString();
    var al = row.value.numerotation ? row.value.numerotation : 'A';
    var porte = num.toString().length > 2 ? num : al + '' + num;
    row.controls.porte.setValue(this.find_valeur(porte));
  }

  find_valeur(string) {
    if (string.length > 2) {
      var debt = this.find_unique_characters(string.toString().substr(0, 2));
      var fin = string.toString().substr(2)
      return debt + '' + fin
    } else {
      return string
    }
  }

  find_unique_characters(string) {
    var unique = '';
    for (var i = 0; i < string.length; i++) {
      if (unique.indexOf(string[i]) == -1) {
        unique += string[i];
      }
    }
    return unique;
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

  onSubmit(){
    this.submit = true
    this.emitter.loading();
    if(this.form.valid){
      const data = this.form.getRawValue()
      if(data.type === 'VERTICAL'){
        this.coproprieteService.add(data).subscribe((res: any) => {
          if (res?.status === 'success') {
            this.modal.close('COPROPRIETE');
            if (this.form.value.uuid) {
              this.emitter.emit({action: 'COPROPRIETE_UPDATED', payload: res?.data});
            } else {
              this.emitter.emit({action: 'COPROPRIETE_ADD', payload: res?.data});
            }
          }
          this.emitter.stopLoading();
        })
      }else if(data.type !== 'VERTICAL'){
        this.homeCoService.add(data).subscribe((res: any) => {
          if (res?.status === 'success') {
            this.modal.close('COPROPRIETE');
            if (this.form.value.uuid) {
              this.emitter.emit({action: 'COPROPRIETE_UPDATED', payload: res?.data});
            } else {
              this.emitter.emit({action: 'COPROPRIETE_ADD', payload: res?.data});
            }
          }
          this.emitter.stopLoading();
        })
      }
    }
  }

  modale(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop,
    }).result.then((result) => {
    }, (reason) => { });
  }

  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }

  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
  get appartement() { return this.form.get('appartements') as FormArray; }
  get tantieme() { return this.form.get('tantiemes') as FormArray; }

}
