import { Supply } from '@model/supply';
import { Treasury } from '@model/treasury';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component,HostListener, OnInit } from '@angular/core';
import { SupplyService } from '@service/supply/supply.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { FormBuilder, FormGroup,FormArray, Validators } from '@angular/forms';
import { HouseService } from '@service/house/house.service';
import { DateHelperService } from '@theme/utils/date-helper.service';



@Component({
  selector: 'app-supply-add',
  templateUrl: './supply-add.component.html',
  styleUrls: ['./supply-add.component.scss']
})
export class SupplyAddComponent implements OnInit {
  sourceTitle: string = ""
  numeroTitle: string = ""
  title: string = ""
  edit: boolean = false
  treasury: boolean = false
  supply: Supply
  form: FormGroup
  submit: boolean = false
  emetteurSelected: any;
  recepteurSelected: any;
  treasuryR: Treasury
  treasuryE: Treasury
  required = Globals.required
  modeRow = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" },
    { label: "VIREMENT", value: "VIREMENT" }
  ]
  typeRow = [
    { label: "INTERNE", value: "INTERNE" },
    { label: "EXTERNE", value: "EXTERNE" },
  ]

  fileO: any;
  ESCAPE_KEYCODE = 27;
  publicUrl = environment.publicUrl;
  ownerSelected?: any;
  houses: any[] = []
  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public supplyService: SupplyService,
    public treasuryService: TreasuryService,
    public uploadService: UploaderService,
    private houseService: HouseService
    ) {
    this.edit = this.supplyService.edit
    this.supply = this.supplyService.getSupply()
    this.title = (!this.edit) ? "Ajouter un approvisionnement" : "Modifier l'approvisionnement "+this.supply.code
    this.newForm()
    this.setTreasury()
  }

  ngOnInit(): void {
    this.editForm()
  }
  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      type: [null],
      type_externe: [null],
      mode: ['ESPECE'],
      libelle: [null],
      emetteur: [null],
      recepteur: [null, [Validators.required]],
      source: [null],
      numero: [null],
      montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      date: [null, [Validators.required]],
      description: [null],
      folderUuid: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      owner: [null],
      house: [null],
      effectue: ["AUTRE"],
      tiers: [null]
    });

    //type
    this.form.get('type').valueChanges.subscribe(res => {
      if (res === "EXTERNE") {
        this.form.get('description').setValidators(Validators.required);
        this.form.get('emetteur').clearValidators();
      } else {
        this.form.get('description').clearValidators();
        this.form.get('emetteur').setValidators(Validators.required);
      }
      this.form.get('emetteur').updateValueAndValidity();
      this.form.get('description').updateValueAndValidity();
    });

    //type externe
    this.form.get('type_externe').valueChanges.subscribe(res => {
      if (res === "NON") {
        this.form.get('owner').setValue(null);
        this.form.get('house').setValue(null);
        this.ownerSelected = null;
      }
    });
  }


  editForm() {
    if (this.edit) {
      const data = { ...this.supplyService.getSupply() }
      data.date = DateHelperService.fromJsonDate(data.date);
      this.form.patchValue(data)
      if (data.house) {
        this.ownerSelected = {
          photoSrc: data.house ? data.house.owner.photoSrc : null,
          title: data.house ? data.house.owner.nom : null,
          detail: data.house ? data.house.owner.telephone : null
        };
        this.f.house.setValue(data?.house?.uuid);
        this.f.type_externe.setValue("OUI");
        this.f.owner.setValue(data.house.owner ? data.house.owner.uuid : null);

      }

      this.recepteurSelected = {
        photoSrc: data.recepteur ? data.recepteur.photoSrc : null,
        title: data.house ? data.recepteur.nom : null,
        detail: data.house ? data.recepteur.nom : null
      };
      this.emetteurSelected = {
        photoSrc: data.emetteur ? data.emetteur.photoSrc : null,
        title: data.emetteur ? data.emetteur.nom : null,
        detail: data.emetteur ? data.emetteur.nom : null
      };
      this.f.emetteur.setValue(data?.emetteur?.uuid);
      this.f.folderUuid.setValue(data?.folder?.uuid);
      this.loadHouses();
      if (data.emetteur) {
        this.setTreasuryEmetteurUuid(data.emetteur.uuid)
      }
      if (data.recepteur) {
        this.setTreasuryRecepteurUuid(data.recepteur.uuid)
      }


    }
  }
  setTreasury(){
    if(this.supplyService.treasury){
      this.treasury = true
      this.f.emetteur.setValue(this.supplyService.treasury);
      this.treasuryService.getSingle(this.supplyService.treasury).subscribe((res) => {
        this.setCurrentTreasuryEmetteur(res)
        this.treasuryE = res;
      });
    }
  }
  setTreasuryEmetteurUuid(uuid): void {
    if (uuid) {
      this.f.emetteur.setValue(uuid);
      this.treasuryService.getSingle(this.f.emetteur.value).subscribe((res) => {
        this.treasuryE = res;
      });
    } else{
      this.f.emetteur.setValue(null);
      this.treasuryE = null;
    }
  }
  setTreasuryRecepteurUuid(uuid): void {
    if (uuid) {
      this.f.recepteur.setValue(uuid);
      this.treasuryService.getSingle(this.f.recepteur.value).subscribe((res) => {
        this.treasuryR = res;
      });
    } else{
      this.f.recepteur.setValue(null);
      this.treasuryR = null;
    }
  }
  setCurrentTreasuryEmetteur(treasury): void {
    this.setTreasuryEmetteurUuid(treasury?.uuid);
    this.emetteurSelected = {
      photoSrc: treasury?.photoSrc,
      title: treasury?.searchableTitle,
      detail: treasury?.searchableDetail
    };
  }
  setCurrentTreasuryRecepteur(treasury): void {
    this.setTreasuryRecepteurUuid(treasury?.uuid);
    this.recepteurSelected = {
      photoSrc: treasury?.photoSrc,
      title: treasury?.searchableTitle,
      detail: treasury?.searchableDetail
    };
  }
  onChangeLibelle() {
    if(this.f.mode.value === 'VIREMENT'){
      this.numeroTitle = "N° virement"
      this.sourceTitle = "Banque"
    }
    if(this.f.mode.value === 'CHEQUE'){
      this.sourceTitle = "Banque"
      this.numeroTitle = "N° cheque"
    }
    if(this.f.mode.value === 'MOBILE MONEY'){
      this.sourceTitle = "N° Téléphone"
      this.numeroTitle = "N° mobile"
    }
    this.f.source.setValue(null)
    this.f.numero.setValue(null)
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.supplyService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (data?.uuid) {
            this.emitter.emit({action: 'SUPPLY_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'SUPPLY_ADD', payload: res?.data});
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
  upload(files): void {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value): void {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, { [property]: value });
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }
  showFile(item) {
    const fileByFolder = this.uploadService.getDataFileByFolder();
    this.fileO = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.fileO = '';
    this.uploadService.setDataFileByFolder('');
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }
  onClose() {
    if (!this.edit && this.form.value.folderUuid) {
      var data = { uuid: this.form.value.folderUuid, path: 'locataire' }
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
  get f() { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}
