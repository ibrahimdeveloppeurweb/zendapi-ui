import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JournauxService } from '@service/configuration/journaux.service';
import { OperationService } from '@service/configuration/operation.service';
import { PlanComptableService } from '@service/configuration/plan-comptable.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-operation-add',
  templateUrl: './operation-add.component.html',
  styleUrls: ['./operation-add.component.scss']
})
export class OperationAddComponent implements OnInit {

  title: string = ""
  edit: boolean = false

  userSession = Globals.user;
  form: FormGroup
  submit: boolean = false
  required = Globals.required

  operation: any

  accounts: any[] = []
  logs: any[] = []

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private operationService: OperationService,
    private journauxService: JournauxService,
    private planComptableServce: PlanComptableService
  ) {
    this.edit = this.operationService.edit
    this.operation = this.operationService.getOperation()
    this.journauxService.getList(this.userSession.agencyKey, this.operation.trustee.uuid).subscribe((res) => {
      console.log(res)
      if (res) {
        res.forEach((log) => {
          if (log.etat === 'ACTIF') {
            this.logs.push(log)
          }
        })
      }
    })
    this.planComptableServce.getList(this.userSession.agencyKey, null, true).subscribe((res) => {
      console.log(res)
      if (res) {
        res.forEach((account) => {
          if (account.etat === 'ACTIF') {
            this.accounts.push(account)
          }
        })
      }
    })
    this.title = "Ventiler l'opération"
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      libelle: [null, [Validators.required]],
      dateOp: [null, [Validators.required]],
      montant: [null, [Validators.required]],
      mode: [null],
      creditedAccount: [null],
      auxiliaryC: [null],
      debitedAccount: [null],
      auxiliaryD: [null],
      log: [null, [Validators.required]]
    });
  }

  editForm() {
    if (this.edit) {
      const data = { ...this.operationService.getOperation() }
      this.operationService.getSingle(data.uuid).subscribe((res) => {
        console.log(res)
      })
      data.montant = data.isCredited ? data.creditedAmount : data.debitedAmount
      data.dateOp = DateHelperService.fromJsonDate(data.dateOp)
      let creditedAccount = data.creditedAccount
      let auxiliaryC = data.auxiliaryC
      let debitedAccount = data.debitedAccount
      let auxiliaryD = data.auxiliaryD
      let log = data.log

      data.creditedAccount = null
      data.auxiliaryC = null
      data.debitedAccount = null
      data.auxiliaryD = null
      data.log = null
      this.form.patchValue(data)
      this.f.creditedAccount.setValue(creditedAccount ? creditedAccount.uuid : null)
      // this.f.auxiliaryC.setValue(auxiliaryC ? auxiliaryC.uuid : null)
      this.f.auxiliaryC.setValue(auxiliaryC ? auxiliaryC.numero : null)
      this.f.debitedAccount.setValue(debitedAccount ? debitedAccount.uuid : null)
      // this.f.auxiliaryD.setValue(auxiliaryD ? auxiliaryD.uuid : null)
      this.f.auxiliaryD.setValue(auxiliaryD ? auxiliaryD.numero : null)
      this.f.log.setValue(log ? log.uuid : null)
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

  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.operationService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'OPERATION_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'OPERATION_ADD', payload: res?.data});
          }
        }
      }, error => {});
    } else {
      return;
    }
  }

  get f() { return this.form.controls; }
}
