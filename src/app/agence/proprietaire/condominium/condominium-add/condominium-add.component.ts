import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { Budget } from '@model/budget';
import { Syndic } from '@model/syndic/syndic';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BudgetService } from '@service/budget/budget.service';
import { EmitterService } from '@service/emitter/emitter.service'
import { HouseService } from '@service/house/house.service';
import { OwnerService } from '@service/owner/owner.service';
import { RentalService } from '@service/rental/rental.service';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { HomeCoService } from '@service/syndic/home-co.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { TantiemeService } from '@service/syndic/tantieme.service';
import { TenantService } from '@service/tenant/tenant.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-condominium-add',
  templateUrl: './condominium-add.component.html',
  styleUrls: ['./condominium-add.component.scss']
})
export class CondominiumAddComponent implements OnInit {

  form: FormGroup
  edit: boolean = false
  copropriete: any
  title: string = ''
  currentSyndic: any
  submit: boolean = false
  voir: boolean = false
  countrys= []
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
  ownerCoSelected: any
  currentOwnerItem: any
  currentTenantItem: any
  publicUrl = environment.publicUrl;
  tantiemeSelected: any
  tantiemes = []
  tantiemess = []
  categorieType: boolean = false
  advance: boolean = false
  syndics: any[] = []
  houses: any[] = []
  rentals: any[] = []
  isBudgetValide = false;
  numLotHidden = false;
  budget: Budget;
  syndic: Syndic;

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private houseService: HouseService,
    private ownerService: OwnerService,
    private rentalService: RentalService,
    private homeCoService: HomeCoService,
    private syndicService: SyndicService,
    private tenantService: TenantService,
    public uploadService: UploaderService,
    private tantiemeService: TantiemeService,
    private coproprieteService: CoproprieteService
  ) {
    this.edit = this.coproprieteService.edit
    this.copropriete = this.coproprieteService.getCopropriete()
    const lot = this.copropriete ? this.copropriete.nom : ''
    this.title = (!this.edit) ? 'Configuration des millièmes' : 'Configuration des millièmes du lot ' + lot;
    this.getListSyndic()
    this.newForm()
    if(this.coproprieteService.type === 'SYNDIC'){
      this.f.syndic.setValue(this.coproprieteService.uuidSyndic)
      this.tantiemeService.getTantiemeTrustee(this.coproprieteService.uuidSyndic).subscribe((res: any) => {
        this.addTantieme(res)
        return this.tantiemes = res
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
      agency: [this.agency],
      syndic: [null, [Validators.required]],
      house: [null, [Validators.required]],
      owner: [null, [Validators.required]],
      tantiemes: this.formBuild.array([])
    })
  }

  editForm(){
    if (this.edit) {
      const data = {...this.coproprieteService.getCopropriete()};
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
          title: data.owner ? data?.owner?.nom : null,
          detail: data.owner ? data?.owner?.type + ' ' + data?.owner?.telephone : null
        }

        data.owner = data?.owner ? data.owner.uuid : null
        this.f.owner.setValue(data.owner)
        this.f.folderUuid.setValue(data?.folder?.uuid);

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
        console.log(this.tantiemes)
        this.addTantieme(res)
        return this.tantiemes = res
      })
    }
  }
  addTantieme(arr) {
    this.tantieme.clear()
    this.tantieme.controls = []
    const options = this.formBuild.array([]);

    arr.forEach((item) => {
      options.push(
        this.formBuild.group({
          uuid: [item.uuid],
          libelle: [item.libelle],
          valeur: [0, [Validators.required]],
        })
      );
    });
    if(this.rentals.length > 0) {
      this.rentals.forEach((item) => {
        this.tantieme.push(
          this.formBuild.group({
            uuid: [null],
            owner: [null],
            rental: [item.uuid],
            libelle: [item.libelle],
            type: ["RENTAL"],
            options: options,
          })
        );
      });
    }else{
      this.tantieme.push(
        this.formBuild.group({
          uuid: [null],
          owner: [null],
          rental: [null],
          libelle: [null],
          type: ["HOUSE"],
          options: options,
        })
      );
    }

    return options;
  }
  onDelete(row){
    this.tantieme.removeAt(row);
  }
  onChangeTantiemeResidence(type){
    if(type === 'HORIZONTAL'){
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
    }
    else if(type === 'VERTICAL'){
      this.numLotHidden = true;
      this.form.get('nom').clearValidators();
      this.form.get('nom').updateValueAndValidity();
    }
  }

  natureChange(){
    this.f.nbrAppartements.reset()
    this.f.nbrAppartements.setValue(0)
    this.advance = !this.advance
  }

  setOwnerCoUuid(uuid){
    if(uuid){
      this.f.owner.setValue(uuid)
      this.loadHouses(uuid)
    }else{
      this.f.owner.setValue(null)
      this.houses = []
    }
  }

  setOwnerTantiemeUuid(uuid, item){
    if(uuid){
      item.get('owner').setValue(uuid)
    }else{
      item.get('owner').setValue(null)
    }
  }

  setOwnerItemUuid(uuid, i){
    if (uuid) {
      i.get('owner').setValue(uuid)
    } else {
      i.get('owner').setValue(null)
    }
  }

  loadHouses(uuid) {
    if(!this.edit) {
      this.homeCoService.getList(null, null, null, uuid).subscribe((res: any) => {
        this.houses = res;
         return this.houses;
        
      })
      // this.houseService.getList(uuid).subscribe(res => {
      //   this.houses = res;
      //   return this.houses;
      // }, error => {});
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

  onChangeHouse() {
    this.rentalService.getList(null, this.f.house.value).subscribe(res => {
      this.rentals = res;
      this.addTantieme(this.tantiemes)
      return this.rentals;
    }, error => {});
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
    // Remove this line as it's redundant - the input is already bound to formControlName="valeur"
    // const valeurControl = item.get('valeur') as FormControl;
    // valeurControl.patchValue(parseInt(value));
    
    // Instead, you can use this method just for any additional logic you need when the value changes
    // For example, validation or calculations based on the new value
    console.log('Value changed:', value);
    
    // If you need to do calculations with the updated value, you can get it from the form control
    const currentValue = parseInt(value);
    // Add any additional logic here without updating the same control again
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
  onSubmit(){
    this.submit = true
    this.emitter.loading();
    if(this.form.valid){
      const data = this.form.getRawValue()
      this.homeCoService.milliemes(data).subscribe((res: any) => {
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
  get tantieme() { return this.form.get('tantiemes') as FormArray; }

}
