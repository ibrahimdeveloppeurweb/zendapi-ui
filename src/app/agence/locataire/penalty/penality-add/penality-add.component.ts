import {Rent} from '@model/rent';
import {Tenant} from '@model/tenant';
import {Contract} from '@model/contract';
import {Penality} from '@model/penality';
import {ToastrService} from 'ngx-toastr';
import {Globals} from '@theme/utils/globals';
import {Component, OnInit} from '@angular/core';
import {RentService} from '@service/rent/rent.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import {EmitterService} from '@service/emitter/emitter.service';
import {PenalityService} from '@service/penality/penality.service';
import {ContractService} from '@service/contract/contract.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-penality-add',
  templateUrl: './penality-add.component.html',
  styleUrls: ['./penality-add.component.scss']
})
export class PenalityAddComponent implements OnInit {
  title: string = '';
  contract: Contract;
  dateM = '';
  contracts: Array<Contract>;
  tenantUuid ?: null;
  isLoadingContract = false;
  form: FormGroup;
  submit: boolean = false;
  penalities: Penality[] = [];
  rents: Array<Rent>;
  required = Globals.required;
  tenants: Array<Tenant> = [];

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private penalityService: PenalityService,
    private rentService: RentService,
    private contractService: ContractService,
    public toastr: ToastrService,
    private emitter: EmitterService
  ) {
    this.title = 'Ajouter une pénalité';
    this.newForm();
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      tenantUuid: [null],
      tenant: [null],
      contract: [null, [Validators.required]],
      penalities: this.formBuild.array([
        this.formBuild.group({
          uuid: [null],
          id: [null],
          mois: [null, [Validators.required]],
          charge: [{value: 0, disabled: true}],
          loyer: [{value: 0, disabled: true}],
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
    if (event.target.value !== null) {
      this.contract = this.contracts.find(item => {
        if (item.uuid === event.target.value) {
          this.f.contract.setValue(item.uuid);
          return item;
        } else {
          this.f.contract.setValue(null);
          this.penality.clear();
          this.addPenality();
        }
      });
    }
  }
  setRentUuid(row) {
    this.dateM = row.controls.mois.value
    if(this.dateM ){
      this.rentService.getSingle(null, this.dateM, this.f.contract.value).subscribe(res => {
        var penalite = 0;
        if (res) {
          penalite = res?.montant * (this.contract.prcRetard / 100);
          row.controls.mois.setValue(this.dateM);
          row.controls.loyer.setValue(res?.loyer);
          row.controls.charge.setValue(res?.charge);
          row.controls.total.setValue(penalite);
        } else {
          row.controls.loyer.setValue(null);
          row.controls.charge.setValue(null);
          row.controls.total.setValue(null);
          row.controls.mois.setValue(null);
        }
      }, error => {
        row.controls.mois.setValue(null);
        row.controls.loyer.setValue(null);
        row.controls.charge.setValue(null);
        row.controls.total.setValue(null);
      });
    }else {
      row.controls.mois.setValue(null);
      row.controls.loyer.setValue(null);
      row.controls.charge.setValue(null);
      row.controls.total.setValue(null);
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      var data = this.form.getRawValue()
      this.penalityService.add(data).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: 'PENALITY_ADD', payload: res?.data});
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
  addPenality() {
    this.penality.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        mois: [null, [Validators.required]],
        charge: [{value: 0, disabled: true}],
        loyer: [{value: 0, disabled: true}],
        total: [{value: 0, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
      })
    );
  }
  onDelete(row) {
    var index = this.penality.controls.indexOf(row);
    this.penality.controls.splice(index, 1);
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
  get penality() { return this.form.get('penalities') as FormArray; }
}
