import {Tenant} from '@model/tenant';
import {ToastrService} from 'ngx-toastr';
import {Contract} from '@model/contract';
import {Globals} from '@theme/utils/globals';
import {Component, OnInit} from '@angular/core';
import { PAYMENT } from '@theme/utils/functions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {RentService} from '@service/rent/rent.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import {EmitterService} from '@service/emitter/emitter.service';
import {ContractService} from '@service/contract/contract.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-rent-add',
  templateUrl: './rent-add.component.html',
  styleUrls: ['./rent-add.component.scss'],
})
export class RentAddComponent implements OnInit {
  payment = PAYMENT
  title: string = '';
  dateM = '';
  form: FormGroup;
  submit: boolean = false;
  tenantUuid ?: null;
  contract: Contract;
  contracts: Array<Contract>;
  required = Globals.required;
  tenants: Array<Tenant> = [];
  rents = [];
  isLoadingContract = false;
  trimestreRow = [
    {label: 'PREMIER TRIMESTRE', value: 'PREMIER'},
    {label: 'DEUXIEME TRIMESTRE', value: 'DEUXIEME'},
    {label: 'TROISIEME TRIMESTRE', value: 'TROISIEME'},
    {label: 'QUATRIEME TRIMESTRE', value: 'SEMESTRIEL'}
  ]
  semestreRow = [
    {label: 'PREMIER SEMESTRE', value: 'PREMIER'},
    {label: 'DEUXIEME SEMESTRE', value: 'DEUXIEME'}
  ]
  global = {country: Globals.country, device: Globals.device}

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private rentService: RentService,
    private contractService: ContractService,
    public toastr: ToastrService,
    private emitter: EmitterService
  ) {
    this.title = 'Ajouter un loyer';
    this.newForm();
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      tenantUuid: [null],
      tenant: [null, [Validators.required]],
      contract: [null, [Validators.required]],
      rents: this.formBuild.array([
        this.formBuild.group({
          uuid: [null],
          id: [null],
          periode: [null],
          mois: [null, [Validators.required]],
          charge: [{value: 0, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          loyer: [{value: 0, disabled: true}, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          total: [{value: 0, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
        })
      ]),
    });
  }
  setTenantUuid(uuid) {
    if (uuid) {
      this.tenantUuid = uuid;
      this.f.tenantUuid.setValue(uuid);
      this.f.tenant.setValue(uuid);
      this.loadContracts();
    } else {
      this.contracts = [];
      this.f.contract.setValue(null);
    }
  }
  loadContracts() {
    this.isLoadingContract = true;
    if (!this.f.tenantUuid.value) {
      this.isLoadingContract = false;
      this.contracts = [];
      return;
    }
    this.contractService.getList(this.f.tenantUuid.value, 'ACTIF').subscribe(res => {
      this.isLoadingContract = false;
      return this.contracts = res;
    }, error => {
      this.isLoadingContract = false;
    });
  }
  setContratUuid(event) {
    var uuid = event.target.value
    if (uuid !== null) {
      this.contract = this.contracts.find(item => {
        if (item.uuid === uuid) {
          this.f.contract.setValue(item.uuid);
          return item;
        } else {
          this.f.contract.setValue(null);
          this.rent.clear();
          this.addRent();
        }
      });
    }
    if (!this.contract) {
      this.toast('Veuillez selectionner un contrat', 'Erreur', 'danger');
      return;
    }
    this.form.get('contract').setValue(this.contract.uuid);
  }
  setMois(row) {
    this.dateM = row.controls.mois.value
    if(this.dateM){
      var rent = 0;
      rent = this.contract?.loyerCharge;
      row.controls.mois.setValue(this.dateM);
      row.controls.loyer.setValue(this.contract?.loyer);
      row.controls.charge.setValue(this.contract?.charge);
      row.controls.total.setValue(rent);
    } else{
      row.controls.mois.setValue(null);
      row.controls.loyer.setValue(null);
      row.controls.charge.setValue(null);
      row.controls.total.setValue(null);
    }
  }
  setAnnee(row) {
    var loyer = this.contract?.periodicite === 'TRIMESTRIEL' ? (this.contract?.loyer * 3) : this.contract?.periodicite === 'SEMESTRIEL' ? (this.contract?.loyer * 6) : this.contract?.periodicite === 'ANNUEL' ? (this.contract?.loyer * 12) : 0;
    var charge = this.contract?.periodicite === 'TRIMESTRIEL' ? (this.contract?.charge * 3) : this.contract?.periodicite === 'SEMESTRIEL' ? (this.contract?.charge * 6) : this.contract?.periodicite === 'ANNUEL' ? (this.contract?.charge * 12) : 0;
    var total = loyer + charge;

    row.controls.loyer.setValue(loyer);
    row.controls.charge.setValue(charge);
    row.controls.total.setValue(total);
  }
  onChangePeriode(row, value){
    if(this.contract?.periodicite === 'TRIMESTRIEL'){
      row.controls.periode.setValue(value);
    }
  }
  addRent() {
    this.rent.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        periode: [null],
        mois: [null, [Validators.required]],
        charge: [{value: 0, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        loyer: [{value: 0, disabled: true}, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        total: [{value: 0, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
      })
    );
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      var data = this.form.getRawValue()
      this.rentService.add(data).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: 'RENT_ADD', payload: res?.data});
          }
          this.emitter.stopLoading();
        },
        error => {
        });
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
  onDelete(i) {
    this.rent.removeAt(i);
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
  get f() { return this.form.controls; }
  get rent() { return this.form.get('rents') as FormArray; }
}
