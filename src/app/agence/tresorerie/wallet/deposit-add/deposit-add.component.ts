
import { ToastrService } from 'ngx-toastr';
import { Withdrawll } from '@model/withdrawll';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { OwnerService } from '@service/owner/owner.service';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { WalletService } from '@service/wallet/wallet.service';
import { DepositService } from '@service/wallet/deposit.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { House } from '@model/house';
import { HouseService } from '@service/house/house.service';

@Component({
  selector: 'app-deposit-add',
  templateUrl: './deposit-add.component.html',
  styleUrls: ['./deposit-add.component.scss']
})
export class DepositAddComponent implements OnInit {
  ownerSelected?: any;
  ESCAPE_KEYCODE = 27;
  title: string = "";
  treasurySelected?: any;
  sourceTitle: string = "";
  numeroTitle: string = "";

  fileO: any;
  form: FormGroup;
  submit: boolean = false;
  edit: boolean = false;
  withdrawll: Withdrawll;
  required = Globals.required;
  userSession = Globals.user;
  global = {country: Globals.country, device: Globals.device};
  modeRow: any[] = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" },
    { label: "WAVE", value: "WAVE" },
    { label: "VERSEMENT", value: "VERSEMENT" },
    { label: "VIREMENT", value: "VIREMENT" }
  ]
  file: any;
  publicUrl = environment.publicUrl;
  treasuries: any[] = [];
  owner: any;
  treasury: any;
  wallet: any;
  house: House;
  houses: House[] = []

  constructor(
    public toastr: ToastrService,
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private ownerService: OwnerService,
    private houseService: HouseService,
    public modalActive: NgbActiveModal,
    public walletService: WalletService,
    public uploadService: UploaderService,
    private depositService: DepositService,
    private treasuryService: TreasuryService
  ) {
    this.edit = this.depositService.edit;
    this.owner = this.ownerService.getOwner()
    this.treasury = this.treasuryService.getTreasury()
    this.title = (!this.edit) ? "Effectuer un dépôt " : "Modifier le dépôt";

    this.newForm();

    if (this.owner) {
      this.setCurrentOwner(this.owner)
    }
    if (this.treasury) {
      this.f.treasury.setValue(this.treasury.uuid)
      this.treasurySelected = {
        photoSrc: this.treasury.photoSrc,
        title: this.treasury.searchableTitle,
        detail: this.treasury.searchableDetail
      }
      this.loadMode(this.treasury)
    }
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
      libelle: [null],
      owner: [null, [Validators.required]],
      house: [null],
      montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      date: [null, [Validators.required]],
      mode: ['ESPECE', [Validators.required]],
      effectue: [null],
      source: [null],
      numero: [null],
      tiers: [null],
      files: [null, FileUploadValidators.filesLimit(3)],
      folders: this.formBuild.array([]),
    });
  }
  editForm(){
    if (this.edit) {
      const data = {...this.depositService.getDeposit() };
      console.log(data);

      this.form.patchValue(data);
      if (data.treasury) {
        this.treasurySelected = {
          photoSrc: data.treasury?.photoSrc,
          title: data.treasury?.searchableTitle,
          detail: data.treasury?.searchableDetail
        };
      }
      if (data.owner) {
        this.ownerSelected = {
          photoSrc: data.owner?.photoSrc,
          title: data.owner?.searchableTitle,
          detail: data.owner?.searchableDetail
        };
      }
      if (data.house) {
        this.f.house.setValue(data.house.uuid);
      }
      if (data.treasury) {
        this.f.treasury.setValue(data.treasury.uuid);
      }
      this.f.owner.setValue(data.owner.uuid);

      this.f.date.setValue(DateHelperService.fromJsonDate(data?.date));
      this.loadHouses();

    }
  }
  setOwnerUuid(uuid) {
    if (uuid) {
      this.f.owner.setValue(uuid);
      // this.walletService.getOwner(uuid).subscribe((res: any) => {
      //   if(res) {
      //     this.wallet = res;
      //     this.f.wallet.setValue(res?.uuid);
      //   }
      // })
      this.loadHouses();
    } else {
      this.wallet = null;
      this.house = null;
      this.houses = [];
      this.f.owner.setValue(null);
      this.f.house.setValue(null);
    }
  }
  loadHouses() {
    // if(!this.edit) {
      this.houseService.getList(this.f.owner.value, 'LOCATION', 'DISPONIBLE').subscribe(res => {
        this.houses = res;
        return this.houses;
      }, error => {});
    // }
  }

  setTreasuryUuid(uuid) {
    if (uuid) {
      this.setTreasury(uuid)
      this.treasuryService.getSingle(uuid).subscribe((res: any) => {
        if (res) {
          this.treasury = res;
          this.loadMode(this.treasury)
          return this.treasury
        }
      });
    } else {
      this.treasury = null;
    }
  }
  loadMode(treasury){
    if (treasury.type === "CAISSE") {
      this.f.mode.setValue("ESPECE")
      this.modeRow = [
        { label: "ESPECE", value: "ESPECE" },
        { label: "MOBILE MONEY", value: "MOBILE MONEY" },
        { label: "WAVE", value: "WAVE" }
      ];
    }
    if (treasury.type === "BANQUE") {
      this.f.mode.setValue("CHEQUE")
      this.modeRow = [
        { label: "CHEQUE", value: "CHEQUE" },
        { label: "VERSEMENT", value: "VERSEMENT" },
        { label: "VIREMENT", value: "VIREMENT" }
      ];
    }
  }
  setCurrentOwner(owner): void {
    this.setOwnerUuid(owner?.uuid);
    this.ownerSelected = {
      photoSrc: owner?.photoSrc,
      title: owner?.searchableTitle,
      detail: owner?.searchableDetail
    };
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.depositService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.onClose();
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'DEPOSIT_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'DEPOSIT_ADD', payload: res?.data});
          }
        }
      }, error => {});
    } else {
      return;
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
  setTreasury(uuid){
    if(uuid){
      this.f.treasury.setValue(uuid)
      this.treasuryService.getSingle(uuid).subscribe((res: any) => {
        if (res) {
          this.treasury = res;
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
          return this.treasury
        }
      });
    }
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
  onReset(){
    if (this.form.value.folderUuid) {
      this.toast('Impossible de vider le formulaire lorsque un upload a été éffectué', 'Une erreur a été rencontrée', 'warning');
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
  onOwnerSelected(owner): void {
    this.setCurrentOwner(owner);
  }

  get f() { return this.form.controls; }
  get folder() { return this.form.get('folders') as FormArray; }
}
