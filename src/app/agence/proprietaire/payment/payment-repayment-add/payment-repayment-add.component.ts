import { Owner } from '@model/owner';
import { Treasury } from '@model/treasury';
import { ToastrService } from 'ngx-toastr';
import { Repayment } from '@model/repayment';
import { Globals } from '@theme/utils/globals';
import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentRepayment } from '@model/payment-repayment';
import { InvoiceRepayment } from '@model/invoice-repayment';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { EmitterService } from '@service/emitter/emitter.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { RepaymentService } from '@service/repayment/repayment.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceRepaymentService } from '@service/invoice-repayment/invoice-repayment.service';
import { PaymentRepaymentService } from '@service/payment-repayment/payment-repayment.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-payment-repayment-add',
  templateUrl: './payment-repayment-add.component.html',
  styleUrls: ['./payment-repayment-add.component.scss']
})
export class PaymentRepaymentAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  user: any;
  title: string = ""
  sourceTitle: string = ""
  numeroTitle: string = ""
  treasuryUuid: string = ""
  treasury: Treasury;
  ownerSelected?: any;
  repayment: Repayment;
  invoices: InvoiceRepayment[];
  isHidden: boolean = false
  entree: boolean = false
  repayments: Array<Repayment>;
  isLoadingRepayment = false;
  montantTotal:any = 0
  montantRegle: any = 0
  montantRestant: any = 0
  form: FormGroup
  submit: boolean = false
  edit: boolean = false
  payment: PaymentRepayment;
  required = Globals.required;
  global = {country: Globals.country, device: Globals.device}
  owners: Array<Owner> = []
  modeRow = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" },
    { label: "WAVE", value: "WAVE" },
    { label: "VERSEMENT", value: "VERSEMENT" },
    { label: "VIREMENT", value: "VIREMENT" }
  ]
  typeFactureRow = [
    { label: "LOYER", value: "LOYER" },
    { label: "ENTREE", value: "ENTREE" },
    { label: "AUTRES FACTURE", value: "AUTRE" },
    { label: "PENALITE", value: "PENALITE" },
    { label: "RESILIATION", value: "RESILIATION" }
  ]

  constructor(
    private auth: AuthService,
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public uploadService: UploaderService,
    private treasuryService: TreasuryService,
    private repaymentService: RepaymentService,
    public paymentService: PaymentRepaymentService,
    private invoiceService: InvoiceRepaymentService
  ) {
    this.edit = this.paymentService.edit;
    this.treasuryUuid = this.paymentService.treasury;
    this.payment = this.paymentService.getPayment();
    this.title = (!this.edit) ? "Ajouter un paiement" : "Modifier le paiement de " + this.payment?.invoice?.repayment?.owner?.searchableTitle
    this.newForm();
    this.setTreasury();
    this.user = this.auth.getDataToken() ? this.auth.getDataToken() : null;
    this.f.tiers.setValue(this.user?.nom);
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      folderUuid: [null],
      treasury: [null],
      effectue: ['LUI MEME', [Validators.required]],
      owner: [null, [Validators.required]],
      repayment: [null, [Validators.required]],
      montant: [0, [Validators.required,  Validators.min(1)]],
      date: [null, [Validators.required]],
      mode: ['ESPECE', [Validators.required]],
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
      const data = {...this.paymentService.getPayment()};
      this.setCurrentOwner(data?.invoice?.repayment?.owner);
      data.date = DateHelperService.fromJsonDate(data.date)
      data.type = data?.invoice?.type
      data.repayment = data?.invoice?.repayment?.uuid
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder?.uuid);
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
              { label: "ESPECE", value: "ESPECE" },
              { label: "MOBILE MONEY", value: "MOBILE MONEY" },
              { label: "WAVE", value: "WAVE" }
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
  setOwnerUuid(uuid) {
    if (uuid) {
      this.f.owner.setValue(uuid);
    } else {
      this.repayments = [];
      this.option.clear()
      this.f.owner.setValue(null);
      this.f.repayment.setValue(null);
      this.f.type.setValue(null);
    }
    this.loadRepayments()
  }
  setCurrentOwner(owner): void {
    this.setOwnerUuid(owner?.uuid);
    this.ownerSelected = {
      photoSrc: owner?.photoSrc,
      title: owner?.searchableTitle,
      detail: owner?.searchableDetail
    };
  }
  loadRepayments() {
    this.option.clear()
    this.isLoadingRepayment = true;
    if (!this.f.owner.value) {
      this.isLoadingRepayment = false;
      this.repayments = [];
      return;
    }
    this.repaymentService.getList(this.f.owner.value, null, 'VALIDE').subscribe(res => {
      this.isLoadingRepayment = false;
      console.log(res)
      return this.repayments = res;
    }, error => {
      this.isLoadingRepayment = false;
    });
  }
  setRepaymentUuid(event) {
    if (event.target.value !== null) {
      var uuid = event.target.value
      this.repayment = this.repayments.find(item => {
        if (item.uuid === uuid) {
          this.f.repayment.setValue(item?.uuid);
          return item;
        } else {
          this.option.clear()
          this.f.repayment.setValue(null);
        }
      });
    }
    if (!this.repayment) {
      this.toast('Veuillez selectionner un reversement', 'Erreur', 'danger');
      return;
    }
    this.f.repayment.setValue(this.repayment?.uuid);
    this.loadInvoice()
  }
  loadInvoice(){
    this.option.clear()
    if (this.f.repayment.value) {
      this.invoiceService.getList(null, this.f.repayment.value, 'SOLDE').subscribe((res) => {
        this.invoices = res
        if(this.invoices.length > 0){ this.option.controls = this.itemOption() }
        }, error => {}
      );
    }
  }
  itemOption(): FormGroup[] {
    var arr: any[] = []
    if(this.invoices && this.invoices.length > 0){
      this.invoices.forEach((item) =>{
        arr.push(
          this.formBuild.group({
            uuid: [item.uuid],
            checked: [false, [Validators.required]],
            libelle: [{value: item?.libelle, disabled: true}, [Validators.required]],
            montant: [{value: item?.montant, disabled: true}, [Validators.required]],
            paye: [{value: item?.paye, disabled: true}, [Validators.required]],
            impaye: [{value: item?.impaye, disabled: true}, [Validators.required]]
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
    this.montantTotal = total
    this.montantRestant = impaye
    this.montantRegle = paye
    this.f.montant.setValue(impaye)
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
    this.montantTotal = total
    this.montantRestant = impaye
    this.montantRegle = paye
    this.f.montant.setValue(impaye)
  }
  onChangeLibelle() {
    if(this.f.mode.value === 'VIREMENT' || this.f.mode.value === 'VERSEMENT'){
      this.numeroTitle = "N° virement"
      this.sourceTitle = "Banque"
    } else if(this.f.mode.value === 'CHEQUE'){
      this.sourceTitle = "Banque"
      this.numeroTitle = "N° cheque"
    } else if(this.f.mode.value === 'MOBILE MONEY' || this.f.mode.value === 'WAVE'){
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
      this.paymentService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (data?.uuid) {
            this.emitter.emit({action: 'PAYMENT_REPAYMENT_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'PAYMENT_REPAYMENT_ADD', payload: res?.data});
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
        this.folder.push(
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
      var data = {uuid: this.form.value.folderUuid, path: 'payment_reversement'}
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
      this.formBuild.array([])
      this.form.controls['folderUuid'].setValue(null);
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
  get folder() { return this.form.get('folders') as FormArray; }
}
