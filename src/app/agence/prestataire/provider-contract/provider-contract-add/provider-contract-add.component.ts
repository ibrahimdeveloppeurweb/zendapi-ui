import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Construction } from '@model/construction';
import { Provider } from '@model/provider';
import { HomeCo } from '@model/syndic/home-co';
import { HouseCo } from '@model/syndic/house-co';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { HouseService } from '@service/house/house.service';
import { OptionBudgetService } from '@service/option-budget/option-budget.service';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { InfrastructureService } from '@service/syndic/infrastructure.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ProviderContract } from '@model/prestataire/provider-contract'
import { ProviderContractService } from '@service/provider-contract/provider-contract.service'
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { DateHelperService } from '@theme/utils/date-helper.service';
@Component({
  selector: 'app-provider-contract-add',
  templateUrl: './provider-contract-add.component.html',
  styleUrls: ['./provider-contract-add.component.scss']
})
export class ProviderContractAddComponent implements OnInit {

  title: string = '';
  edit: boolean = false;
  trustee: any;
  providerContract: ProviderContract;
  houseCo: HouseCo;
  homeCo: HomeCo;
  infrastructure: any;
  ligneBudgetaire: any;
  coproprietes: any[];
  infrastructures: any[] = []
  currentOwner?: any;
  currentTrustee?: any;
  currentNature?: any;
  provider: Provider;
  form: FormGroup;
  submit: boolean = false;
  isLoadingHouse = false;
  isLoadingRental = false;
  isLoadingHouseCo = false;
  isLoadingHomeCo = false;
  isLoadingInfrastructure = false
  isLoadingTypeLoad = false
  required = Globals.required;
  typeLoads: any[] = [];
  currentProvider: any;
  canChangeProvider = true;

  periodiciteRow = [
    {label: 'JOURNALIER', value: 'JOURNALIER'},
    {label: 'MENSUEL', value: 'MENSUEL'},
    {label: 'TRIMESTRIEL', value: 'TRIMESTRIEL'},
    {label: 'SEMESTRIEL', value: 'SEMESTRIEL'},
    {label: 'ANNUEL', value: 'ANNUEL'}
  ]

  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private coproprieteService: CoproprieteService,
    private optionBudgetService: OptionBudgetService,
    private infrastructureService: InfrastructureService,
    private providerContractService: ProviderContractService
  ) {
    this.edit = this.providerContractService.edit;
    this.providerContract = this.providerContractService.getProviderContract();
    this.title = (!this.edit) ? 'Ajouter un contrat' : 'Modifier le contrat ' + this.providerContract.libelle;
    this.newForm();
    if (this.providerContractService.getProvider()) {
      const provider = this.providerContractService.getProvider()
      this.currentProvider = {
        photoSrc: provider?.photoSrc,
        title: provider?.nom,
        detail: provider?.telephone,
        uuid: provider?.uuid,
      };
      this.f.provider.setValue(this.currentProvider.uuid)
      this.canChangeProvider = false
      this.providerContractService.setProvider(null)
    }
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      periodicite: ['MENSUEL', [Validators.required]],
      trustee: [null, [Validators.required]],
      provider: [null, [Validators.required]],
      infrastructure: [null],
      ligneBudgetaire: [null],
      copropriete: [null],
      libelle: [null, [Validators.required]],
      description: [null],
      type: [null, [Validators.required]],
      montant: [null, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      dateD: [null, [Validators.required]],
      dateF: [null, [Validators.required]],
      dateSign: [null, [Validators.required]],
      folderUuid: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([])
    });
  }

  editForm() {
    if (this.edit) {
      const data = {...this.providerContractService.getProviderContract()};
      data.dateD = DateHelperService.fromJsonDate(data?.dateD);
      data.dateF = DateHelperService.fromJsonDate(data?.dateF);
      data.dateSign = DateHelperService.fromJsonDate(data?.dateSign);
      this.houseCo = data.houseCo;
      this.homeCo = data.homeCo;
      this.ligneBudgetaire = data.ligneBudgetaire;
      this.infrastructure = data.infrastructure
      this.ligneBudgetaire = data.ligneBudgetaire
      this.currentProvider = {
        photoSrc: data?.provider?.photoSrc,
        title: data?.provider?.nom,
        detail: data?.provider?.telephone
      };
      this.setCurrentTrustee(data.trustee);
        this.setTrusteeUuid(data.trustee.uuid);
        this.setCurrentNature(data.ligneBudgetaire);
        this.setNatureUuid(data.ligneBudgetaire.uuid);
      this.form.patchValue(data);
    }
  }

  setCurrentTrustee(trustee): void {
    this.currentTrustee = {
      title: trustee.nom,
      detail: trustee.details,
    };
  }
  setTrusteeUuid(uuid) {
    console.log(uuid);
    this.f.trustee.setValue(uuid);
    this.f.infrastructure.setValue(null);
    if (uuid) {
      this.loadInfrastructure();
      this.loadTypeLoads();
      this.loadCoproprietes();
    }
    else{
      this.infrastructures = [];
      this.typeLoads = [];
      this.coproprietes = [];
    }
  }
  setProviderUuid(uuid) {
    if (uuid) {
      this.f.provider.setValue(uuid);
    } else {
      this.f.provider.setValue(null);
    }
  }
  setCurrentNature(ligneBudgetaire): void {
    this.currentNature = {
      title: ligneBudgetaire.libelle,
      detail: ligneBudgetaire.details,
    };
  }
  setNatureUuid(uuid) {
    this.f.ligneBudgetaire.setValue(uuid);
  }


  loadInfrastructure() {
    this.isLoadingInfrastructure = true;
    this.infrastructures = [];
    if (!this.f.trustee.value) {
      this.isLoadingInfrastructure = false;
      return;
    }
    this.infrastructureService.getList(this.f.trustee.value).subscribe(res => {
      this.isLoadingInfrastructure = false;
      this.infrastructures = res;
    }, error => {
      this.isLoadingInfrastructure = false;
    });
    if (this.edit && this.providerContract.infrastructure) {
      this.f.infrastructure.setValue(this.providerContract.infrastructure.uuid);
    }
  }
  loadCoproprietes() {
    this.coproprieteService.getListAll(this.f.trustee.value).subscribe(res => {
      if (res.length > 0) {
        this.coproprietes = res;
      }
    }, error => {
    });
  };
  loadTypeLoads() {
    this.isLoadingTypeLoad = true;
    this.typeLoads = [];
    if (!this.f.trustee.value) {
      this.isLoadingTypeLoad = false;
      return;
    }
    this.optionBudgetService.getList(this.f.trustee.value).subscribe(res => {
      this.isLoadingTypeLoad = false;
      if(res.length>0){
        this.typeLoads = res;
      }
    }, error => {
      this.isLoadingTypeLoad = false;
    });
    if (this.edit && this.providerContract.ligneBudgetaire) {
      this.f.ligneBudgetaire.setValue(this.providerContract.ligneBudgetaire.uuid);
    }
  }

  onChangeDate() {
    const compare = DateHelperService.compareNgbDateStruct(this.f.dateD.value, this.f.dateF.value, 'YYYYMMDD');
    if (!compare && this.f.dateD.value && this.f.dateF.value) {
      this.toast(
        'La Date de début ne peut être supérieure à la Date de fin !',
        'Attention !',
        'warning'
      );
    }
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
    if (this.form.valid) {
      this.providerContractService.add(this.form.value).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            if (this.form.value.uuid) {
              this.emitter.emit({action: 'PROVIDER_CONTRACT_UPDATED', payload: res?.data});
            } else {
              this.emitter.emit({action: 'PROVIDER_CONTRACT_ADD', payload: res?.data});
            }
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.toast('Votre formualire n\'est pas valide.', 'Attention !', 'warning');
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
  onClose(){
    this.form.reset()
    this.modal.close('ferme');
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
  get f() {return this.form.controls;}
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}
