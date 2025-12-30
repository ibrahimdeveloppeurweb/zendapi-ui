import * as moment from 'moment';
import {Option} from '@model/option';
import { House } from '@model/house';
import { Owner } from '@model/owner';
import { Rental } from '@model/rental';
import { Tenant } from '@model/tenant';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ShortContract } from '@model/short-contract';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OwnerService } from '@service/owner/owner.service';
import { TenantService } from '@service/tenant/tenant.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortContractService } from '@service/short-contract/short-contract.service';
import { HouseService } from '@service/house/house.service';

@Component({
  selector: 'app-short-contract-add',
  templateUrl: './short-contract-add.component.html',
  styleUrls: ['./short-contract-add.component.scss']
})
export class ShortContractAddComponent implements OnInit {
  edit = false;
  owner: Owner;
  house: House;
  submit = false;
  tenant: Tenant;
  rental: Rental;
  form: FormGroup;
  ownerSelect: any;
  title: string = "";
  ownerSelected?: any;
  step: boolean = false
  tenantSelected?: any;
  montant: number = 0;
  totalHT: number = 0;
  totalTva: number = 0;
  totalTTC: number = 0;
  totalRemise: number = 0;
  contract: ShortContract;
  houses: Array<House> = [];
  required = Globals.required
  tenants: Array<Tenant> = [];
  rentals: Array<Rental> = [];
  options: Array<Option> = [];
  typeRow = [
    {label: 'HORAIRE', value: 'HORAIRE'},
    {label: 'JOURNALIER', value: 'JOURNALIER'},
  ];

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private houseService: HouseService,
    private ownerService: OwnerService,
    private tenantService: TenantService,
    private contractService: ShortContractService,
  ) {
    this.edit = this.contractService.edit;
    this.contract = this.contractService.getShortContract();
    this.title = (!this.edit) ? 'Ajouter un contrat' : 'Modifier le contrat ' + this.contract?.libelle;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm(): void {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      tenant: [null, [Validators.required]],
      owner: [null],
      house: [null],
      rental: [null, [Validators.required]],
      type: ['HORAIRE', [Validators.required]],
      dateSign: [null, [Validators.required]],
      dateEntr: [null, [Validators.required]],
      dateFin: [null, [Validators.required]],
      echeance: [null, [Validators.required]],
      nbr: [0],
      montant: [0, [Validators.required]],
      montantHt: [0],
      montantTva: [0],
      montantRemise: [0],
      loyer: [0, [Validators.required]],
      options: this.formBuild.array([]),
    });
  }
  editForm(): void {
    if (this.edit) {
      const data = {...this.contractService.getShortContract()};
      this.house = data.rental.house;
      this.rentals = [data.rental];
      this.rental = data.rental;
      this.setTenantUuid(data.tenant.uuid);
      this.selectHouse(data.rental.house.uuid)
      this.setOwnerUuid(data.rental.house.owner.uuid);
      this.ownerSelected = {
        photoSrc: data.rental.house.owner.photoSrc,
        title: data.rental.house.owner.searchableTitle,
        detail: data.rental.house.owner.searchableDetail
      };
      this.tenantSelected = {
        photoSrc: data.tenant.photoSrc,
        title: data.tenant.searchableTitle,
        detail: data.tenant.searchableDetail
      };
      data.dateEntr = DateHelperService.getFormatGeneralDateTime(data.dateEntr);
      data.dateFin = DateHelperService.getFormatGeneralDateTime(data.dateFin);
      data.dateSign = DateHelperService.getFormatGeneralDateTime(data.dateSign);
      data.echeance = DateHelperService.fromJsonDate(data.echeance);
      data?.invoice?.options.forEach((item, index) => {
        this.option.push(
          this.formBuild.group({
            uuid: [item.uuid],
            id: [item.id],
            libelle: [{ value: item.libelle, disabled: index === 0 ? true : false }, [Validators.required]],
            prix: [item.prix, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [item.qte, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [item.tva, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [item.remise, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [item.total, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          })
        );
      });
      data.tenant = data.tenant.uuid;
      data.rental = data.rental.uuid;
      this.form.patchValue(data);
      this.onChangeTotal();
    }
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
  onDeleteOption(row) {
    const index = this.option.controls.indexOf(row);
    this.option.controls.splice(index, 1);
    this.onChangeTotal();
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
      this.house?.rentals.forEach(val => {
        if (val.etat === 'DISPONIBLE' && !this.edit) {
          this.rentals.push(val);
        }
      });
    }
    this.f.house.setValue(value);
  }
  onChangeRental(event) {
    this.f.rental.setValue(event);
    this.rental = this.rentals.find((item) => {
      if (item.uuid === event) {
        return item;
      }
    });
    this.f.loyer.setValue(this.rental.montant);
  }
  onChangeType(event) {
    this.option.clear()
    if(event === 'HORAIRE') {
      this.onChangeDate();
      this.onChangeTotal();
    } else {
      this.onChangeDate();
      this.onChangeTotal();
    }
  }
  onChangeDate() {
    let nbr = 0;
    if (this.f.dateEntr.value && this.f.dateFin.value) {
      const start = new Date(this.f.dateEntr.value);
      const end = new Date(this.f.dateFin.value);

      //Comparer les date debut et fin
      if (this.f.dateEntr.value && this.f.dateFin.value) {
        if (end <= start) {
          this.toast(
            'La Date de début ne peut être supérieur ou égale à la Date de fin !',
            'Attention !',
            'warning'
          );
          this.form.get('dateFin').setValue(null);
        }
      }

      nbr = this.onCalculNbre(this.f.dateEntr.value, this.f.dateFin.value);
      this.f.nbr.setValue(nbr);

      if(this.f.rental.value && this.f.type.value === "HORAIRE") {
        this.option.clear();
        this.f.montant.setValue(this.f.nbr.value * this.f.loyer.value);

        this.option.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            libelle: [{ value: 'Locative '+this.rental?.porte, disabled: true }, [Validators.required]],
            prix: [this.f.loyer.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [this.f.nbr.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [this.f.nbr.value * this.f.loyer.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        );
      } else if(this.f.rental.value && this.f.type.value === "JOURNALIER") {
        this.option.clear();
        this.f.montant.setValue(this.f.nbr.value * this.f.loyer.value);

        this.option.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            libelle: [{ value: 'Locative '+this.rental?.porte, disabled: true }, [Validators.required]],
            prix: [this.f.loyer.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [this.f.nbr.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [this.f.nbr.value * this.f.loyer.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        );
      }
      this.montant = this.f.montant.value;
    }
    this.onChangeTotal();
  }
  onCalculNbre(start, end) {
    if(this.f.type.value === "HORAIRE") {
      const startDate = moment(start);
      const endDate = moment(end);
      const duration = moment.duration(endDate.diff(startDate));
      return Math.round(duration.asHours());
    } else if(this.f.type.value === "JOURNALIER") {
      var dateD = moment(start); //todays date
      var dateF = moment(end); //another date
      var duration = moment.duration(dateF.diff(dateD));
      var days = duration.asDays();
      return Math.round(days);
    }
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
      var totalTtc = totalHt + totalTva;
      elem.get('total').setValue(totalTtc);
      totalOptionRemise += remise;
      totalOptionHT += (elem.value.qte >= 1 && (remise <= totalHt)) ? totalHt - remise : 0;
      totalOptionTVA += totalTva;
      totalOptionTTC += totalTtc;
    });

    this.totalHT = totalOptionHT;
    this.totalTva = totalOptionTVA;
    this.totalRemise = totalOptionRemise;
    this.totalTTC = totalOptionTTC;
    this.f.montantHt.setValue(totalOptionHT);
    this.f.montantTva.setValue(totalOptionTVA);
    this.f.montantRemise.setValue(totalOptionRemise);
    this.f.montant.setValue(this.totalTTC);
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
      this.contractService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'SHORT_CONTRACT_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'SHORT_CONTRACT_ADD', payload: res?.data});
          }
        }
      }, error => {});
    } else {
      return;
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

  get f() { return this.form.controls; }
  get option() { return this.form.get('options') as FormArray; }
}
