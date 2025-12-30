import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentService } from '@service/agent/agent.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-agent-add',
  templateUrl: './agent-add.component.html',
  styleUrls: ['./agent-add.component.scss']
})
export class AgentAddComponent implements OnInit {

  
  title = null;
  type = '';
  edit: boolean = false;
  agent: any;
  form: FormGroup;
  submit = false;
  required = Globals.required;
  publicUrl = environment.publicUrl;
  
  civilityRow = [
    { label: 'Monsieur', value: 'Mr' },
    { label: 'Madame', value: 'Mme' },
    { label: 'Mademoiselle', value: 'Mlle' }
  ];
  maritalRow = [
    { label: 'Célibataire', value: 'Célibataire' },
    { label: 'Marié(e)', value: 'Marié(e)' },
    { label: 'Veuve', value: 'Veuve' },
    { label: 'Veuf', value: 'Veuf' }
  ];
  professionnelleRow = [
    { label: 'Agent de l\'Etat', value: 'Agent de l\'Etat' },
    { label: 'Agent(e) du secteur privé', value: 'Agent(e) du secteur privé' },
    { label: 'Artisan(e)', value: 'Artisan(e)' },
    { label: 'Agriculteur', value: 'Agriculteur' },
    { label: 'Profession libérale', value: 'Profession libérale' },
    { label: 'Commerçant(e)', value: 'Commerçant(e)' },
    { label: 'Autre, à préciser', value: 'Autre, à préciser' },
  ]

  pieceRow = [
    { label: 'CNI', value: 'CNI' },
    { label: 'ONI', value: 'ONI' },
    { label: 'Carte Consulaire', value: 'Carte Consulaire' },
    { label: 'Passeport', value: 'Passeport' },
    { label: 'Permis de conduire', value: 'Permis de conduire' },
    { label: 'Autres pieces', value: 'Autres' }
  ];

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    public agentService: AgentService,
    public uploadService: UploaderService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) { 
    this.edit = this.agentService.edit;
    this.type = this.agentService.type;
    this.agent = this.agentService.getAgent();
    this.title = (!this.edit) ? 'Ajouter un agent' : 'Modifier l\'agent ' + this.agent.nom;
    this.newForm()
  }

  ngOnInit(): void {
  }
  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      type: this.type,
      civilite: ['Mr', [Validators.required]],
      sexe: [{ value: 'Masculin', disabled: true }, [Validators.required]],
      profession: [null],
      nom: [null, [Validators.required]],
      telephone: [null, [Validators.required]],
      numPiece: [null, [Validators.required]],
      autrePiece: [null],
      dateN: [null],
      categorieP: [null],
      paysResidence: [null],
      paysDelivrance: [null],
      adresse: [null],
      dateExpirePiece: [null, [Validators.required]],
      email: [null, [Validators.pattern(ValidatorsEnums.email)]],
      situationM: [null],
      domicile: [null],
      naturePiece: [null],
      codePostal: [null],
      folderUuid: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),  
    })
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
  
  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      const owner = this.form.getRawValue();
      owner.user.password = this.form.value.telephone;
      this.agentService.add(owner).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({ action: this.edit ? 'OWNER_UPDATED' : 'OWNER_ADD', payload: res?.data });
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.emitter.stopLoading();
      this.toast('Certaines informations obligatoires sont manquantes ou mal formatées', 'Formulaire invalide', 'warning');
      return;
    }
  }

  onSexe() {
    if (this.f.civilite.value === 'Mr') {
      this.f.sexe.setValue('Masculin');
    } else if (this.f.civilite.value === 'Mme') {
      this.f.sexe.setValue('Féminin');
    } else if (this.f.civilite.value === 'Mlle') {
      this.f.sexe.setValue('Féminin');
    }
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

  // loadfile(data) {
  //   if (data && data !== null) {
  //     const file = data.todo.file
  //     this.file.push(
  //       this.formBuild.group({
  //         uniqId: [data.todo.uniqId, [Validators.required]],
  //         fileName: [file.name, [Validators.required]],
  //         fileSize: [file.size, [Validators.required]],
  //         fileType: [file.type, [Validators.required]],
  //         loaded: [data.todo.loaded, [Validators.required]],
  //         chunk: [data.chunk, [Validators.required]],
  //       })
  //     );
  //   }
  // }
  // files(data) {
  //   if (data && data !== null) {
  //     data.forEach(item => {
  //       this.folder.push(
  //         this.formBuild.group({
  //           uuid: [item?.uuid, [Validators.required]],
  //           name: [item?.name],
  //           path: [item?.path]
  //         })
  //       );
  //     });
  //   }
  // }
  // upload(files): void {
  //   for (const file of files) {
  //     this.uploadService.upload(file);
  //   }
  // }
  // setParam(property, value): void {
  //   if (value) {
  //     if (this.form.value.hasOwnProperty(property)) {
  //       Object.assign(this.form.value, { [property]: value });
  //     }
  //     if (this.form.controls.hasOwnProperty(property)) {
  //       this.form.controls[property].setValue(value);
  //     }
  //   }
  // }
  
  onClose() {
      this.form.reset()
      this.modal.close('ferme');
  }
  onReset() {
      this.form.reset()
  }
  
  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }


}
