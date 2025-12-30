import {PaymentFunding} from '@model/payment-funding';
import {Component, HostListener, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {FileUploadValidators} from '@iplab/ngx-file-upload';
import {FundingService} from '@service/funding/funding.service';
import {ConstructionService} from '@service/construction/construction.service';
import {Construction} from '@model/construction';
import {Treasury} from '@model/treasury';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import {TreasuryService} from '@service/treasury/treasury.service';
import { Globals } from '@theme/utils/globals';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Invoice } from '@model/invoice';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { EmitterService } from '@service/emitter/emitter.service';
import {PaymentFundingService} from '@service/payment-funding/payment-funding.service';
import { FundingInvoiceService } from '@service/funding-invoice/funding-invoice.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-payment-funding-add',
  templateUrl: './payment-funding-add.component.html',
  styleUrls: ['./payment-funding-add.component.scss']
})
export class PaymentFundingAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = '';
  form: FormGroup;
  submit: boolean = false;
  currentConstruction?: any;
  fundings = [];
  invoices: Invoice[];
  folders = [];
  treasuries = [];
  construction?: Construction;
  edit: boolean = false;
  payment: PaymentFunding;
  treasuryUuid: string = ""
  treasury: Treasury;
  montantTotal:any = 0
  montantRegle: any = 0
  montantRestant: any = 0
  sourceTitle: string = ""
  numeroTitle: string = ""
  isHidden: boolean;
  total: number = 0;
  required = Globals.required;
  global = {country: Globals.country, device: Globals.device}

  modeRow = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" },
    { label: "VERSEMENT", value: "VERSEMENT" },
    { label: "VIREMENT", value: "VIREMENT" }
  ]

  constructor(
    private formBuild: FormBuilder,
    public fundingService: FundingService,
    public fundingInvoiceService: FundingInvoiceService,
    public constructionService: ConstructionService,
    public treasuryService: TreasuryService,
    public toastr: ToastrService,
    public paymentFundingService: PaymentFundingService,
    public modal: NgbActiveModal,
    public uploadService: UploaderService,
    private emitter: EmitterService
  ) {
    this.edit = this.paymentFundingService.edit;
    this.treasuryUuid = this.paymentFundingService.treasury;
    this.payment = this.paymentFundingService.getPayment();
    this.title = (!this.edit) ? "Ajouter un paiement" : "Modifier le paiement de " + this.payment?.code
    this.newForm();
    this.setTreasury();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      folderUuid: [null],
      construction: [null, Validators.required],
      treasury: [null, Validators.required],
      montant: [null, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      date: [null, Validators.required],
      mode: ['ESPECE', Validators.required],
      montantVerse: [null],
      effectue: [null, Validators.required],
      source: [null],
      numero: [null],
      tiers: [null],
      files: [null, FileUploadValidators.filesLimit(3)],
      options: this.formBuild.array(this.itemOption()),
      folders: this.formBuild.array([]),
    });
  }
  editForm() {
    if (this.edit) {
      const data = {...this.paymentFundingService.getPayment()};
      this.setConstructionUuid(data?.invoice?.funding?.construction);
      data.date = DateHelperService.fromJsonDate(data.date)
      this.option.push(
        this.formBuild.group({
          checked: [true],
          libelle: [{value: data?.invoice.libelle, disabled: true}],
          montant: [{value: data?.invoice?.montant, disabled: true}],
          paye: [{value: data?.invoice?.paye, disabled: true}],
          impaye: [{value: data?.invoice?.impaye, disabled: true}]
        })
      )
      this.montantRestant = data?.invoice?.impaye
      this.montantTotal = data?.invoice?.montant
      this.montantRegle = data?.invoice?.paye
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder?.uuid)
    }
  }
  setTreasury(){
    if(this.treasuryUuid){
      this.f.treasury.setValue(this.treasuryUuid)
      this.treasuryService.getSingle(this.treasuryUuid).subscribe((res: any) => {
        if (res) {
          this.treasury = res;
          if (this.treasury.type === "CAISSE") {
            this.modeRow = [
              { label: "ESPECE", value: "ESPECE" }
            ]
          }
          if (this.treasury.type === "BANQUE") {
            this.modeRow = [
              { label: "CHEQUE", value: "CHEQUE" },
              { label: "VERSEMENT", value: "VERSEMENT" },
              { label: "VIREMENT", value: "VIREMENT" }
            ]
          }
          return this.treasury
        }
      });
    }
  }
  setConstructionUuid(uuid) {
    this.f.construction.setValue(uuid);
    if(!this.edit && uuid){
      this.constructionService.getSingle(uuid).subscribe((res: any) => { this.construction = res; });
      this.loadInvoice();
    }
  }
  loadInvoice(){
    this.option.controls = []

    this.fundingInvoiceService.getList(this.f.construction.value, null).subscribe((res) => {
      this.invoices = res
      if(this.invoices){
        this.option.controls = this.itemOption()
      }
      }, error => {}
    );
  }
  itemOption(): FormGroup[] {
    var arr: any[] = []
    if(this.invoices && this.invoices.length > 0){
      this.invoices.forEach((item) =>{
        arr.push(
          this.formBuild.group({
            uuid: [item.uuid],
            checked: [false],
            libelle: [{value: item?.libelle, disabled: true}],
            montant: [{value: item?.montant, disabled: true}],
            paye: [{value: item?.paye, disabled: true}],
            impaye: [{value: item?.impaye, disabled: true}]
          })
        )
      })
    }
    return arr;
  }
  onSelectAllInvoice($event) {
    let total = 0
    let paye = 0
    let impaye = 0
    this.option.controls.forEach(item => {
      // @ts-ignore
      var ligne = item.getRawValue()
      item.get('checked').setValue($event.target.checked)
      if($event.target.checked === true){
        this.isHidden = true
        total += ligne.montant
        paye += ligne.paye
        impaye += ligne.impaye
      }
      if($event.target.checked === false) {
        this.isHidden = false
      }
    })
    this.f.montant.setValue(impaye)
    this.montantTotal = total
    this.montantRestant = impaye
    this.montantRegle = paye
  }
  onSelectInvoice() {
    let i = 0
    let total = 0
    let paye = 0
    let impaye = 0
    this.option.controls.forEach(item => {
      // @ts-ignore
      var ligne = item.getRawValue()
      if(ligne.checked === true){
        i += 1
        total += ligne.montant
        paye += ligne.paye
        impaye += ligne.impaye
      }
      this.isHidden = i > 1 ? true : false
    })
    this.f.montant.setValue(impaye)
    this.montantTotal = total
    this.montantRestant = impaye
    this.montantRegle = paye
  }
  onChangeLibelle() {
    if(this.f.mode.value === 'VIREMENT' || this.f.mode.value === 'VERSEMENT'){
      this.numeroTitle = "N° virement"
      this.sourceTitle = "Banque"
    }
    if(this.f.mode.value === 'CHEQUE'){
      this.sourceTitle = "Banque"
      this.numeroTitle = "N° cheque"
    }
    if(this.f.mode.value === 'MOBILE MONEY'){
      this.sourceTitle = "N° Téléphone"
      this.numeroTitle = "N° Transaction"
    }
    this.f.source.setValue(null)
    this.f.numero.setValue(null)
  }
  onChangeEffectue() {
    this.f.tiers.setValue(null)
  }
  onChangeMontant(){
    if(this.f.montant.value > parseFloat(this.montantRestant)){
      this.f.montant.setValue(0)
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.f.montant.value <= 0) {
      this.toast('Le montant du paiement ne peut être inferieur ou égal à 0.', 'Montant erroné', 'warning');
      return
    }
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.paymentFundingService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (data?.uuid) {
            this.emitter.emit({action: 'PAYMENT_CUSTOMER_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'PAYMENT_CUSTOMER_ADD', payload: res?.data});
          }
        }
      });
    } else { return; }
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
  files(data) {
    if(data && data !== null){
      data.forEach(item => {
        this.folderf.push(
          this.formBuild.group({
            uuid: [item?.uuid, [Validators.required]],
            name: [item?.name],
            path: [item?.path]
          })
        );
      });
    }
  }
  upload(files): void {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value): void {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, {[property]: value});
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }
  onClose(){
    if (!this.edit && this.form.value.folderUuid) {
      var data = {uuid: this.form.value.folderUuid, path: 'paiment_financement'}
      this.uploadService.getDelete(data).subscribe((res: any) => {
        if (res) {
          if (res?.status === 'success') {
            this.form.reset()
            this.modal.close('ferme');
          }
        }
        return res
      });
    }else{
      this.form.reset()
      this.modal.close('ferme');
    }
  }
  onReset(){
    if (this.form.value.folderUuid) {
      this.toast('Impossible de de vider le formulaire lorsque un upload a été éffectué', 'Une erreur a été rencontrée', 'warning');
    }else{
      this.form.reset()
    }
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
  get option() { return this.form.get('options') as FormArray; }
  get folderf() { return this.form.get('folders') as FormArray; }
}
