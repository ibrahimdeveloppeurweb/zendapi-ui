import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProviderService } from '@service/provider/provider.service';
import { Provider } from '@model/provider';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { JobAddComponent } from '@agence/prestataire/job/job-add/job-add.component';
import { JobService } from '@service/job/job.service';
import { PlanComptableService } from '@service/configuration/plan-comptable.service';

@Component({
  selector: 'app-provider-add',
  templateUrl: './provider-add.component.html',
  styleUrls: ['./provider-add.component.scss']
})
export class ProviderAddComponent implements OnInit {
  title: string = ""
  type: string = ""
  edit: boolean = false
  provider: Provider
  form: FormGroup
  submit: boolean = false
  required = Globals.required;
  civilityRow = [
    { label: 'Monsieur', value: 'Mr' },
    { label: 'Madame', value: 'Mme' },
    { label: 'Mademoiselle', value: 'Mlle' }
  ]
  sexRow = [
    { label: 'Masculin', value: 'Masculin' },
    { label: 'Féminin', value: 'Féminin' }
  ]
  pieceRow = [
    { label: 'CNI', value: 'CNI' },
    { label: 'ONI', value: 'ONI' },
    { label: 'Carte Consulaire', value: 'Carte Consulaire' },
    { label: 'Passeport', value: 'Passeport' },
    { label: 'Permis de conduire', value: 'Permis de conduire' }
  ]

  prestationRow = [
    { label: 'Services', value: 'SERVICES' },
    { label: 'Produits', value: 'PRODUITS' },
    { label: 'Produits et Service', value: 'PRODUITS_SERVICES' },
  ];

  selectedFiles: any[] = [];
  filesList: any[] = [];
  fileDfeName: any;
  editDfe: boolean;
  editRegistre: boolean;
  fileRegistreName: any;
  paysSelected: any
  jobSelected: any
  dataDfe: any = []
  editStatutEntre: boolean;
  fileStatutName: any;
  dataStatutEntre: any = []
  folder: any;
  uploadService: any;
  file: any;
  
  accountSelected:any

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private jobService: JobService,
    private providerService: ProviderService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public toastr: ToastrService,
    private planComptableService: PlanComptableService
  ) {
    this.edit = this.providerService.edit
    this.provider = this.providerService.getProvider()
    this.title = (!this.edit) ? "Ajouter un fournisseur ou prestataire" : "Modifier le fournisseur ou prestataire "+this.provider.nom
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form =  this.formBuild.group({
      uuid: [null],
      id: [null],
      type: ['PARTICULIER', [Validators.required]],
      nom: [null, [Validators.required]],
      civilite: [null],
      telephone: [null],
      sexe: [null],
      service: [null, [Validators.required]],
      domicile: [null],
      email: [null],
      codePostal: [null],
      naturePiece: [null],
      numPiece: [null],
      ncc: [null],
      nrc: [null],
      siegeSocial: [null],

      groupe: [null, [Validators.required]],
      job: [null],
      pays: [null],
      ville: [null],
      commune: [null],
      quartier: [null],
      numRegistre: [null],
      registreCom: [null],
      statutEntreprise: [null],
      dfe: [null],
      dateDelivre: [null],
      dateExpire: [null],
      pieceRepresentant: [null],
      juridique: [null],
      compte: [null],
      prestation: [null],

      account: [null],
      numero: [null]
    })
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.providerService.getProvider() }
      console.log(data)
      this.paysSelected = data.pays;
      this.generateNumero((data.auxiliary ? data.auxiliary.uuid : null), data.nom)
      if (data.account) {
        this.accountSelected = {
          title: data.account.searchableTitle,
          detail: data.account.searchableDetail
        }
      } 
      this.form.patchValue(data)
    }
  }
  setPaysUuid(uuid) {
    if (uuid) {
      this.f.pays.setValue(uuid);
    } else {
      this.f.pays.setValue(null);
    }
  }
  setJobUuid(uuid) {
    if (uuid) {
      this.f.job.setValue(uuid);
    } else {
      this.f.job.setValue(null);
    }
  }
  uploadDfeFiles(files?) {
    this.selectedFiles = files.target.files;
    if (this.selectedFiles) {
      if (this.filesList.length != 0) {
        this.filesList = this.filesList.filter((file) => file.name !== "DFE")
      }
      this.filesList.push({
        'name': 'DFE',
        'file': this.selectedFiles[0]
      })
      this.editDfe = true
      this.fileDfeName = this.selectedFiles[0];
      this.selectedFiles = null;
      this.selectedFiles = null;
    }
  }
  uploadRegistreFiles(files?) {
    this.selectedFiles = files.target.files;
    if (this.selectedFiles) {
      if (this.filesList.length != 0) {
        this.filesList = this.filesList.filter((file) => file.name !== "Registre de commerce")
      }
      this.filesList.push({
        'name': 'Registre de commerce',
        'file': this.selectedFiles[0]
      })
      this.editRegistre = true
      this.fileRegistreName = this.selectedFiles[0];
      this.selectedFiles = null;
      this.selectedFiles = null;
    }
  }
  uploadStatutFiles(files?) {
    this.selectedFiles = files.target.files;
    if (this.selectedFiles) {
      if (this.filesList.length != 0) {
        this.filesList = this.filesList.filter((file) => file.name !== "Statut de l\'entreprise")
      }
      this.filesList.push({
        'name': 'Statut de l\'entreprise',
        'file': this.selectedFiles[0]
      })
      this.editStatutEntre = true
      this.fileStatutName = this.selectedFiles[0];
      this.selectedFiles = null;
      this.selectedFiles = null;
    }
  }
  onNomChange() {
    let accountUuid = this.f.account.value
    let nom = this.f.nom.value
    if (accountUuid && nom) {
      this.generateNumero(accountUuid, nom)
    }
  } 
  setAccountUuid(uuid) {
    if(uuid){
      this.f.account.setValue(uuid);
      if (this.f.nom.value) {
        this.generateNumero(uuid, this.f.nom.value)
      }
    } else {
      this.f.account.setValue(null);
      this.f.numero.setValue(null);
    }
  }

  generateNumero(uuid, libelle) {
    if (uuid && libelle) {
      this.planComptableService.getSingle(uuid).subscribe((res) => {
        if (res) {
          let string = res.baseNumero.toString()
          let label_prefix = libelle.substring(0, 3).toUpperCase();
          let numero = string + label_prefix;

          if (numero.length < 6) {
            while (numero.length < 6) {
              string += "0";
              numero = string + label_prefix;
            }
          } else if (numero.length > 6) {
            let difference = numero.length - 6;
            string = string.slice(0, -difference);
            numero = string + label_prefix;
          }

          this.f.numero.setValue(numero)
        }
      })
    }
  }
  
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const provider = this.form.value;
      this.providerService.add(provider).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modale.dismiss();
            this.modale.close('ferme');
            this.emitter.emit({action: this.edit ? 'PROVIDER_UPDATED' : 'PROVIDER_ADD', payload: res?.data});
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.toast('Votre formualire n\'est pas valide.', 'Attention !', 'warning');
      return;
    }
  }
  addJob(event: Event){
    event.preventDefault();
    this.jobService.edit = false;
    this.modal(JobAddComponent, 'modal-basic-title', 'md', true, 'static');
  }
  onConfirm() {
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
    this.modale.close('ferme');
  }
  toast(msg, title, type): void {
    if (type === 'info') {
      this.toastr.info(msg, title);
    } else if (type === 'success') {
      this.toastr.success(msg, title);
    } else if (type === 'warning') {
      this.toastr.warning(msg, title);
    } else if (type === 'error') {
      this.toastr.error(msg, title);
    }
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => { });
  }
  get f() { return this.form.controls }

}
