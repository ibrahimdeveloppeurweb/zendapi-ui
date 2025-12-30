
import { Owner } from '@model/owner';
import { House } from '@model/house';
import { Rental } from '@model/rental';
import { Mandate } from '@model/mandate';
import { Repayment } from '@model/repayment';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RendService } from '@service/rdv/rend.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { ActivatedRoute, Router } from '@angular/router';
import { OwnerService } from '@service/owner/owner.service';
import { HouseService } from '@service/house/house.service';
import { FilterService } from '@service/filter/filter.service';
import { RentalService } from '@service/rental/rental.service';
import { MandateService } from '@service/mandate/mandate.service';
import { RepaymentService } from '@service/repayment/repayment.service';
import { OwnerAddComponent } from '@proprietaire/owner/owner-add/owner-add.component';
import { UploaderService } from '@service/uploader/uploader.service';
import { ActivityService } from '@service/activity/activity.service';
import { TicketService } from '@service/ticket/ticket.service';
import { WalletService } from '@service/wallet/wallet.service';
import { WithdrawalAddComponent } from '@agence/tresorerie/wallet/withdrawal-add/withdrawal-add.component';
import { TreasuryService } from '@service/treasury/treasury.service';
import { WithdrallService } from '@service/wallet/withdrawll.service';
import { OwnerReleveComponent } from '../owner-releve/owner-releve.component';
import { DepositAddComponent } from '@agence/tresorerie/wallet/deposit-add/deposit-add.component';
import { DepositService } from '@service/wallet/deposit.service';


@Component({
  selector: 'app-owner-show',
  templateUrl: './owner-show.component.html',
  styleUrls: ['./owner-show.component.scss']
})
export class OwnerShowComponent implements OnInit {
  public activeTab: string = 'PROPRIETAIRE';
  publicUrl = environment.publicUrl;
  userSession = Globals.user;
  global = {country: Globals.country, device: Globals.device};
  owner: Owner = null;
  houses: House[];
  rentals: Rental[];
  mandates: Mandate[];
  repayments: Repayment[];
  tickets: any[] = []
  graph : any
  type: string = 'WALLET';
  etatRow = [
    { label: 'DISPONIBLE', value: 'DISPONIBLE' },
    { label: 'VENDU', value: 'VENDU' }
  ];
  typeRow = [
    { label: 'Portefeuille', value: 'WALLET' },
    { label: 'PROPRIETAIRE', value: 'PROPRIETAIRE' },
    { label: 'RETRAIT', value: 'RETRAIT' },
    { label: 'DEPOT', value: 'DEPOT' },
    { label: 'BIEN', value: 'BIEN' },
    { label: 'LOCATIVE', value: 'LOCATIVE' },
    { label: 'MANDAT', value: 'MANDAT' },
    { label: 'REVERSEMENT', value: 'REVERSEMENT' }
  ];
  categorieRow = [
    { label: 'EN LOCATION', value: 'LOCATION' },
    { label: 'EN VENTE', value: 'VENTE' }
  ];
  nameTitle: string = "Nom du bien"
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de bien"
  etatTitle: string = "Disponibilité ?"
  file: any;
  rdvs = []
  notes = [];
  name: boolean = false
  categorie: boolean = false
  etat: boolean = false
  isHidden: boolean =false
  event = {
    categorie: null,
    code: null,
    count: 10,
    create: null,
    dateD: null,
    dateF: null,
    etat: null,
    max: null,
    min: null,
    name: null,
    ordre: "ASC",
    type: "OWNER",
    uuid: null,
    isHidden: false
  }
  widget : any
  listing : any[]
  withdrawlls: any[] = []
  deposits: any[] = []

  constructor(
    private ownerService: OwnerService,
    private houseService: HouseService,
    private rentalService: RentalService,
    private mandateService: MandateService,
    private repaymentService: RepaymentService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private filterService: FilterService,
    private permissionsService: NgxPermissionsService,
    private uploader: UploaderService,
    private activityService: ActivityService,
    private rdvService: RendService,
    public ticketService: TicketService,
    private walletService: WalletService,
    private treasuryService: TreasuryService,
    private withdrawllService: WithdrallService,
    private depositService: DepositService,


  ) {
    this.owner = this.ownerService.getOwner();
    this.onChangeLoad(this.type);
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    if (!this.owner) {
      this.ownerService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        return this.owner = res;
      });
    }
  }

  onFilter($event) {
    this.widget = null
    this.listing = null
    this.graph = null
    this.houses = []
    this.rentals = []
    this.mandates = []
    this.repayments = []
    $event.type = this.activeTab
    if(this.activeTab === 'WALLET'){
      this.filterService.wallet(this.event, 'wallet', this.route.snapshot.params.id).subscribe(
        res => {
          this.widget = res?.widget
          this.listing = res?.listing
          this.graph = res?.graph
          return this.graph
      }, err => { })
    }else {
      this.filterService.search($event, 'owner', this.owner.uuid).subscribe(
        res => {
          if (this.activeTab === 'BIEN') {
            return this.houses = res;
          } else if (this.activeTab === 'LOCATIVE') {
            return this.rentals = res;
          } else if (this.activeTab === 'MANDAT') {
            return this.mandates = res;
          } else if (this.activeTab === 'REVERSEMENT') {
            return this.repayments = res;
          } else if (this.activeTab === 'RETRAIT') {
            return this.withdrawlls = res;
          } else if (this.activeTab === 'DEPOSIT') {
            return this.deposits = res;
          }
        }, err => { })
    }
  }
  onChangeLoad(type): void {
    this.activeTab = type;
    if (type === 'WALLET') {
      this.typeRow = [{ label: 'Portefeuille ', value: 'OWNER' }];
      this.filterService.wallet(this.event, 'wallet', this.route.snapshot.params.id).subscribe(
        res => {
          this.widget = res?.widget
          this.listing = res?.listing
          this.graph = res?.graph
      }, err => { })
    } else if (type === 'PROPRIETAIRE') {
      this.name = true
      this.categorie = true
      this.etat = true
      if (!this.owner) {
        this.ownerService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          return this.owner = res;
        });
      }
    } else if (type === 'BIEN') {
      this.name = true
      this.categorie = true
      this.etat = true
      this.typeRow = [{ label: 'BIEN', value: 'BIEN' }];
      this.categorieRow = []
      this.houseService.getList(this.owner.uuid, null, null).subscribe((res) => {
        return this.houses = res;
      }, error => { }
      );
    } else if (type === 'LOCATIVE') {
      this.name = true
      this.categorie = true
      this.etat = true
      this.categorieTitle = 'Type de locative'
      this.nameTitle = 'Nom du bien'
      this.typeRow = [{ label: 'LOCATIVE', value: 'LOCATIVE' }];
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
        { label: 'VENDU', value: 'VENDU' }
      ];
      this.rentalService.getList(this.owner.uuid).subscribe((res) => {
        return this.rentals = res;
      }, error => { }
      );
    } else if (type === 'MANDAT') {
      this.name = true
      this.categorie = true
      this.etat = true
      this.nameTitle = 'Nom du bien'
      this.typeRow = [{ label: 'MANDAT', value: 'MANDAT' }];
      this.categorieRow = []
      this.mandateService.getList(this.owner.uuid).subscribe((res) => {
        return this.mandates = res;
      }, error => { }
      );
    } else if (type === 'REVERSEMENT') {
      this.name = true
      this.categorie = true
      this.etat = true
      this.typeRow = [{ label: 'REVERSEMENT', value: 'REVERSEMENT' }];
      this.categorieRow = []
      this.repaymentService.getList(this.owner.uuid, null, null).subscribe((res) => {
        return this.repayments = res;
      }, error => { }
      );
    } else if (type === 'RETRAIT') {
      this.name = true
      this.categorie = true
      this.etat = true
      this.name = false
      this.typeRow = [{ label: 'RETRAIT', value: 'RETRAIT' }];
      this.categorieRow = []
      this.withdrawllService.getList(this.owner.uuid).subscribe((res) => {
        return this.withdrawlls = res;
      }, error => { }
      );
    } else if (type === 'DEPOT') {
      this.name = true
      this.categorie = true
      this.etat = true
      this.name = false
      this.typeRow = [{ label: 'DEPOT', value: 'DEPOT' }];
      this.categorieRow = []
      this.depositService.getList(this.owner.uuid).subscribe((res) => {
        return this.deposits = res;
      }, error => { }
      );
    } else if (type === 'NOTE_INTERNE'){
      this.activityService.getList(null, this.owner.uuid, null, null).subscribe((res: any) => {
        return this.notes = res
      })
      this.rdvService.getList(null, this.owner.uuid, null, null).subscribe((res: any) => {
        return this.rdvs = res
      })
    } else if (type === 'TICKET'){
      this.ticketService.getList(null,null,null,null,this.owner.uuid,null,null,null).subscribe(res => {
        return this.tickets = res;
      }, error => { });

    }
  }
  editOwner(row) {
    this.ownerService.setOwner(row);
    this.ownerService.edit = true;
    this.ownerService.type = row.type;
    this.modal(OwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printerOwner(row): void {
    this.ownerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  back() { this.router.navigate(['/admin/proprietaire']) }
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
      if (willDelete.dismiss) { }
      else {
        this.ownerService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') { this.router.navigate(['/admin/proprietaire']) }
        });
      }
    });
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
  addDeposit() {
    this.modalService.dismissAll();
    this.ownerService.setOwner(this.owner);
    this.treasuryService.setTreasury(null);
    this.depositService.edit = false;
    this.modal(DepositAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  getReveler() {
    this.ownerService.setOwner(this.owner);
    this.modal(OwnerReleveComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addWithdrawll() {
    this.modalService.dismissAll();
    this.ownerService.setOwner(this.owner);
    this.treasuryService.setTreasury(null);
    this.withdrawllService.edit = false;
    this.modal(WithdrawalAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
}
