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
import { DepositAddComponent } from '@agence/tresorerie/wallet/deposit-add/deposit-add.component';
import { DepositService } from '@service/wallet/deposit.service';
import { OwnerCoService } from '@service/owner-co/owner-co.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { HomeCoService } from '@service/syndic/home-co.service';
import { SyndicCondominiumAddComponent } from '@agence/syndic/syndic-condominium/syndic-condominium-add/syndic-condominium-add.component';
import { FundsapealService } from '@service/syndic/fundsapeal.service';
import { OwnerCoAddComponent } from '../owner-co-add/owner-co-add.component';
import { FundsPaymentService } from '@service/syndic/funds-payment.service';


@Component({
  selector: 'app-owner-co-show',
  templateUrl: './owner-co-show.component.html',
  styleUrls: ['./owner-co-show.component.scss']
})
export class OwnerCoShowComponent implements OnInit {
  public activeTab: string = 'COPROPRIETAIRE';
  publicUrl = environment.publicUrl;
  userSession = Globals.user;
  global = {country: Globals.country, device: Globals.device};
  owner: any;
  houses: House[];
  rentals: Rental[];
  mandates: Mandate[];
  repayments: Repayment[];
  tickets: any[] = []
  graph : any
  type: string = 'COPROPRIETAIRE';
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
  syndic: any
  syndicUuid : any
  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;
  coproprietes: any[] = []
  fundsapeals: any[] = []

  montant: number = 0
  paye: number = 0
  reste: number = 0

  fundsPayments: any[] = []

  constructor(
    private ownerService: OwnerService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private filterService: FilterService,
    private permissionsService: NgxPermissionsService,
    private ownerCoService: OwnerCoService,
    private syndicService: SyndicService,
    private homeCoService: HomeCoService,
    private coproprieteService: CoproprieteService,
    private fundsapealService: FundsapealService,
    private fundsPaymentService: FundsPaymentService


  ) {
    this.owner = this.ownerCoService.getOwnerCo();
    this.syndicUuid = this.owner?.trustee?.uuid
    this.onChangeLoad(this.type);
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    if (!this.owner) {
      this.ownerCoService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        this.syndicUuid = res?.trustee?.uuid
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
    this.fundsapeals  = []
    this.fundsPayments = []
    $event.type = this.activeTab
    if(this.activeTab === 'WALLET'){
      this.filterService.wallet(this.event, 'wallet', this.route.snapshot.params.id).subscribe(
        res => {
          this.widget = res?.widget
          this.listing = res?.listing
          this.graph = res?.graph
          return this.graph
      }, err => { })
    }else if (this.activeTab === 'APPEL' || this.activeTab === 'PROVISION') {
      $event.type = this.activeTab 
      $event.uuid = this.route.snapshot.params.id
      $event.syndic = this.syndicUuid
      this.filterService.search($event, 'trustee', this.syndicUuid).subscribe(
        res => {
          if (this.activeTab === 'APPEL') {
            return this.fundsapeals = res
          } else if (this.activeTab === 'PROVISION') {
            return this.fundsPayments = res
          }
         
      }, err => { })
      
    }else {
      $event.uuid = this.route.snapshot.params.id
      this.coproprietes = []
      this.filterService.search($event, 'owner', this.owner.uuid).subscribe(
        res => {
          if (this.activeTab === 'LOT') {
            return this.coproprietes = res;
          }
        }, err => { })
    }
  }
  onChangeLoad(type): void {
    this.activeTab = type;
    if (type === 'COPROPRIETAIRE') {
      this.name = true
      this.categorie = true
      this.etat = true
      if (!this.owner) {
        this.ownerCoService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          return this.owner = res;
        });
      }
    } else if (type === 'SYNDIC') {
      this.name = true
      this.categorie = false
      this.etat = false
      this.typeRow = [{ label: 'SYNDIC', value: 'SYNDIC' }];
      this.categorieRow = []
      
      this.syndicService.getSingle(this.syndicUuid).subscribe((res: any) => {
        return this.syndic = res
      })
    } else if (type === 'LOT') {
      this.categorie = false
      this.etat = false
      this.typeRow = [{ label: 'LOT', value: 'LOT' }];
      this.coproprietes = []
      this.homeCoService.getList(null,null,null,this.owner?.uuid).subscribe((res: any) => {
        return this.coproprietes = res
      })
      
    }else if (type === 'APPEL') {
      this.categorie = false
      this.etat = false
      this.typeRow = [{ label: 'APPEL DE CHARGE', value: 'APPEL' }];
      this.fundsapealService.getList(null, this.owner?.uuid).subscribe((res: any) => {
        let montant = 0
        let paye = 0
        let reste = 0
        res.forEach((item: any) => {
          montant += Number(item.montant)
          paye += Number(item.payer)
          reste += Number(item.reste)
        })
        this.montant = montant
        this.paye = paye
        this.reste = reste

        return this.fundsapeals = res
      })
    }else if (type === 'PROVISION') {
      this.name = true
      this.nameTitle = 'Libellé'
      this.typeRow = [
        { label: 'RÈGLEMENT', value: 'PROVISION' },
      ];
      this.fundsPaymentService.getList(this.syndicService.uuid, this.owner?.uuid).subscribe((res: any) => {
        return this.fundsPayments = res
      })
    }
  }
  editOwner(row) {
    console.log(row);
    
    this.ownerCoService.setOwnerCo(row);
    this.ownerCoService.edit = true;
    this.ownerCoService.type = row.type;
    this.modal(OwnerCoAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printerOwner(row): void {
    this.ownerCoService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid, null);
  }
  back() {  window.history.back();}
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
        this.ownerCoService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') { this.router.navigate(['/admin/syndic']) }
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

 

    showHouse(row){
      this.coproprieteService.setCopropriete(row)
      this.coproprieteService.exit = 'SYNDIC_LIST'
      this.router.navigate(['/admin/syndic/copropriete/show/' + row.uuid]);
    }
  editHouse(row){
      this.coproprieteService.setCopropriete(row)
      this.coproprieteService.edit = true
      this.modal(SyndicCondominiumAddComponent, 'modal-basic-title', 'xl', true, 'static')
    }
  
    printHouse(row){
      if (row.type === 'VERTICAL') {
        this.coproprieteService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row?.trustee?.uuid, row.uuid);
      }
      else if (row.type === 'HORIZONTAL') {
        this.homeCoService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row?.trustee?.uuid, row.uuid);
      }
    }

    deleteHouse(item) {
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
            if(item.type === 'HORIZONTAL'){
              this.homeCoService.getDelete(item?.uuid).subscribe((res: any) => {
                if (res?.status === 'success') {
                  const index = this.coproprietes.findIndex(x => x.id === item.id);
                  if (index !== -1) { this.coproprietes.splice(index, 1); }
                  Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
                }
              });
            }
            else if(item.type === 'VERTICAL'){
              this.coproprieteService.getDelete(item?.uuid).subscribe((res: any) => {
                if (res?.status === 'success') {
                  const index = this.coproprietes.findIndex(x => x.id === item.id);
                  if (index !== -1) { this.coproprietes.splice(index, 1); }
                  Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
                }
              });
            }
          }
        });
      }
}

