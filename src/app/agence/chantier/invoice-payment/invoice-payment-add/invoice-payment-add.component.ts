import { Component, OnInit, ChangeDetectionStrategy, Provider, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { InvoiceCoService } from '@service/invoice-co/invoice-co.service';
import { InvoicePaymentService } from '@service/invoice-payment/invoice-payment.service';
import { ToastrService } from 'ngx-toastr';
import { UploaderService } from '@service/uploader/uploader.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { InvoiceCo } from '@model/prestataire/invoice-co';
import { TreasuryService } from '@service/treasury/treasury.service';
import { CurrencyPipe } from '@angular/common';
import { Globals } from '@theme/utils/globals';
import { TypeLoad } from '@model/typeLoad';
import { InvoicePayment } from '@model/prestataire/invoice-payment';

@Component({
  selector: 'app-invoice-payment-add',
  templateUrl: './invoice-payment-add.component.html',
  styleUrls: ['./invoice-payment-add.component.scss'],
})
export class InvoicePaymentAddComponent implements OnInit {
  @Input() public type: string = "LOCATIVE"
  @Input() public treasury: string 
  title: string = ""
  edit: boolean = false
  form: FormGroup
  submit: boolean = false
  
  typeLoads: TypeLoad[] = [];
  treasuries: any[] = [];
  selectedTreasury: any;
  selectedInvoice: any;
  
  selectRow = []
  totalHT = 0;
  totalTva = 0;
  totalTTC = 0;
  totalRemise = 0;
  required = Globals.required
  isLoadingHouseCo = false;
  isLoadingHomeCo = false;
  isLoadingInfrastructure = false
  isLoadingTypeLoad = false
  canChangeProvider = true;
  canChangeSyndic = true
  // données paiement
  sourceTitle: string = "";
  numeroTitle: string = "";
  montantTotal: any = 0;
  montantRegle: any = 0;
  montantRestant: any = 0;
  isHidden: boolean = false;

  currencyPipe: CurrencyPipe = new CurrencyPipe('fr');

  modeRow: any[] = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" },
    { label: "WAVE", value: "WAVE" },
    { label: "VERSEMENT", value: "VERSEMENT" },
    { label: "VIREMENT", value: "VIREMENT" }
  ];

  selectedCopriete = {};
  invoice: InvoiceCo;
  invoicePayement: InvoicePayment;
  invoices: InvoiceCo[];

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private uploadService: UploaderService,
    private invoiceService: InvoiceCoService,
    private treasuryService: TreasuryService,
    private invoicePaymentService: InvoicePaymentService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) {
    this.edit = this.invoiceService.edit
    this.title = (!this.edit) ? "Ajouter un paiement" : "Modifier le paiement" + this.invoicePayement.code
    this.newForm()
    
    this.loadTreasuries();
    this.loadInvoices();
  }

  ngOnInit(): void {
    this.editForm()
    if (this.treasury) {
      this.treasuryService.getSingle(this.treasury).subscribe(res => {
        this.selectedTreasury = res
        this.f.treasury.setValue(res.uuid)
      }, error => {
      });
    }
  }

  

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      invoice: [null, [Validators.required]],
      folderUuid: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      treasury: [null, [Validators.required]],
      effectue: [null],
      montant: [0],
      date: [null, [Validators.required]],
      mode: ['ESPECE'],
      source: [null],
      numero: [null],
      tiers: [null],
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.invoiceService.getInvoiceCo() }
      data.date = DateHelperService.fromJsonDate(data?.date);
      this.form.patchValue(data)
      this.f.folderUuid?.setValue(data?.folder?.uuid);
    }
  }
  setProviderUuid(uuid) {
    if (uuid) {
      this.f.provider.setValue(uuid);
    } else {
      this.f.provider.setValue(null);
    }
  }
  
  loadTreasuries() {
    this.treasuries = [];
    this.treasuryService.getList().subscribe(res => {
      if (res.length > 0) {
        this.treasuries = res;
      }
    }, error => {
    });
  };

  loadInvoices() {
    this.treasuries = [];
    this.invoiceService.getList().subscribe(res => {
      if (res.length > 0) {
        this.invoices = res;
      }
    }, error => {
    });
  };
  
  setTreasury() {
    if (this.f.treasury) {
      this.treasuryService.getSingle(this.f.treasury.value).subscribe((res: any) => {
        if (res) {
          if (res.type === "CAISSE") {
            this.modeRow = [
              { label: "ESPECE", value: "ESPECE" },
              { label: "MOBILE MONEY", value: "MOBILE MONEY" },
              { label: "WAVE", value: "WAVE" }
            ];
          }
          if (res.type === "BANQUE") {
            this.modeRow = [
              { label: "CHEQUE", value: "CHEQUE" },
              { label: "VERSEMENT", value: "VERSEMENT" },
              { label: "VIREMENT", value: "VIREMENT" }
            ];
          }
          return res
        }
      });
    }
  }

  setInvoice() {}
  
  loadfile(data) {
    if (data && data !== null) {
      const file = data.todo.file
      this.file.push(
        this.formBuild.group({
          uniqId: [data.todo.uniqId, [Validators.required]],
          fileName: [file.name, [Validators.required]],
          fileSize: [file.size, [Validators.required]],
          fileType: [file.type, [Validators.required]],
          loaded: [data.todo.loaded, [Validators.required]],
          chunk: [data.chunk, [Validators.required]],
        })
      );
    }
  }
  files(data) {
    if (data && data !== null) {
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
  upload(files) {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value) {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, { [property]: value });
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.invoicePaymentService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'INVOICE_PAYMENT_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'INVOICE_PAYMENT_ADD', payload: res?.data });
          }
        }
      });
    } else { return; }
  }
  
  onChangeLibelle() {
    if (this.f.mode.value === 'VIREMENT' || this.f.mode.value === 'VERSEMENT') {
      this.numeroTitle = "N° virement"
      this.sourceTitle = "Banque"
    } else if (this.f.mode.value === 'CHEQUE') {
      this.sourceTitle = "Banque"
      this.numeroTitle = "N° cheque"
    } else if (this.f.mode.value === 'MOBILE MONEY' || this.f.mode.value === 'WAVE') {
      this.sourceTitle = "N° Téléphone"
      this.numeroTitle = "N° Transaction"
    }
    this.f.source.setValue(null)
    this.f.numero.setValue(null)
  }

  onChangeEffectue() {
    this.f.tiers.setValue(null)
  }

  onChangeMontant() {
    if (this.f.montant.value > parseFloat(this.f.montant.value)) {
      this.f.montant.setValue(0)
    }
  }
  
  groupingHelper(item) {
    if (item?.houseCo) {
      return item?.houseCo?.nom
    }
    return null;
  }
  groupValueHelper(item) {
    return item.houseCo;
  }
  onConfirme() {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment enregistrer cette facture ?',
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
  onClose() {
    if (!this.edit && this.form.value.folderUuid) {
      var data = { uuid: this.form.value.folderUuid, path: 'invoice' }
      this.uploadService.getDelete(data).subscribe((res: any) => {
        if (res) {
          if (res?.status === 'success') {
            this.form.reset()
            this.modal.close('ferme');
          }
        }
        return res
      });
    } else {
      this.form.reset()
      this.modal.close('ferme');
    }
  }
  onReset() {
    if (this.form.value.folderUuid) {
      this.toast('Impossible de de vider le formulaire lorsque un upload a été éffectué', 'Une erreur a été rencontrée', 'warning');
    } else {
      this.form.reset()
    }
  }
  toast(msg, title, type) {
    if (type == 'info') {
      this.toastr.info(msg, title)
    } else if (type == 'success') {
      this.toastr.success(msg, title)
    } else if (type == 'warning') {
      this.toastr.warning(msg, title)
    } else if (type == 'error') {
      this.toastr.error(msg, title)
    }
  }
  formatInputValue(value: number): string {
    return this.currencyPipe.transform(value, '1.0');
  }
  timelapse(dateD, dateF): string { return DateHelperService.getTimeLapse(dateD, dateF, false, 'dmy'); }
  get f() { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}
