import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { FundRequest } from '@model/fund-request';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FundRequestService } from '@service/fund-request/fund-request.service';

@Component({
  selector: 'app-fund-request-disburse',
  templateUrl: './fund-request-disburse.component.html',
  styleUrls: ['./fund-request-disburse.component.scss']
})
export class FundRequestDisburseComponent implements OnInit {
  title: string = ""
  fund: FundRequest
  form: FormGroup
  submit: boolean = false
  required = Globals.required

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public fundRequestService: FundRequestService
  ) {
    this.fund = this.fundRequestService.getFundRequest()
    this.title = "Ajouter une decaisse de fond"
    this.newForm()
    this.f.fund.setValue(this.fund.uuid)
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      montant: [this.fund.montant, [Validators.required]],
      date: [null, [Validators.required]],
      fund: [null, [Validators.required]],
    });
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.fundRequestService.disburse(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
            this.emitter.emit({action: 'FUND_DISBURSE', payload: res?.data});
        }
      });
    } else { return; }
  }
  get f() { return this.form.controls; }
}
