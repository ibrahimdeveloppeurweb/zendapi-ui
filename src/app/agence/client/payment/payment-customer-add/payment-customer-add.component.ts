import {Folder} from '@model/folder';
import { ToastrService } from 'ngx-toastr';
import { Treasury } from '@model/treasury';
import { Globals } from '@theme/utils/globals';
import {Component, HostListener, OnInit} from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { InvoiceFolder } from '@model/invoice-folder';
import {PaymentCustomer} from '@model/payment-customer';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FileUploadValidators} from '@iplab/ngx-file-upload';
import {FolderService} from '@service/folder/folder.service';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import {CustomerService} from '@service/customer/customer.service';
import {TreasuryService} from '@service/treasury/treasury.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {FolderInvoiceService} from '@service/folder-invoice/folder-invoice.service';
import {PaymentCustomerService} from '@service/payment-customer/payment-customer.service';
import { UpdateComponent } from '@agence/modal/update/update.component';

@Component({
  selector: 'app-payment-customer-add',
  templateUrl: './payment-customer-add.component.html',
  styleUrls: ['./payment-customer-add.component.scss']
})
export class PaymentCustomerAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = '';
  form: FormGroup;
  submit: boolean = false;
  customerSelected?: any;
  customers = [];
  invoices: InvoiceFolder[];
  folders = [];
  treasuries = [];
  folder?: Folder;
  isLoadingFolder = false;
  edit: boolean = false;
  payment: PaymentCustomer;
  treasuryUuid: string = "";
  treasury: Treasury;
  montantTotal:any = 0;
  montantRegle: any = 0;
  montantRestant: any = 0;
  sourceTitle: string = "";
  numeroTitle: string = "";
  isHidden: boolean;
  periode: any;
  uuid: any;
  total: number = 0;
  total_paye: number = 0;
  total_impaye: number = 0;
  required = Globals.required;
  userSession = Globals.user;
  global = {country: Globals.country, device: Globals.device};

  modeRow = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" },
    { label: "WAVE", value: "WAVE" },
    { label: "VERSEMENT", value: "VERSEMENT" },
    { label: "VIREMENT", value: "VIREMENT" }
  ]
  typeFactureRow = [
    { label: "DOSSIER", value: "DOSSIER" },
    { label: "RESILIATION", value: "RESILIATION" }
  ]

  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public folderService: FolderService,
    public uploadService: UploaderService,
    public customerService: CustomerService,
    private treasuryService: TreasuryService,
    public folderInvoiceService: FolderInvoiceService,
    public paymentCustomerService: PaymentCustomerService
  ) {
    this.edit = this.paymentCustomerService.edit;
    this.treasuryUuid = this.paymentCustomerService.treasury;
    this.payment = this.paymentCustomerService.getPayment();
    this.title = (!this.edit) ? "Ajouter un paiement" : "Modifier le paiement de " + this.payment?.invoice?.folder?.customer?.searchableTitle
    this.newForm();
    this.setTreasury()
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      treasury: [null],
      folderUuid: [null],
      type: [null, Validators.required],
      customer: [null, Validators.required],
      folder: [null, Validators.required],
      montant: [0, [Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
      date: [null, Validators.required],
      mode: ['ESPECE', Validators.required],
      montantVerse: [0],
      effectue: [null, Validators.required],
      source: [null],
      numero: [null],
      tiers: [null],
      files: [null, FileUploadValidators.filesLimit(3)],
      options: this.formBuild.array(this.itemOption()),
      echeanceFolders: this.formBuild.array([]),
      avanceFolders: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    });
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
  editForm() {
    if (this.edit) {
      const data = {...this.paymentCustomerService.getPayment()};
      data.date = DateHelperService.fromJsonDate(data.date);
      this.customerSelected = {
        photoSrc: data?.invoice?.folder?.customer?.photoSrc,
        title: data?.invoice?.folder?.customer?.searchableTitle,
        detail: data?.invoice?.folder?.customer?.searchableDetail
      };
      //@ts-ignore
      data?.type = data?.invoice?.type;
      //@ts-ignore
      data?.customer = data?.invoice?.folder?.customer?.uuid;
      //@ts-ignore
      data?.folder = data?.invoice?.folder?.uuid;
      this.form.patchValue(data);
      this.f.folderUuid.setValue(this.payment.folder.uuid);
      this.option.push(
        this.formBuild.group({
          checked: [true],
          libelle: [{value: data?.invoice.libelle, disabled: true}],
          montant: [{value: data?.invoice?.montant, disabled: true}],
          paye: [{value: data?.invoice?.paye, disabled: true}],
          impaye: [{value: data?.invoice?.impaye, disabled: true}]
        })
      );
      this.montantRestant = data?.invoice?.impaye;
      this.montantTotal = data?.invoice?.montant;
      this.montantRegle = data?.invoice?.paye;
    }
  }
  setCustomerUuid(uuid) {
    if (uuid) {
      this.customerService.getSingle(uuid).subscribe((res: any) => {
        if(res.etat === 'ACTIF') {
          this.f.customer.setValue(uuid);

          // const modal = this.modalService.open(UpdateComponent, { centered: true });
          // modal.componentInstance.data = res;
          // modal.componentInstance.selected = res?.telephone;
          // modal.componentInstance.type = 'CUSTOMER';
        }else{
          this.f.customer.setValue(null);
          this.toast('Désolez, ce client n\'a aucun dossier actif', 'Dossier inactif', 'warning');
        }
      })
    } else {
      this.folders = [];
      this.option.clear()
      this.f.folder.setValue(null);
    }
  }
  loadFolders() {
    this.option.clear()
    this.isLoadingFolder = true;
    if (!this.f.customer.value) {
      this.isLoadingFolder = false;
      this.folders = [];
      return;
    }
    var etat  = this.f.type.value === "RESILIATION" ? 'RESILIE' : 'VALIDE';
    this.folderService.getList(this.f.customer.value, etat).subscribe(res => {
      this.isLoadingFolder = false;
      return this.folders = res;
    }, error => {
      this.isLoadingFolder = false;
    });
  }
  setFolderUuid(event) {
   var uuid = event.target.value
    if (event.target.value !== null) {
      this.folder = this.folders.find(item => {
        if (item.uuid === uuid) {
          this.f.folder.setValue(item.uuid);
          this.loadInvoice(this.f.type.value);
          return item;
        }
      });
    }
    if (this.folder?.invoice?.rembourser > 0) {
      this.isHidden = true
    }
    if (!this.folder) {
      this.toast('Veuillez selectionner un dossier', 'Erreur', 'danger');
      return;
    }
    if (this.folder) {
      if (this.folder?.modalite === "ECHEANCE") {
        this.avanceFolders.controls.length = 0;
        this.echeanceFolders.controls.length = 0;
        this.folder?.echeances.forEach(item => {
          if (item?.etat === 'IMPAYE') {
            this.echeanceFolders.controls.push(
              this.formBuild.group({
                uuid: [item?.uuid],
                id: [item?.id],
                checked: [false],
                date: [{value: DateHelperService.fromJsonDate(item?.date), disabled: true}],
                etat: [{value: item?.etat, disabled: true}],
                montant: [{value: item?.montant, disabled: true}],
                description: [{value: item?.description, disabled: true}],
              })
            );
          }
        });
      }
      if (this.folder?.modalite === "AVANCEMENT") {
        this.avanceFolders.controls.length = 0;
        this.echeanceFolders.controls.length = 0;

        this.folder?.advances.forEach(item => {
          if (item?.etat === 'IMPAYE') {
            this.avanceFolders.controls.push(
              this.formBuild.group({
                uuid: [item?.uuid],
                id: [item?.id],
                checked: [false],
                libelle: [{value: item?.libelle, disabled: true}],
                etat: [{value: item?.etat, disabled: true}],
                prc: [{value: item?.prc, disabled: true}],
                montant: [{value: item?.montant, disabled: true}],
              })
            );
          }
        });
      }
    }
    this.form.get('folder').setValue(this.folder.uuid);
  }
  loadInvoice(type){
    this.option.clear()
    this.folderInvoiceService.getList(this.f.folder.value, null, type).subscribe((res) => {
      //@ts-ignore
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
            montant: [{value: this.folder?.invoice?.rembourser > 0 ? item?.rembourser : item?.montant, disabled: true}],
            paye: [{value: this.folder?.invoice?.rembourser > 0 ? 0 : item?.paye, disabled: true}],
            impaye: [{value: this.folder?.invoice?.rembourser > 0 ? item?.rembourser : item?.impaye, disabled: true}]
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
    if (this.folder?.invoice?.rembourser > 0) {
      this.isHidden = true
    }
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
    if (this.folder?.invoice?.rembourser > 0) {
      this.isHidden = true
    }
  }
  onSelectAllEcheance($event) {
    this.echeanceFolders.controls.forEach(item => {
      item.get('checked').setValue($event.target.checked)
    })
  }
  onSelectAllAdvance($event) {
    this.avanceFolders.controls.forEach(item => {
      item.get('checked').setValue($event.target.checked)
    })
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
    } else if (this.f.montant.value < 0){
      this.f.montant.setValue(parseFloat(this.montantRestant))
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.f.montant.value <= 0) {
      this.toast('Le montant du paiement ne peut être inferieur ou égal à 0.', 'Montant erroné', 'warning');
      return
    }
    if (this.folder?.modalite === "ECHEANCE") {
      var i = 0
      this.echeanceFolders.controls.forEach(item => {
        if (item.get('checked').value) { i = i + 1 }
      });
      if (i === 0) {
        Swal.fire({
          title: '',
          text: "Voulez-vous vraiment enregistrer cet paiement sans selectionner d'échéance ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'primary',
          cancelButtonColor: '#F5ce4b',
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result.isConfirmed) { this.send() }
        })
      }else{
        this.send()
      }
    } else if (this.folder?.modalite === "AVANCEMENT") {
      var i = 0
      this.avanceFolders.controls.forEach(item => {
        if (item.get('checked').value) { i = i + 1 }
      });
      if (i === 0) {
        Swal.fire({
          title: '',
          text: "Voulez-vous vraiment enregistrer cet paiement sans selectionner d'avance ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: 'primary',
          cancelButtonColor: '#F5ce4b',
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result.isConfirmed) { this.send() }
        })
        return
      }else{
        this.send()
      }
      this.send()
    }else{
      this.send()
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
  send() {
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.paymentCustomerService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (data?.uuid) {
            this.paymentCustomerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, res?.data?.uuid);
            this.emitter.emit({action: 'PAYMENT_CUSTOMER_UPDATED', payload: res?.data});
          } else {
            res.data.forEach(item => {
              this.paymentCustomerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, item?.uuid);
            })
            this.emitter.emit({action: 'PAYMENT_CUSTOMER_ADD', payload: res?.data});
          }
        }
      });
    } else { return; }
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
      var data = {uuid: this.form.value.folderUuid, path: 'paiement_client'}
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
  onChangeFolder(event) {
    this.folder = null;
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
  get echeanceFolders() { return this.form.get('echeanceFolders') as FormArray; }
  get avanceFolders() { return this.form.get('avanceFolders') as FormArray; }
  get folderf() { return this.form.get('folders') as FormArray; }
}
