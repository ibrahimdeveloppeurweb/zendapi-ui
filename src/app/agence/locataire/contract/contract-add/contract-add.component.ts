import {House} from '@model/house';
import {Owner} from '@model/owner';
import {Tenant} from '@model/tenant';
import {Rental} from '@model/rental';
import {Option} from '@model/option';
import {ToastrService} from 'ngx-toastr';
import {Contract} from '@model/contract';
import {DatePipe} from '@angular/common';
import { Globals } from '@theme/utils/globals';
import {Component, OnInit} from '@angular/core';
import {HouseService} from '@service/house/house.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TenantService} from '@service/tenant/tenant.service';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import { RentalService } from '@service/rental/rental.service';
import {EmitterService} from '@service/emitter/emitter.service';
import {ContractService} from '@service/contract/contract.service';
import {DateHelperService} from '@theme/utils/date-helper.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-contract-add',
  templateUrl: './contract-add.component.html',
  styleUrls: ['./contract-add.component.scss'],
  providers: [DatePipe]
})
export class ContractAddComponent implements OnInit {
  title: string = "";
  caution = 0;
  form: FormGroup;
  submit = false;
  edit = false;
  contract: Contract;
  tenant: Tenant;
  owner: Owner;
  house: House;
  rental: Rental;
  required = Globals.required
  tenants: Array<Tenant> = [];
  options: Array<Option> = [];
  houses: Array<House> = [];
  rentals: Array<Rental> = [];
  totalHT = 0;
  totalTva = 0;
  totalTTC = 0;
  totalRemise = 0;
  remiseProrata = 0;
  loyerMontant = 0;
  tauxProrata = 0;
  tenantSelected?: any;
  ownerSelected?: any;
  typeRow = [
    {label: 'Contrat de bail habitation', value: 'HABITATION'},
    {label: 'Contrat de bail commercial', value: 'COMMERCIAL'},
  ];
  cotionRow = [
    {label: 'AGENCE', value: 'AGENCE'},
    {label: 'PROPRIETAIRE', value: 'PROPRIETAIRE'},
  ];
  booleanRow = [
    {label: 'NON', value: false},
    {label: 'OUI', value: true}
  ];
  invoices = [];
  invoicesRow = [];
  monthRow = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Aout',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ];
  step: boolean = false
  libelleRow = [
    { label: 'Caution CIE / SODECI (25%)', value: 25},
    { label: 'Honoraire d\'agence', value: 100},
    { label: 'Timbres fiscaux (légalisation bail)', value: 0},
    { label: 'Droit d\'enregistrement', value: 2.5},
    { label: 'Frais de dossier (non remboursable)', value: 0},
    { label: 'Frais d\'assurance (la compagnie au choix du client)', value: 0}
  ]
  limiteRow = []
  blocks = []
  dayRow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  periodiciteRow = [
    {label: 'JOURNALIER', value: 'JOURNALIER'},
    {label: 'MENSUEL', value: 'MENSUEL'},
    {label: 'TRIMESTRIEL', value: 'TRIMESTRIEL'},
    {label: 'SEMESTRIEL', value: 'SEMESTRIEL'},
    {label: 'ANNUEL', value: 'ANNUEL'}
  ]

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private contractService: ContractService,
    private tenantService: TenantService,
    private houseService: HouseService,
    private rentalService: RentalService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) {
    this.edit = this.contractService.edit;
    this.contract = this.contractService.getContract();
    this.dayRow.map((x) => { this.limiteRow.push({label: "Le "+ x +" du mois", value: x}) })
    this.title = (!this.edit) ? 'Ajouter un contrat' : 'Modifier le contrat de ' + this.contract?.tenant?.nom;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm(): void {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      owner: [null],
      block: [null],
      house: [null, [Validators.required]],
      tenant: [null, [Validators.required]],
      rental: [null, [Validators.required]],
      loyer: [0],
      charge: [0],
      loyerCharge: [0],
      montant: [0],
      caution: [0],
      pasPorte: [0],
      avance: [0],
      isSigned: [false, [Validators.required]],
      cotion: [true, [Validators.required]],
      renouveler: [true, [Validators.required]],
      cautionReverser: ["AGENCE", [Validators.required]],
      moisCaution: [2, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      moisAvance: [2, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      type: ['HABITATION', [Validators.required]],
      periodicite: ['MENSUEL', [Validators.required]],
      dateSign: [null, [Validators.required]],
      dateEntr: [null, [Validators.required]],
      dateFa: [null, [Validators.required]],
      dateE: [null, [Validators.required]],
      dateEcheance: [null, [Validators.required]],
      dateFin: [null, [Validators.required]],
      moratoire: [false, [Validators.required]],
      nbrMoratoire: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      prcRetard: [10, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      limite: [10, [Validators.required]],
      montantHt: [0],
      montantTva: [0],
      montantRemise: [0],
      options: this.formBuild.array(this.itemOption()),
      rents: this.formBuild.array([]),
      deadlines: this.formBuild.array([]),
    });
  }
  editForm(): void {
    if (this.edit) {
      const data = {...this.contractService.getContract()};
      this.setTenantUuid(data.tenant.uuid);
      this.setOwnerUuid(data.rental.house.owner.uuid);
      this.selectHouse(data.rental.house.uuid)
      data.dateEntr = DateHelperService.fromJsonDate(data.dateEntr);
      data.dateEcheance = DateHelperService.fromJsonDate(data.dateEcheance);
      data.dateFin = DateHelperService.fromJsonDate(data.dateFin);
      data.dateSign = DateHelperService.fromJsonDate(data.dateSign);
      data.dateFa = DateHelperService.fromJsonDate(data.dateF);
      data.dateE = DateHelperService.fromJsonDate(data.dateE);
      this.houses = [data.rental.house];
      this.house = data.rental.house;
      this.rentals = [data.rental];
      this.rental = data.rental;
      this.loyerMontant = this.rental?.montant + this.rental?.charge
      this.tenantSelected = {
        photoSrc: data.tenant.photoSrc,
        title: data.tenant.searchableTitle,
        detail: data.tenant.searchableDetail
      };
      this.ownerSelected = {
        photoSrc: data.rental.house.owner.photoSrc,
        title: data.rental.house.owner.nom,
        detail: data.rental.house.owner.telephone
      };
      data?.entranceInvoice?.options.forEach((item) => {
        this.option.push(
          this.formBuild.group({
            uuid: [item.uuid],
            id: [item.id],
            libelle: [item.libelle, [Validators.required]],
            prix: [item.prix, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [item.qte, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [item.tva, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [item.remise, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [item.total, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          })
        );
      });
      data?.entranceInvoice?.deadlines.forEach((item) => {
        this.deadlines.push(
          this.formBuild.group({
            uuid: [item?.uuid],
            id: [item?.id],
            date: [DateHelperService.fromJsonDate(item?.date)],
            description: [null],
            montant: [{value: item?.montant, disabled: true}],
          })
        );
      });
      data.tenant = data.tenant.uuid
      data.rental = data.rental.uuid
      this.form.patchValue(data);
      this.onChangeTotal()
      this.onStep(data)
    }
  }
  onChangeCaution() {
    const caution = this.f.moisCaution.value * this.f.loyer.value;
    this.f.caution.setValue(caution);
    this.onChangeTotal()
  }
  onCalculeLoyer() {
    return this.rental.montant + this.rental.charge
  }

  prorata() {
    let loyer = this.f.loyerCharge.value;
    let dateEntree = this.f.dateEntr.value;
    let taux = 0;
    let jourEntree = DateHelperService.getDay(dateEntree);

    if(jourEntree > 1 && jourEntree < 10){
      taux = 0;
    }
    else if(jourEntree > 9 && jourEntree < 16){
      taux = 0.5;
    }
    else if(jourEntree > 15 && jourEntree < 26){
      taux = (2/3);
    }
    else if(jourEntree > 25){
      taux = 1;
    }
    this.tauxProrata = taux;
    this.remiseProrata = Math.round(taux * loyer);
    if(this.f.moisAvance.value > 0) this.onChangeAvance();
  }

  onChangeAvance() {
    const avance = this.f.moisAvance.value * (parseFloat(this.f.loyerCharge.value)) - this.remiseProrata;
    this.f.avance.setValue(avance);
    this.onChangeTotal()
  }
  onChangeTotal() {
    let totalOptionRemise = 0;
    let totalOptionHT = 0;
    let totalOptionTVA = 0;
    let totalOptionTTC = 0;
    this.option.controls.forEach(elem => {
      var remise = elem.value.remise >= 0 ? elem.value.remise : 0
      var totalHt = (elem.value.prix * elem.value.qte) - remise
      var totalTva = elem.value.tva >= 0 ? totalHt * (elem.value.tva / 100) : 0
      var totalTtc = totalHt + totalTva
      elem.get('total').setValue(totalTtc);
      totalOptionRemise += remise;
      totalOptionHT += (elem.value.qte >= 1 && (remise <= totalHt)) ? totalHt - remise : 0;
      totalOptionTVA += totalTva;
      totalOptionTTC += totalTtc
    });

    this.totalHT = totalOptionHT;
    this.totalTva = totalOptionTVA;
    this.totalRemise = totalOptionRemise;
    this.totalTTC = this.f.caution.value + this.f.avance.value + totalOptionTTC;
    this.totalTTC = this.totalTTC + (this.f.pasPorte.value >= 0 ? parseFloat(this.f.pasPorte.value) : 0)
    this.f.montantHt.setValue(totalOptionHT);
    this.f.montantTva.setValue(totalOptionTVA);
    this.f.montantRemise.setValue(totalOptionRemise);
    this.f.montant.setValue(this.totalTTC);
  }
  setTenantUuid(uuid) {
    if(uuid){
      this.f.tenant.setValue(uuid);
      this.loadTenant();
    } else {
      this.f.tenant.setValue(null);
    }
  }
  loadTenant() {
    this.emitter.disallowLoading();
    this.tenantService.getSingle(this.f.tenant.value).subscribe((res: any) => {
      this.tenant = res?.data;
    });
  }
  setOwnerUuid(uuid) {
    if(uuid){
      this.f.owner.setValue(uuid);
      this.loadHouses();
    } else {
      this.houses = [];
      this.rentals = [];
      this.f.owner.setValue(null);
      this.f.house.setValue(null);
      this.f.rental.setValue(null);
    }
  }
  loadHouses() {
    if(!this.edit) {
      this.houseService.getList(this.f.owner.value, 'LOCATION', 'DISPONIBLE').subscribe(res => {
        this.houses = res;
        return this.houses;
      }, error => {});
    }
  }
  selectHouse(value) {
    this.rentals = [];
    this.rental = null;
    this.f.rental.setValue(null);
    if(!this.edit) {
      this.house = this.houses.find(item => {
        if (item.uuid === value) {
          if (item?.resilie) {
            Swal.fire({
              title: 'Attention !',
              text: 'Le mandat de ce bien a été résilié !',
              icon: 'warning',
              timer: 3000,
              allowOutsideClick: false,
              showConfirmButton: false,
            })
            this.f.house.setValue(null);
            this.houses = [];
            this.rentals = [];
            return null;
          }
          return item;
        }
      });
      this.blocks = this.house?.blockHouses;
      if (this.house?.blockHouses?.length == 0) {
        this.house?.rentals.forEach(val => {
          if (val.etat === 'DISPONIBLE' && !this.edit) {
            this.rentals.push(val);
          }
        });
      }else {
        this.blocks = this.house?.blockHouses;
      }
    }
    this.f.house.setValue(value);
  }
  selectBlock(value) {
    this.rentals = [];
    this.rental = null;
    this.f.rental.setValue(null);
    if(!this.edit) {
      this.rentalService.getByBlockId(value).subscribe((res:any) => {
        this.rentals = res
      });
    }
  }
  onChangeRental(event) {
    this.rental = this.rentals.find((item) => {
      if (item.uuid === event) {
        this.loyerMontant = item?.montant + item?.charge
        this.f.loyer.setValue(item.montant);
        this.f.charge.setValue(item.charge);
        this.f.loyerCharge.setValue(item.total);

        this.f.pasPorte.setValue(item.pasPorte);
        this.f.caution.setValue(item.total * this.f.moisCaution.value);
        this.f.avance.setValue(item.total * this.f.moisAvance.value);
        this.onChangeTotal()
        return item;
      }
    });
  }
  onChangeDate() {
    if (this.f.dateEntr?.value && this.f.dateFin?.value) {
      const compare = DateHelperService.compareNgbDateStruct(this.f.dateEntr.value, this.f.dateFin.value, 'YYYYMMDD');
      if (!compare && this.f.dateEntr.value && this.f.dateFin.value) {
        this.toast(
          'La Date de début ne peut être supérieur à la Date de fin !',
          'Attention !',
          'warning'
        );
        this.form.get('dateFin').reset();
      }
    }
    this.prorata();
  }
  onRentGenere(data) {
    console.clear();
    if (this.edit) { return; }
    this.option.controls = this.itemOption();
    this.onChangeTotal()
    const dateEntr = new Date(data.dateEntr);
    const now = new Date();
    if(this.f.moisAvance.value > 0){
      if (dateEntr.getTime() < now.getTime()) {
        // on determine le nombre de mois entre la date d'entree et la date d'aujourdhui
        //On verifie si le nombre de mois d'interval est superireur a 0 et inferieur ou egale au nombre de mois d'avance
        const nbMois = this.onDetectMonth(dateEntr, now) > 0 && this.onDetectMonth(dateEntr, now) >= data.moisAvance ? this.onDetectMonth(dateEntr, now) : data.moisAvance;
        const nbMois2 = this.monthDiffGlobal(this.f.dateEntr.value)
        const moisEntr = this.onDetectMonth(dateEntr, now) > 0 ? dateEntr.getMonth() + 1 : dateEntr.getMonth();
        const moisEntr2 = dateEntr.getMonth()+1;
        //console.log('moisEntr', moisEntr, 'moisEntr2', moisEntr2)
        const nbMoisF = (nbMois > nbMois2)?nbMois:nbMois2;
        //const moisEntr2 = new Date(this.f.dateEntr.value).getMonth() + 1;
        let year = dateEntr.getFullYear();
        let mois = moisEntr2;
        if (this.form) { while (this.rent.length > 0) { this.rent.removeAt(0); } }
        //Si le nbMois > 0 alors on commence a compter a partir de ce
          for (let index = 0; index < nbMoisF; index++) {
            if (mois > 11) {
              mois = 0;
              year++;
            }
            const firstDay = new Date(year, mois - 1, 1);
            const echeance = new Date(year, mois + 1, 0);
            const label = "Loyer de " + this.date(firstDay).toLowerCase();
            const type = (index + 1 <= data.moisAvance) ? "AVANCE" : "LOYER";

            let remiseProrataL = 0;
            let remiseProrataC = 0;
            if (index == 0) {
              remiseProrataL = this.tauxProrata * data.loyer
              remiseProrataC = this.tauxProrata * data.charge
            }
            if(index == 0) remiseProrataL = this.tauxProrata * data.loyer
            const loyer = data.loyer - remiseProrataL;
            const charge = data.charge - remiseProrataC;
            const loyerCharge = loyer + charge;

            echeance.setDate(echeance.getDate() + parseInt(this.f.limite.value));
            this.rent.push(
              this.formBuild.group({
                mois: [{value: label, disabled: true}, [Validators.required]],
                type: [{value: type, disabled: true}, [Validators.required]],
                loyer: [loyer, [Validators.required]],
                charge: [charge, [Validators.required]],
                total: [{value: loyerCharge, disabled: true}, [Validators.required]],
                verse: [{value: 0, disabled: type === "AVANCE" ? true : false }],
                restant: [loyerCharge, [Validators.required]],
                date: [firstDay]
              })
              );
              mois++;
          }

        } else {
          const nbMois = this.onDetectMonth(dateEntr, now) > 0 && this.onDetectMonth(dateEntr, now) >= data.moisAvance ? this.onDetectMonth(dateEntr, now) : data.moisAvance;
          const moisEntr = this.onDetectMonth(dateEntr, now) > 0 ? dateEntr.getMonth() + 1 : dateEntr.getMonth();
          let year = dateEntr.getFullYear();
          let mois = moisEntr;
          if (this.form) { while (this.rent.length > 0) { this.rent.removeAt(0); } }

          for (let index = 0; index < nbMois; index++) {
            if (mois > 11) {
              mois = 0;
              year++;
            }
            const firstDay = new Date(year, mois, 1);
            const echeance = new Date(year, mois + 1, 0);
            const label = "Loyer de " + this.date(firstDay).toLowerCase()
            const type = (index + 1 <= data.moisAvance) ? "AVANCE" : "LOYER";

            let remiseProrataL = 0;
            let remiseProrataC = 0;
            if (index == 0) {
              remiseProrataL = this.tauxProrata * data.loyer
              remiseProrataC = this.tauxProrata * data.charge
            }
            if(index == 0) remiseProrataL = this.tauxProrata * data.loyer
            const loyer = data.loyer - remiseProrataL;
            const charge = data.charge - remiseProrataC;
            const loyerCharge = loyer + charge;

            echeance.setDate(echeance.getDate() + parseInt(this.f.limite.value));
            this.rent.push(
              this.formBuild.group({
                mois: [{value: label, disabled: true}, [Validators.required]],
                type: [{value: type, disabled: true}, [Validators.required]],
                loyer: [loyer, [Validators.required]],
                charge: [charge, [Validators.required]],
                total: [{value: loyerCharge, disabled: true}, [Validators.required]],
                verse: [{value: 0, disabled: type === "AVANCE" ? true : false }],
                restant: [loyerCharge, [Validators.required]],
                date: [firstDay]
              })
              );
              mois++;
          }
        }
    }else if(this.f.moisAvance.value === 0){
      this.rent.clear();
      // on determine le nombre de mois entre la date d'entree et le dernier mois de l'année (nb)
      const currentYear = new Date().getFullYear();
      const endOfYearDate = new Date(currentYear, 11, 31);
      //const nbMois2 = this.onDetectMonth(dateEntr, endOfYearDate)
      let currentDate = DateHelperService.getFormatGeneralDateTime(now)
      const nbMois3 = this.monthDiff(this.f.dateEntr.value, this.f.dateFin.value)
      const nbMois4 = this.monthDiffGlobal(this.f.dateEntr.value)
      const moisEntr = this.onDetectMonth(dateEntr, now) > 0 ? dateEntr.getMonth() + 1 : dateEntr.getMonth();
      const moisEntr2 = new Date(this.f.dateEntr.value).getMonth() + 1;
      let year = dateEntr.getFullYear();
      //let mois = moisEntr;
      let mois = moisEntr2;
      // on génère (nb) loyers
      for (let index = 0; index < nbMois4; index++) {
        if (mois > 11) {
          mois = 0;
          year++;
        }
        const firstDay = new Date(year, mois-1, 1);
        const echeance = new Date(year, mois + 1, 0);
        const label = "Loyer de " + this.date(firstDay).toLowerCase()
        const type = (index + 1 <= data.moisAvance) ? "AVANCE" : "LOYER";

        let remiseProrataL = 0;
        let remiseProrataC = 0;

        if (index == 0) {
          remiseProrataL = this.tauxProrata * data.loyer
          remiseProrataC = this.tauxProrata * data.charge
        }

        if(index == 0) remiseProrataL = this.tauxProrata * data.loyer
          const loyer = data.loyer - remiseProrataL;
          const charge = data.charge - remiseProrataC;
          const loyerCharge = loyer + charge;
          echeance.setDate(echeance.getDate() + parseInt(this.f.limite.value));
          this.rent.push(
            this.formBuild.group({
              mois: [{value: label, disabled: true}, [Validators.required]],
              type: [{value: type, disabled: true}, [Validators.required]],
              loyer: [loyer, [Validators.required]],
              charge: [charge, [Validators.required]],
              total: [{value: loyerCharge, disabled: true}, [Validators.required]],
              verse: [{value: 0, disabled: type === "AVANCE" ? true : false }],
              restant: [loyerCharge, [Validators.required]],
              date: [firstDay]
            })
          );
          mois++;
      }
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.contractService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'CONTRACT_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'CONTRACT_ADD', payload: res?.data});
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
  itemOption(): FormGroup[] {
    const arr: any[] = [];
    if (!this.edit && this.form?.value?.loyer) {
      for(let i = 0; i < this.libelleRow.length; i++){
        var value = (this.form?.value?.loyer * this.libelleRow[i].value) / 100;
        var label = this.libelleRow[i].label;
        if (this.libelleRow[i].value === 2.5) {
          if(this.form?.value?.type === 'HABITATION') {
            value = this.form?.value?.loyer < 500000 ? 18000 : (this.form?.value?.loyer * 12) * (this.libelleRow[i].value / 100);
            label = this.form?.value?.loyer < 500000 ? "Droit simple d'enregistrement (DS)" : "Droit d'enregistrement (2.5%)";
          } else if(this.form?.value?.type === 'COMMERCIAL') {
            value = (this.form?.value?.loyer * 12) * (this.libelleRow[i].value / 100);
            label = "Droit d'enregistrement (2.5%)";
          }
        }
        arr.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            libelle: [{value: label, disabled: true}, [Validators.required]],
            prix: [value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        );
      }
    }
    return arr;
  }
  onAddOption() {
    return this.option.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        libelle: [null, [Validators.required]],
        prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
        tva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        remise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        total: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
      })
    );
  }
  onDeleteOption(i: number) {
    this.option.removeAt(i);
    this.onChangeTotal();
  }
  onCalculRent(i) {
    this.rent.at(i).get('total').setValue(parseFloat(this.rent.at(i).get('loyer').value) + parseFloat(this.rent.at(i).get('charge').value));
    this.rent.at(i).get('restant').setValue(parseFloat(this.rent.at(i).get('total').value) - parseFloat(this.rent.at(i).get('verse').value));
  }
  addDeadline() {
    this.deadlines.clear();
    if(this.f.moratoire.value && this.f.montant.value > 0){
      var nbr = (this.f.nbrMoratoire.value >= 0) ? this.f.nbrMoratoire.value : 0;
      if (this.deadlines.controls.length < nbr) {
        for (let i = 0; i < nbr; i++) {
          var montant = this.f.montant.value / this.f.nbrMoratoire.value
          this.deadlines.controls.push(
            this.formBuild.group({
              uuid: [null],
              id: [null],
              date: [null],
              description: [null],
              montant: [{value: montant, disabled: true}],
            })
          );
        }
        return this.deadlines;
      } else if (nbr === 0)  {
        let i = this.deadlines.controls.length - (nbr === 0 ? 1 : nbr);
        return this.deadlines.removeAt(i);
      } else {
        return this.deadlines.controls.splice(0, this.deadlines.controls.length);
      }
    } else {
      this.deadlines.clear()
      this.f.nbrMoratoire.setValue(0)
    }
  }
  deleteRent(i) {
    this.rent.removeAt(i);
  }
  onDetectMonth(dateD, dateF): number {
    let value;
    value = (dateF.getFullYear() - dateD.getFullYear()) * 12;
    value -= dateD.getMonth() + 1;
    value += dateF.getMonth() + 1;
    return value <= 0 ? 0 : value;
  }
  onStep(data){
    this.step = false
    if (
      this.f.tenant.value &&
      data.loyer &&
      data.moisCaution >= 0 &&
      data.moisAvance >= 0 &&
      data.caution >= 0 &&
      data.avance >= 0 &&
      data.type &&
      data.dateSign &&
      data.dateEntr &&
      data.dateFin &&
      data.prcRetard >= 0 &&
      data.limite &&
      data.moratoire !== null &&
      data.renouveler !== null &&
      data.periodicite &&
      data.isSigned !== null
    ) {
      this.step = true
    }
    return this.step
  }

  monthDiff(inputDate: string, endDate: string) {
    const d1 = new Date(inputDate);
    const d2 = new Date(endDate);
    const currentYear = new Date().getFullYear();
    const endOfYearDate = new Date(currentYear, 11, 31); // Mois 11 représente décembre (0-indexé)

    return (endOfYearDate.getMonth()+1)-(d1.getMonth()+1)+1;
  }

  monthDiffGlobal(inputDate: string) {
    const d1 = new Date(inputDate)
    const d2 = new Date()

    const d3 = new Date(d1.getFullYear()+'-'+(d1.getMonth()+1)+'-1')
    const d4 = new Date(d2.getFullYear()+'-'+(d2.getMonth()+1)+'-'+this.joursDansMois((d2.getMonth()+1), d2.getFullYear()))
    // Calculer la différence en millisecondes entre les deux dates
    const differenceEnMillisecondes = d4.getTime() - d3.getTime();
    // Convertir la différence en mois
    const differenceEnMois = differenceEnMillisecondes / (1000 * 60 * 60 * 24 * 30.44);

    // Arrondir le résultat au nombre entier le plus proche
    const nombreDeMoisArrondi = Math.round(differenceEnMois);
    return nombreDeMoisArrondi;
  }

  // Fonction pour récupérer le nombre total de jours pour un mois donné
  joursDansMois(mois, annee) {
    const dernierJourDuMois = new Date(annee, mois, 0);
    const nombreDeJours = dernierJourDuMois.getDate();
    return nombreDeJours;
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
  date(value){ return DateHelperService.readableMonth(value); }

  get f() { return this.form.controls; }
  get option() { return this.form.get('options') as FormArray; }
  get rent() { return this.form.get('rents') as FormArray; }
  get deadlines() { return this.form.get('deadlines') as FormArray; }
}
