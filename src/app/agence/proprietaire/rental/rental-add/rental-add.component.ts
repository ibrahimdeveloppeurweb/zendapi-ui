import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { HouseService } from '@service/house/house.service';
import { House } from '@model/house';
import { Owner} from '@model/owner';
import { RentalService } from '@service/rental/rental.service';
import { Rental } from '@model/rental';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { UploaderService } from '@service/uploader/uploader.service';
import { ToastrService } from 'ngx-toastr';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-rental-add',
  templateUrl: './rental-add.component.html',
  styleUrls: ['./rental-add.component.scss']
})
export class RentalAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = '';
  form: FormGroup;
  submit: boolean = false;
  edit: boolean = false;
  ownerUuid ?: null;
  isLoadingHouse = false;
  rental: Rental;
  owners: Owner[];
  owner: Owner;
  houses: House[];
  house: House;
  required = Globals.required;
  global = {country: Globals.country, device: Globals.device}
  typeRow = [
    {
      label: 'Habitation',
      type: [
        {label: 'STUDIO', value: 'STUDIO'},
        {label: 'APPARTEMENT', value: 'APPARTEMENT'},
        {label: 'PALIER', value: 'PALIER'},
        {label: 'VILLA', value: 'VILLA'}
      ]
    },
    {
      label: 'Commercial',
      type: [
        {label: 'MAGASIN', value: 'MAGASIN'},
        {label: 'BUREAU', value: 'BUREAU'},
        {label: 'APPARTEMENT', value: 'APPARTEMENT'},
        {label: 'VILLA', value: 'VILLA'},
        {label: 'COUR COMMUNE', value: 'COUR COMMUNE'},
        {label: 'BUREAU PRIVÉ', value: 'BUREAU PRIVE'},
        {label: 'BUREAU VIRTUEL', value: 'BUREAU VIRTUEL'},
        {label: 'OPEN SPACE', value: 'OPEN SPACE'},
        {label: 'SURFACE', value: 'SURFACE'},
        {label: 'RESTAURANT', value: 'RESTAURANT'},
        {label: 'HALL', value: 'HALL'},
        {label: 'SALLE DE CONFÉRENCE', value: 'SALLE CONFERENCE'},
        {label: 'PARKING', value: 'PARKING'}
      ]
    },
    {
      label: 'Autre',
      type: [
        {label: 'ÉVÈNEMENTIELLE', value: 'EVENEMENTIELLE'},
        {label: 'SALLE DE RÉUNION', value: 'SALLE REUNION'}
      ]
    }
  ];
  etageRow = [
    { label: 'REZ DE CHAUSSEE', value: 'REZ DE CHAUSSEZ' },
    { label: '1er étage', value: 'ETAGE 1' },
    { label: '2e étage', value: 'ETAGE 2' },
    { label: '3e étage', value: 'ETAGE 3' },
    { label: '4e étage', value: 'ETAGE 4' },
    { label: '5e étage', value: 'ETAGE 5' },
    { label: '6e étage', value: 'ETAGE 6' },
    { label: '7e étage', value: 'ETAGE 7' },
    { label: '8e étage', value: 'ETAGE 8' },
    { label: '9e étage', value: 'ETAGE 9' },
    { label: '10e étage', value: 'ETAGE 10' },
    { label: '11e étage', value: 'ETAGE 11' },
    { label: '12e étage', value: 'ETAGE 12' }
  ]

  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private houseService: HouseService,
    private rentalService: RentalService,
    private uploadService: UploaderService
  ) {
    this.newForm();
    this.edit = this.rentalService.edit;
  }

  ngOnInit(): void {
    this.rental = this.rentalService.getRental();
    this.house = this.houseService.getHouse();
    this.title = (!this.edit) ? 'Ajouter une locative' : 'Modifier la locative ' + this.rental?.libelle;
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      ownerUuid: [null],
      folderUuid: [null],
      house: [null, [Validators.required]],
      montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      charge: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      total: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      porte: [null, [Validators.required]],
      pasPorte: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]], // NOUVEAU CHAMP
      etage: ['Rez de chaussée'],
      type: ['STUDIO', [Validators.required]],
      piece: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      superficie: [null, [Validators.pattern(ValidatorsEnums.number)]],
      picture: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    });
  }
  
  editForm() {
    if (this.edit) {
      const data = {...this.rentalService.getRental()};
      this.house = this.house ? this.house : data.house
      this.setOwnerUuid(this.house.owner.uuid)
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder ? data?.folder?.uuid : null);
      this.f.house.setValue(this.house.uuid)
    }
  }
  
  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      this.rentalService.add(this.form.value).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: this.edit ? 'RENTAL_UPDATED' : 'RENTAL_ADD', payload: res?.data});
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
  
  setOwnerUuid(uuid) {
    this.f.ownerUuid.setValue(uuid);
    this.loadHouses();
  }
  
  loadHouses() {
    this.isLoadingHouse = true;
    if (!this.f.ownerUuid.value) {
      this.isLoadingHouse = false;
      this.houses = [];
      return;
    }
    this.houseService.getList(this.f.ownerUuid.value, 'LOCATION').subscribe(res => {
      this.isLoadingHouse = false;
      return this.houses = res;
    }, error => {
      this.isLoadingHouse = false;
    });
  }
  
  selectHouse(event) {
    this.house = this.houses.find(
      item => {
        if (item.uuid === event.target.value) { return item; }
      }
    );
    console.log(this.house);
    this.form.get('house').setValue(this.house ? this.house.uuid : null);
  }
  
  onChangeTotal() {
    if (this.f.montant.value >= 0 || this.f.charge.value >= 0) {
      if (this.f.montant.value >= 0 && this.f.charge.value < 0) {
        return this.f.total.setValue(this.f.montant.value);
      } else if (this.f.montant.value < 0 && this.f.charge.value >= 0) {
        return this.f.total.setValue(this.f.charge.value);
      } else if (this.f.montant.value >= 0 && this.f.charge.value >= 0) {
        return this.f.total.setValue(this.f.montant.value + this.f.charge.value);
      } else {
        return this.f.total.setValue(0);
      }
    }
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
  
  upload(files) {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  
  setParam(property, value) {
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
      var data = {uuid: this.form.value.folderUuid, path: 'locative'}
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
      this.form.controls['folderUuid'].setValue(null);
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
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
}