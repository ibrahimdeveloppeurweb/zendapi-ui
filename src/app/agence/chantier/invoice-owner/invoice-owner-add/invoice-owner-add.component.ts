import { Component, Input, OnInit } from '@angular/core';
import { Construction } from '@model/construction';
import { Quote } from '@model/quote';
import { QuoteOwner } from '@model/quote-owner';
import { QuoteService } from '@service/quote/quote.service';
import { ProductService } from '@service/product/product.service';
import { Globals } from '@theme/utils/globals';
import { Provider } from '@model/provider';
import { EmitterService } from '@service/emitter/emitter.service';
import { ConstructionService } from '@service/construction/construction.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { ToastrService } from 'ngx-toastr';
import { DateHelperService } from '@theme/utils/date-helper.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HouseCo } from '@model/syndic/house-co';
import { HomeCo } from '@model/syndic/home-co';
import { House } from '@model/house';
import { InfrastructureService } from '@service/syndic/infrastructure.service';
import { LoadCategory } from '@model/load-category';
import { UploaderService } from '@service/uploader/uploader.service';
import { TypeLoadService } from '@service/typeLoad/type-load.service';
import { TypeLoad } from '@model/typeLoad';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { OptionBudgetService } from '@service/option-budget/option-budget.service';
import { ProviderAddComponent } from '@agence/prestataire/provider/provider-add/provider-add.component';
import { ProviderService } from '@service/provider/provider.service';
import { QuoteOwnerService } from '@service/quote-owner/quote-owner.service';
import { InvoiceOwnerService } from '@service/invoice-owner/invoice-owner.service';
import { InvoiceOwner } from '@model/invoice-owner';

@Component({
  selector: 'app-invoice-owner-add',
  templateUrl: './invoice-owner-add.component.html',
  styleUrls: ['./invoice-owner-add.component.scss']
})
export class InvoiceOwnerAddComponent implements OnInit {
  @Input() public type: string = "LOCATIVE"
  @Input() public isBon: boolean = false
  title: string = ""
  edit: boolean = false
  form: FormGroup
  submit: boolean = false
  invoiceOwner: InvoiceOwner
  provider: Provider
  construction: Construction
  devis: QuoteOwner
  trustee: any;
  houseCo: HouseCo;
  homeCo: HomeCo;
  infrastructure: any;
  nature: any;
  ligneBudgetaire: LoadCategory
  coproprietes: any[];
  houses: House[] = [];
  houseCos: HouseCo[] = [];
  homeCos: HomeCo[] = [];
  infrastructures: any[] = []
  typeLoads: TypeLoad[] = [];
  products: any[] = [];
  quotes: Quote[];
  bons: Quote[];
  devisRow: QuoteOwner[] = [];
  currentConstruction?: any;
  currentDevis?: any;
  devistSelected?: any;
  currentProduct?: any;
  currentProvider?: any;
  currentTrustee?: any;
  currentLigneBudgetaire?: any;
  selectRow = []
  totalHT = 0;
  totalTva = 0;
  totalTTC = 0;
  totalRemise = 0;
  totalDifference = 0; // Nouvelle variable pour la différence totale globale
  totalInitial = 0;
  required = Globals.required

  isLoadingHouseCo = false;
  isLoadingHomeCo = false;
  isLoadingInfrastructure = false
  isLoadingTypeLoad = false
  isLoadingConstruction = false
  canChangeProvider = true;

  selectedCopriete = {};

  constructor(
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private quoteService: QuoteService,
    private invoiceOwnerService: InvoiceOwnerService,
    private productService: ProductService,
    private uploadService: UploaderService,
    private providerService: ProviderService,
    private optionBudgetService: OptionBudgetService,
    private coproprieteService: CoproprieteService,
    private constructionService: ConstructionService,
    private infrastructureService: InfrastructureService
  ) {
    this.edit = this.invoiceOwnerService.edit
    this.invoiceOwner = this.invoiceOwnerService.getInvoiceOwner()
    this.newForm(); // Initialiser le formulaire d'abord
  }

  // Getter pour le titre du modal
  get modalTitle(): string {
    if (!this.edit) {
      return "Ajouter une facture " ;
    } else {
      return  "Modifier la facture "+ (this.invoiceOwner?.code || "") ;
    }
  }

  ngOnInit(): void {    
    this.configureValidation();
    
    // Charger les produits
    if (!this.edit  && this.products.length === 0) {
       this.productService.getList().subscribe((products) => {
      this.products = [...this.products, ...products];
    });
    }
    
    // Configuration de la construction
    if ( !this.edit && this.invoiceOwnerService?.construction != null) {
      this.setConstructionUuid(this.invoiceOwnerService?.construction?.uuid);
      this.currentConstruction = {
        title: this.invoiceOwnerService?.construction?.nom,
        detail: this.invoiceOwnerService?.construction?.telephone
      };
      
      // Charger les devis/bons SEULEMENT si construction existe et mode création
      if (!this.edit) {
        this.loadQuotesOrBons();
      }

   
    } else {
    }

 
    
    // Charger les données en mode édition
    if (this.edit) {
      this.editForm();
    }
    
  }

  /**
   * Méthode dédiée pour charger les devis ou bons de commande
   */
  private loadQuotesOrBons(): void {
    const constructionUuid = this.invoiceOwnerService.construction?.uuid;
    
    if (!constructionUuid) {
      return;
    }
    
    // Construire les paramètres selon le type (bon ou devis)

    this.quoteService.getList(constructionUuid, 'PRESTATION').subscribe((res) => {
      
      // Stocker dans la bonne variable selon le type
      this.quotes = res;
      
      // Créer un quotePrestataire pour chaque élément
      if (res && res.length > 0) {
        
        res.forEach((item: Quote, index: number) => {
          this.quotesPrestataires.push(this.createQuotePrestataire({
            uuid: item.uuid,
            id: item.id,
            type: item.type,
            echeance: item.echeance,
            date: item.date,
            providerUuid: item.provider?.uuid,
            prestataireNom: item.provider?.nom,
            montant: item.montant || 0,
            montantHt: item.montantHt || 0,
            montantTva: item.montantTva || 0,
            libelle: item.libelle,
            options: item.options || []
          }));
        });
        
        // Recalculer les totaux après l'ajout
        this.onChangeTotal();
      } else {
      }
    }, error => {
    });
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      libelle: [null, [Validators.required]],
      numero: [null, [Validators.required]],
      construction: [null],
      devis: [null],
      house: [null],
      trustee: [null],
      copropriete: [null],
      infrastructure: [null],
      ligneBudgetaire: [null],
      type: [null],
      prestation: [0],
      montantHt: [this.totalHT],
      montantRemise: [this.totalRemise],
      montantTva: [this.totalTva],
      montantDifference: [this.totalDifference],
      montant: [0],
      folderUuid: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      quotesPrestataires: this.formBuild.array([])
    });
  }

  // Créer un FormGroup pour un prestataire avec ses options
  createQuotePrestataire(data?: any) {
    return this.formBuild.group({
      uuid: [data?.uuid || null],
      id: [data?.id || null],
      libelle: [data?.libelle || null],
      type: [data?.type || null],
      echeance: [data?.echeance || null],
      date: [data?.date || null],
      provider: [data?.prestataireNom || null],
      providerUuid: [data?.providerUuid || null],
      montant: [data?.montant || 0],
      montantInitial: [data?.montant || 0], // Stocker le montant initial qui ne changera pas
      montantInitialPrestataire: [data?.montantInitialPrestataire || 0],
      montantHt: [data?.montantHt || 0],
      montantTva: [data?.montantTva || 0],
      montantDifference: [data?.montantDifference || 0], // Nouvelle ligne pour la différence totale
      options: this.formBuild.array(data?.options ? this.createOptionsFromData(data.options) : [])
    });
  }

  // Créer les options à partir des données existantes
  createOptionsFromData(options: any[]): FormGroup[] {
    const optionArray = Array.isArray(options) ? options : Object.values(options);
    return optionArray.map(item => this.createOption(item));
  }

  // Créer une option
  createOption(data?: any) {
    // Calcul du prix majoré par défaut (identique au prix initial si non défini)
    const prixInitial = data?.prix || 0;
    const prixMajore = data?.prixMajore || prixInitial;

    // Ajouter le produit personnalisé s'il n'existe pas
    if (data?.product == null && data?.libelle) {
      const exists = this.products.find(p => p.libelle === data?.libelle);
      if (!exists) {
        this.products.push({ 
          uuid: data?.libelle, 
          libelle: data?.libelle, 
          prix: data.prix || 0, 
          tag: true 
        });
      }
    } else if (data?.product?.uuid) {
      // Ajouter le produit avec UUID s'il n'existe pas
      const exists = this.products.find(p => p.uuid === data?.product.uuid);
      if (!exists) {
        this.products.push({ 
          uuid: data.product.uuid, 
          libelle: data.product.libelle || data.libelle, 
          prix: data.prix || 0, 
          tag: false 
        });
      }
    }

    return this.formBuild.group({
      uuid: [data?.uuid || null],
      id: [data?.id || null],
      libelle: [data?.product?.libelle || data?.libelle || null, [Validators.required]],
      produit: [data?.product?.uuid || data?.produit || null],
      prix: [prixInitial, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      prixMajore: [prixMajore, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      qte: [data?.qte || 1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
      tva: [data?.tva || 0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      remise: [data?.remise || 0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      total: [{ value: data?.total || 0, disabled: true }, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
    });
  }

  // Ajouter un prestataire
  addQuotePrestataire() {
    this.quotesPrestataires.push(this.createQuotePrestataire());
  }

  // Ajouter une option à un prestataire spécifique
  addOption(prestataireIndex: number = 0) {
    // Si aucun prestataire n'existe, en créer un par défaut
    if (this.quotesPrestataires.length === 0) {
      this.addQuotePrestataire();
    }
    
    const options = this.getOptions(prestataireIndex);
    options.push(this.createOption());
  }

  // Obtenir les options d'un prestataire
  getOptions(prestataireIndex: number): FormArray {
    return this.quotesPrestataires.at(prestataireIndex).get('options') as FormArray;
  }

  // Supprimer une option d'un prestataire
  onDelete(prestataireIndex: number, optionIndex: number) {
    const options = this.getOptions(prestataireIndex);
    options.removeAt(optionIndex);
    this.onChangeTotal();
  }

  configureValidation() {
    const trustee = this.form.get('trustee');
    const construction = this.form.get('construction');
    const house = this.form.get('house');

    if (this.type === 'SYNDIC') {
      trustee.setValidators([Validators.required]);
      house.clearValidators();
    } else if (this.type === 'LOCATIVE') {
      trustee.clearValidators();
      construction.setValidators([Validators.required]);
      house.setValidators(Validators.required);
    }

    trustee.updateValueAndValidity();
    house.updateValueAndValidity();
    construction.updateValueAndValidity();
  }

editForm() {
  if (this.edit) {
    const data = { ...this.invoiceOwnerService.getInvoiceOwner() }
  
    console.log("configuration edit modif de la construction",data.uuid);
    // Configuration des données de base
    this.construction = data?.construction;
    this.trustee = data?.trustee;
    this.houseCo = data?.houseCo;
    this.homeCo = data?.homeCo;
    this.infrastructure = data?.infrastructure;
    this.ligneBudgetaire = data?.ligneBudgetaire;

    // Configuration de la construction
    console.log("configuration de la construction",data);
 
    
    if (data.construction != null) {
      this.setConstructionUuid(data.construction.uuid);
      this.currentConstruction = {
        title: data?.construction?.nom,
        detail: data?.construction?.telephone
      };
    }

    // Configuration du syndic (type SYNDIC)
    if (this.type == "SYNDIC" && data.trustee) {
      this.currentTrustee = {
        title: data?.trustee?.nom,
        detail: data?.trustee?.telephone
      };
      this.setTrusteeUuid(data.trustee?.uuid);
    }

    // Configuration de la ligne budgétaire
    if (data.ligneBudgetaire) {
      this.setLigneBudgetaireUuid(data.ligneBudgetaire.uuid);
    }
     console.log("configuration de la construction 12443",data);
    // ✅ GESTION DES QUOTE PROVIDERS
    if (data?.quoteProviders && data.quoteProviders.length > 0) {
      
      data.quoteProviders.forEach((quoteProvider, index) => {
        
        // Ajouter les produits des options à la liste globale
        if (quoteProvider.options && quoteProvider.options.length > 0) {
          quoteProvider.options.forEach((option) => {
            // Produit personnalisé (sans UUID)
            if (!option.product?.uuid && option.libelle) {
              const exists = this.products.find(p => p.libelle === option.libelle);
              if (!exists) {
                this.products.push({ 
                  uuid: option.product?.uuid || option.libelle, 
                  libelle: option.product?.libelle, 
                  prix: option.prix || 0, 
                  tag: true 
                });
              }
            }
        
          });
        }

        // Créer le FormGroup pour ce quoteProvider
        const prestataireFormGroup = this.createQuotePrestataire({
          uuid: quoteProvider.uuid,
          id: quoteProvider.id,
          libelle: quoteProvider.libelle,
          type: quoteProvider.type,
          echeance: quoteProvider.echeance,
          date: quoteProvider.date,
          providerUuid: quoteProvider.provider?.uuid,
          prestataireNom: quoteProvider.provider?.nom,
          montant: quoteProvider.montant,
          montantHt: quoteProvider.montantHt,
          montantTva: quoteProvider.montantTva,
          montantRemise: quoteProvider.montantRemise,
          options: quoteProvider.options || []
        });

        this.quotesPrestataires.push(prestataireFormGroup);
      });

    } else {
    }

    // Patch des valeurs du formulaire principal
    this.form.patchValue({
      uuid: data.uuid,
      id: data.id,
      numero: data.numero,
      libelle: data.libelle,
      type: data.type,
      date: data.date,
      echeance: data.echeance,
      prestation: data.prestation || 0,
      montant: data.montant || 0,
      montantHt: data.montantHt || 0,
      montantTva: data.montantTva || 0,
      montantRemise: data.montantRemise || 0,
      construction: data?.construction?.uuid,
      house: data?.construction?.house?.uuid,
      trustee: data?.trustee?.uuid,
      infrastructure: data?.infrastructure?.uuid,
      ligneBudgetaire: data?.ligneBudgetaire?.uuid,
      folderUuid: data?.folder?.uuid
    });


    // Recalculer les totaux
    this.onChangeTotal();
    
  }
}


getDevis() {
  if (this.devis) {
    // Configuration des données de base
    this.construction = this.devis?.construction;
    this.trustee = this.devis?.trustee;
    this.houseCo = this.devis.houseCo;
    this.homeCo = this.devis.homeCo;
    this.infrastructure = this.devis.infrastructure;
    this.ligneBudgetaire = this.devis.ligneBudgetaire;

    
    if (this.devis.construction != null) {
      this.setConstructionUuid(this.devis.construction.uuid);
      this.currentConstruction = {
        title: this.devis?.construction?.nom,
        detail: this.devis?.construction?.telephone
      };
    }

    // Configuration du syndic (type SYNDIC)
    if (this.type == "SYNDIC" && this.devis.trustee) {
      this.currentTrustee = {
        title: this.devis?.trustee?.nom,
        detail: this.devis?.trustee?.telephone
      };
      this.setTrusteeUuid(this.devis.trustee?.uuid);
    }

    // Configuration de la ligne budgétaire
    if (this.devis.ligneBudgetaire) {
      this.setLigneBudgetaireUuid(this.devis.ligneBudgetaire.uuid);
    }

    // ✅ GESTION DES QUOTE PROVIDERS
    if (this.devis?.quoteProviders && this.devis.quoteProviders.length > 0) {
      
      this.devis.quoteProviders.forEach((quoteProvider, index) => {
        
        // Ajouter les produits des options à la liste globale
        if (quoteProvider.options && quoteProvider.options.length > 0) {
          quoteProvider.options.forEach((option) => {
            // Produit personnalisé (sans UUID)
            if (!option.product?.uuid && option.libelle) {
              const exists = this.products.find(p => p.libelle === option.libelle);
              if (!exists) {
                this.products.push({ 
                  uuid: option.product?.uuid || option.libelle, 
                  libelle: option.product?.libelle, 
                  prix: option.prix || 0, 
                  tag: true 
                });
              }
            }
        
          });
        }

        // Créer le FormGroup pour ce quoteProvider
        const prestataireFormGroup = this.createQuotePrestataire({
          uuid: quoteProvider.uuid,
          id: quoteProvider.id,
          libelle: quoteProvider.libelle,
          type: quoteProvider.type,
          echeance: quoteProvider.echeance,
          date: quoteProvider.date,
          providerUuid: quoteProvider.provider?.uuid,
          prestataireNom: quoteProvider.provider?.nom,
          montant: quoteProvider.montant,
          montantHt: quoteProvider.montantHt,
          montantTva: quoteProvider.montantTva,
          montantRemise: quoteProvider.montantRemise,
          options: quoteProvider.options || []
        });

        this.quotesPrestataires.push(prestataireFormGroup);
      });

    } else {
    }

    // Patch des valeurs du formulaire principal
    this.form.patchValue({
      uuid: null,
      id: null,
      libelle: this.devis.libelle,
      type: this.devis.type,
      date: this.devis.date,
      echeance: this.devis.echeance,
      prestation: this.devis.prestation || 0,
      montant: this.devis.montant || 0,
      montantHt: this.devis.montantHt || 0,
      montantTva: this.devis.montantTva || 0,
      montantRemise: this.devis.montantRemise || 0,
      construction: this.devis?.construction?.uuid,
      house: this.devis?.construction?.house?.uuid,
      trustee: this.devis?.trustee?.uuid,
      infrastructure: this.devis?.infrastructure?.uuid,
      ligneBudgetaire: this.devis?.ligneBudgetaire?.uuid,
      folderUuid: this.devis?.folder?.uuid
    });


    // Recalculer les totaux
    this.onChangeTotal();
    
  }
}

  setProviderUuid(uuid) {
    if (uuid) {
      this.f.provider.setValue(uuid);
    } else {
      this.f.provider.setValue(null);
    }
  }

  setConstructionUuid(uuid) {
    this.f.construction.setValue(uuid);
    this.f.trustee.setValue(null);
    this.f.infrastructure.setValue(null);
    const trustee = this.form.get('trustee');
    if (uuid) {
      this.constructionService.getSingle(uuid).subscribe((res: any) => {
        this.construction = res;
        this.f.house.setValue(this.construction.house.uuid);
      });
    }
    if (this.type === 'SYNDIC') {
      if (uuid) {
        trustee.clearValidators();
      } else {
        trustee.setValidators([Validators.required]);
      }
      trustee.updateValueAndValidity();
    }
  }

    setDevisUuid(uuid) {
    this.f.devis.setValue(uuid);
    if (uuid) {
      console.log("bbhghhgghvghvgjvhhgjhj",uuid);
      
      this.invoiceOwnerService.getSingle(uuid).subscribe((res: any) => {
        if (res) {
            this.devis = res;
            this.getDevis();
        }
      });
    }else {
      this.quotesPrestataires.clear();
      this.devis = null;
       this.totalHT = 0;
       this.totalTva = 0;
        this.totalTTC = 0;
        this.totalRemise = 0;
    }
  
  }

  setProductUuid(prestataireIndex: number, optionIndex: number, uuid) {
    const option = this.getOptions(prestataireIndex).at(optionIndex);
    
    if (option && uuid) {
      option.get('produit').setValue(uuid);
      this.productService.getSingle(uuid).subscribe((res: any) => {
        if (res) {
          this.currentProduct = res
          console.log(res)
          option.get('libelle').setValue(this.currentProduct.libelle)
          option.get('prix').setValue(this.currentProduct.prix)
          // Initialiser le prix majoré avec la même valeur que le prix initial
          option.get('prixMajore').setValue(this.currentProduct.prix)
          this.onChangeTotal()
        }
      })
    } else {
      option.get('produit').setValue(null);
      option.get('libelle').setValue(null)
      option.get('prix').setValue(null)
      option.get('prixMajore').setValue(null)
      this.currentProduct = null;
      this.onChangeTotal()
    }
  }

  setCurrentTrustee(trustee): void {
    this.currentTrustee = {
      title: trustee.nom,
      detail: trustee.details,
    };
  }

  setTrusteeUuid(uuid) {
    this.f.trustee.setValue(uuid);
    this.f.infrastructure.setValue(null);
    if (!this.edit) {
      if (uuid) {
        this.loadInfrastructure();
        this.loadTypeLoads();
        this.loadCoproprietes();
      }
      else {
        this.infrastructures = [];
        this.typeLoads = [];
        this.coproprietes = [];
      }
    }
  }

  setLigneBudgetaireUuid(uuid) {
    if (uuid) {
      this.f.ligneBudgetaire.setValue(uuid);
    } else {
      this.f.ligneBudgetaire.setValue(null);
    }
  }

  loadCoproprietes() {
    this.coproprieteService.getListAll(this.f.trustee.value).subscribe(res => {
      if (res.length > 0) {
        this.coproprietes = res;
      }
    }, error => {
      console.error("Erreur chargement copropriétés:", error);
    });
  };

  loadInfrastructure() {
    this.isLoadingInfrastructure = true;
    this.infrastructures = [];
    if (!this.f.trustee.value) {
      this.isLoadingInfrastructure = false;
      return;
    }
    this.infrastructureService.getList(this.f.trustee.value).subscribe(res => {
      this.isLoadingInfrastructure = false;
      this.infrastructures = res;
    }, error => {
      this.isLoadingInfrastructure = false;
      console.error("Erreur chargement infrastructures:", error);
    });
    if (this.edit) {
      this.f.infrastructure.setValue(this.construction.infrastructure.uuid);
    }
  }

  loadTypeLoads() {
    this.isLoadingTypeLoad = true;
    this.typeLoads = [];
    if (!this.f.trustee.value) {
      this.isLoadingTypeLoad = false;
      return;
    }
    this.optionBudgetService.getList(this.f.trustee.value).subscribe(res => {
      this.isLoadingTypeLoad = false;
      if (res.length > 0) {
        this.typeLoads = res;
      }
    }, error => {
      this.isLoadingTypeLoad = false;
      console.error("Erreur chargement typeLoads:", error);
    });
    if (this.edit) {
      this.f.ligneBudgetaire.setValue(this.construction.infrastructure.uuid);
    }
  }

  onChangeTotal() {
    let totalOptionRemise = 0;
    let totalOptionHT = 0;
    let totalOptionTVA = 0;
    let totalOptionTTC = 0;
    let totalOptionDifference = 0; // Nouvelle variable pour accumuler les différences globales
    let totalOptionInitial = 0;

    // Parcourir tous les prestataires et leurs options
    this.quotesPrestataires.controls.forEach((prestataire, prestataireIndex) => {
      const options = prestataire.get('options') as FormArray;
      
      // Variables pour les sous-totaux de ce prestataire
      let prestataireHT = 0;
      let prestataireTVA = 0;
      let prestataireTTC = 0;
      let prestataireRemise = 0;
      let prestataireDifference = 0; // Nouvelle variable pour la différence totale
      let prestataireInitial = 0;
      
      options.controls.forEach(elem => {
        // UTILISER LE PRIX MAJORÉ AU LIEU DU PRIX INITIAL
        const prixUnitaire = elem.value.prixMajore >= 0 ? elem.value.prixMajore : elem.value.prix;
        const prixInitial = elem.value.prix || 0;
        const qte = elem.value.qte || 1;
        
        // Calculer la différence pour cette ligne
        const totalMajore = (elem.value.prixMajore || 0) * qte;
        const totalUnitaire = prixInitial * qte;
        const difference = totalMajore - totalUnitaire;

         prestataireInitial += totalUnitaire;
        
        var remise = elem.value.remise >= 0 ? elem.value.remise : 0;
        var totalHt = (prixUnitaire * qte) - remise;
        var totalTva = elem.value.tva >= 0 ? totalHt * (elem.value.tva / 100) : 0;
        var totalTtc = totalHt + totalTva;
        
        elem.get('total').setValue(totalTtc);
        
        // Accumuler pour ce prestataire
        prestataireRemise += remise;
        prestataireHT += (elem.value.qte >= 1 && (remise <= totalHt)) ? totalHt : 0;
        prestataireTVA += totalTva;
        prestataireTTC += totalTtc;
        prestataireDifference += difference; // Accumuler les différences
        totalOptionInitial += totalUnitaire;
        
        // Accumuler pour le total global
        totalOptionRemise += remise;
        totalOptionHT += (elem.value.qte >= 1 && (remise <= totalHt)) ? totalHt : 0;
        totalOptionTVA += totalTva;
        totalOptionTTC += totalTtc;
        totalOptionDifference += difference; // Accumuler les différences globales
      });
      
      // Mettre à jour les sous-totaux du prestataire
      prestataire.get('montantHt').setValue(prestataireHT);
      prestataire.get('montantTva').setValue(prestataireTVA);
      prestataire.get('montant').setValue(prestataireTTC);
      prestataire.get('montantDifference').setValue(prestataireDifference); // Nouvelle ligne
      prestataire.get('montantInitialPrestataire').setValue(prestataireInitial);
    });

    // Mettre à jour les totaux globaux
    this.totalInitial = totalOptionInitial;
    this.totalHT = totalOptionHT;
    this.totalTva = totalOptionTVA;
    this.totalRemise = totalOptionRemise;
    this.totalDifference = totalOptionDifference; // Nouvelle ligne pour le total différence global
    this.totalTTC = totalOptionHT + totalOptionTVA + this.f.prestation.value;
    
    this.f.montantHt.setValue(totalOptionHT);
    this.f.montantTva.setValue(totalOptionTVA);
    this.f.montantRemise.setValue(totalOptionRemise);
    this.f.montant.setValue(this.totalTTC);
  }

  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      console.log("📤 Données à envoyer:", data);
      
      this.invoiceOwnerService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'INVOICE_OWNER_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'INVOICE_OWNER_ADD', payload: res?.data });
          }
        }
      }, error => {
        console.error("❌ Erreur lors de l'enregistrement:", error);
        this.toast('Erreur lors de l\'enregistrement', 'Erreur', 'error');
      });
    } else {
      console.warn("⚠️ Formulaire invalide");
      return;
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

  addProduct(term: any) {
    return { uuid: term, libelle: term, prix: 0, tag: true }
  };

  onSelectChange(prestataireIndex: number, optionIndex: number, event: any) {
    console.log('Selected option:', event);
    const option = this.getOptions(prestataireIndex).at(optionIndex);
    
    if (option && event) {
      if (event.tag) {
        option.get('libelle').setValue(event.libelle)
        option.get('produit').setValue(null);
        option.get('prix').setValue(event.prix);
        // Initialiser le prix majoré avec la même valeur que le prix initial
        option.get('prixMajore').setValue(event.prix);
      } else {
        option.get('produit').setValue(event.uuid);
        option.get('libelle').setValue(event.libelle)
        option.get('prix').setValue(event.prix)
        // Initialiser le prix majoré avec la même valeur que le prix initial
        option.get('prixMajore').setValue(event.prix);
      }
      this.onChangeTotal()
    } else {
      option.get('produit').setValue(null);
      option.get('libelle').setValue(null)
      option.get('prix').setValue(null)
      option.get('prixMajore').setValue(null);
      this.currentProduct = null;
      this.onChangeTotal()
    }
  }

  onSelectCoproprieteChange(event: any) {
    console.log('Copropriété sélectionnée:', event);
  }

  groupingHelper(item) {
    if (item?.houseCo) {
      return item?.houseCo?.nom
    }
    return null;
  }

  groupValueHelper(item) {
    return item.houseCo;
  }

  addProvider() {
    this.modalService.dismissAll()
    this.providerService.edit = false
    this.ngModal(ProviderAddComponent, 'modal-basic-title', 'xl', true, 'static')
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
      this.toast('Impossible de vider le formulaire lorsque un upload a été effectué', 'Une erreur a été rencontrée', 'warning');
    } else {
      this.form.reset()
    }
  }

  toast(msg, title, type) {
    if (type == 'info') {
      this.toastr.info(msg, title)
    } else if (type == 'success') {
      this.toastr.success(msg, title)
    } else if (type == 'warning') {
      this.toastr.warning(msg, title)
    } else if (type == 'error') {
      this.toastr.error(msg, title)
    }
  }

  ngModal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }

  timelapse(dateD, dateF): string { 
    return DateHelperService.getTimeLapse(dateD, dateF, false, 'dmy'); 
  }
  
  get f() { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
  get quotesPrestataires() { return this.form.get('quotesPrestataires') as FormArray; }
  
  // Getter option pour compatibilité - retourne les options du premier prestataire
  get option() { 
    if (this.quotesPrestataires.length === 0) {
      this.addQuotePrestataire();
    }
    return this.getOptions(0);
  }
}