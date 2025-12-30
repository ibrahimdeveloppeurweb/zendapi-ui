import { Quote } from '@model/quote';
import { QuoteOwner } from '@model/quote-owner';
import { Funding } from '@model/funding';
import { Globals } from '@theme/utils/globals';
import { Production } from '@model/production';
import { Component, OnInit } from '@angular/core';
import { Construction } from '@model/construction';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentFunding } from '@model/payment-funding';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteService } from '@service/quote/quote.service';
import { QuoteOwnerService } from '@service/quote-owner/quote-owner.service';
import { FilterService } from '@service/filter/filter.service';
import { FundingService } from '@service/funding/funding.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { ProductionService } from '@service/production/production.service';
import { ConstructionService } from '@service/construction/construction.service';
import { PaymentFundingService } from '@service/payment-funding/payment-funding.service';
import { ConstructionAddComponent } from '@chantier/construction/construction-add/construction-add.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { InvoiceCo } from '@model/prestataire/invoice-co';
import { InvoiceCoService } from '@service/invoice-co/invoice-co.service';
import { QuoteAddComponent } from '@agence/chantier/quote/quote-add/quote-add.component';
import { QuoteOwnerAddComponent } from '@agence/chantier/quote-owner/quote-owner-add/quote-owner-add.component';
import { InvoiceCoAddComponent } from '@agence/chantier/invoice-co/invoice-co-add/invoice-co-add.component';
import { FundingAddComponent } from '@agence/chantier/funding/funding-add/funding-add.component';
import { ProductionAddComponent } from '@agence/chantier/production/production-add/production-add.component';
import { Location } from '@angular/common';
import { Ticket } from '@model/ticket';
import { EmitterService } from '@service/emitter/emitter.service';
import { InvoiceOwnerAddComponent } from '@agence/chantier/invoice-owner/invoice-owner-add/invoice-owner-add.component';
import { InvoiceOwnerService } from '@service/invoice-owner/invoice-owner.service';
import { InvoiceOwner } from '@model/invoice-owner';

@Component({
  selector: 'app-construction-show',
  templateUrl: './construction-show.component.html',
  styleUrls: ['./construction-show.component.scss']
})
export class ConstructionShowComponent implements OnInit {
  public activeTab: string = 'INTERVENTION';
  construction: Construction;
  ticket: Ticket;
  constructionVal: boolean = false;
  prestataire: boolean = true;
  
  // Données
  quotes: Quote[] = [];
  quoteOwners: QuoteOwner[] = [];
  bons: Quote[] = [];
  bonOwners: QuoteOwner[] = [];
  invoices: InvoiceCo[] = [];
  invoicesOwners: InvoiceOwner[] = [];
  productions: Production[] = [];
  fundings: Funding[] = [];
  payments: PaymentFunding[] = [];
  file: any;
  
  type: string = 'INTERVENTION';
  name: boolean = true;
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user;
  modelRef: NgbModalRef;
  
  // Configuration des filtres
  etatRow = [
    { label: 'DISPONIBLE', value: 'DISPONIBLE' },
    { label: 'VENDU', value: 'VENDU' }
  ];
  typeRow = [
    { label: 'INTERVENTION', value: 'INTERVENTION' },
    { label: 'DEVIS', value: 'DEVIS' },
    { label: 'BON DE COMMANDE', value: 'BON' },
    { label: 'FINANCEMENT', value: 'FINANCEMENT' },
    { label: 'REALISATION', value: 'REALISATION' },
    { label: 'PAIEMENT', value: 'PAIEMENT' }
  ];
  categorieRow = [
    { label: 'EN LOCATION', value: 'LOCATION' },
    { label: 'EN VENTE', value: 'VENTE' }
  ];
  nameTitle: string = "Nom du bien";
  userTitle: string = "Crée par";
  minTitle: string = "Montant MIN";
  maxTitle: string = "Montant MAX";
  categorieTitle: string = "Type de bien";
  etatTitle: string = "Disponibilité ?";

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private quoteService: QuoteService,
    private quoteOwnerService: QuoteOwnerService,
    private filterService: FilterService,
    private fundingService: FundingService,
    private invoiceService: InvoiceCoService,
    private invoiceOwnerService: InvoiceOwnerService,
    private productionService: ProductionService,
    private paymentService: PaymentFundingService,
    private constructionService: ConstructionService,
    private permissionsService: NgxPermissionsService
  ) {
    this.onChangeLoad(this.type);
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    console.log("🏗️ Initialisation ConstructionShowComponent");
    
    if (!this.construction) {
      this.constructionService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        this.ticket = res?.ticket;
        this.construction = res;
        console.log("✅ Construction chargée:", this.construction);
      });
    }

    // Écouter les événements
    this.emitter.event.subscribe((data) => {
      console.log("🔔 Événement reçu:", data);
      this.handleEmitterEvents(data);
    });
  }

  handleEmitterEvents(data: any): void {
    switch (data.action) {
      case 'QUOTE_ADD':
      case 'QUOTE_UPDATED':
      case 'QUOTE_VALIDATE':
        if (this.activeTab === 'DEVIS') {
          this.loadQuotes();
        } else if (this.activeTab === 'BON') {
          this.loadBons();
        }
        break;
      
      case 'QUOTE_OWNER_ADD':
      case 'QUOTE_OWNER_UPDATED':
      case 'QUOTE_OWNER_VALIDATE':
        if (this.activeTab === 'DEVIS_OWNER') {
          this.loadQuoteOwners();
        } else if (this.activeTab === 'BON_OWNER') {
          this.loadBonOwners();
        }
        break;
      
      case 'FUNDING_ADD':
      case 'FUNDING_UPDATED':
      case 'FUNDING_VALIDATE':
        this.loadFundings();
        break;
      
      case 'PRODUCTION_ADD':
      case 'PRODUCTION_UPDATED':
        this.loadProductions();
        break;
    }
  }

  onFilter($event) {
    console.log("🔍 Filtrage:", $event);
    this.quotes = [];
    this.quoteOwners = [];
    this.bons = [];
    this.bonOwners = [];
    this.productions = [];
    this.fundings = [];
    this.payments = [];
    
    $event.type = this.activeTab;
    this.filterService.search($event, 'construction', this.construction.uuid).subscribe(
      res => {
        if (this.activeTab === 'DEVIS') {
          this.quotes = res;
        } else if (this.activeTab === 'DEVIS_OWNER') {
          this.quoteOwners = res;
        } else if (this.activeTab === 'BON') {
          this.bons = res;
        } else if (this.activeTab === 'BON_OWNER') {
          this.bonOwners = res;
        } else if (this.activeTab === 'FACTURE') {
          this.invoices = res;
        }  else if (this.activeTab === 'FACTURE_OWNER') {
          this.invoicesOwners = res;
        }else if (this.activeTab === 'FINANCEMENT') {
          this.fundings = res;
        } else if (this.activeTab === 'REALISATION') {
          this.productions = res;
        } else if (this.activeTab === 'PAIEMENT') {
          this.payments = res;
        }
      }, err => {
        console.error("❌ Erreur filtrage:", err);
      }
    );
  }

  onChangeLoad(type): void {
    console.log("📑 Changement d'onglet:", type);
    this.activeTab = type;
    
    if (type === 'INTERVENTION') {
      if (!this.construction) {
        this.constructionService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          this.construction = res?.data;
        });
      }
    } else if (type === 'DEVIS') {
      this.configureFilters('DEVIS', 'Libellé', 'Type', 'PRESTATION', 'FOURNITURE');
      this.loadQuotes();
    } else if (type === 'DEVIS_OWNER') {
      this.configureFilters('DEVIS_OWNER', 'Libellé', 'Type', 'PRESTATION', 'FOURNITURE');
      this.loadQuoteOwners();
    } else if (type === 'BON') {
      this.configureFilters('BON', 'Libellé', 'Type', 'FOURNITURE');
      this.loadBons();
    } else if (type === 'BON_OWNER') {
      this.configureFilters('BON_OWNER', 'Libellé', 'Type', 'FOURNITURE');
      this.loadBonOwners();
    } else if (type === 'FACTURE') {
      this.configureFilters('FACTURE', 'Libellé', 'Type', 'FACTURE');
      this.loadInvoices();
    }else if (type === 'FACTURE_OWNER') {
      this.configureFilters('FACTURE_OWNER', 'Libellé', 'Type', 'FACTURE');
      this.loadInvoicesOwner();
    }else if (type === 'FINANCEMENT') {
      this.configureFilters('FINANCEMENT', null, 'Financeur', 'AGENCE', 'PROPRIETAIRE');
      this.loadFundings();
    } else if (type === 'REALISATION') {
      this.configureFilters('REALISATION', null, null);
      this.loadProductions();
    } else if (type === 'PAIEMENT') {
      this.configureFilters('PAIEMENT', null, null);
      this.loadPayments();
    } else if (type === 'TICKET') {
      this.typeRow = [{ label: 'TICKET', value: 'TICKET' }];
      this.categorieRow = [];
    }
  }

  private configureFilters(type: string, nameTitle?: string, categorieTitle?: string, ...categories: string[]): void {
    let label = type;
    if (label === 'DEVIS_OWNER') label = 'DEVIS PROPRIETAIRE';
    if (label === 'BON_OWNER') label = 'BON PROPRIETAIRE';
    if (label === 'FACTURE_OWNER') label = 'FACTURE PROPRIETAIRE';
    
    this.typeRow = [{ label: label, value: type }];
    this.name = !nameTitle;
    if (nameTitle) this.nameTitle = nameTitle;
    if (categorieTitle) this.categorieTitle = categorieTitle;
    
    this.etatTitle = 'Etat';
    this.etatRow = [
      { label: 'VALIDE', value: 'VALIDE' },
      { label: 'INVALIDE', value: 'INVALIDE' }
    ];
    
    if (categories.length > 0) {
      this.categorieRow = categories.map(cat => ({ label: cat, value: cat }));
    } else {
      this.categorieRow = [];
    }
  }

  // ==================== CHARGEMENT DES DONNÉES ====================

  private loadQuotes(): void {
    console.log("📋 Chargement des devis prestataire...");
    this.quoteService.getList(this.construction.uuid, 'PRESTATION').subscribe((res) => {
      this.quotes = res;
      console.log("✅ Devis prestataire chargés:", this.quotes.length);
    }, error => {
      console.error("❌ Erreur chargement devis:", error);
    });
  }

  private loadQuoteOwners(): void {
    console.log("📋 Chargement des devis propriétaire...");
    this.quoteOwnerService.getList(this.construction.uuid,'PRESTATION').subscribe((res: QuoteOwner[]) => {
      this.quoteOwners = res.filter(q => !q.isBon);
      console.log("✅ Devis propriétaire chargés:", this.quoteOwners.length);
    }, error => {
      console.error("❌ Erreur chargement devis propriétaire:", error);
    });
  }

  private loadBons(): void {
    console.log("📋 Chargement des bons de commande prestataire...");
    this.quoteService.getList(this.construction.uuid, 'PRESTATION', null, 1).subscribe((res) => {
      this.bons = res;
      console.log("✅ Bons prestataire chargés:", this.bons.length);
    }, error => {
      console.error("❌ Erreur chargement bons:", error);
    });
  }

  private loadBonOwners(): void {
    this.quoteOwnerService.getList(this.construction.uuid, 'PRESTATION', null, 1,null).subscribe((res) => {
      this.bonOwners = res;
    }, error => {
      console.error("❌ Erreur chargement bons propriétaire:", error);
    });
  }

  private loadInvoices(): void {
    console.log("📋 Chargement des factures...");
    this.invoiceService.getList(this.construction.uuid, 'PRESTATION').subscribe((res) => {
      this.invoices = res;
      console.log("✅ Factures chargées:", this.invoices.length);
    }, error => {
      console.error("❌ Erreur chargement factures:", error);
    });
  }

  private loadInvoicesOwner(): void {
    this.invoiceOwnerService.getList(this.construction.uuid, 'PRESTATION').subscribe((res) => {
      this.invoicesOwners = res;
      console.log("✅ Factures chargées:", this.invoicesOwners.length);
    }, error => {
      console.error("❌ Erreur chargement factures:", error);
    });
  }

  private loadFundings(): void {
    console.log("💰 Chargement des financements...");
    this.fundingService.getList(this.construction.uuid).subscribe((res) => {
      this.fundings = res;
      console.log("✅ Financements chargés:", this.fundings.length);
    }, error => {
      console.error("❌ Erreur chargement financements:", error);
    });
  }

  private loadProductions(): void {
    console.log("🏭 Chargement des réalisations...");
    this.productionService.getList(this.construction.uuid).subscribe((res) => {
      this.productions = res;
      console.log("✅ Réalisations chargées:", this.productions.length);
    }, error => {
      console.error("❌ Erreur chargement réalisations:", error);
    });
  }

  private loadPayments(): void {
    console.log("💳 Chargement des paiements...");
    this.paymentService.getList(null, this.construction.uuid).subscribe((res) => {
      this.payments = res;
      console.log("✅ Paiements chargés:", this.payments.length);
    }, error => {
      console.error("❌ Erreur chargement paiements:", error);
    });
  }

  // ==================== ACTIONS D'AJOUT ====================

  addQuote(type) {
    console.log("➕ Ajout devis prestataire");
    this.modalService.dismissAll();
    this.quoteService.edit = false;
    this.quoteService.construction = this.construction;
    this.modal(QuoteAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = type ?? "LOCATIVE";
  }

  addQuoteOwner(type) {
    this.modalService.dismissAll();
    this.quoteOwnerService.edit = false;
    this.quoteService.construction = this.construction;
    this.modal(QuoteOwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = type ?? "LOCATIVE";
    this.modelRef.componentInstance.isBon = false;
  }

  addBon(type?) {
    console.log("➕ Ajout bon de commande prestataire");
    this.modalService.dismissAll();
    this.quoteService.edit = false;
    this.quoteService.construction = this.construction;
    this.modal(QuoteAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = type ?? "LOCATIVE";
    this.modelRef.componentInstance.isBon = true;
  }

  addBonOwner(type?) {
    this.modalService.dismissAll();
    this.quoteOwnerService.edit = false;
    this.quoteService.construction = this.construction;
    this.modal(QuoteOwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = type ?? "LOCATIVE";
    this.modelRef.componentInstance.isBon = true;
  }

  addInvoiceCo(type?) {
    console.log("➕ Ajout facture");
    this.modalService.dismissAll();
    this.quoteService.edit = false;
    this.quoteService.construction = this.construction;
    this.modal(InvoiceCoAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = type ?? "LOCATIVE";
  }

  addInvoiceOwner(type?) {
    console.log("➕ Ajout facture");
    this.modalService.dismissAll();
    this.invoiceOwnerService.edit = false;
    this.invoiceOwnerService.construction = this.construction;
    this.modal(InvoiceOwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = type ?? "LOCATIVE";
  }

  addProduction() {
    console.log("➕ Ajout réalisation");
    this.modalService.dismissAll();
    this.productionService.edit = false;
    this.productionService.construction = this.construction;
    this.modal(ProductionAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }


  addFunding() {
    console.log("➕ Ajout financement");
    this.modalService.dismissAll();
    this.fundingService.edit = false;
    this.fundingService.construction = this.construction;
    this.modal(FundingAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  // ==================== AUTRES ACTIONS ====================

  editConstruction(row) {
    console.log("✏️ Édition construction");
    this.constructionService.setConstruction(row);
    this.constructionService.edit = true;
    this.constructionService.type = row.type;
    this.modal(ConstructionAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printerConstruction(row): void {
    console.log("🖨️ Impression construction");
    this.constructionService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.constructionService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            this.router.navigate(['/admin/intervention']);
          }
        });
      }
    });
  }

  showFile(folder): void {
    // TODO: Implémenter la visualisation des fichiers
    console.log("👁️ Affichage fichier:", folder);
  }

  closeViewer(): void {
    this.file = null;
  }

  back() {
    this.location.back();
  }

  modal(component, type, size, center, backdrop, inputs?) {
    this.modelRef = this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    });
  }

  /**
   * Calcule l'évolution GLOBALE des réalisations pour une construction
   * Utilise exactement la même logique que getGlobalProgress() dans production-show
   * Calcule le pourcentage basé sur toutes les optionProductions
   * Les optionProductions peuvent être dans construction.production.optionProductions ou construction.optionProductions
   */
  getEvolution(): number {
    if (!this.construction) {
      return 0;
    }
    
    // Récupérer les optionProductions (peuvent être dans production ou directement dans construction)
    let optionProductions: any[] = [];
    
    if (this.construction?.production?.optionProductions && Array.isArray(this.construction.production.optionProductions) && this.construction.production.optionProductions.length > 0) {
      optionProductions = this.construction.production.optionProductions;
    } else if (this.construction?.optionProductions && Array.isArray(this.construction.optionProductions) && this.construction.optionProductions.length > 0) {
      optionProductions = this.construction.optionProductions;
    }
    
    // Si pas d'optionProductions, retourner 0
    if (optionProductions.length === 0) {
      return 0;
    }
    
    // Calculer l'évolution globale : nombre de tâches terminées / nombre total de tâches
    let total = 0;
    let completed = 0;
    
    optionProductions.forEach((option: any) => {
      total++;
      if (option?.evolution === true || option?.evolution === 'true') {
        completed++;
      }
    });
    
    return total > 0 ? Math.floor((completed * 100) / total) : 0;
  }

  formatDate(date): string {
    return DateHelperService.fromJsonDate(date);
  }

  timelapse(dateD, dateF): string {
    return DateHelperService.getTimeLapse(dateD, dateF, false, 'dmy');
  }
}