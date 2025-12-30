import { HouseService } from '@service/house/house.service';
import { RentalService } from '@service/rental/rental.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SyndicService } from '@service/syndic/syndic.service';
import { Globals } from '@theme/utils/globals';
import { MandateSyndicService } from '@service/syndic/mandate-syndic.service';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CondominiumAddComponent } from '@agence/proprietaire/condominium/condominium-add/condominium-add.component';
import { SyndicAddComponent } from '../syndic-add/syndic-add.component';
import { InfrastructureService } from '@service/syndic/infrastructure.service';
import { InfrastructureAddComponent } from '@agence/syndic/infrastructure/infrastructure-add/infrastructure-add.component';
import { InfrastructureShowComponent } from '@agence/syndic/infrastructure/infrastructure-show/infrastructure-show.component';
import { SyndicMandateShowComponent } from '@agence/syndic/syndic-mandate/syndic-mandate-show/syndic-mandate-show.component';
import { SyndicMandateAddComponent } from '@agence/syndic/syndic-mandate/syndic-mandate-add/syndic-mandate-add.component';
import { environment } from '@env/environment';
import { UploaderService } from '@service/uploader/uploader.service';
import { HomeCoService } from '@service/syndic/home-co.service';
import { FundsapealService } from '@service/syndic/fundsapeal.service';
import { OwnerService } from '@service/owner/owner.service';
import { ProviderService } from '@service/provider/provider.service';
import { ConstructionService } from '@service/construction/construction.service';
import { InvoiceCoService } from '@service/invoice-co/invoice-co.service';
import { QuoteService } from '@service/quote/quote.service';
import { BudgetService } from '@service/budget/budget.service';
import { FundsNoticeService } from '@service/syndic/funds-notice.service';
import { FundsPaymentService } from '@service/syndic/funds-payment.service';
import { OwnerAddComponent } from '@agence/proprietaire/owner/owner-add/owner-add.component';
import { ProviderAddComponent } from '@agence/prestataire/provider/provider-add/provider-add.component';
import { ConstructionAddComponent } from '@agence/chantier/construction/construction-add/construction-add.component';
import { BudgetDevelopComponent } from '@agence/budget/budget/budget-develop/budget-develop.component';
import { BudgetAddComponent } from '@agence/budget/budget/budget-add/budget-add.component';
import { FilterService } from '@service/filter/filter.service';
import { FundsPaymentAddComponent } from '@agence/syndic/funds-payment/funds-payment-add/funds-payment-add.component';
import { PopComponent } from '@theme/shared/pop/pop.component';
import { EmitterService } from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { InvoiceCoAddComponent } from '@agence/chantier/invoice-co/invoice-co-add/invoice-co-add.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { OwnerCoService } from '@service/owner-co/owner-co.service';
import { OwnerCoShowComponent } from '@agence/syndic/owner-co/owner-co-show/owner-co-show.component';
import { OwnerCoAddComponent } from '@agence/syndic/owner-co/owner-co-add/owner-co-add.component';
import { SyndicCondominiumAddComponent } from '@agence/syndic/syndic-condominium/syndic-condominium-add/syndic-condominium-add.component';


@Component({
  selector: 'app-syndic-show',
  templateUrl: './syndic-show.component.html',
  styleUrls: ['./syndic-show.component.scss']
})
export class SyndicShowComponent implements OnInit {

  activeTab: string = 'SYNDIC';
  refTitle: string = "Annee d'exercice";
  syndic: any
  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;
  filter: any;
  action: boolean = true;
  dtOptions: any = {};
  etat: boolean = false;
  code: boolean = false;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  publicUrl = environment.publicUrl;
  type: string = 'LOT';
  etatRow = [];
  typeRow = [
    { label: 'LOT', value: 'LOT' },
  ];
  nameTitle: string = "Libellé"
  userTitle: string = "Crée par"
  categorieTitle: string = ""
  etatTitle: string = "Etat ?"
  categorieRow = [];
  view: boolean = false
  file: any;
  mandats: any[] = []
  coproprietes: any[] = []
  homeCo: any[] = []
  infrastructures: any[] = []
  coproprietaires: any[] = []
  providers: any[] = []
  interventions: any[] = []
  invoiceCos: any[] = []
  devis: any[] = []
  budgets: any[] = []
  fundsapeals: any[] = []
  fundsNotices: any[] = []
  fundsPayments: any[] = []
  owners: any[] = []
  quotes: any[] = []
  houses: any[] = []
  rentals: any[] = []
  countdownValue: any
  startDate: Date;
  endDate: Date;
  countdown: any = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };
  bien: boolean = false
  name: boolean = false
  autre: boolean = false
  bienTitle: string = ''
  autreTitle: string = ''
  dateExiste: boolean = false
  nbMandat: number = 0
  nbCopropriete: number = 0
  nbInfrastructure: number = 0
  nbCoproprietaire: number = 0
  modelRef: NgbModalRef
  montant: number = 0
  paye: number = 0
  reste: number = 0
  categorie: boolean = false
  isHovered: boolean = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private syndicService: SyndicService,
    private coproprieteService: CoproprieteService,
    private ownerService: OwnerService,
    private homeService: HomeCoService,
    private providerService: ProviderService,
    private fundsapealService: FundsapealService,
    private mandateSyndicService: MandateSyndicService,
    private infrastructureService: InfrastructureService,
    private constructionService: ConstructionService,
    private invoiceCoService: InvoiceCoService,
    private quoteService: QuoteService,
    private budgetService: BudgetService,
    private emitter: EmitterService,
    private filterService: FilterService,
    private homeCoService: HomeCoService,
    private houseService: HouseService,
    private rentalService: RentalService,
    private fundsNoticeService: FundsNoticeService,
    private fundsPaymentService: FundsPaymentService,
    private permissionsService: NgxPermissionsService,
    private ownerCoService: OwnerCoService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen'))
      ? JSON.parse(localStorage.getItem('permission-zen'))
      : [];
    this.permissionsService.loadPermissions(permission);
    this.syndicService.uuid = this.route.snapshot.params.id
    this.syndicService.getSingle(this.syndicService.uuid).subscribe((res: any) => {
      return this.syndic = res
    })
    if (this.syndicService.return === 'SYNDIC_SHOW') {
      this.activeTab === 'LOT'
      this.onChangeLoad(true, 'LOT')
      this.syndicService.return = null
    }
  }
  ngOnInit() {
    this.dtOptions = Globals.dataTable
    this.compteArebouse();
    this.emitter.event.subscribe((data) => {
      if (data.action === 'BUDGET_ADD' || data.action === 'BUDGET_UPDATE') {
        this.onChangeLoad(false, 'BUDGET');
      }
    });
  }

  onFilter($event) {
    this.mandats = []
    this.coproprietes = []
    this.infrastructures = []
    this.coproprietaires = []
    this.interventions = []
    this.invoiceCos = []
    this.quotes = []
    this.budgets = []
    this.fundsapeals = []
    this.fundsNotices = []
    this.fundsPayments = []
    this.quotes = []
    this.rentals = []
    this.houses = []
    this.owners= []

    

    if (this.activeTab === 'COPROPRIETAIRE') {
      $event.type = 'CO-PROPRIETAIRE'
      this.filterService.type = 'PROPRIETAIRE';
    } else {
      $event.type = this.activeTab
      this.filterService.type = this.activeTab;
    }

    $event.uuid = this.route.snapshot.params.id
    $event.syndic = this.syndic?.uuid
    this.filter = null;
    this.filterService.search($event, 'trustee', this.syndic.uuid).subscribe(
      res => {
        this.filter = this.filterService.filter
        if (this.activeTab === 'MANDAT') {
          return this.mandats = res
        } else if (this.activeTab === 'LOT') {
          return this.houses = res
        } else if (this.activeTab === 'COPROPRIETAIRE') {
          return this.owners = res
        } else if (this.activeTab === 'INFRASTRUCTURE') {
          return this.infrastructures = res
        } else if (this.activeTab === 'FOURNISSEUR') {
          return this.providers = res
        } else if (this.activeTab === 'INTERVENTION') {
          return this.interventions = res
        } else if (this.activeTab === 'FACTURE') {
          return this.invoiceCos = res
        } else if (this.activeTab === 'DEVIS') {
          return this.quotes = res
        } else if (this.activeTab === 'BUDGET') {
          return this.budgets = res
        } else if (this.activeTab === 'APPEL') {
          console.log(res);
          
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
        } else if (this.activeTab === 'AVIS') {
          return this.fundsNotices = res
        } else if (this.activeTab === 'PROVISION') {
          return this.fundsPayments = res
        }
      }, err => { })
  }

  onChangeLoad(bool: boolean, type: string) {
    this.view = bool;
    this.activeTab = type;
    this.type = type;
    this.code = false;
    if (type === 'MANDAT') {
      this.bien = true
      this.name = false
      this.bienTitle = 'Libellé mandat'
      this.categorie = false
      this.etat = true
      this.typeRow = [
        { label: 'MANDAT', value: 'MANDAT' },
      ];
      this.etatRow = [
        { label: 'BROUILLON', value: 'BROUILLON' },
        { label: 'VALIDE', value: 'VALIDE' },
        { label: 'RESILIE', value: 'RESILIE' },
      ]
      this.mandateSyndicService.getList(this.syndicService.uuid).subscribe((res: any) => {
        return this.mandats = res
      })
    } else if (type == 'LOT') {
      this.name = true
      this.bien = false
      this.categorie = true
      this.nameTitle = 'Numéro de lot'
      this.categorieTitle = 'Type de lot'
      this.etat = false
      this.typeRow = [
        { label: 'LOT', value: 'LOT' },
        { label: 'INFRASTRUCTURE', value: 'INFRASTRUCTURE' },
      ];
      this.categorieRow = [
        { label: 'VERTICAL', value: 'VERTICAL' },
        { label: 'HORIZONTAL', value: 'HORIZONTAL' },
      ];
     
      this.homeCoService.getList(this.syndicService.uuid ).subscribe((res: any) => {
        return this.houses = res
      })
      // this.rentalService.getList(null, null, null, this.syndicService.uuid).subscribe((res: any) => {
      //   return this.rentals = res
      // })
    } else if (type === 'INFRASTRUCTURE') {
      this.categorie = true
      this.name = true
      this.bien = true
      this.nameTitle = 'Numéro de lot'
      this.categorieTitle = 'Type d\'infrastructure'
      this.bienTitle = 'Libellé infrastucture'
      this.etat = false
      this.categorieRow = [
        { label: 'Ascenseur', value: 'ASCENSEUR' },
        { label: 'Partie commune', value: 'PARTIE COMMUNE' },
        { label: 'Parking', value: 'PARKING' },
        { label: 'Jardin', value: 'JARDIN' },
        { label: 'Piscine', value: 'PISCINE' },
        { label: 'Aire de jeux', value: 'AIRE DE JEUX' }
      ];
      this.infrastructureService.getList(this.syndicService.uuid, null, null).subscribe((res: any) => {
        return this.infrastructures = res
      })
    } else if (type === 'COPROPRIETAIRE') {
      this.categorie = true
      this.categorieTitle = 'Type de copropriétaire'
      this.bien = false
      this.nameTitle = 'Nom & prénoms / Raison sociale'
      this.etat = false
      this.typeRow = [
        { label: 'COPROPRIETAIRE', value: 'CO-PROPRIETAIRE' },
      ];
      this.categorieRow = [
        { label: 'PARTICULIER', value: 'PARTICULIER' },
        { label: 'ENTREPRISE', value: 'ENTREPRISE' },
      ];
            
      this.ownerCoService.getList(null, this.syndicService.uuid).subscribe((res: any) => {
        return this.owners = res
      })
    } else if (type === 'FOURNISSEUR') {
      this.name = true
      this.nameTitle = 'Facture'
      this.bien = false
      this.nameTitle = 'Nom & prénoms'
      this.categorie = false
      this.etat = true
      this.etatTitle = 'Type'
      this.etatRow = [
        { label: 'PARTICULIER', value: 'PARTICULIER' },
        { label: 'ENTREPRISE', value: 'ENTREPRISE' },
      ];
      this.providerService.getList(this.syndicService.uuid).subscribe((res: any) => {
        return this.providers = res
      })
    } else if (type === 'INTERVENTION') {
      this.name = true
      this.nameTitle = 'Nom du lot'
      this.bien = true
      this.etat = false
      this.bienTitle = 'Libellé'
      this.categorie = false
      this.constructionService.getList(this.syndicService.uuid).subscribe((res: any) => {
        return this.interventions = res
      })
    } else if (type === 'FACTURE') {
      this.bien = true
      this.bienTitle = 'Libellé'
      this.name = true
      this.nameTitle = 'Intervention'
      this.autre = true
      this.autreTitle = 'Fournisseur'
      this.categorie = false
      this.etat = true
      this.etatRow = [
        { label: 'PAYE', value: 'PAYE' },
        { label: 'IMPAYE', value: 'IMPAYE' },
        { label: 'ATTENTE', value: 'ATTENTE' },
      ]
      this.typeRow = [
        { label: 'FACTURE', value: 'FACTURE' },
        { label: 'FOURNISSEUR', value: 'FOURNISSEUR' },
        { label: 'DEVIS', value: 'DEVIS' },
        { label: 'INTERVENTION', value: 'INTERVENTION' },
      ];
      this.invoiceCoService.getList(null, null, this.syndicService.uuid).subscribe((res: any) => {
        return this.invoiceCos = res
      })
    } else if (type === 'DEVIS') {
      this.categorie = false
      this.bien = true
      this.bienTitle = 'Libellé'
      this.name = true
      this.nameTitle = 'Intervention'
      this.autre = true
      this.etat = false
      this.autreTitle = 'Fournisseur'
      this.quoteService.getList(null, null, this.syndicService.uuid, 0).subscribe((res: any) => {
        return this.quotes = res
      })
    } else if (type === 'BUDGET') {
      this.bien = false
      this.name = true
      this.autre = false
      this.nameTitle = 'Libellé'
      this.categorie = false
      this.etat = false
      this.typeRow = [
        { label: 'BUDGET', value: 'BUDGET' }
      ]
      this.budgetService.getList(null, null, this.syndicService.uuid).subscribe((res: any) => {
        return this.budgets = res
      })
    } else if (type === 'APPEL') {
      this.bien = true
      this.bienTitle = 'Libellé'
      this.categorieTitle = 'Catégorie'
      this.categorie = true
      this.etat = false
      this.etat = false
      this.name = false
      this.code = true;
      this.typeRow = [
        { label: 'APPEL DE CHARGE', value: 'APPEL' },
        { label: 'RÈGLEMENT', value: 'PROVISION' },
      ];
      this.etatRow = [
        { label: 'EN COURS', value: 'EN COURS' },
        { label: 'PAYER', value: 'PAYER' },
        { label: 'IMPAYER', value: 'IMPAYER' },
      ]
      this.categorieRow = [
        { label: 'GENERAL', value: 'GENERAL' },
        { label: 'RESERVE', value: 'RESERVE' },
      ]
      this.fundsapealService.getList(this.syndicService.uuid, null).subscribe((res: any) => {
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
    } else if (type === 'AVIS') {
      this.name = false
      this.nameTitle = 'Libellé'
      this.typeRow = [
        { label: 'AVIS D\'ECHEANCE', value: 'AVIS' }
      ]
      this.fundsNoticeService.getList(this.syndicService.uuid, null).subscribe((res: any) => {
        return this.fundsNotices = res
      })
    } else if (type === 'PROVISION') {
      this.bien = true
      this.name = true
      this.etat = false
      this.categorie = false;
      this.nameTitle = 'Copropriétaire'
      this.bienTitle = 'Libellé'
      this.etat = false
      this.categorieRow = [
        { label: 'GENERAL', value: 'GENERAL' },
        { label: 'RESERVE', value: 'RESERVE' },
      ]
      this.fundsPaymentService.getList(this.syndicService.uuid, null).subscribe((res: any) => {
        return this.fundsPayments = res
      })
    }
  }

  // Les ajouts
  add(type: string) {
    if (type === 'LOT') {
      this.modalService.dismissAll()
      this.syndicService.setSyndic(this.syndic);
      this.coproprieteService.edit = false
      this.coproprieteService.type = 'SYNDIC'
      this.coproprieteService.uuidSyndic = this.route.snapshot.params.id
      this.modal(CondominiumAddComponent, 'modal-basic-title', 'xl', true, 'static',)
    } else if (type === 'MANDAT') {
      this.mandateSyndicService.edit = false
      this.mandateSyndicService.type = 'SYNDIC'
      this.mandateSyndicService.uuidSyndic = this.route.snapshot.params.id
      this.modal(SyndicMandateAddComponent, 'modal-basic-title', 'xl', true, 'static')
    } else if (type === 'COPROPRIETAIRE') {
      this.modalService.dismissAll();
      this.ownerService.uuidSyndic = this.route.snapshot.params.id
      this.modal(PopComponent, 'modal-basic-title', 'md', true, 'static');
    } else if (type === 'PROVISION') {
      this.modalService.dismissAll();
      this.fundsPaymentService.edit = false;
      this.fundsPaymentService.type = 'SYNDIC';
      this.fundsPaymentService.uuidSyndic = this.route.snapshot.params.id;
      this.modal(FundsPaymentAddComponent, 'modal-basic-title', 'xl', true, 'static')
    } else if (type === 'INFRASTRUCTURE') {
      this.infrastructureService.edit = false
      this.infrastructureService.type = 'SYNDIC'
      this.infrastructureService.uuidSyndic = this.route.snapshot.params.id
      this.modal(InfrastructureAddComponent, 'modal-basic-title', 'xl', true, 'static');
    } else if (type === 'BUDGET') {
      this.modalService.dismissAll();
      this.budgetService.edit = false;
      this.budgetService.type = 'SYNDIC'
      this.budgetService.uuidSyndic = this.route.snapshot.params.id
      this.modal(BudgetAddComponent, 'modal-basic-title', 'xl', true, 'static');
    } else if (type === 'FACTURE') {
      this.modalService.dismissAll();
      this.invoiceCoService.edit = false;
      this.invoiceCoService.setSyndic(this.syndic);
      this.modal(InvoiceCoAddComponent, 'modal-basic-title', 'xl', true, 'static');
    }
  }

  showHouse(row, type) {
    this.coproprieteService.setCopropriete(row)
    this.coproprieteService.exit = 'SYNDIC_SHOW'
    this.coproprieteService.uuidSyndic = this.route.snapshot.params.id
    this.router.navigate(['/admin/syndic/copropriete/show/' + row.uuid]);
  }


  
  editHouse(row){
    this.coproprieteService.setCopropriete(row)
    this.coproprieteService.edit = true
    this.modal(SyndicCondominiumAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }



  showOwner(row) {
    this.ownerService.setOwner(row);
    this.router.navigate(['/admin/proprietaire/show/' + row.uuid]);
  }

  editOwner(row) {
    this.ownerService.setOwner(row);
    this.ownerService.edit = true;
    this.ownerService.type = row.type;
    this.modal(OwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printerOwner(row): void {
    this.ownerCoService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid, null);
  }

  editProvider(row) {
    this.providerService.setProvider(row)
    this.providerService.edit = true
    this.modal(ProviderAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  showProvider(row) {
    this.providerService.setProvider(row)
    this.router.navigate(['/admin/prestataire/show/' + row.uuid]);
  }

  showConstruction(row) {
    this.constructionService.setConstruction(row);
    this.router.navigate(['/admin/intervention/show/' + row.uuid]);
  }

  printerConstruction(row): void {
    this.constructionService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  editConstruction(row) {
    this.constructionService.setConstruction(row);
    this.constructionService.edit = true;
    this.constructionService.type = row.type;
    this.modal(ConstructionAddComponent, 'modal-basic-title', 'lg', true, 'static');
    this.modelRef.componentInstance.type = this.constructionService.type == "SYNDIC" ? "SYNDIC" : "LOCATIVE"
  }

  edit(row, type) {
    this.budgetService.setBudget(row);
    this.budgetService.edit = true;
    this.budgetService.type = 'SYNDIC'
    this.budgetService.uuidSyndic = row?.trustee?.uuid
    this.modal(BudgetAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printerBudget(row): void {
    this.budgetService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid, 'BUDGET');
  }

  printSyndic(item){
    this.syndicService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, item?.uuid);
  }


  generateFundsApeals(item, type) {
    let text = "";
    if (type == 'GENERAL') {
      text = 'généraux';
    }
    else if (type == 'RESERVE') {
      text = 'de réserve';
    }

    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment générer les appels de charges ' + text + ' ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.fundsapealService.generateFundsApeal(item.uuid, item.trustee.uuid, type).subscribe(res => {
          if (res?.code === 200) {
            Swal.fire('Succès', 'Les appels de charges ' + text + ' ont été générés avec succès', 'success');
          }
        }, error => {
          Swal.fire('', error.error?.message, 'error');
        })
      }
    });
  }

  generateStaticFundsApeals(uuid, budgetUuid) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment générer les appels de charges ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.fundsapealService.generateFundsApeal(budgetUuid, uuid).subscribe(res => {
          if (res?.code === 200) {
            Swal.fire('Succès', 'Les appels de charges ont été générés avec succès', 'success');
          }
        }, error => {
          Swal.fire('', error.error?.message, 'error');
        })
      }
    });
  }

  deleteBudget(item) {
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
        this.budgetService.getDelete(item.uuid).subscribe(res => {
          if (res?.code === 200) {
            const index = this.budgets.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.budgets.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
          Swal.fire('', error.message, 'error');
        })
      }
    });
  }

  deleteSyndic(item) {
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
        this.syndicService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            this.router.navigate(['admin/syndic'])
          }
        });
      }
    });
  }


  show(row, type) {
    this.budgetService.setBudget(row);
    this.budgetService.setType(type);
    if (type == 'SHOW') {
      this.router.navigate(['/admin/budget/show/' + row.uuid]);
    } else {
      this.modal(BudgetDevelopComponent, 'modal-basic-title', 'xl', true, 'static')
      this.onChangeLoad(false, 'BUDGET');
    }
  }


  deleteConstruction(construction) {
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
        this.constructionService.getDelete(construction.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.interventions.findIndex(x => x.uuid === construction.uuid);
            if (index !== -1) {
              this.interventions.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
        });
        Swal.fire('', 'Enrégistrement supprimé avec succès !', 'success');
      }
    });
  }

  deleteProvider(item) {
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
        this.providerService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.providers.findIndex(x => x.id === item.id);
            if (index !== -1) {
              this.providers.splice(index, 1);
            }
            Swal.fire('', res?.message, 'success');
          }
        });
      }
    });
  }

  deleteOwner(item) {
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

  printHouse(row) {
    if (row.type === 'VERTICAL') {
      this.coproprieteService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row?.trustee?.uuid, row.uuid);
    }
    else if (row.type === 'HORIZONTAL') {
      this.homeService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row?.trustee?.uuid, row.uuid);
    }
  }

  delete(item) {
    console.log('Lot', item);
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
          this.homeService.getDelete(item?.uuid).subscribe((res: any) => {
            if (res?.status === 'success') {
              const index = this.houses.findIndex(x => x.id === item.id);
              if (index !== -1) { this.houses.splice(index, 1); }
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

  showInfrastructure(item) {
    this.infrastructureService.setInfrastructure(item)
    this.modal(InfrastructureShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }

  validation(item,etat) {
    Swal.fire({
      title: '',
      text: etat == 'VALIDE' ? 'Voulez-vous vraiment valider ce budget ': 'Voulez-vous vraiment clôturer ce budget',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        if(etat == 'VALIDE') {
          let data = {
            'uuid':item.uuid,
            'etat':'VALIDE',
          }
          this.budgetService.validate(data).subscribe(
            (res) => {
              if (res?.status === 'success') {
                this.emitter.emit({
                  action: 'BUDGET_UPDATE',
                  payload: res?.data,
                });
              }
            },
            (error) => {}
          );
        }
        if(etat == 'CLOTURE') {
          let data = {
            'uuid':item.uuid,
            'etat':'CLOTURE',
          }
          this.budgetService.cloture(data).subscribe(
            (res) => {
              if (res?.status === 'success') {
                this.emitter.emit({
                  action: 'BUDGET_UPDATE',
                  payload: res?.data,
                });
              }
            },
            (error) => {}
          );
        }
      }
    });
  }

  editInfrastructure(item) {
    this.infrastructureService.setInfrastructure(item)
    this.infrastructureService.edit = true
    this.modal(InfrastructureAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printInfrastructure(item) {
  }

  deleteInfrastructure(item) {
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
        this.infrastructureService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.infrastructures.findIndex(x => x.id === item.id);
            if (index !== -1) { this.infrastructures.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }

  showMandate(item) {
    this.mandateSyndicService.setMandat(item)
    this.modal(SyndicMandateShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  editMandate(item) {
    this.mandateSyndicService.setMandat(item)
    this.mandateSyndicService.edit = true
    this.modal(SyndicMandateAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printMandate(item) {

  }

  deleteMandat(item) {
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
        this.mandateSyndicService.getDelete(item?.uuid).subscribe((res: any) => {
          this.emitter.loading();
          if (res?.status === 'success') {
            const index = this.mandats.findIndex(x => x.id === item.id);
            if (index !== -1) { this.mandats.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
          this.syndicService.getSingle(this.syndicService.uuid).subscribe((res: any) => {
            return this.syndic = res
          })
          this.emitter.stopLoading();
        });
      }
    });
  }

  compteArebouse() {
    this.syndicService.getSingle(this.syndicService.uuid).subscribe((res: any) => {

      this.dateExiste = res?.currentMandate?.dateD && res?.currentMandate?.dateF ? true : false
      this.startDate = new Date(res?.currentMandate?.dateD); // Date de départ
      this.endDate = new Date(res?.currentMandate?.dateF); // Date d'arrivée

      setInterval(() => {
        this.calculateCountdown();
      }, 1000);
    })
  }

  calculateCountdown() {
    const currentTime = new Date().getTime();
    const remainingTime = this.endDate.getTime() - currentTime;

    this.countdown.days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    this.countdown.hours = Math.floor(
      (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    this.countdown.minutes = Math.floor(
      (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    this.countdown.seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {
      if (result == 'OWNER') {
        this.ownerService.getList(this.route.snapshot.params.id).subscribe((res: any) => {
          return this.owners = res
        })
      } else if (result == 'COPROPRIETE') {
        this.homeCoService.getList(this.route.snapshot.params.id, null, null, null).subscribe((res: any) => {
          return this.coproprietes = res
        })
      } else if (result == 'INFRASTRUCTURE') {
        this.infrastructureService.getList(this.route.snapshot.params.id, null, null).subscribe((res: any) => {
          return this.infrastructures = res
        })
      } else if (result == 'PROVISION') {
        this.fundsapealService.getList(this.route.snapshot.params.id, null).subscribe((res: any) => {
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
        this.fundsPaymentService.getList(this.route.snapshot.params.id, null, null).subscribe((res: any) => {
          return this.fundsPayments = res
        })
      } else if (result === 'SYNDIC' || result === 'MANDAT') {
        this.syndicService.getSingle(this.route.snapshot.params.id).subscribe((res) => {
          return this.syndic = res
        })
        this.mandateSyndicService.getList(this.route.snapshot.params.id, null).subscribe((res: any) => {
          return this.mandats = res
        })
      }
    }, (reason) => { });
  }

  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }

  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }

  onSubStringLongName(str: string): any {
    if (str !== null) {
      if (str.length > 35) {
        return str.substring(0, 35) + ' ...';
      } else {
        return str;
      }
    } else {
      return '';
    }
  }

  showOwnerCo(row) {
    this.ownerCoService.setOwnerCo(row);
    this.router.navigate(['/admin/syndic/coproprietaire/show/' + row.uuid]);
  }

  editOwnerCo(row) {
    this.ownerCoService.setOwnerCo(row);
    this.ownerCoService.edit = true;
    this.ownerCoService.type = row.type;
    this.modal(OwnerCoAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  onPrinter() {
    if (this.activeTab === 'SYNDIC') {
      //this.syndicService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
    else if (this.activeTab === 'MANDAT') {
      this.mandateSyndicService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, this.syndic.uuid);
    }
    else if (this.activeTab === 'MANDAT') {
      this.mandateSyndicService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter), this.syndic.uuid;
    }
    else if (this.activeTab === 'LOT') {
      this.homeCoService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, this.syndic.uuid);
    }
    else if (this.activeTab === 'INFRASTRUCTURE') {
      this.infrastructureService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, this.syndic.uuid);
    }
    else if (this.activeTab === 'APPEL') {
      this.fundsapealService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, this.syndic.uuid);
    }
    else if (this.activeTab === 'PROVISION') {
      this.fundsPaymentService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, this.syndic.uuid);
    }
    else if (this.activeTab === 'COPROPRIETAIRE') {
      this.ownerService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, this.syndic.uuid);
    }
  }

  onExport() {
    if (this.type === 'SYNDIC') {
      //this.syndicService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }

  back() { this.router.navigate(['/admin/syndic']) }

  timelapse(dateD, dateF): string { return DateHelperService.getTimeLapse(dateD, dateF, false, 'dmy'); }

}
