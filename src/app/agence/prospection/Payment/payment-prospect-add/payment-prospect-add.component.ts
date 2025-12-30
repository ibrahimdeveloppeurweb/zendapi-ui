import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { Treasury } from '@model/treasury';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { FolderService } from '@service/folder/folder.service';
import { PaymentReservationService } from '@service/payment-reservation/payment-reservation.service';
import { ProspectionService } from '@service/prospection/prospection.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-payment-prospect-add',
  templateUrl: './payment-prospect-add.component.html',
  styleUrls: ['./payment-prospect-add.component.scss']
})
export class PaymentProspectAddComponent implements OnInit {
  ESCAPE_KEYCODE = 27;
  title: string = '';
  form: FormGroup;
  submit: boolean = false;
  prospectSelected?: any;
  agency: any
  customers = [];
  invoices: any;
  folders = [];
  reservations= []
  dataReservation : any = []
  treasuries = [];
  folder?: any;
  isLoadingFolder = false;
  edit: boolean = false;
  payment: any;
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
  montant: number = 0;
  total_paye: number = 0;
  total_impaye: number = 0;
  required = Globals.required;
  userSession = Globals.user;
  global = {country: Globals.country, device: Globals.device};

  modeRow = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" }
    // { label: "WAVE", value: "WAVE" },
    // { label: "VERSEMENT", value: "VERSEMENT" },
    // { label: "VIREMENT", value: "VIREMENT" }
  ]
  // typeFactureRow = [
  //   { label: "DOSSIER", value: "DOSSIER" },
  //   { label: "RESILIATION", value: "RESILIATION" }
  // ]

  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public folderService: FolderService,
    public uploadService: UploaderService,
    private treasuryService: TreasuryService,
    private paymentReservationService: PaymentReservationService,
    private prospectionService: ProspectionService    
  ) {
    this.edit = this.paymentReservationService.edit;
    this.treasuryUuid = this.paymentReservationService.treasury;
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('token-zen-data')) : [];
    this.agency = permission.agencyKey,    
    this.payment = this.paymentReservationService.getPayment();    
    this.title = (!this.edit) ? "Ajouter un paiement" : "Modifier le paiement de " + this.payment?.info?.searchableTitle
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
      tiers: [null],
      prospect: [null, Validators.required],
      montant: [0, [Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
      date: [null, Validators.required],
      mode: ['ESPECE', Validators.required],
      effectue: [null, Validators.required],
      source: [null],
      numero: [null],
      files: [null, FileUploadValidators.filesLimit(3)],
      options: this.formBuild.array(this.itemOption()),
      folders: this.formBuild.array([]),
    });
  }
  
  editForm() {
    if (this.edit) {
      const data = {...this.paymentReservationService.getPayment()};
      console.log(data);
      console.log('test',this.payment)
      data.date = DateHelperService.fromJsonDate(data.date);
      this.prospectSelected = {
        photoSrc: data?.info?.photoSrc,
        title: data?.info?.searchableTitle,
        detail: data?.info?.searchableDetail
      };
      //@ts-ignore
      data?.prospect = data?.info?.prospectUuid;
      this.f.prospect.setValue(data?.info?.prospectUuid)
      //@ts-ignore
      data?.folder = data?.folder?.uuid;
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
  setProspectUuid(uuid) {
    if(uuid) {
      this.f.prospect.setValue(uuid)
      // this.loadInvoice(uuid);
   }else {
      this.f.prospect.setValue(null)
      this.prospectSelected = null
      this.montant = 0
      this.toast('Veuillez selectionner un dossier', 'Erreur', 'danger');
   }   
  }

  // loadInvoice(uuid){                
  //   this.prospectionService.getInvoices(uuid, this.agency, 'gestion').subscribe((res: any) => {
  //     if(res) {
  //       this.invoices = res.filter((item:any) => item.etat === 'ATTENTE')        
  //       //@ts-ignore
  //       this.invoices = res
  //       if(this.invoices){
  //         this.option.controls = this.itemOption()
  //       }
  //     }else{
  //       this.f.prospect.setValue(null);
  //       this.toast('Désolez, ce client n\'a aucun dossier actif', 'Dossier inactif', 'warning');
  //     }
  //   })
  // }
  
  itemOption(): FormGroup[] {
    var arr: any[] = []
    if(this.invoices && this.invoices.length > 0){
      this.invoices.forEach((item) =>{
        if(item.etat !== 'SOLDE') {
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
        }
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
      if($event.target.checked === true) {
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
    this.send()   
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
      this.paymentReservationService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          this.paymentReservationService.getPrinter('PRESERVATION', this.userSession?.agencyKey, this.userSession?.uuid, res?.data[0].uuid);
          this.emitter.emit({action: 'PAYMENT_CUSTOMER_ADD', payload: res?.data});         
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
