
import { Tenant } from '@model/tenant';
import { Payment } from '@model/payment';
import { Invoice } from '@model/invoice';
import { Contract } from '@model/contract';
import { ToastrService } from 'ngx-toastr';
import { Treasury } from '@model/treasury';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ShortContract } from '@model/short-contract';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { TenantService } from '@service/tenant/tenant.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { PaymentService } from '@service/payment/payment.service';
import { InvoiceService } from '@service/invoice/invoice.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { ContractService } from '@service/contract/contract.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateComponent } from '@agence/modal/update/update.component';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ShortContractService } from '@service/short-contract/short-contract.service';
import { environment } from '@env/environment';
import { RentService } from '@service/rent/rent.service';
import {RenewService} from '@service/renew/renew.service';
import { RenewPaymentService } from '@service/renew-payment/renew-payment.service';
import {GroupedContractService} from "@service/grouped-contract/grouped-contract.service";



@Component({
  selector: 'app-payment-add',
  templateUrl: './payment-add.component.html',
  styleUrls: ['./payment-add.component.scss']
})
export class PaymentAddComponent implements OnInit {
  ESCAPE_KEYCODE = 27;
  title: string = "";
  sourceTitle: string = "";
  numeroTitle: string = "";
  treasuryUuid: string = null;
  treasury: Treasury;
  tenantSelected?: any;
  contract: Contract|ShortContract;
  invoices: Invoice[];
  autres: Invoice[];
  isHidden: boolean = false;
  entree: boolean = false;
  contracts: any[]= [];
  isLoadingContract = false;
  montantTotal:any = 0;
  montantRegle: any = 0;
  montantRestant: any = 0;
  form: FormGroup;
  submit: boolean = false;
  edit: boolean = false;
  payment: Payment;
  required = Globals.required;
  userSession = Globals.user;
  global = {country: Globals.country, device: Globals.device};
  tenant: Tenant = null;
  tenants: Array<Tenant> = [];
  modeRow: any[] = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" },
    { label: "WAVE", value: "WAVE" },
    { label: "VERSEMENT", value: "VERSEMENT" },
    { label: "VIREMENT", value: "VIREMENT" }
  ];
  typeFactureRow = [
    { label: "LOYER", value: "LOYER" },
    { label: "ENTREE", value: "ENTREE" },
    { label: "COURT TERME", value: "COURT-TERME" },
    { label: "AUTRES FACTURE", value: "AUTRE" },
    { label: "PENALITE", value: "PENALITE" },
    { label: "RESILIATION", value: "RESILIATION" },
    { label: "RENOUVELLEMENT", value: "RENOUVELLEMENT" }
  ];
  file: any;
  isTreso: string = "NON";
  publicUrl = environment.publicUrl;
  treasuries: any[] = [];

  constructor(
    public toastr: ToastrService,
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public modalActive: NgbActiveModal,
    private tenantService: TenantService,
    public paymentService: PaymentService,
    public renewPaymentService: RenewPaymentService,
    public uploadService: UploaderService,
    private invoiceService: InvoiceService,
    private treasuryService: TreasuryService,
    private contractService: ContractService,
    private shortService: ShortContractService,
    private rentService: RentService,
    private renewService: RenewService,
    private groupedContractService: GroupedContractService,
  ) {
    this.edit = this.paymentService.edit;
    this.isTreso = this.paymentService.isTreso;
    this.treasuryUuid = this.paymentService.treasury;

    this.payment = this.paymentService.getPayment();
    console.log(this.treasuryUuid);

    this.title = (!this.edit) ? "Ajouter un paiement" : "Modifier le paiement de " + this.payment?.invoice?.contract?.tenant?.searchableTitle;
    this.newForm();
    this.setTreasury();
    this.treasuryService.getList().subscribe(res => { return this.treasuries = res; }, error => { });
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
      isTreso: [this.isTreso],
      effectue: [null, [Validators.required]],
      tenant: [null, [Validators.required]],
      contract: [null, [Validators.required]],
      type: [null, [Validators.required]],
      montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
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
      this.setCurrentTenant(data?.invoice?.contract ? data?.invoice?.contract?.tenant : data?.invoice?.short?.tenant);
      data.date = DateHelperService.fromJsonDate(data.date)
      data.type = data?.invoice?.type
      data.contract = data?.invoice?.contract ? data?.invoice?.contract?.uuid : data?.invoice?.short?.uuid;
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder?.uuid)
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

  onSelectTreasury(value) {
    if (value) {
      this.treasuryUuid = value
      this.setTreasury()
    }
  }

  setTreasury(){
    if(this.treasuryUuid){
      this.f.treasury.setValue(this.treasuryUuid)
      this.treasuryService.getSingle(this.treasuryUuid).subscribe((res: any) => {
        if (res) {
          this.treasury = res;
          console.log(this.treasury.type)
          if (this.treasury.type === "CAISSE") {
            this.f.mode.setValue("ESPECE")
            this.modeRow = [
              { label: "ESPECE", value: "ESPECE" },
              { label: "MOBILE MONEY", value: "MOBILE MONEY" },
              { label: "WAVE", value: "WAVE" }
            ];
          }
          if (this.treasury.type === "BANQUE") {
            this.f.mode.setValue("CHEQUE")
            this.modeRow = [
              { label: "CHEQUE", value: "CHEQUE" },
              { label: "VERSEMENT", value: "VERSEMENT" },
              { label: "VIREMENT", value: "VIREMENT" }
            ];
          }
          this.onChangeLibelle()
          return this.treasury
        }
      });
    }
  }
  setTenantUuid(uuid) {
    if (uuid) {
      this.tenantService.getSingle(uuid).subscribe((res: any) => {
        if(res) {
          this.tenant = res;
          this.f.tenant.setValue(res?.uuid);

          // const modal = this.modalService.open(UpdateComponent, { centered: true });
          // modal.componentInstance.data = this.tenant;
          // modal.componentInstance.selected = this.tenant?.telephone;
          // modal.componentInstance.type = 'TENANT';
        }
      })
    } else {
      this.contracts = [];
      this.option.clear();
      this.f.tenant.setValue(null);
      this.f.contract.setValue(null);
      this.f.type.setValue(null);
    }
  }
  setCurrentTenant(tenant): void {
    this.setTenantUuid(tenant?.uuid);
    this.tenantSelected = {
      photoSrc: tenant?.photoSrc,
      title: tenant?.searchableTitle,
      detail: tenant?.searchableDetail
    };
  }
  onTenantEtat() {
    if(this.tenant?.etat !== 'ACTIF' && this.f.type.value !== 'RESILIATION') {
      this.toast('Désolez, ce locataire n\'a aucun contrat actif', 'Contrat inactif', 'warning');
      this.contracts = [];
      this.option.clear();
      this.setCurrentTenant(null);
      this.tenantSelected = null;
    }
  }
  /*loadContracts() {
    this.f.contract.setValue(null);
    this.option.clear();
    this.isLoadingContract = true;
    if (!this.f.tenant.value || !this.f.type.value) {
      this.isLoadingContract = false;
      this.contracts = [];
      return;
    }
    var etat = this.f.type.value === "RESILIATION" ? 'RESILIE' : 'ACTIF';
    this.isHidden = this.f.type.value === "ENTREE" ? true : false;
    if(this.f.type.value !== 'COURT-TERME') {
      this.contractService.getList(this.f.tenant.value, etat).subscribe(res => {
        console.log(res)
        this.isLoadingContract = false;
        this.contracts = res;
        if (this.contracts.length === 0) {
          this.groupedContractService.getList(this.f.tenant.value, etat).subscribe(res => {
            console.log(res)
            this.isLoadingContract = false;
            this.contracts = res;
            if (this.contracts.length === 1) {
              let uuid = res[0].uuid
              this.setContratUuid(uuid)
            }
          })
        }else {
          if (this.contracts.length === 1) {
            let uuid = res[0].uuid
            this.setContratUuid(uuid)
          }
        }
      }, error => {
        this.isLoadingContract = false;
      });
    } else if(this.f.type.value === 'COURT-TERME') {
      this.shortService.getList(this.f.tenant.value, etat).subscribe(res => {
        this.isLoadingContract = false;
        this.contracts = res;
        if (res.length === 1) {
          let uuid = res[0].uuid
          this.setContratUuid(uuid)
        }
      }, error => {
        this.isLoadingContract = false;
      });
    }else if(this.f.type.value === 'RENOUVELLEMENT') {
      this.contracts = [];
      this.renewService.getList(null, null).subscribe(res => {return this.contracts = res; }, error => {} );

    }
  }*/
  loadContracts(): void {
    // Réinitialisation des valeurs
    this.resetContractState();

    // Validation des prérequis
    if (!this.isValidFormState()) {
      this.setLoadingState(false);
      this.contracts = [];
      return;
    }

    const typeValue = this.f.type.value;
    const tenantValue = this.f.tenant.value;

    // Configuration basée sur le type
    const config = this.getContractConfig(typeValue);
    this.isHidden = config.isHidden;

    this.setLoadingState(true);

    // Dispatch vers la méthode appropriée selon le type
    this.loadContractsByType(typeValue, tenantValue, config.etat);
  }

  private resetContractState(): void {
    this.f.contract.setValue(null);
    this.option.clear();
  }

  private isValidFormState(): boolean {
    return !!(this.f.tenant.value && this.f.type.value);
  }

  private setLoadingState(isLoading: boolean): void {
    this.isLoadingContract = isLoading;
  }

  private getContractConfig(type: string): { etat: string; isHidden: boolean } {
    const configs = {
      'RESILIATION': { etat: 'RESILIE', isHidden: false },
      'ENTREE': { etat: 'ACTIF', isHidden: true },
      'COURT-TERME': { etat: 'ACTIF', isHidden: false },
      'RENOUVELLEMENT': { etat: null, isHidden: false }
    };

    return configs[type] || { etat: 'ACTIF', isHidden: false };
  }

  private loadContractsByType(type: string, tenantValue: string, etat: string): void {
    switch (type) {
      case 'RENOUVELLEMENT':
        this.loadRenewalContracts();
        break;
      case 'COURT-TERME':
        this.loadShortTermContracts(tenantValue, etat);
        break;
      default:
        this.loadRegularContracts(tenantValue, etat);
        break;
    }
  }

  private loadRegularContracts(tenantValue: string, etat: string): void {
    this.contractService.getList(tenantValue, etat).subscribe({
      next: (contracts) => {
        console.log('Regular contracts:', contracts);
        this.handleContractsResponse(contracts);

        // Si aucun contrat trouvé, essayer avec groupedContractService
        if (contracts.length === 0) {
          this.loadGroupedContracts(tenantValue, etat);
        } else {
          this.handleSingleContractSelection(contracts);
        }
      },
      error: (error) => this.handleContractError(error)
    });
  }

  private loadGroupedContracts(tenantValue: string, etat: string): void {
    this.groupedContractService.getList(tenantValue, etat).subscribe({
      next: (contracts) => {
        console.log('Grouped contracts:', contracts);
        this.handleContractsResponse(contracts);
        this.handleSingleContractSelection(contracts);
      },
      error: (error) => this.handleContractError(error)
    });
  }

  private loadShortTermContracts(tenantValue: string, etat: string): void {
    this.shortService.getList(tenantValue, etat).subscribe({
      next: (contracts) => {
        this.handleContractsResponse(contracts);
        this.handleSingleContractSelection(contracts);
      },
      error: (error) => this.handleContractError(error)
    });
  }

  private loadRenewalContracts(): void {
    this.contracts = [];
    this.renewService.getList(null, null).subscribe({
      next: (contracts) => {
        this.contracts = contracts;
        this.setLoadingState(false);
      },
      error: (error) => this.handleContractError(error)
    });
  }

  private handleContractsResponse(contracts: any[]): void {
    this.contracts = contracts;
    this.setLoadingState(false);
  }

  private handleSingleContractSelection(contracts: any[]): void {
    if (contracts.length === 1) {
      const uuid = contracts[0].uuid;
      this.setContratUuid(uuid);
    }
  }

  private handleContractError(error: any): void {
    console.error('Erreur lors du chargement des contrats:', error);
    this.setLoadingState(false);
    this.contracts = [];
  }
  setContratUuid(event) {
    console.log(event)
    // var uuid = event.target.value
    var uuid = event
    if (uuid !== null) {
      this.contract = this.contracts.find(item => {
        if (item?.uuid === uuid) {
          this.f.contract.setValue(item?.uuid);
          return item;
        }
      });
      if (this.f.contract.value === null) {
        this.option.clear()
        this.f.contract.setValue(null);
        this.f.type.setValue(null);
      }
    }
    if (!this.contract) {
      this.toast('Veuillez selectionner un contrat', 'Erreur', 'danger');
      return;
    }
    this.f.contract.setValue(this.contract.uuid);
    this.loadInvoice(this.f.type.value)
  }
  loadInvoice(type){
    this.option.clear();
    this.invoiceService.getList(null, type, this.contract.uuid).subscribe((res) => {
      this.invoices = type !== 'LOYER' ? res : res?.filter((item) => { if (item?.rent?.type !== 'AVANCE'){ return item } })
      this.entree = this.invoices ? true : false
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
    if (this.f.type.value === "LOYER") {
      this.option.controls.forEach(item => {
        // @ts-ignore
        var ligne = item.getRawValue()
        if (ligne?.checked === true) {
          if (ligne?.paye == 0) {
            if (this.f.montant.value < this.contract?.charge) {
              this.toast('Le montant du paiement ne peut être inferieur au montant du charge.', 'Montant erroné', 'warning');
            }
          }
        }
      })
    }
    if(this.f.montant.value > parseFloat(this.montantRestant)){
      this.f.montant.setValue(0)
    }
  }
  onSubmit() {
    this.submit = true;
    if(this.f.type.value !== "RESILIATION" && this.f.type.value !== "ENTREE"){
      if (this.f.montant.value < 0) {
        this.toast('Le montant du paiement ne peut être inferieur à 0.', 'Montant erroné', 'warning');
        return
      }
    }
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.paymentService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modalActive.close('ferme');
          if (data?.uuid) {
            let check = res.data.montant === res.data.invoice.montant
            if (check) {
              let rent  =  res.data.invoice ? res.data.invoice.rent : null
              if (rent) {
                this.rentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, rent.uuid);
              }
            } else {
              this.paymentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, res?.data?.uuid);
            }
            this.emitter.emit({action: 'PAYMENT_UPDATED', payload: res?.data});
          } else {
            let uuids = []
            res.data.forEach((item: any) => {
              let check = item.montant === item.invoice.montant
              if (check) {
                let rent = item.invoice ? item.invoice.rent : null
                if (rent) {
                  uuids.push(rent.uuid)
                }
              } else {
                this.paymentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, item?.uuid);
              }
            })
            if (uuids && uuids.length > 0) {
              this.rentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, uuids);
            }
            this.emitter.emit({action: 'PAYMENT_ADD', payload: res?.data});
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
  showFile(item) {
    const fileByFolder = this.uploadService.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploadService.setDataFileByFolder('');
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }

  onClose(){
    if (!this.edit && this.form.value.folderUuid) {
      var data = {uuid: this.form.value.folderUuid, path: 'paiement_locataire'}
      this.uploadService.getDelete(data).subscribe((res: any) => {
        if (res) {
          if (res?.status === 'success') {
            this.form.reset()
            this.modalActive.close('ferme');
          }
        }
        return res
      });
    }else{
      this.form.reset()
      this.modalActive.close('ferme');
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
  modal(component, type, size, center, backdrop) {
    return this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => {});
  }
  get f() { return this.form.controls; }
  get option() { return this.form.get('options') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}
