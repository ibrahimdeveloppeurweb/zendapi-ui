import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Construction } from '@model/construction';
import { Provider } from '@model/provider';
import { HomeCo } from '@model/syndic/home-co';
import { HouseCo } from '@model/syndic/house-co';
import { InvoiceCo } from '@model/prestataire/invoice-co';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConstructionService } from '@service/construction/construction.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { ProductService } from '@service/product/product.service';
import { InvoiceCoService } from '@service/invoice-co/invoice-co.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UploaderService } from '@service/uploader/uploader.service';
import { HomeCoService } from '@service/syndic/home-co.service';
import { HouseCoService } from '@service/syndic/house-co.service';
import { InfrastructureService } from '@service/syndic/infrastructure.service';
import { LoadCategory } from '@model/load-category';
import { TypeLoad } from '@model/typeLoad';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { CurrencyPipe } from '@angular/common';
import { OptionBudgetService } from '@service/option-budget/option-budget.service';
import { QuoteService } from '@service/quote/quote.service';

@Component({
  selector: 'app-invoice-co-add',
  templateUrl: './invoice-co-add.component.html',
  styleUrls: ['./invoice-co-add.component.scss']
})
export class InvoiceCoAddComponent implements OnInit {
  @Input() public type: string = "LOCATIVE"
  title: string = ""
  edit: boolean = false
  form: FormGroup
  submit: boolean = false
  invoiceCo: InvoiceCo
  provider: Provider
  construction: Construction
  trustee: any;
  ligneBudgetaire: LoadCategory
  house: HouseCo;
  home: HomeCo;
  infrastructure: any;
  nature: any;
  coproprietes: any[];
  houses: HouseCo[] = [];
  homes: HomeCo[] = [];
  infrastructures: any[] = []
  typeLoads: TypeLoad[] = [];
  products: any[] = [];
  treasuries: any[] = [];
  currentConstruction?: any;
  currentProduct?: any;
  currentProvider?: any;
  currentTrustee?: any;
  currentLigneBudgetaire?: any;
  selectRow = []
  totalHT = 0;
  totalTva = 0;
  totalTTC = 0;
  totalRemise = 0;
  required = Globals.required
  isLoadingHouseCo = false;
  isLoadingHomeCo = false;
  isLoadingInfrastructure = false
  isLoadingTypeLoad = false
  canChangeProvider = true;
  canChangeSyndic = true
  // données paiement
  sourceTitle: string = "";
  numeroTitle: string = "";
  montantTotal: any = 0;
  montantRegle: any = 0;
  montantRestant: any = 0;
  isHidden: boolean = false;

  currencyPipe: CurrencyPipe = new CurrencyPipe('fr');

  modeRow: any[] = [
    { label: "ESPECE", value: "ESPECE" },
    { label: "CHEQUE", value: "CHEQUE" },
    { label: "MOBILE MONEY", value: "MOBILE MONEY" },
    { label: "WAVE", value: "WAVE" },
    { label: "VERSEMENT", value: "VERSEMENT" },
    { label: "VIREMENT", value: "VIREMENT" }
  ];

  selectedCopriete = {};

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private uploadService: UploaderService,
    private optionBudgetService: OptionBudgetService,
    private invoiceCoService: InvoiceCoService,
    private productService: ProductService,
    private homeCoService: HomeCoService,
    private houseCoService: HouseCoService,
    private infrastructureService: InfrastructureService,
    private constructionService: ConstructionService,
    private coproprieteService: CoproprieteService,
    private treasuryService: TreasuryService,
    private emitter: EmitterService,
    public toastr: ToastrService,
   private quoteService: QuoteService,
  ) {
    this.edit = this.invoiceCoService.edit
    this.invoiceCo = this.invoiceCoService.getInvoiceCo()
    this.title = (!this.edit) ? "Ajouter une facture" : "Modifier la facture" + this.invoiceCo.code
    this.newForm()
    console.log(this.type)
    if (this.invoiceCoService.getProvider()) {
      const provider = this.invoiceCoService.getProvider()
      this.currentProvider = {
        photoSrc: provider?.photoSrc,
        title: provider?.nom,
        detail: provider?.telephone,
        uuid: provider?.uuid,
      };
      this.f.provider.setValue(this.currentProvider.uuid)
      this.canChangeProvider = false
      this.invoiceCoService.setProvider(null)
    }
    if (this.invoiceCoService.getSyndic()) {
      const syndic = this.invoiceCoService.getSyndic()
      this.currentTrustee = {
        photoSrc: syndic?.photoSrc,
        title: syndic?.nom,
        uuid: syndic?.uuid,
      };
      this.f.trustee.setValue(this.currentTrustee.uuid)
      this.canChangeSyndic = false
      this.invoiceCoService.setSyndic(null)
      this.loadInfrastructure();
      this.loadTypeLoads();
      this.loadCoproprietes();
      this.loadTreasuries();
    }
  }

  ngOnInit(): void {
    this.editForm()
    this.configureValidation();
    this.productService.getList().subscribe((products) => {
      this.products = [...this.products, ...products];
    })

    if (this.quoteService?.construction != null) {
    this.setConstructionUuid(this.quoteService?.construction?.uuid);
      this.currentConstruction = {
      title: this.quoteService?.construction?.nom,
      detail: this.quoteService?.construction?.telephone
    };
    }
  }

  configureValidation() {
    const trustee = this.form.get('trustee');
    const construction = this.form.get('construction');

    if (this.type === 'SYNDIC') {
      trustee.setValidators([Validators.required]);
    } else if (this.type === 'LOCATIVE') {
      construction.setValidators([Validators.required]);
    }

    trustee.updateValueAndValidity();
    construction.updateValueAndValidity();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      libelle: [null, [Validators.required]],
      numero: [null, [Validators.required]],
      construction: [null],
      trustee: [null, [Validators.required]],
      copropriete: [null],
      ligneBudgetaire: [null],
      infrastructure: [null],
      provider: [null, [Validators.required]],
      date: [null, [Validators.required]],
      echeance: [null, [Validators.required]],
      type: [null, [Validators.required]],
      prestation: [0],
      montant: [0],
      montantHt: [0],
      montantTva: [0],
      montantRemise: [0],
      options: this.formBuild.array([]),
      folderUuid: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      treasuryPaiement: [null],
      effectuePaiement: [null],
      montantPaiement: [0],
      datePaiement: [null],
      modePaiement: ['ESPECE'],
      sourcePaiement: [null],
      numeroPaiement: [null],
      tiersPaiement: [null],
      isPaid: ['NON'],
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.invoiceCoService.getInvoiceCo() }
      this.setProviderUuid(data.provider.uuid);
      if (data.construction) {
        this.setConstructionUuid(data.construction.uuid);
      }
      if (data.trustee) {
        this.setTrusteeUuid(data.trustee.uuid);
      }
      if (data.ligneBudgetaire) {
        this.setLigneBudgetaireUuid(data.ligneBudgetaire.uuid);
      }
      data.date = DateHelperService.fromJsonDate(data?.date);
      data.echeance = DateHelperService.fromJsonDate(data?.echeance);
      this.construction = data?.construction
      this.trustee = data.trustee;
      this.house = data.house;
      this.home = data.home;
      this.infrastructure = data.infrastructure
      this.ligneBudgetaire = data.ligneBudgetaire
      this.currentProvider = {
        photoSrc: data?.provider?.photoSrc,
        title: data?.provider?.nom,
        detail: data?.provider?.telephone
      };
      this.currentTrustee = {
        photoSrc: data?.trustee?.photoSrc,
        title: data?.trustee?.nom,
        detail: data?.trustee?.code
      };
      this.currentConstruction = {
        photoSrc: data?.construction?.photoSrc,
        title: data?.construction?.nom,
        detail: data?.construction?.code
      };
      this.currentLigneBudgetaire = {
        title: data?.ligneBudgetaire?.searchableTitle,
        detail: data?.ligneBudgetaire?.searchableDetail
      };
      data?.options.forEach((item) => {
        if (item.product == null) {
          this.products.push({ uuid: item.libelle, libelle: item.libelle, prix: item.prix, tag: true })
        }
        this.option.push(
          this.formBuild.group({
            uuid: [item.uuid],
            id: [item.id],
            libelle: [item.libelle, [Validators.required]],
            produit: [item?.product?.uuid],
            prix: [item.prix, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.minLength(0)]],
            qte: [item.qte, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.minLength(1)]],
            tva: [item.tva, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.minLength(0)]],
            remise: [item.remise, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.minLength(0)]],
            total: [{ value: item.total, disabled: true }, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.minLength(0)]],
          })
        );
      });
      this.form.patchValue(data)
      this.f.folderUuid?.setValue(data?.folder?.uuid);
      this.onChangeTotal()
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
    if (!this.edit && uuid) {
      this.constructionService.getSingle(uuid).subscribe((res: any) => { this.construction = res?.data; });
    }
    const trustee = this.form.get('trustee');
    if (uuid) {
      trustee.clearValidators();
    } else {
      trustee.setValidators([Validators.required]);
    }
    trustee.updateValueAndValidity();
  }
  setTrusteeUuid(uuid) {
    this.f.trustee.setValue(uuid);
    if (!this.edit) {
      this.f.copropriete.setValue(null);
      this.f.infrastructure.setValue(null);
      if (uuid) {
        this.loadInfrastructure();
        this.loadTypeLoads();
        this.loadCoproprietes();
        this.loadTreasuries();
      }
      else {
        this.infrastructures = [];
        this.typeLoads = [];
        this.coproprietes = [];
        this.treasuries = [];
      }
    }
  }
  setProductUuid(item, uuid) {
    if (item && uuid) {
      item.get('produit').setValue(uuid);
      this.productService.getSingle(uuid).subscribe((res: any) => {
        if (res) {
          this.currentProduct = res
          console.log(res)
          item.get('libelle').setValue(this.currentProduct.libelle)
          item.get('prix').setValue(this.currentProduct.prix)
          this.onChangeTotal()
        }
      })
    } else {
      item.get('produit').setValue(null);
      item.get('libelle').setValue(null)
      item.get('prix').setValue(null)
      this.currentProduct = null;
      this.onChangeTotal()
    }
  }
  setLigneBudgetaireUuid(uuid) {
    if (uuid) {
      this.f.ligneBudgetaire.setValue(uuid);
    } else {
      this.f.ligneBudgetaire.setValue(null);
    }
  }
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
    });
    if (this.edit) {
      this.f.ligneBudgetaire.setValue(this.construction.infrastructure.uuid);
    }
  }
  loadCoproprietes() {
    this.coproprietes = [];
    this.coproprieteService.getListAll(this.f.trustee.value).subscribe(res => {
      if (res.length > 0) {
        this.coproprietes = res;
      }
    }, error => {
    });
  };
  loadTreasuries() {
    this.treasuries = [];
    this.treasuryService.getList(this.f.trustee.value).subscribe(res => {
      if (res.length > 0) {
        this.treasuries = res;
      }
    }, error => {
    });
  };
  onChangeTotal() {
    let totalOptionRemise = 0;
    let totalOptionHT = 0;
    let totalOptionTVA = 0;
    let totalOptionTTC = 0;
    this.option.controls.forEach(elem => {
      var remise = elem.value.remise >= 0 ? elem.value.remise : 0
      var totalHt = (elem.value.prix * elem.value.qte) - remise
      var totalTva = elem.value.tva >= 0 ? totalHt * (elem.value.tva / 100) : 0
      var totalTtc = totalHt + totalTva
      elem.get('total').setValue(totalTtc);
      totalOptionRemise += remise;
      totalOptionHT += (elem.value.qte >= 1 && (remise <= totalHt)) ? totalHt - remise : 0;
      totalOptionTVA += totalTva;
      totalOptionTTC += totalTtc
    });

    this.totalHT = totalOptionHT;
    this.totalTva = totalOptionTVA;
    this.totalRemise = totalOptionRemise;
    this.totalTTC = totalOptionHT + totalOptionTVA + totalOptionRemise + this.f.prestation.value
    this.f.montantHt.setValue(totalOptionHT);
    this.f.montantTva.setValue(totalOptionTVA);
    this.f.montantRemise.setValue(totalOptionRemise);
    this.f.montant.setValue(this.totalTTC);
  }

  addOption() {
    this.option.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        libelle: [null, [Validators.required]],
        produit: [null],
        prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.minLength(0)]],
        qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.minLength(1)]],
        tva: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.minLength(0)]],
        remise: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.minLength(0)]],
        total: [{ value: 0, disabled: true }, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.minLength(0)]],
      })
    );
  }
  setTreasury() {
    if (this.f.treasuryPaiement) {
      this.treasuryService.getSingle(this.f.treasuryPaiement.value).subscribe((res: any) => {
        if (res) {
          if (res.type === "CAISSE") {
            this.modeRow = [
              { label: "ESPECE", value: "ESPECE" },
              { label: "MOBILE MONEY", value: "MOBILE MONEY" },
              { label: "WAVE", value: "WAVE" }
            ];
          }
          if (res.type === "BANQUE") {
            this.modeRow = [
              { label: "CHEQUE", value: "CHEQUE" },
              { label: "VERSEMENT", value: "VERSEMENT" },
              { label: "VIREMENT", value: "VIREMENT" }
            ];
          }
          return res
        }
      });
    }
  }
  onDelete(i) {
    this.option.removeAt(i)
    this.onChangeTotal();
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
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.invoiceCoService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'INVOICE_CO_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'INVOICE_CO_ADD', payload: res?.data });
          }
        }
      });
    } else { return; }
  }

  addProduct(term: any) {
    return { uuid: term, libelle: term, prix: 0, tag: true }
  };
  
  onChangeLibelle() {
    if (this.f.modePaiement.value === 'VIREMENT' || this.f.modePaiement.value === 'VERSEMENT') {
      this.numeroTitle = "N° virement"
      this.sourceTitle = "Banque"
    } else if (this.f.modePaiement.value === 'CHEQUE') {
      this.sourceTitle = "Banque"
      this.numeroTitle = "N° cheque"
    } else if (this.f.modePaiement.value === 'MOBILE MONEY' || this.f.modePaiement.value === 'WAVE') {
      this.sourceTitle = "N° Téléphone"
      this.numeroTitle = "N° Transaction"
    }
    this.f.source.setValue(null)
    this.f.numero.setValue(null)
  }

  onChangeEffectue() {
    this.f.tiers.setValue(null)
  }

  onChangeMontant() {
    if (this.f.montant.value > parseFloat(this.f.montant.value)) {
      this.f.montant.setValue(0)
    }
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
  onConfirme() {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment enregistrer cette facture ?',
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
      var data = { uuid: this.form.value.folderUuid, path: 'invoice' }
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
  formatInputValue(value: number): string {
    return this.currencyPipe.transform(value, '1.0');
  }
  timelapse(dateD, dateF): string { return DateHelperService.getTimeLapse(dateD, dateF, false, 'dmy'); }
  get f() { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
  get option() { return this.form.get('options') as FormArray; }

}
