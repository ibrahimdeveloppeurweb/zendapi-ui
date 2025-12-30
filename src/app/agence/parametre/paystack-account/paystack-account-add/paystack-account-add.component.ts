import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgencyService } from '@service/agency/agency.service';
import { PaystackService } from '@service/paystack/paystack.service';
import { Globals } from '@theme/utils/globals';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-paystack-account-add',
  templateUrl: './paystack-account-add.component.html',
  styleUrls: ['./paystack-account-add.component.scss']
})
export class PaystackAccountAddComponent implements OnInit {

    agency: any
    account: any

    countries: any[] = []
    banks: any[] = []
    
    title: string = ""
    form: FormGroup
    edit: boolean = false
    submit: boolean = false

  constructor(
    private permissionsService: NgxPermissionsService,
    private agencyService: AgencyService,
    private formBuild: FormBuilder,
    public modal: NgbActiveModal,
    private paystackService: PaystackService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.agencyService.getSingle(Globals.user.agencyKey).subscribe((res) => {
      if (res) {
        console.log(res)
        this.agency = res
        this.account = this.agency.paystackAccount
        // this.editForm()
      }
    },(error) => { })
    this.title = "PARAMETRE DU COMPTE PAYSTACK L'AGENCE"
    this.newForm()
  }

  ngOnInit(): void {
    this.loadCountries()
  }

  newForm() {
    this.form = this.formBuild.group({
        paystackId: [null],
        paystackCode: [null],
        businessName: [null],
        country: [null],
        bank: [null],
        accountNumber: [null],
        charged: [null],
        description: [null],
        percentage: [0],
        agency: [Globals.user.agencyKey]
    })
  }

  /* editMode(edit){
    this.edit = edit
    this.title = edit ? "MODIFICATION DES PARAMETRES" : "PARAMETRE DU COMPTE PAYSTACK L'AGENCE"
    if(!this.edit){
      this.editForm()
    }
  } */

  /* editForm() {
    const data = {...this.account}
    console.log(data)
    this.form.patchValue(data);
  } */

  onSubmit() {
    this.paystackService.add(this.form.getRawValue()).subscribe(res => {
      if (res?.status === 'success') {
        this.reloadAgencyDetails()
        // this.title = ""
        // this.edit = false
      }
    }, error => {});
  }

  loadCountries() {
    this.paystackService.getCountries().subscribe((res: any) => {
        if (res) {
            console.log(res)
            this.countries = res.data
        }
    })
  }

  onChangeCountry(value) {
    if (value) {
        console.log(value)
        this.loadBanks(value)
    }
  }

  loadBanks(country) {
    this.paystackService.getBanks(country).subscribe((res: any) => {
        if (res) {
            console.log(res)
            this.banks = res.data
        }
    })
  }

  reloadAgencyDetails() {
    this.agencyService.getSingle(Globals.user.agencyKey).subscribe((res) => {
        if (res) {
          console.log(res)
          this.agency = res
          this.account = this.agency.paystackAccount
        }
      },(error) => { })
  }

  get f() { return this.form.controls }
}
