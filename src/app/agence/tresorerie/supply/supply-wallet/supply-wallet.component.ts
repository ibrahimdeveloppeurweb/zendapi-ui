import { Supply } from '@model/supply';
import { Treasury } from '@model/treasury';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { UploaderService } from '@service/uploader/uploader.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { FormBuilder, FormGroup,FormArray, Validators } from '@angular/forms';
import { Owner } from '@model/owner';

@Component({
  selector: 'app-supply-wallet',
  templateUrl: './supply-wallet.component.html',
  styleUrls: ['./supply-wallet.component.scss']
})
export class SupplyWalletComponent implements OnInit {
  fileO: any;
  owner: Owner
  form: FormGroup
  title: string = ""
  treasuryE: Treasury
  treasuryR: Treasury
  treasury: boolean = false
  edit: boolean = false
  emetteurSelected: any;
  recepteurSelected: any;
  sourceTitle :string = ""
  numeroTitle :string = ""
  
  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    public uploadService:UploaderService,
    public treasuryService: TreasuryService

  ) { 
    this.newForm()
    this.title = (!this.edit) ? "Effectuer un dépôt " : "Modifier le  dépôt";

  }
  editForm(){}

  ngOnInit(): void {
    this.editForm()

  }
  setParam(property, value){

  }
  
  onClose(){
    this.modal.close('ferme');
  }
  modeRow = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" },
    { label: "VIREMENT", value: "VIREMENT" }
  ]
  typeRow = [
    { label: "PROPRIETAIRE", value: "PROPRIETAIRE" },
    { label: "LOCATAIRE", value: "LOCATAIRE" },
  ]
  newForm(){
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      Number: [null],
      type: [null, [Validators.required]],
      mode: ['ESPECE', [Validators.required]],
      libelle: [null, [Validators.required]],
      emetteur: [null, [Validators.required]],
      recepteur: [null, [Validators.required]],
      source: [null],
      numero: [null],
      montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      date: [null, [Validators.required]],
      description: [null],
      folderUuid: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    });

  }
  onConfirme(){
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
  onSubmit(){

  }
  closeViewer(){
    this.fileO = '';
    this.uploadService.setDataFileByFolder('');
  }
  onChangeLibelle(){
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
  setTreasuryRecepteurUuid(uuid): void{}
  setTreasuryEmetteurUuid(uuid): void{

  }
  get f() { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }

}
