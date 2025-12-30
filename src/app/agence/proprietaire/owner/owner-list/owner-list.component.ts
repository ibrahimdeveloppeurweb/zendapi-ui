import { Owner } from '@model/owner';
import { House } from '@model/house';
import { Rental } from '@model/rental';
import { Router } from '@angular/router';
import { Mandate } from '@model/mandate';
import { Repayment } from '@model/repayment';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Terminate } from '@model/terminate';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RenewMandate } from '@model/renew-mandate';
import { NgxPermissionsService } from 'ngx-permissions';
import { HouseService } from '@service/house/house.service';
import { OwnerService } from '@service/owner/owner.service';
import { FilterService } from '@service/filter/filter.service';
import { RentalService } from '@service/rental/rental.service';
import { MandateService } from '@service/mandate/mandate.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { ContractService } from '@service/contract/contract.service';
import { OnBoardingService } from '@theme/utils/on-boarding.service';
import { RepaymentService } from '@service/repayment/repayment.service';
import { EquipmentService } from '@service/equipment/equipment.service';
import { ValidationService } from '@service/validation/validation.service';
import { RenewMandateService } from '@service/renew-mandate/renew-mandate.service';
import { HouseAddComponent } from '@proprietaire/house/house-add/house-add.component';
import { OwnerAddComponent } from '@proprietaire/owner/owner-add/owner-add.component';
import { OwnerCommitteeComponent } from '../owner-committee/owner-committee.component';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';
import { RentalAddComponent } from '@proprietaire/rental/rental-add/rental-add.component';
import { ValidationAddComponent } from '@validation/validation-add/validation-add.component';
import { MandateAddComponent } from '@proprietaire/mandate/mandate-add/mandate-add.component';
import { AttributionComponent } from '@agence/proprietaire/attribution/attribution.component';
import { TerminateMandateService } from '@service/terminate-mandate/terminate-mandate.service';
import { RentalBlockAddComponent } from '@proprietaire/rental-block-add/rental-block-add.component';
import { EquipmentAddComponent } from '@agence/proprietaire/equipment/equipment-add/equipment-add.component';
import { RepaymentAddComponent } from '@agence/proprietaire/repayment/repayment-add/repayment-add.component';
import { RenewMandateAddComponent } from '@proprietaire/renew-mandate/renew-mandate-add/renew-mandate-add.component';
import { TerminateMandateAddComponent } from "@agence/proprietaire/terminate-mandate/terminate-mandate-add/terminate-mandate-add.component";
import { RepayAddComponent } from '../../repay/repay-add/repay-add.component';
import { RepaymentNotificationService } from '@service/notification/repayment-notification.service';
import { RepaymentNotificationsModalComponent } from '@agence/proprietaire/repayment-notifications/repayment-notifications-modal.component';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.scss']
})
export class OwnerListComponent implements OnInit {
  proprietaire: boolean = true;
  bien: boolean = false;
  min: boolean = false;
  max: boolean = false;
  filter: any;
  owners: Owner[];
  houses: House[];
  rentals: Rental[];
  mandates: Mandate[];
  renews: RenewMandate[];
  terminates: Terminate[] = [];
  repayments: Repayment[];
  visible: boolean = false;
  userSession = Globals.user
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device};
  type: string = 'PROPRIETAIRE';
  etatRow = [
    { label: 'AUCUN MANDAT', value: 'AUCUN' },
  ];
  typeRow = [
    { label: 'PROPRIETAIRE', value: 'PROPRIETAIRE' },
    { label: 'BIEN', value: 'BIEN' },
    { label: 'LOCATIVE', value: 'LOCATIVE' },
    { label: 'MANDAT', value: 'MANDAT' },
    { label: 'REVERSEMENT', value: 'REVERSEMENT' },
    { label: 'RENOUVELLEMENT', value: 'RENOUVELLEMENT_M' },
    { label: 'RESILIATION', value: 'RESILIATION_M' }
  ];
  categorieRow = [
    { label: 'PARTICULIER', value: 'PARTICULIER' },
    { label: 'ENTREPRISE', value: 'ENTREPRISE' }
  ];
  nameTitle: string = "Nom / Raison sociale"
  userTitle: string = "Crée par"
  bienTitle: string = "Propriétaire"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de propriétaire"
  etatTitle: string = "Mandats"
  cookie: string = ''
  autorisation: any = Globals.autorisation;
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 8000,
    timerProgressBar: true
  })
  etat: boolean = true

  view: boolean = false
  dtOptions: any = {};

  totalImpaye: number = 0
  totalReverse: number = 0
  unreadNotificationsCount: number = 0

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private ownerService: OwnerService,
    private houseService: HouseService,
    public boarding: OnBoardingService,
    private cookieService: CookieService,
    private filterService: FilterService,
    private rentalService: RentalService,
    private mandateService: MandateService,
    private contractService: ContractService,
    private equimentService: EquipmentService,
    private repaymentService: RepaymentService,
    private validationService: ValidationService,
    private renewMandateService: RenewMandateService,
    private terminateService: TerminateMandateService,
    private permissionsService: NgxPermissionsService,
    public notificationService: RepaymentNotificationService
  ) {
    this.ownerService.getList().subscribe(res => {
      res.forEach((owner: any) => {
        this.totalImpaye += owner.impaye
        this.totalReverse += owner.reverse
      })

      return this.owners = res;
    }, error => { });
    const permission = JSON.parse(localStorage.getItem('permission-zen') || '[]');
    this.permissionsService.loadPermissions(permission);
    
    // S'abonner au compteur de notifications
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadNotificationsCount = count;
    });
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'OWNER_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'OWNER_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  ngAfterViewInit(): void {
    this.cookie = this.cookieService.get('owner');
    var etat = this.cookie ? true : false;
    // if (this.cookie !== 'on-boarding-owner') {
    //   this.boarding.owner(etat);
    // }
    // this.boarding.owner(etat);
  }

  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    this.owners = []
    this.houses = []
    this.rentals = []
    this.mandates = []
    this.repayments = []
    this.renews = []
    this.terminates = []
    this.filterService.search($event, 'owner', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if (this.type === 'PROPRIETAIRE') {
          res.forEach((owner: any) => {
            this.totalImpaye += owner.impaye
            this.totalReverse += owner.reverse
          })
          this.owners = res;
          return this.owners;
        } else if (this.type === 'BIEN') {
          this.houses = res;
          return this.houses;
        } else if (this.type === 'LOCATIVE') {
          this.rentals = res;
          return this.rentals;
        } else if (this.type === 'MANDAT') {
          this.mandates = res;
          return this.mandates;
        } else if (this.type === 'REVERSEMENT') {
          this.repayments = res;
          return this.repayments;
        } else if (this.type === 'RENOUVELLEMENT_M') {
          this.renews = res;
          return this.renews;
        } else if (this.type === 'RESILIATION_M') {
          this.terminates = res;
          return this.terminates;
        }
      }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if ($event === 'PROPRIETAIRE') {
      this.bien = false;
      this.min = false;
      this.max = false;
      this.nameTitle = "Nom / Raison sociale"
      this.categorieTitle = 'Type de propriétaire'
      this.etatRow = [];
      this.categorieRow = [
        { label: 'PARTICULIER', value: 'PARTICULIER' },
        { label: 'ENTREPRISE', value: 'ENTREPRISE' }
      ];
      this.visible = false;
      this.ownerService.getList().subscribe(res => {
        res.forEach((owner: any) => {
          this.totalImpaye += owner.impaye
          this.totalReverse += owner.reverse
        })
        return this.owners = res;
      }, error => { });
      this.etat = true
      this.etatTitle = "Mandats"
    } else if ($event === 'BIEN') {
      this.bien = true;
      this.min = false;
      this.max = false;
      this.bienTitle = "Nom du bien"
      this.nameTitle = "Propriétaire"
      this.categorieTitle = 'Type de bien'
      this.etatRow = [
        { label: 'DISPONIBLE', value: 'DISPONIBLE' },
        { label: 'VENDU', value: 'VENDU' }
      ];
      this.categorieRow = [
        { label: 'EN LOCATION', value: 'LOCATION' },
        { label: 'EN VENTE', value: 'VENTE' }
      ];
      this.visible = false;
      this.houseService.getList().subscribe(res => { return this.houses = res; }, error => { });
      this.etatTitle = "Disponibilité ?"
    } else if ($event === 'LOCATIVE') {
      this.bien = true;
      this.min = true;
      this.max = true;
      this.bienTitle = "Nom du bien"
      this.nameTitle = "Propriétaire"
      this.categorieTitle = 'Type de locative'
      this.categorieRow = [
        { label: 'STUDIO', value: 'STUDIO' },
        { label: 'APPARTEMENT', value: 'APPARTEMENT' },
        { label: 'PALIER', value: 'PALIER' },
        { label: 'VILLA', value: 'VILLA' },
        { label: 'MAGASIN', value: 'MAGASIN' },
        { label: 'BUREAU', value: 'BUREAU' },
        { label: 'SURFACE', value: 'SURFACE' },
        { label: 'RESTAURANT', value: 'RESTAURANT' },
        { label: 'HALL', value: 'HALL' },
        { label: 'SALLE CONFERENCE', value: 'SALLE CONFERENCE' },
        { label: 'PARKING', value: 'PARKING' }
      ];
      this.etatRow = [
        { label: 'DISPONIBLE', value: 'DISPONIBLE' },
        { label: 'RESERVE', value: 'RESERVE' },
        { label: 'OCCUPE', value: 'OCCUPE' }
      ];
      this.visible = false;
      this.rentalService.getList().subscribe(res => { return this.rentals = res; }, error => { });
    } else if ($event === 'MANDAT') {
      this.bien = true;
      this.min = true;
      this.max = true;
      this.bienTitle = "Nom du bien"
      this.nameTitle = "Propriétaire"
      this.categorieTitle = 'Type de locative'
      this.categorieRow = [
        { label: 'VENTE', value: 'VENTE' },
        { label: 'LOCATION', value: 'LOCATION' }
      ];
      this.etatTitle = "Etat"
      this.etatRow = [
        { label: 'INVALIDE', value: 'INVALIDE' },
        { label: 'VALIDE', value: 'VALIDE' },
        { label: 'RESILIE', value: 'RESILIE' }
      ];
      this.visible = true;
      this.mandateService.getList(null, null).subscribe(res => { return this.mandates = res; }, error => { });
    } else if ($event === 'REVERSEMENT') {
      this.bien = false;
      this.min = true;
      this.max = true;
      this.nameTitle = "Propriétaire"
      this.categorieTitle = 'Type'
      this.etatTitle = 'Etat'
      this.etatRow = [
        { label: 'INVALIDE', value: 'INVALIDE' },
        { label: 'VALIDE', value: 'VALIDE' }
      ];
      this.categorieRow = [
        { label: 'VENTE', value: 'VENTE' },
        { label: 'LOCATION', value: 'LOCATION' }
      ];
      this.visible = true;
      this.repaymentService.getList().subscribe(res => { return this.repayments = res; }, error => { });
    } else if ($event === 'RENOUVELLEMENT_M') {
      this.bien = true;
      this.min = true;
      this.max = true;
      this.bienTitle = "N° Mandat"
      this.etatTitle = 'Etat'
      this.nameTitle = 'Proprietaire'
      this.etatRow = [
        { label: 'ACTIF', value: 'ACTIF' },
        { label: 'INACTIF', value: 'INACTIF' },
        { label: 'EXPIRER', value: 'EXPIRER' }
      ];
      this.visible = true;
      this.renewMandateService.getList().subscribe(res => { return this.renews = res; }, error => { });
    } else if ($event === 'RESILIATION_M') {
      this.bien = true;
      this.min = false;
      this.max = false;
      this.bienTitle = "Nom du bien"
      this.nameTitle = "Propriétaire"
      this.categorieTitle = ''
      this.categorieRow = [];
      this.etatTitle = "Etat"
      this.etatRow = [
        { label: 'INVALIDE', value: 'INVALIDE' },
        { label: 'VALIDE', value: 'VALIDE' }
      ];
      this.visible = false;
      this.terminateService.getList(null).subscribe(res => { return this.terminates = res; }, error => { });
    }
  }
  onPrinter() {
    if (this.type === 'PROPRIETAIRE') {
      this.ownerService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'BIEN') {
      this.houseService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'LOCATIVE') {
      this.rentalService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'MANDAT') {
      this.mandateService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'REVERSEMENT') {
      this.repaymentService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'RENOUVELLEMENT_M') {
      this.renewMandateService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'RESILIATION_M') {
      this.terminateService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onModel() {
    if (this.type === 'PROPRIETAIRE') {
      this.ownerService.getGenerer();
    } else if (this.type === 'BIEN') {
      this.houseService.getGenerer();
    } else if (this.type === 'LOCATIVE') {
      this.rentalService.getGenerer();
    }
  }
  onExport() {
    if (this.type === 'PROPRIETAIRE') {
      this.ownerService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'BIEN') {
      this.houseService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'LOCATIVE') {
      this.rentalService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'MANDAT') {
      this.mandateService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'REVERSEMENT') {
      this.repaymentService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'RENOUVELLEMENT_M') {
      this.renewMandateService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'RESILIATION_M') {
      this.terminateService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onImport() {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = this.type;
  }
  appendToList(owner): void {
    this.owners.unshift(owner);
  }
  update(owner): void {
    const index = this.owners.findIndex(x => x.uuid === owner.uuid);
    if (index !== -1) {
      this.owners[index] = owner;
    }
  }
  addOwner(type) {
    this.modalService.dismissAll();
    this.ownerService.edit = false;
    this.ownerService.type = type;
    this.modal(OwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addHouse(type) {
    this.modalService.dismissAll();
    this.houseService.edit = false;
    this.houseService.house = null;
    this.houseService.disponible = type;
    this.modal(HouseAddComponent, 'modal-basic-title', 'xl', true, 'static', 'full-screen');
  }
  addRental() {
    this.modalService.dismissAll();
    this.rentalService.edit = false;
    this.rentalService.rental = null;
    this.modal(RentalAddComponent, 'modal-basic-title', 'xl', true, 'static', 'full-screen');
  }
  addRentalBlock() {
    this.modalService.dismissAll();
    this.rentalService.edit = false;
    this.rentalService.rental = null;
    this.modal(RentalBlockAddComponent, 'modal-basic-title', 'xl', true, 'static', 'full-screen');
  }
  addEquipment() {
    this.modalService.dismissAll();
    this.equimentService.edit = false;
    this.modal(EquipmentAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addAttribution(){
    this.modalService.dismissAll();
    this.modal(AttributionComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  addMandate() {
    this.modalService.dismissAll();
    this.mandateService.edit = false;
    this.modal(MandateAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addTerminate() {
    this.modalService.dismissAll();
    this.terminateService.edit = false;
    this.contractService.setContract(null);
    this.modal(TerminateMandateAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  addRenewMandate() {
    this.modalService.dismissAll();
    this.renewMandateService.edit = false;
    this.modal(RenewMandateAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addRepayment(type) {
    this.modalService.dismissAll();
    this.repaymentService.edit = false;
    this.repaymentService.type = type;
    this.modal(RepaymentAddComponent, 'modal-basic-title', 'xl', true, 'static');
    // this.modal(RepayAddComponent, 'modal-basic-title', 'xl', true, 'static', 'full-screen')
  }
  editOwner(row) {
    this.ownerService.setOwner(row);
    this.ownerService.edit = true;
    this.ownerService.type = row.type;
    this.modal(OwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showOwner(row) {
    this.ownerService.setOwner(row);
    this.router.navigate(['/admin/proprietaire/show/' + row.uuid]);
  }
  printerOwner(row): void {
    this.ownerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.ownerService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.owners.findIndex(x => x.id === item.id);
            if (index !== -1) { this.owners.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }
  modal(component, type, size, center, backdrop, style?) {
    this.modalService.open(component, {
      windowClass: style,
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  getAccountStatement() {
    console.log('Relévé de compte')
    // this.modal(OwnerAccoun, 'modal-basic-title', 'xl', true, 'static');
  }
  getCommittees() {
    this.modal(OwnerCommitteeComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addValidateur() {
    this.modalService.dismissAll();
    this.validationService.type = 'HOUSE';
    this.modal(ValidationAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  onChangeView() {
    this.view = !this.view
  }
  
  openNotifications() {
    this.modalService.dismissAll();
    this.modal(RepaymentNotificationsModalComponent, 'modal-basic-title', 'xl', true, 'static');
  }
}
