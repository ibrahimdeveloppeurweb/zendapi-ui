
import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { DateHelperService } from '@theme/utils/date-helper.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OwnerCo } from '@model/owner-co';
import { OwnerCoService } from '@service/owner-co/owner-co.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { UploaderService } from '@service/uploader/uploader.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { SyndicService } from '@service/syndic/syndic.service';
import { PlanComptableService } from '@service/configuration/plan-comptable.service';

@Component({
  selector: 'app-owner-co-add',
  templateUrl: './owner-co-add.component.html',
  styleUrls: ['./owner-co-add.component.scss']
})
export class OwnerCoAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  trustes: any[] = [];
  title = null;
  type = '';
  syndicSelected: any;
  edit: boolean = false;
  ownerCo: OwnerCo;
  form: FormGroup;
  trustee: any;
  agency = Globals.user.agencyKey;
  typeLoadForm: FormGroup;
  submit = false;
  required = Globals.required;
  civilityRow = [
    { label: 'Monsieur', value: 'Mr' },
    { label: 'Madame', value: 'Mme' },
    { label: 'Mademoiselle', value: 'Mlle' }
  ];
  pieceRow = [
    { label: 'CNI', value: 'CNI' },
    { label: 'ONI', value: 'ONI' },
    { label: 'Carte Consulaire', value: 'Carte Consulaire' },
    { label: 'Passeport', value: 'Passeport' },
    { label: 'Permis de conduire', value: 'Permis de conduire' },
    { label: 'Autres pieces', value: 'Autres' }
  ];
  maritalRow = [
    { label: 'Célibataire', value: 'Célibataire' },
    { label: 'Marié(e)', value: 'Marié(e)' },
    { label: 'Veuve', value: 'Veuve' },
    { label: 'Veuf', value: 'Veuf' }
  ];
  relationshipRow = [
    { label: 'Parents', value: 'Parents' },
    { label: 'Partenaire', value: 'Partenaire' },
    { label: 'Collègue', value: 'Collègue' },
    { label: 'Amie(e)', value: 'Amie(e)' },
    { label: 'Autre', value: 'Autre' }
  ];
  autorisationRow = [
    {label: 'NON', value: 'AUCUNE'},
    {label: 'SMS', value: 'SMS'},
    {label: 'MAIL', value: 'MAIL'},
    {label: 'SMS & MAIL', value: 'SMS_MAIL'},
  ]
  numMask = Globals.numMask;
  telephoneSelected: string = null
  telResponsableSelected: string = null
  contactUrgenceSelected: string = null
  typetList: any[] = [];


  accountSelected: any

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    public ownerCoService: OwnerCoService,
    public uploadService: UploaderService,
    private syndicService: SyndicService,
    private emitter: EmitterService,
    public toastr: ToastrService,
    private planComptableService: PlanComptableService,
  ) {
    this.edit = this.ownerCoService.edit;
    this.type = this.ownerCoService.type;
    this.ownerCo = this.ownerCoService.getOwnerCo();
    this.title = (!this.edit) ? 'Ajouter un copropriétaire' : 'Modifier le copropriétaire ' + this.ownerCo.nom;
    this.newForm();
    this.getListtrustee()
    console.log('this.ownerService.typeSyndic',this.ownerCoService.typeSyndic)
    if(this.ownerCoService.typeSyndic === 'SYNDIC'){
      this.f.syndic.setValue(this.ownerCoService.uuidSyndic)
      this.t.trustee.setValue(this.ownerCoService.uuidSyndic)
    }
    this.ownerCoService.type = null
    this.ownerCoService.uuidSyndic = null
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    const defaults = {
      uuid: [null],
      id: [null],
      type: this.type,
      code: [null],
      civilite: ['Mr'],
      sexe: [{ value: 'Masculin', disabled: true }],
      folderUuid: [null],
      profession: [null],
      codePostal: [null],
      trustee: [null],
      nom: [null, [Validators.required]],
      telephone: [null],
      autorisation: ['AUCUNE'],
      user: this.formBuild.group({
        uuid: [null],
        id: [null],
        email: [null],
        password: [null]
      }),
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      account: [null],
      numero:[null],
      finances: this.formBuild.array([]),
      deleted: this.formBuild.array([]),
    };
    switch (this.type) {
      case 'PARTICULIER': {
        Object.assign(defaults, {
        });
        break;
      }
      case 'ENTREPRISE': {
        Object.assign(defaults, {
          ncc: [null],
          nrc: [null],
        });
        break;
      }
    }
    this.form = this.formBuild.group(defaults);
    this.typeLoadForm = this.formBuild.group({
      uuid: [null],
      id: [null],
      trustee: [null],
      libelle: [null],
      credit: [0],
      debit: [0],
      date: [null],
    });
  }
  editForm() {
    if (this.edit) {
      let data = { ...this.ownerCoService.getOwnerCo() };
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder?.uuid);
      this.telephoneSelected = data?.telephone
      this.telResponsableSelected = data?.telResponsable
      this.contactUrgenceSelected = data?.contactUrgence
      data.dateN = DateHelperService.fromJsonDate(data?.dateN);
      this.form.controls.user.get('email').setValue(data?.email)
      data.dateEmission = DateHelperService.fromJsonDate(data?.dateEmission);
      data.dateExpirePiece = DateHelperService.fromJsonDate(data?.dateExpirePiece);
      this.f.trustee.setValue(data?.trustee?.uuid);

      data.fianancialSituation.forEach((element) => {
        this.finances.push(
          this.formBuild.group({
            uuid: [element.uuid],
            libelleTrustee: [element.trusteNom],
            trustee: [element.trusteeUuid],
            libelle: [element.libelle],
            credit: [element.credit],
            debit: [element.debit],
            date: [element?.date ? DateHelperService.fromJsonDate(element?.date) : '' ],
          })
        );
      });
    }
  }
  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      const owner = this.form.getRawValue();
      owner.user.password = this.form.value.telephone;
      this.ownerCoService.add(owner).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.close('OWNER');
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
    if (this.f.civilite.value === 'Mr') {
      this.f.sexe.setValue('Masculin');
    } else if (this.f.civilite.value === 'Mme') {
      this.f.sexe.setValue('Féminin');
    } else if (this.f.civilite.value === 'Mlle') {
      this.f.sexe.setValue('Féminin');
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

  setContact(event, type: string) {
    let value = null;
    if (type === 'telephone') {
      value = this.form.get('telephone').value
    } else if (this.type === 'ENTREPRISE' && type === 'telResponsable') {
      value = this.form.get('telResponsable').value
    } else if (this.type === 'PARTICULIER' && type === 'contactUrgence') {
      value = this.form.get('contactUrgence').value
    }
    let valeur = (this.edit && event === null) ? value : event;
    if (type === 'telephone') {
      this.form.get('telephone').setValue(valeur)
    } else if (this.type === 'ENTREPRISE' && type === 'telResponsable') {
      this.form.get('telResponsable').setValue(valeur)
    } else if (this.type === 'PARTICULIER' && type === 'contactUrgence') {
      this.form.get('contactUrgence').setValue(valeur)
    }
  }

  addType() {
    let element = this.typeLoadForm.value
    let verif = true
    console.log('verif', element)

    if(element.libelle.length === 0 || !element.date) {
      Swal.fire( 'Attention !', 'Veuillez renseigner les champs obligatoire' );
      return;
    }

    this.finances.controls.forEach((control: FormControl) => {
      const value = control.value;
      if(value.libelle == element.libelle) {
            verif = false
        }
    });

    if (verif) {
      this.finances.push(
        this.formBuild.group({
          index: [this.finances.length + 1],
          libelle: [element.libelle],
          credit: [element.credit],
          debit: [element.debit],
          date: [element.date]
        })
      );

      for (var i = 0; i < this.typetList.length; i++) {
        if (this.typetList[i].uuid == this.f.category.value) {
          this.typetList.splice(i, 1);
        }
      }
      this.typetList = [...this.typetList];
      this.t.debit.setValue(0);
      this.t.credit.setValue(0);
      this.t.date.setValue(null);
      this.t.libelle.setValue(null);
      this.typeLoadForm.reset();
    }else {
      Swal.fire( 'Attention !', 'Ce libellé a été déjà ajouté!', 'warning' );
    }
  }

  onDelete(item, i) {
    this.typetList = [...this.typetList, item];
    this.finances.removeAt(i);
    this.deleted.push(
      this.formBuild.group({
        uuid: [item.uuid],
      })
    );
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }

  getListtrustee() {
    this.syndicService.getList(this.agency).subscribe(
      (res) => {
        this.trustes = res;
        console.log( this.trustes );
        
      },
      (error) => {}
    );
  }
  setAccountUuid(uuid) {
    if(uuid){
      this.f.account.setValue(uuid);
      if (this.f.nom.value) {
        this.generateNumero(uuid, this.f.nom.value)
      }
    } else {
      this.f.account.setValue(null);
    }
  }
  onNomChange() {
    let accountUuid = this.f.account.value
    let libelle = this.f.nom.value
    if (accountUuid && libelle) {
      this.generateNumero(accountUuid, libelle)
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

  onReset() {
    if (this.form.value.folderUuid) {
      this.toast('Impossible de de vider le formulaire lorsque un upload a été éffectué', 'Une erreur a été rencontrée', 'warning');
    } else {
      this.form.reset()
      this.formBuild.array([])
      this.form.controls['folderUuid'].setValue(null);
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
  get finances() {
    return this.form.get('finances') as FormArray;
  }
  get t() {
    return this.typeLoadForm.controls;
  }
  get deleted() {
    return this.form.get('deleted') as FormArray;
  }
}

