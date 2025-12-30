
import { UserService } from '@service/user/user.service';
import { CategoryService } from '@service/category/category.service';
import { TenantService } from '@service/tenant/tenant.service';
import { Tenant } from '@model/tenant';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { User } from '@model/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import { UploaderService } from '@service/uploader/uploader.service';
import { ToastrService } from 'ngx-toastr';
import { EmitterService } from '@service/emitter/emitter.service';
import { House } from '@model/house';
import { Rental } from '@model/rental';
import { HouseService } from '@service/house/house.service';
import { RentalService } from '@service/rental/rental.service';
import { RessourceTiersService } from '@service/ressource-tiers/ressource-tiers.service';
import { Ressource } from '@model/ressource';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Qualification } from '@model/qualification';
import { TicketService } from '@service/ticket/ticket.service';

@Component({
  selector: 'app-qualification-add',
  templateUrl: './qualification-add.component.html',
  styleUrls: ['./qualification-add.component.scss']
})
export class QualificationAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = ""
  type: string = ""
  edit: boolean = false
  isHidden: boolean = false
  qualification: Qualification
  users: User[]
  user: User
  tenant: Tenant
  form: FormGroup
  houseSelected?: any;
  emitterSelected?: any;
  serviceSelected?: any;
  categorySelected?: any;
  selectedType?: any = { className: 'Customer', groupName: 'customer', label: 'Client' };
  submit: boolean = false
  required = Globals.required;

  urgenceRow = [
    { label: 'URGENT', value: 'URGENT' },
    { label: 'IMPORTANT', value: 'IMPORTANT' },
    { label: 'INTERMEDIAIRE', value: 'INTERMEDIAIRE' }
  ]
  concerneRow = [
    { label: 'UN BIEN', value: 'BIEN' },
    { label: 'UNE LOCATIVE', value: 'RENTAL' },
    { label: 'UNE RESSOURCE', value: 'RESSOURCE' }
  ]
  typesRow = [
    { label: 'CLIENT', value: 'CLIENT' },
    { label: 'PROPRIETAIRE', value: 'PROPRIETAIRE' },
    { label: 'LOCATAIRE', value: 'LOCATAIRE' },
    { label: 'AUTRES', value: 'AUTRES' }
  ]
  house: House; 
  rental: Rental; 
  rentals: Rental[]=[]; 
  ressources: Ressource[]=[]; 
  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public userService: UserService,
    private houseService: HouseService,
    public ticketService: TicketService,
    public tenantService: TenantService,
    private rentalService: RentalService,
    private uploadService: UploaderService,
    public categoryService: CategoryService,
    private ressourceService: RessourceTiersService
  ) {
    this.edit = this.ticketService.edit
    this.qualification = this.ticketService.getQualification()
    this.title = (!this.edit) ? "Ajouter une qualification" : "Modifier la qualification " + this.qualification.objet
    this.type = this.ticketService.type
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }
  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      type: [null, [Validators.required]],
      emitter: [null, [Validators.required]],
      concerne: [null],
      house: [null],
      rental: [null],
      ressource: [null],
      urgence: [null, [Validators.required]],
      service: [null, [Validators.required]],
      category: [null, [Validators.required]],
      user: [null, [Validators.required]],
      date: [null, [Validators.required]],
      ticket: [this.ticketService.uuid]
    });
  }
  onTypeChange(val): void {
    switch (val) {
      case 'CLIENT':
        this.selectedType.className = 'Customer';
        this.selectedType.groupName = 'customer';
        this.selectedType.label = 'Client';
        break;

      case 'PROPRIETAIRE':
        this.selectedType.className = 'Owner';
        this.selectedType.groupName = 'owner';
        this.selectedType.label = 'Propriétaire';
        break;
      case 'LOCATAIRE':
        this.selectedType.className = 'Tenant';
        this.selectedType.groupName = 'tenant';
        this.selectedType.label = 'Locataire';
        break;
      default:
        break;
    }
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.ticketService.getQualification() }
       this.emitterSelected = { 
        title: data.customer?.nom ? data.customer.nom : null,
        detail: data.customer?.nom ? data.customer.nom : null,
        }
        this.categorySelected= {
          title: data.category?.libelle ? data.category.libelle : null,
          detail: data.category?.libelle ? data.category.libelle : null,
        }
        this.serviceSelected= {
          title: data.service?.nom ? data.service?.nom : null,
          detail: data.service?.nom  ? data.service?.nom  : null,
        }
        data.date = DateHelperService.fromJsonDate(data?.date);
      
      this.form.patchValue(data)
      this.f.emitter.setValue(data.customer.uuid);
      this.f.category.setValue(data.category.uuid);
      this.f.service.setValue(data.service?.uuid);
      this.f.user.setValue(data?.user ? data?.user?.id : null);
      this.loadUsers();
    }
  }
  setEmitterUuid(uuid) {
    this.f.emitter.setValue(uuid);
  }
  setHouseUuid(uuid) {
    this.f.house.setValue(uuid);
    if(uuid){
      this.loadRentals(uuid);
    }
  }
  loadRentals(uuid) {
    this.rentalService.getList(null, uuid).subscribe(res => {
      this.rentals = res;
      return this.rentals;
    }, error => {});
  }
  onChangeRental(event) {
    this.rental = this.rentals.find((item) => {
      if (item.uuid === event) {  return item;  }
    });
    if(this.rental){
      this.loadRessource(this.rental.uuid)
    }
  }
  setRessourceUuid(uuid){
    this.f.piece.setValue(uuid)
  }
  loadRessource(uuid) {
    this.ressourceService.getList(uuid).subscribe(res => {
      this.ressources = res;
      return this.ressources;
    }, error => {});
  }
  setCategoryUuid(uuid) {
    this.f.category.setValue(uuid);
    if (uuid) {
      this.loadCategories();
    } else {

    }
  }
  setServiceUuid(uuid) {
    this.f.service.setValue(uuid);
    if (uuid) {
      this.loadUsers();
    } else {
      this.users = [];
    }
  }

  loadUsers() {
    // if (!this.edit) {
      this.userService.getList(null, this.f.service.value).subscribe(res => {
        this.users = res;
        return this.users;
      }, error => { });
    // }
  }
  loadCategories() {
    this.categoryService.getList().subscribe(res => {
    }, error => { });
  }
  selectUser(value) {
    this.users = [];
    this.user = null;
    this.f.user.setValue(null);
    if (!this.edit) {
      this.user = this.users.find(item => {
        if (item.uuid === value) {
          this.f.user.setValue(item.uuid);
          return item;
        }
      });
    }
    this.f.user.setValue(value);
  }

  onSearch() {
    this.isHidden = true
  }
  onSubmit() {
    this.submit = true
    if (!this.form.invalid) {
      this.ticketService.qualification(this.form.value).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          this.emitter.emit({ action: this.edit ? 'TICKET_QUALIFICATION_UPDATED' : 'TICKET_QUALIFICATION_ADD', payload: res?.data });
        }
      }, error => { });
    } else {
      return
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
        Object.assign(this.form.value, { [property]: value });
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
  onClose() {
    if (!this.edit && this.form.value.folderUuid) {
      var data = { uuid: this.form.value.folderUuid, path: 'locative' }
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
}


