import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaystackService } from '@service/paystack/paystack.service';
import { Globals } from '@theme/utils/globals';
import { NgxPermissionsService } from 'ngx-permissions';
import { PaystackAccountAddComponent } from '../paystack-account-add/paystack-account-add.component';
import {AgencyService} from "@service/agency/agency.service";

@Component({
  selector: 'app-paystack-account-show',
  templateUrl: './paystack-account-show.component.html',
  styleUrls: ['./paystack-account-show.component.scss']
})
export class PaystackAccountShowComponent implements OnInit {

    agency: any
    account: any

    countries: any[] = []
    banks: any[] = []

    title: string = ""

  constructor(
    private modalService: NgbModal,
    private permissionsService: NgxPermissionsService,
    private agencyService: AgencyService,
    private paystackService: PaystackService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.agencyService.getSingle(Globals.user.agencyKey).subscribe((res) => {
      if (res) {
        console.log(res)
        this.agency = res
        this.account = this.agency.paystackAccount
      }
    },(error) => { })
    this.title = "DÉTAILS DU COMPTE PAYSTACK L'AGENCE"
  }

  ngOnInit(): void {}

  createAccount() {
      this.openModal(PaystackAccountAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }

  openModal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {

    }, (reason) => {

    });
  }
}
