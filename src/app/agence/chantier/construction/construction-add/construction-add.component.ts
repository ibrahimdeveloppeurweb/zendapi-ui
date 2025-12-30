
import {House} from '@model/house';
import {Owner} from '@model/owner';
import {Rental} from '@model/rental';
import {ToastrService} from 'ngx-toastr';
import { Provider } from '@model/provider';
import { Globals } from '@theme/utils/globals';
import {Component, Input, OnInit} from '@angular/core';
import {Construction} from '@model/construction';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HouseService} from '@service/house/house.service';
import {RentalService} from '@service/rental/rental.service';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import {EmitterService} from '@service/emitter/emitter.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateHelperService} from '@theme/utils/date-helper.service';
import {ConstructionService} from '@service/construction/construction.service';
import { HouseCoService } from '@service/syndic/house-co.service';
import { HomeCoService } from '@service/syndic/home-co.service';
import { InfrastructureService } from '@service/syndic/infrastructure.service';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HouseCo } from '@model/syndic/house-co';
import { HomeCo } from '@model/syndic/home-co';
import { TypeLoad } from '@model/typeLoad';
import { TypeLoadService } from '@service/typeLoad/type-load.service';
import { OptionBudgetService } from '@service/option-budget/option-budget.service';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { TicketService } from '@service/ticket/ticket.service';

@Component({
  selector: 'app-construction-add',
  templateUrl: './construction-add.component.html',
  styleUrls: ['./construction-add.component.scss']
})
export class ConstructionAddComponent implements OnInit {

  @Input() public type: string = "LOCATIVE"
  title: string = '';
  edit: boolean = false;
  house: any;
  trustee: any;
  houseCo: HouseCo;
  homeCo: HomeCo;
  infrastructure: any;
  nature: any;
  coproprietes: any[];
  houses: House[] = [];
  rentals: Rental[] = [];
  houseCos: HouseCo[] = [];
  homeCos: HomeCo[] = [];
  infrastructures: any[] = []
  typeLoads: TypeLoad[] = []
  currentTicket?: any;
  currentOwner?: any;
  currentTrustee?: any;
  currentNature?: any;
  owner: Owner;
  provider: Provider;
  rental: Rental;
  construction: Construction;
  form: FormGroup;
  submit: boolean = false;
  isLoadingHouse = false;
  isLoadingRental = false;
  isLoadingHouseCo = false;
  isLoadingHomeCo = false;
  isLoadingInfrastructure = false
  isLoadingTypeLoad = false
  isLoadingTicket = false;
  required = Globals.required;

  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private houseService: HouseService,
    private rentalService: RentalService,
    private coproprieteService: CoproprieteService,
    private optionBudgetService: OptionBudgetService,
    private constructionService: ConstructionService,
    private infrastructureService: InfrastructureService,
    public ticketService: TicketService
  ) {
    this.edit = this.constructionService.edit;
    this.construction = this.constructionService.getConstruction();
    this.title = (!this.edit) ? 'Ajouter une intervention' : 'Modifier l\'intervention ' + this.construction.nom;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
    this.configureValidation();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      lie: ["OUI",[Validators.required]],
      ticket: [null],
      trustee: [null],
      owner: [null],
      house: [null],
      houseCo: [null],
      homeCo: [null],
      infrastructure: [null],
      nature: [null],
      rental: [null],
      copropriete: [null],
      nom: [null, [Validators.required]],
      description: [null],
      montant: [null, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      dateD: [null, [Validators.required]],
      dateF: [null, [Validators.required]],
    });

 
  }
  configureValidation() {
    const trustee = this.form.get('trustee');
    const nature = this.form.get('nature');
    const owner = this.form.get('owner');
    const house = this.form.get('house');

    if (this.type === 'SYNDIC') {
      trustee.setValidators([Validators.required]);
      nature.setValidators([Validators.required]);
      owner.clearValidators();
      house.clearValidators();
    } else if (this.type === 'LOCATIVE') {
      trustee.clearValidators();
      nature.clearValidators();
      owner.setValidators([Validators.required]);
      house.setValidators(Validators.required);
    }

    trustee.updateValueAndValidity();
    owner.updateValueAndValidity();
    house.updateValueAndValidity();
    nature.updateValueAndValidity();
  }
  editForm() {
    if (this.edit) {
      const data = {...this.constructionService.getConstruction()};
      data.dateD = DateHelperService.fromJsonDate(data?.dateD);
      data.dateF = DateHelperService.fromJsonDate(data?.dateF);
      this.house = data.house;
      this.rental = data.rental;
      this.houseCo = data.houseCo;
      this.homeCo = data.homeCo;
      this.nature = data.nature;
      this.infrastructure = data.infrastructure
      this.nature = data.nature
      if(data.type != "SYNDIC"){
        this.setCurrentOwner(data.owner);
        this.setOwnerUuid(data.owner.uuid);
      }else{
        this.setCurrentTrustee(data.trustee);
        this.setTrusteeUuid(data.trustee.uuid);
        this.setCurrentNature(data.nature);
        this.setNatureUuid(data.nature.uuid);
      }
      this.form.patchValue(data);
    }
  }
  setCurrentOwner(owner): void {
    this.currentOwner = {
      photoSrc: owner.photoSrc,
      title: owner.nom,
      detail: owner.telephone
    };
  }
  setTicketUuid(uuid) {
    if(uuid){
      this.f.ticket.setValue(uuid);
      this.loadTicket()
    }else{
      this.f.ticket.setValue(null);
      this.f.owner.setValue(null);
      this.f.house.setValue(null);
      this.f.rental.setValue(null);
      this.form.get('nom').reset();
      this.currentOwner = null
    }
  }
  setOwnerUuid(uuid) {
    this.f.owner.setValue(uuid);
    this.f.house.setValue(null);
    this.f.rental.setValue(null);
    if(!this.edit){
      this.loadHouses();
    }
  }
  setCurrentTrustee(trustee): void {
    this.currentTrustee = {
      title: trustee.nom,
      detail: trustee.details,
    };
  }
  setTrusteeUuid(uuid) {
    this.f.trustee.setValue(uuid);
    this.f.houseCo.setValue(null);
    this.f.homeCo.setValue(null);
    this.f.infrastructure.setValue(null);
    if(!this.edit){
      if (uuid) {
        this.loadInfrastructure();
        this.loadTypeLoads();
        this.loadCoproprietes();
      }
      else{
        this.infrastructures = [];
        this.typeLoads = [];
        this.coproprietes = [];
      }
    }
  }
  setCurrentNature(nature): void {
    this.currentNature = {
      title: nature.libelle,
      detail: nature.details,
    };
  }
  setNatureUuid(uuid) {
    this.f.nature.setValue(uuid);
  }
  loadHouses() {
    this.isLoadingHouse = true;
    this.houses = [];
    if (!this.f.owner.value) {
      this.isLoadingHouse = false;
      return;
    }
    this.houseService.getList(this.f.owner.value).subscribe(res => {
      this.isLoadingHouse = false;
      this.houses = res;

    }, error => {
      this.isLoadingHouse = false;
    });
    if (this.edit) {
      this.f.house.setValue(this.construction.house.uuid);
      this.selectHouse();
    }
  }
  
  loadInfrastructure() {
    this.isLoadingInfrastructure = true;
    this.infrastructures = [];
    if (!this.f.trustee.value) {
      this.isLoadingInfrastructure = false;
      return;
    }
    this.infrastructureService.getList(this.f.trustee.value).subscribe(res => {
      this.isLoadingInfrastructure = false;
      this.infrastructures = res;
    }, error => {
      this.isLoadingInfrastructure = false;
    });
    if (this.edit) {
      this.f.infrastructure.setValue(this.construction.infrastructure.uuid);
    }
  }
  loadCoproprietes() {
    this.coproprieteService.getListAll(this.f.trustee.value).subscribe(res => {
      if (res.length > 0) {
        this.coproprietes = res;
      }
    }, error => {
    });
  };
  loadTypeLoads() {
    this.isLoadingTypeLoad = true;
    this.typeLoads = [];
    if (!this.f.trustee.value) {
      this.isLoadingTypeLoad = false;
      return;
    }
    this.optionBudgetService.getList(this.f.trustee.value).subscribe(res => {
      this.isLoadingTypeLoad = false;
      if(res.length>0){
        this.typeLoads = res;
      }
    }, error => {
      this.isLoadingTypeLoad = false;
    });
    if (this.edit) {
      this.f.nature.setValue(this.construction.infrastructure.uuid);
    }
  }
  selectHouse() {
    this.f.rental.setValue(null);
    this.loadRental();
  }
  
  loadRental() {
    this.isLoadingRental = true;
    if (!this.f.house.value) {
      this.isLoadingRental = false;
      this.rentals = [];
      return;
    }
    this.emitter.disallowLoading();
    this.rentalService.getList(this.f.owner.value, this.f.house.value).subscribe(res => {
      this.isLoadingRental = false;
      this.rentals = res;
      if (this.edit) {
        this.f.rental.setValue(this.construction.rental.uuid);
      }
    }, error => {
      this.isLoadingRental = false;
    });
  }
  loadTicket() {
    this.isLoadingTicket = true;
    if (!this.f.ticket.value) {
      this.isLoadingTicket = false;
      return;
    }
    this.emitter.disallowLoading();
    this.ticketService.getSingle(this.f.ticket.value).subscribe(res => {
      this.f.nom.setValue(res.objet);
      console.log(res);
      if (res.owner) {
        
        this.f.owner.setValue(res.owner.uuid);
        this.currentOwner = {
          title: res.owner.nom,
          detail: res.owner.searchableDetail
        };
        this.setOwnerUuid(res.owner.uuid);
        if (res.house) {
          this.f.house.setValue(res.house.uuid);
          this.selectHouse()
          if (res.rental) {
            this.f.rental.setValue(res.rental.uuid);
          }
        }
      }
      
      // this.f.house.setValue(res.objet);
      this.isLoadingTicket = false;
    }, error => {
      this.isLoadingTicket = false;
    });
  }
  onChangeHouse(event) {
    this.house = this.houses.find(item => {
      if (item.uuid === event) {
        return item;
      }
    });
  }
  onChangeRental(event) {
    this.rental = this.rentals.find(item => {
      if (item.uuid == event) {
        return item;
      }
    });
  }
  onChangeDate() {
    const compare = DateHelperService.compareNgbDateStruct(this.f.dateD.value, this.f.dateF.value, 'YYYYMMDD');
    if (!compare && this.f.dateD.value && this.f.dateF.value) {
      this.toast(
        'La Date de début ne peut être supérieure à la Date de fin !',
        'Attention !',
        'warning'
      );
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.constructionService.add(this.form.value).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            if (this.form.value.uuid) {
              this.emitter.emit({action: 'CONSTRUCTION_UPDATED', payload: res?.data});
            } else {
              this.emitter.emit({action: 'CONSTRUCTION_ADD', payload: res?.data});
            }
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
    this.form.reset()
    this.modal.close('ferme');
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
  groupingHelper(item) {
    if (item?.houseCo) {
      return item?.houseCo?.nom
    }
    return null;
  }
  groupValueHelper(item) {
    return item.houseCo;
  }
  get f() {return this.form.controls;}

}
