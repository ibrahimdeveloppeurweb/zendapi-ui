import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { JournauxService } from '@service/configuration/journaux.service';
import { SpentService } from '@service/spent/spent.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Globals } from '@theme/utils/globals';
import { FundRequestService } from '@service/fund-request/fund-request.service';
import { SupplyService } from '@service/supply/supply.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  title: string = ""
  edit: boolean = false
  form: FormGroup
  submit: boolean = false
  entityName: string
  entityUuid: string
  selectedLog: any
  logs: any[] = []
  userSession = Globals.user

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private journauxService: JournauxService,
    private spentService: SpentService,
    private fundRequestService: FundRequestService,
    private supplyService: SupplyService
  ) {
    this.title = "Formulaire d'ajout du journal comptable correspondant a l'opération"
    this.entityName = this.journauxService.entityName
    this.entityUuid = this.journauxService.entityUuid
    console.log(this.entityName)
    console.log(this.entityUuid)
    this.newForm()
    if (this.entityUuid) {
      this.f.uuid.setValue(this.entityUuid)
    }
    this.journauxService.getList(this.userSession.agencyKey).subscribe((res) => {
      console.log(res)
      if (res) {
        this.logs = res
      }
    })
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null, [Validators.required]],
      log: [null, [Validators.required]],
    })
  }

  setLogUuid(uuid: string) {
    if (uuid) {
      this.f.log.setValue(uuid)
    } else {
      this.f.log.setValue(null)
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
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      if (this.entityName && this.entityName === 'SPENT') {
        this.spentService.updateLog(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
          }
        });
      } else if (this.entityName && this.entityName === 'FUND_REQUEST') {
        this.fundRequestService.updateLog(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
          }
        });
      } else if (this.entityName && this.entityName === 'SUPPLY') {
        this.supplyService.updateLog(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
          }
        });
      }
    } else { return; }
  }
  // editForm() {
  //   if (this.edit) {
  //     const data = {...this.spentService.getSpent()}
  //     console.log(data)
  //     this.form.patchValue(data)
  //   }
  // }
  
  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }

  get f() { return this.form.controls }

}
