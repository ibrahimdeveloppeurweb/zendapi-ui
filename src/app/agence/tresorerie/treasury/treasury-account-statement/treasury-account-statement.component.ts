import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { TreasuryService } from '@service/treasury/treasury.service';

@Component({
  selector: 'app-treasury-account-statement',
  templateUrl: './treasury-account-statement.component.html',
  styleUrls: ['./treasury-account-statement.component.scss']
})
export class TreasuryAccountStatementComponent implements OnInit {

  form: FormGroup;

  user: any;

  title: string = ""

  selectedTreasury: any

  userSession = Globals.user

  required = Globals.required;

  global = {country: Globals.country, device: Globals.device}
  
  statements = []

  canLoadStatements: boolean = false

  isLoadingStatements: boolean = false

  dtOptions: any = {};

  totalC = 0
  totalD = 0

  urlBase = environment.publicUrl

  constructor(
    private auth: AuthService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private treasuryService: TreasuryService
  ) {
    this.user = this.auth.getDataToken() ? this.auth.getDataToken() : null;
    this.newForm();
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
  }

  newForm() {
    this.form = this.formBuild.group({
      treasury: [null, [Validators.required]],
      dateD: [null, [Validators.required]],
      dateF: [null, [Validators.required]],
    });
  }

  setTreasuryUuid(uuid) {
    console.log(uuid)
    if (uuid) {
      this.f.treasury.setValue(uuid)
      this.canLoadStatements = true
    } else {
      this.f.treasury.setValue(null)
      this.canLoadStatements = false
      this.statements = []
    }
  }

  loadStatements() {
    this.isLoadingStatements = true
    if (!this.form.invalid) {
      this.statements = []
      let data = this.form.getRawValue()
      console.log(data)
      this.treasuryService.getAccountStatements(data).subscribe((res) => {
        console.log(res)
        if (res) {
          this.isLoadingStatements = false
          this.statements = res
          this.totalC = this.calulateTotal(this.statements, 'CREDIT')
          this.totalD = this.calulateTotal(this.statements, 'DEBIT')
        }
      })
    } else {
      setTimeout(() => {
        this.isLoadingStatements = false
      }, 3000)
    }
  }

  calulateTotal(statements, type) {
    console.log(type)
    let total = 0
    let filteredStatements = statements.filter((statement) => statement.type === type)
    if (filteredStatements && filteredStatements.length > 0) {
      filteredStatements.forEach((statement) => {
        total += statement.montant
      })
    }
    return total
  }

  print() {
    let data = this.form.getRawValue()
    console.log(data)
    let url = this.urlBase + '/printer/agency/treasury/statements/' + this.user.agencyKey + '/' + this.user.uuid + '/' + data.treasury + '/' + data.dateD + '/' + data.dateF;
    console.log(url)
    window.open(`${url}`, '_blank');
  }

  export() {
    let data = this.form.getRawValue()
    console.log(data)
    let url = this.urlBase + '/export/statements/' + this.user.agencyKey + '/' + this.user.uuid + '/' + data.treasury + '/' + data.dateD + '/' + data.dateF;
    console.log(url)
    window.open(`${url}`, '_blank');
    // this.treasuryService.getExportStatement(this.userSession?.agencyKey, this.userSession?.uuid);
  }

  onClose(){
    this.modal.close('ferme');
  }

  get f() { return this.form.controls; }
}
