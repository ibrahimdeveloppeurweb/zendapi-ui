import { House } from '@model/house';
import { Spent } from '@model/spent';
import { Treasury } from '@model/treasury';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { environment } from '@env/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HouseService } from '@service/house/house.service';
import { SpentService } from '@service/spent/spent.service';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import { Component, HostListener, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-spent-add',
  templateUrl: './spent-add.component.html',
  styleUrls: ['./spent-add.component.scss']
})
export class SpentAddComponent implements OnInit {
  ESCAPE_KEYCODE = 27;
  title: string = ""
  edit: boolean = false
  form: FormGroup
  submit: boolean = false
  spent: Spent;
  treasury: Treasury;
  totalHT = 0;
  totalTva = 0;
  totalTTC = 0;
  totalRemise = 0;
  houses: Array<House> = [];
  required = Globals.required;
  ownerSelected?: any;
  prioriteRow = [
    {label: 'NON PRIORITAIRE', value: 'NON'},
    {label: 'PRIORITE MOYEN', value: 'MOYEN'},
    {label: 'URGENT', value: 'URGENT'}
  ];
  typeRow = [
    {label: 'STANDARD', value: 'STANDARD'},
    {label: 'PROPRIETAIRE', value: 'PROPRIETAIRE'}

  ];
  file: any;
  publicUrl = environment.publicUrl;
  sourceTitle: string = "";
  numeroTitle: string = "";
  modeRow: any[] = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" },
    { label: "WAVE", value: "WAVE" },
    { label: "VERSEMENT", value: "VERSEMENT" },
    { label: "VIREMENT", value: "VIREMENT" }
  ]

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public spentService: SpentService,
    private houseService: HouseService,
    public uploadService: UploaderService,
    public treasuryService: TreasuryService
  ) {
    this.edit = this.spentService.edit;
    this.spent = this.spentService.getSpent();
    this.title = (!this.edit) ? "Ajouter une dépense" : "Modifier la dépense de " + this.spent?.code
    this.newForm();
    this.f.treasury.setValue(this.spentService.treasury)
    this.treasuryService.getSingle(this.spentService.treasury).subscribe((res: any) => {
      if (res) { this.treasury = res; }
    });
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      type: ['STANDARD', Validators.required],
      owner: [null],
      house: [null],
      folderUuid: [null],
      treasury: [null, Validators.required],
      montant: [null, Validators.required],
      date: [null, Validators.required],
      motif: [null, Validators.required],
      priorite: ['NON', Validators.required],
      description: [null],
      montantHt: [0],
      montantTva: [0],
      montantRemise: [0],
      options: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      receiver: [null],
      mode: ['ESPECE', [Validators.required]],
      effectue: [null],
      tiers: [null]
    });

    this.form.get('type').valueChanges.subscribe(res => {
      if(res === 'STANDARD') {
        this.houses = [];
        this.ownerSelected = null;
        this.form.get('owner').setValue(null);
        this.form.get('house').setValue(null);
        this.form.get('owner').clearValidators();
        this.form.get('house').clearValidators();
      } else if(res === 'PROPRIETAIRE') {
        this.form.get('owner').setValidators(Validators.required);
        this.form.get('house').setValidators(Validators.required);
      }
      this.form.get('owner').updateValueAndValidity();
      this.form.get('house').updateValueAndValidity();
    });
  }
  editForm() {
    if (this.edit) {
      const data = {...this.spentService.getSpent()};
      this.ownerSelected = {
        photoSrc: data.house ? data.house.owner.photoSrc : null,
        title: data.house ? data.house.owner.nom : null,
        detail: data.house ? data.house.owner.telephone : null
      };
      this.setOwnerUuid(data.house ? data.house.owner.uuid : null);
      data.date = DateHelperService.fromJsonDate(data.date);
      data?.options.forEach((item: any) => {
        this.option.push(
          this.formBuild.group({
            uuid: [item.uuid],
            id: [item.id],
            libelle: [item.libelle, [Validators.required]],
            prix: [item.prix, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [item.qte, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [item.tva, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [item.remise, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [item.total, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          })
        );
      });
      data.house = data.house? data.house.uuid : null;
      data.treasury = data.treasury? data.treasury.uuid : null;
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder?.uuid);
      this.onChangeTotal();
    }
  }
  setOwnerUuid(uuid) {
    if(uuid){
      this.f.owner.setValue(uuid);
      this.loadHouses();
    } else {
      this.houses = [];
      this.f.owner.setValue(null);
      this.f.house.setValue(null);
    }
  }
  loadHouses() {
    if(!this.edit) {
      this.houseService.getList(this.f.owner.value, null, 'DISPONIBLE').subscribe(res => {
        this.houses = res;
        return this.houses;
      }, error => {});
    }
  }
  onChangeTotal() {
    let totalOptionRemise = 0;
    let totalOptionHT = 0;
    let totalOptionTVA = 0;
    let totalOptionTTC = 0;
    this.option.controls.forEach(elem => {
      var remise = elem.value.remise >= 0 ? elem.value.remise : 0
      var totalHt = (elem.value.prix * elem.value.qte) - remise
      var totalTva = elem.value.tva >= 0 ? totalHt * (elem.value.tva / 100) : 0
      var totalTtc = totalHt + totalTva
      elem.get('total').setValue(totalTtc);
      totalOptionRemise += remise;
      totalOptionHT += (elem.value.qte >= 1 && (remise <= totalHt)) ? totalHt - remise : 0;
      totalOptionTVA += totalTva;
      totalOptionTTC += totalTtc
    });

    this.totalHT = totalOptionHT;
    this.totalTva = totalOptionTVA;
    this.totalRemise = totalOptionRemise;
    this.totalTTC = totalOptionHT + totalOptionTVA + totalOptionRemise
    this.f.montantHt.setValue(totalOptionHT);
    this.f.montantTva.setValue(totalOptionTVA);
    this.f.montantRemise.setValue(totalOptionRemise);
    this.f.montant.setValue(totalOptionHT + totalOptionTVA + totalOptionRemise);
  }
  addOption() {
    this.option.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        libelle: [null, [Validators.required]],
        prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
        tva: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        remise: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        total: [{value: 0, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      })
    );
  }
  onDelete(i: number) {
    this.option.removeAt(i);
    this.onChangeTotal();
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
        this.spentService.add(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
            if (data?.uuid) {
              this.emitter.emit({action: 'SPENT_UPDATED', payload: res?.data});
            } else {
              this.emitter.emit({action: 'SPENT_ADD', payload: res?.data});
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
      var data = {uuid: this.form.value.folderUuid, path: 'locataire'}
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
  onChangeEffectue() {
    this.f.tiers.setValue(null)
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
