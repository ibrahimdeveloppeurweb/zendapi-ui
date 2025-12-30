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
import { HomeCoService } from '@service/syndic/home-co.service';
import { HouseCoService } from '@service/syndic/house-co.service';
import { InfrastructureService } from '@service/syndic/infrastructure.service';
import { LoadCategory } from '@model/load-category';
import { UploaderService } from '@service/uploader/uploader.service';
import { TypeLoadService } from '@service/typeLoad/type-load.service';
import { TypeLoad } from '@model/typeLoad';
import { Product } from '@model/product';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { OptionBudgetService } from '@service/option-budget/option-budget.service';
import { ProviderAddComponent } from '@agence/prestataire/provider/provider-add/provider-add.component';
import { ProviderService } from '@service/provider/provider.service';
import { QuoteOwnerService } from '@service/quote-owner/quote-owner.service';

@Component({
  selector: 'app-quote-owner-add',
  templateUrl: './quote-owner-add.component.html',
  styleUrls: ['./quote-owner-add.component.scss']
})
export class QuoteOwnerAddComponent implements OnInit {
  @Input() public type: string = "LOCATIVE"
  @Input() public isBon: boolean = false
  title: string = ""
  edit: boolean = false
  form: FormGroup
  submit: boolean = false
  quoteOwner: QuoteOwner
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
  totalDifference = 0;
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
    private quoteOwnerService: QuoteOwnerService,
    private productService: ProductService,
    private uploadService: UploaderService,
    private providerService: ProviderService,
    private optionBudgetService: OptionBudgetService,
    private coproprieteService: CoproprieteService,
    private constructionService: ConstructionService,
    private infrastructureService: InfrastructureService
  ) {
    this.edit = this.quoteOwnerService.edit
    this.quoteOwner = this.quoteOwnerService.getQuote()
    this.newForm();
  }

  get modalTitle(): string {
    if (!this.edit) {
      return this.isBon ? "Ajouter un bon de commande" : "Ajouter un devis proprietaire";
    } else {
      return this.isBon ? "Modifier le bon de commande"+ (this.quoteOwner?.code || "") : "Modifier le devis " + (this.quoteOwner?.code || "");
    }
  }

  ngOnInit(): void {    
    this.configureValidation();
    
    if (!this.edit  && this.products.length === 0) {
       this.productService.getList().subscribe((products) => {
      this.products = [...this.products, ...products];
    });
    }
    
    if ( !this.edit && this.quoteService?.construction != null) {
      this.setConstructionUuid(this.quoteService?.construction?.uuid);
      this.currentConstruction = {
        title: this.quoteService?.construction?.nom,
        detail: this.quoteService?.construction?.telephone
      };
      
      if (!this.edit && !this.isBon ) {
        this.loadQuotesOrBons();
      }
    }

      if (this.isBon) {
        this.quoteOwnerService.getList(this.quoteService.construction?.uuid,'PRESTATION', null, 0,"VALIDE").subscribe((res) => {            
          this.devisRow = res.filter(item => item.etat === 'VALIDE');
        }, error => {
        });
    }
    
    if (this.edit) {
      this.editForm();
    }
  }

  private loadQuotesOrBons(): void {
    const constructionUuid = this.quoteService.construction?.uuid;
    
    if (!constructionUuid) {
      return;
    }
    
    const params = this.isBon 
      ? [constructionUuid, 'PRESTATION', null, 1] 
      : [constructionUuid, 'PRESTATION'];
    
    this.quoteOwnerService.getList(...params).subscribe((res) => {
      this.devisRow = res;
    }, error => {
    });
    
    this.quoteService.getList(...params).subscribe((res) => {
      if (this.isBon) {
        this.bons = res;
      } else {
        this.quotes = res;
      }
      
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
        
        this.onChangeTotal();
      }
    }, error => {
    });
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      libelle: [null, [Validators.required]],
      construction:[null, [Validators.required]],
      devis: [null],
      house: [null],
      trustee: [null],
      copropriete: [null],
      infrastructure: [null],
      ligneBudgetaire: [null],
      type: [null],
      prestation: [0],
      isBon: [this.isBon],
      montantHt: [this.totalHT],
      montantRemise: [this.totalRemise],
      montantTva: [this.totalTva],
      montant: [0],
      folderUuid: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      quotesPrestataires: this.formBuild.array([])
    });
  }

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
      montantInitial: [data?.montant || 0],
      montantInitialPrestataire: [data?.montantInitialPrestataire || 0],
      montantHt: [data?.montantHt || 0],
      montantTva: [data?.montantTva || 0],
      montantDifference: [data?.montantDifference || 0],
      options: this.formBuild.array(data?.options ? this.createOptionsFromData(data.options) : [])
    });
  }

  createOptionsFromData(options: any[]): FormGroup[] {
    const optionArray = Array.isArray(options) ? options : Object.values(options);
    return optionArray.map(item => this.createOption(item));
  }

  createOption(data?: any) {
    const prixInitial = data?.prix || 0;
    const prixMajore = data?.prixMajore || prixInitial;

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

  addQuotePrestataire() {
    this.quotesPrestataires.push(this.createQuotePrestataire());
  }

  addOption(prestataireIndex: number = 0) {
    if (this.quotesPrestataires.length === 0) {
      this.addQuotePrestataire();
    }
    
    const options = this.getOptions(prestataireIndex);
    options.push(this.createOption());
  }

  getOptions(prestataireIndex: number): FormArray {
    return this.quotesPrestataires.at(prestataireIndex).get('options') as FormArray;
  }

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
      const data = { ...this.quoteOwnerService.getQuote() }
      
      this.construction = data?.construction;
      this.trustee = data?.trustee;
      this.houseCo = data?.houseCo;
      this.homeCo = data?.homeCo;
      this.infrastructure = data?.infrastructure;
      this.ligneBudgetaire = data?.ligneBudgetaire;
      
      if (data.construction != null) {
        this.setConstructionUuid(data.construction.uuid);
        this.currentConstruction = {
          title: data?.construction?.nom,
          detail: data?.construction?.telephone
        };
      }

      if (this.type == "SYNDIC" && data.trustee) {
        this.currentTrustee = {
          title: data?.trustee?.nom,
          detail: data?.trustee?.telephone
        };
        this.setTrusteeUuid(data.trustee?.uuid);
      }

      if (data.ligneBudgetaire) {
        this.setLigneBudgetaireUuid(data.ligneBudgetaire.uuid);
      }

      if (data?.quoteProviders && data.quoteProviders.length > 0) {
        data.quoteProviders.forEach((quoteProvider, index) => {
          if (quoteProvider.options && quoteProvider.options.length > 0) {
            quoteProvider.options.forEach((option) => {
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
      }

      this.form.patchValue({
        uuid: data.uuid,
        id: data.id,
        libelle: data.libelle,
        type: data.type,
        date: data.date,
        echeance: data.echeance,
        prestation: data.prestation || 0,
        montant: data.montant || 0,
        montantHt: data.montantHt || 0,
        montantTva: data.montantTva || 0,
        montantRemise: data.montantRemise || 0,
        isBon: data.isBon,
        construction: data?.construction?.uuid,
        house: data?.construction?.house?.uuid,
        trustee: data?.trustee?.uuid,
        infrastructure: data?.infrastructure?.uuid,
        ligneBudgetaire: data?.ligneBudgetaire?.uuid,
        folderUuid: data?.folder?.uuid
      });

      this.onChangeTotal();
    }
  }

  getDevis() {
    if (this.devis) {
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

      if (this.type == "SYNDIC" && this.devis.trustee) {
        this.currentTrustee = {
          title: this.devis?.trustee?.nom,
          detail: this.devis?.trustee?.telephone
        };
        this.setTrusteeUuid(this.devis.trustee?.uuid);
      }

      if (this.devis.ligneBudgetaire) {
        this.setLigneBudgetaireUuid(this.devis.ligneBudgetaire.uuid);
      }

      if (this.devis?.quoteProviders && this.devis.quoteProviders.length > 0) {
        this.devis.quoteProviders.forEach((quoteProvider, index) => {
          if (quoteProvider.options && quoteProvider.options.length > 0) {
            quoteProvider.options.forEach((option) => {
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
      }

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
        isBon: this.isBon,
        construction: this.devis?.construction?.uuid,
        house: this.devis?.construction?.house?.uuid,
        trustee: this.devis?.trustee?.uuid,
        infrastructure: this.devis?.infrastructure?.uuid,
        ligneBudgetaire: this.devis?.ligneBudgetaire?.uuid,
        folderUuid: this.devis?.folder?.uuid
      });

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
      this.quoteOwnerService.getSingle(uuid).subscribe((res: any) => {
        if (res) {
          this.devis = res;
          this.getDevis();
        }
      });
    } else {
      this.quotesPrestataires.clear();
      this.devis = null;
      this.totalHT = 0;
      this.totalTva = 0;
      this.totalTTC = 0;
      this.totalRemise = 0;
      this.totalDifference = 0;
    }
  }

  setProductUuid(prestataireIndex: number, optionIndex: number, uuid) {
    const option = this.getOptions(prestataireIndex).at(optionIndex);
    
    if (option && uuid) {
      option.get('produit').setValue(uuid);
      this.productService.getSingle(uuid).subscribe((res: any) => {
        if (res) {
          this.currentProduct = res
          option.get('libelle').setValue(this.currentProduct.libelle)
          option.get('prix').setValue(this.currentProduct.prix)
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
      } else {
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
    let totalOptionDifference = 0;
    let totalOptionInitial = 0;

    this.quotesPrestataires.controls.forEach((prestataire, prestataireIndex) => {
      const options = prestataire.get('options') as FormArray;
      
      let prestataireHT = 0;
      let prestataireTVA = 0;
      let prestataireTTC = 0;
      let prestataireRemise = 0;
      let prestataireDifference = 0;
      let prestataireInitial = 0;
      
      options.controls.forEach(elem => {
        const prixUnitaire = elem.value.prixMajore >= 0 ? elem.value.prixMajore : elem.value.prix;
        const prixInitial = elem.value.prix || 0;
        const qte = elem.value.qte || 1;
        
        const totalMajore = (elem.value.prixMajore || 0) * qte;
        const totalUnitaire = prixInitial * qte;
        const difference = totalMajore - totalUnitaire;
        
        var remise = elem.value.remise >= 0 ? elem.value.remise : 0;
        var totalHt = (prixUnitaire * qte) - remise;
        var totalTva = elem.value.tva >= 0 ? totalHt * (elem.value.tva / 100) : 0;
        var totalTtc = totalHt + totalTva;
        
        elem.get('total').setValue(totalTtc);
        
        prestataireRemise += remise;
        prestataireHT += (elem.value.qte >= 1 && (remise <= totalHt)) ? totalHt : 0;
        prestataireTVA += totalTva;
        prestataireTTC += totalTtc;
        prestataireDifference += difference;
        prestataireInitial += totalUnitaire;
        
        totalOptionRemise += remise;
        totalOptionHT += (elem.value.qte >= 1 && (remise <= totalHt)) ? totalHt : 0;
        totalOptionTVA += totalTva;
        totalOptionTTC += totalTtc;
        totalOptionDifference += difference;
        totalOptionInitial += totalUnitaire;
      });
      
      prestataire.get('montantInitialPrestataire').setValue(prestataireInitial);
      prestataire.get('montantHt').setValue(prestataireHT);
      prestataire.get('montantTva').setValue(prestataireTVA);
      prestataire.get('montant').setValue(prestataireTTC);
      prestataire.get('montantDifference').setValue(prestataireDifference);
    });

    this.totalInitial = totalOptionInitial;
    this.totalHT = totalOptionHT;
    this.totalTva = totalOptionTVA;
    this.totalRemise = totalOptionRemise;
    this.totalDifference = totalOptionDifference;
    this.totalTTC = totalOptionHT + totalOptionTVA + this.f.prestation.value;
    
    this.f.montantHt.setValue(totalOptionHT);
    this.f.montantTva.setValue(totalOptionTVA);
    this.f.montantRemise.setValue(totalOptionRemise);
    this.f.montant.setValue(this.totalTTC);
  }

  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      this.f.isBon.setValue(this.isBon)
      if (this.isBon) {
        this.f.type.setValue('FOURNITURE')
      }
      const data = this.form.getRawValue();
      
      this.quoteOwnerService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'QUOTE_OWNER_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'QUOTE_OWNER_ADD', payload: res?.data });
          }
        }
      }, error => {
        console.error("Erreur lors de l'enregistrement:", error);
        this.toast('Erreur lors de l\'enregistrement', 'Erreur', 'error');
      });
    } else {
      console.warn("Formulaire invalide");
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
    const option = this.getOptions(prestataireIndex).at(optionIndex);
    
    if (option && event) {
      if (event.tag) {
        option.get('libelle').setValue(event.libelle)
        option.get('produit').setValue(null);
        option.get('prix').setValue(event.prix);
        option.get('prixMajore').setValue(event.prix);
      } else {
        option.get('produit').setValue(event.uuid);
        option.get('libelle').setValue(event.libelle)
        option.get('prix').setValue(event.prix)
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
  
  get option() { 
    if (this.quotesPrestataires.length === 0) {
      this.addQuotePrestataire();
    }
    return this.getOptions(0);
  }
}