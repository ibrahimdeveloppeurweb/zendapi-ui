import {DateHelperService} from '@theme/utils/date-helper.service';
import {Customer} from '@model/customer';
import {FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms';
import {ValidatorsEnums} from '@theme/enums/validators.enums';
import {CustomerService} from '@service/customer/customer.service';
import {Component, HostListener, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UploaderService} from '@service/uploader/uploader.service';
import {ToastrService} from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { EmitterService } from '@service/emitter/emitter.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from '@env/environment';
import { ProspectionService } from '@service/prospection/prospection.service';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss']
})
export class CustomerAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title = null;
  type = '';
  edit = false;
  customer: Customer;
  form: FormGroup;
  submit = false;
  required = Globals.required;
  publicUrl = environment.publicUrl;
  civilityRow = [
    {label: 'Monsieur', value: 'Mr'},
    {label: 'Madame', value: 'Mme'},
    {label: 'Mademoiselle', value: 'Mlle'}
  ];
  pieceRow = [
    {label: 'CNI', value: 'CNI'},
    {label: 'ONI', value: 'ONI'},
    {label: 'Carte Consulaire', value: 'Carte Consulaire'},
    {label: 'Passeport', value: 'Passeport'},
    {label: 'Permis de conduire', value: 'Permis de conduire'},
    {label: 'Autres pieces', value: 'Autres'}
  ];
  maritalRow = [
    {label: 'Célibataire', value: 'Célibataire'},
    {label: 'Marié(e)', value: 'Marié(e)'},
    {label: 'Veuve', value: 'Veuve'},
    {label: 'Veuf', value: 'Veuf'}
  ];
  relationshipRow = [
    {label: 'Parents', value: 'Parents'},
    {label: 'Partenaire', value: 'Partenaire'},
    {label: 'Collègue', value: 'Collègue'},
    {label: 'Amie(e)', value: 'Amie(e)'},
    {label: 'Autre', value: 'Autre'}
  ];
  numMask = Globals.numMask;
  telephoneSelected: string = null;
  numbWhatsappSelected: string = null;
  telResponsableSelected: string = null;
  contactUrgenceSelected: string = null;
  fileC: any;

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    public customerService: CustomerService,
    public uploadService: UploaderService,
    private prospectionServie: ProspectionService,
    private emitter: EmitterService,
    public toastr: ToastrService
  ) {
    this.edit = this.customerService.edit;
    this.type = this.customerService.type;
    this.customer = this.customerService.getCustomer();
    this.title = (!this.edit) ? 'Ajouter un client' : 'Modifier le client ' + this.customer.nom;
    this.newForm();
    if(customerService.categorie === 'PROSPECT'){
      const type = customerService.type
      const uuid = customerService.uuidProspect
      this.getProspect(uuid, type)
    }
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    const defaults = {
      uuid: [null],
      id: [null],
      type: this.type,
      folderUuid: [null],
      profession: [null],
      codePostal: [null],
      nom: [null, [Validators.required]],
      telephone: [null, [Validators.required]],
      ncc: [null],
      numbWhatsapp: [null],
      autrePiece: [null],
      civilite: ['Mr', [Validators.required]],
      naturePiece: ['CNI'],
      convertir: ['NON'],
      dateEmission: [null],
      numPiece: [null],
      dateExpirePiece: [null],
      signatureAutorite: [null],
      domicile: [null],
      sexe: [{ value: 'Masculin', disabled: true }, [Validators.required]],
      dateN: [null],
      lieuN: [null],
      user: this.formBuild.group({
        uuid: [null],
        id: [null],
        email: [null, [Validators.pattern(ValidatorsEnums.email)]],
        password:[null]
      }),
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    };
    switch (this.type) {
      case 'PARTICULIER': {
        Object.assign(defaults, {
          nationalite: [null, [Validators.pattern(ValidatorsEnums.name)]],
          situationMatrimoniale: [null],
          enfant: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          nomUrgence: [null],
          affiniteUrgence: ['Parents'],
          autreAffinite: [null],
          contactUrgence: [null]
        });
        break;
      }
      case 'ENTREPRISE': {
        Object.assign(defaults, {
          nrc: [null],
          capital: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          siegeSocial: [null],
          nomResponsable: [null],
          posteOccupe: [null],
          telResponsable: [null],
        });
        break;
      }
    }
    this.form = this.formBuild.group(defaults);

    this.form.get('naturePiece')?.valueChanges.subscribe(res => {
      this.form.get('autrePiece').setValue(null);
      if (res === 'Autres') {
        this.form.get('autrePiece').setValidators(Validators.required);
      } else {
        this.form.get('autrePiece').clearValidators();
      }
      this.form.get('autrePiece').updateValueAndValidity();
    })
    this.form.get('affiniteUrgence')?.valueChanges.subscribe(res => {
      this.form.get('autreAffinite').setValue(null);
      if (res === 'Autre') {
        this.form.get('autreAffinite').setValidators(Validators.required);
      } else {
        this.form.get('autreAffinite').clearValidators();
      }
      this.form.get('autreAffinite').updateValueAndValidity();
    })
  }
  editForm() {
    if (this.edit) {
      let data = {...this.customerService.getCustomer()};
      data.dateN = DateHelperService.fromJsonDate(data?.dateN);
      data.dateEmission = DateHelperService.fromJsonDate(data?.dateEmission);
      data.dateExpirePiece = DateHelperService.fromJsonDate(data?.dateExpirePiece);
      this.form.controls.user.get('email').setValue(data?.email);
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder?.uuid)
      this.telephoneSelected = data?.telephone
      this.telResponsableSelected = data?.telResponsable
      this.contactUrgenceSelected = data?.contactUrgence
    }
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const customer = this.form.getRawValue();
      customer.user.password = customer.telephone;
      this.customerService.add(customer).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
          this.emitter.emit({ action: this.edit ? 'TENANT_UPDATED' : 'TENANT_ADD', payload: res?.data });
        } else {
          this.toast(res?.message, 'Une erreur a été rencontrée', 'error');
        }
        this.emitter.stopLoading();
      },
        error => {
        });
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
  onSexe() {
    if(this.f.civilite.value === 'Mr') {
      this.f.sexe.setValue('Masculin');
    } else if(this.f.civilite.value === 'Mme') {
      this.f.sexe.setValue('Féminin');
    } else if(this.f.civilite.value === 'Mlle') {
      this.f.sexe.setValue('Féminin');
    }
  }
  getProspect(uuid: string, type: string){
    this.prospectionServie.getSingle(uuid).subscribe((res: any) => {
      this.maritalRow = [
        {label: 'Célibataire', value: 'Célibataire'},
        {label: 'Marié(e)', value: 'Marié(e)'},
        {label: 'Veuve', value: 'Veuve'},
        {label: 'Veuf', value: 'Veuf'}
      ];
      if(type === 'PARTICULIER'){
        this.f.civilite.setValue(res.civilite)
        this.f.nom.setValue(res.nom)
        this.f.dateN.setValue(res.dateN)
        this.f.nationalite.setValue(res.nationalite)
        this.f.naturePiece.setValue(res.piece)
        this.f.numPiece.setValue(res.numPiece)
        this.f.dateExpirePiece.setValue(res.dateExpirePiece)
        this.f.profession.setValue(res.profession)
        // this.f.telephone.setValue(res.telephone)
        this.f.email.setValue(res.email)
        this.f.codePostal.setValue(res.adresse)
        this.f.situationMatrimoniale.setValue(res.situationM)
      }else if(type === 'ENTREPRISE'){
        this.f.civilite.setValue(res.civilite)
        this.f.nom.setValue(res.nom)
        this.f.nomResponsable.setValue(res.nom)
        this.f.dateN.setValue(res.dateN)
        this.f.naturePiece.setValue(res.piece)
        this.f.numPiece.setValue(res.numPiece)
        this.f.dateExpirePiece.setValue(res.dateExpirePiece)
        // this.f.telephone.setValue(res.telephone)
        this.f.telResponsable.setValue(res.telephone)
        this.f.codePostal.setValue(res.adresse)
        this.f.email.setValue(res.email)
      }
    })
  }
  loadfile(data) {
    if(data && data !== null){
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
  setContact(event, type: string) {
    let value = null;
    if (type === 'telephone') {
      value = this.form.get('telephone').value
    }  else if (type === 'numbWhatsapp') {
      value = this.form.get('numbWhatsapp').value
    } else if (this.type === 'ENTREPRISE' && type === 'telResponsable') {
      value = this.form.get('telResponsable').value
    } else if (this.type === 'PARTICULIER' && type === 'contactUrgence') {
      value = this.form.get('contactUrgence').value
    }
    let valeur = (this.edit && event === null) ? value : event;
    if (type === 'telephone') {
      this.form.get('telephone').setValue(valeur)
    }  else if ( type === 'numbWhatsapp') {
      this.form.get('numbWhatsapp').setValue(valeur)
    }else if (this.type === 'ENTREPRISE' && type === 'telResponsable') {
      this.form.get('telResponsable').setValue(valeur)
    } else if (this.type === 'PARTICULIER' && type === 'contactUrgence') {
      this.form.get('contactUrgence').setValue(valeur)
    }
  }
  showFile(item) {
    const fileByFolder = this.uploadService.getDataFileByFolder();
    this.fileC = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.fileC = '';
    this.uploadService.setDataFileByFolder('');
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }

  onClose(){
    if (!this.edit && this.form.value.folderUuid) {
      var data = {uuid: this.form.value.folderUuid, path: 'client'}
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
  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}
