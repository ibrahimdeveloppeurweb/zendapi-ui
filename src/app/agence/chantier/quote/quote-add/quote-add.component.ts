import { Component, Input, OnInit } from '@angular/core';
import { Construction } from '@model/construction';
import { Quote } from '@model/quote';
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

@Component({
  selector: 'app-quote-add',
  templateUrl: './quote-add.component.html',
  styleUrls: ['./quote-add.component.scss']
})
export class QuoteAddComponent implements OnInit {
  @Input() public type: string = "LOCATIVE"
  @Input() public isBon: boolean = false
  title: string = ""
  edit: boolean = false
  form: FormGroup
  submit: boolean = false
  quote: Quote
  provider: Provider
  construction: Construction
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

  selectedCopriete = {};

  constructor(
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private quoteService: QuoteService,
    private productService: ProductService,
    private uploadService: UploaderService,
    private providerService: ProviderService,
    private optionBudgetService: OptionBudgetService,
    private coproprieteService: CoproprieteService,
    private constructionService: ConstructionService,
    private infrastructureService: InfrastructureService
  ) {
    this.edit = this.quoteService.edit
    this.quote = this.quoteService.getQuote()
    this.title = (!this.edit) ? this.isBon ? "Ajouter un bon de commande " : "Ajouter un devis" : this.isBon ? "Modifier le bon de commande " : "Modifier le devis " + this.quote.code
    this.newForm()
    if (this.quoteService.getProvider()) {
      const provider = this.quoteService.getProvider()
      this.currentProvider = {
        photoSrc: provider?.photoSrc,
        title: provider?.nom,
        detail: provider?.telephone,
        uuid: provider?.uuid,
      };
      this.f.provider.setValue(provider.uuid)
      this.canChangeProvider = false
      this.quoteService.setProvider(null)
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

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      libelle: [null, [Validators.required]],
      construction: [null],
      house: [null],
      trustee: [null],
      copropriete: [null],
      infrastructure: [null],
      ligneBudgetaire: [null],
      provider: [null, [Validators.required]],
      date: [null, [Validators.required]],
      echeance: [null, [Validators.required]],
      type: [null],
      prestation: [0],
      montant: [0],
      montantHt: [0],
      montantTva: [0],
      montantRemise: [0],
      isBon: [this.isBon],
      folderUuid: [null],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      options: this.formBuild.array([])
    });
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
      const data = { ...this.quoteService.getQuote() }
    console.log(" data?nnnnnnnnnnnnnnn", data);
      
      this.setProviderUuid(data.provider.uuid);
      if (data.construction != null) this.setConstructionUuid(data.construction.uuid);
      data.date = DateHelperService.fromJsonDate(data?.date);
      data.echeance = DateHelperService.fromJsonDate(data?.echeance);
      this.construction = data?.construction
      this.trustee = data.trustee;
      this.houseCo = data.houseCo;
      this.homeCo = data.homeCo;
      this.infrastructure = data.infrastructure
      this.ligneBudgetaire = data.ligneBudgetaire
      this.currentProvider = {
        photoSrc: data?.provider?.photoSrc,
        title: data?.provider?.nom,
        detail: data?.provider?.telephone
      };
      this.currentLigneBudgetaire = {
        title: data?.ligneBudgetaire?.searchableTitle,
        detail: data?.ligneBudgetaire?.searchableDetail
      };
      this.currentConstruction = {
        title: data?.construction?.nom,
        detail: data?.construction?.telephone
      };
      if (this.type == "SYNDIC") {
    
        this.currentTrustee = {
          title: data?.trustee?.nom,
          detail: data?.trustee?.telephone
        };
        this.setTrusteeUuid(data.trustee?.uuid);
      }
      if (data.ligneBudgetaire) {
        this.setLigneBudgetaireUuid(data.ligneBudgetaire.uuid);
      }
      
      
      data?.options.forEach((item) => {
        if (item.product == null) {
          this.products.push({ uuid: item.product.uuid, libelle: item.product.libelle, prix: item.prix, tag: true })
        }
        this.option.push(
          this.formBuild.group({
            uuid: [item.product.uuid],
            id: [item.id],
            libelle: [item.product.libelle, [Validators.required]],
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
      this.f.construction?.setValue(data?.construction?.uuid);
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
  onDelete(i) {
    this.option.removeAt(i)
    this.onChangeTotal();
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      this.f.isBon.setValue(this.isBon)
      if (this.isBon) {
        this.f.type.setValue('FOURNITURE')
      }
      const data = this.form.getRawValue();
      this.quoteService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'QUOTE_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'QUOTE_ADD', payload: res?.data });
          }
        }
      });
    } else { return; }
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

  onSelectChange(item, event: any) {
    console.log('Selected option:', event);
    if (item && event) {
      if (event.tag) {
        item.get('libelle').setValue(event.libelle)
        item.get('produit').setValue(null);
        item.get('prix').setValue(event.prix);
      } else {
        item.get('produit').setValue(event.uuid);
        item.get('libelle').setValue(event.libelle)
        item.get('prix').setValue(event.prix)
      }
      this.onChangeTotal()
    } else {
      item.get('produit').setValue(null);
      item.get('libelle').setValue(null)
      item.get('prix').setValue(null)
      this.currentProduct = null;
      this.onChangeTotal()
    }
  }
  onSelectCoproprieteChange(event: any) {
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
  ngModal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  timelapse(dateD, dateF): string { return DateHelperService.getTimeLapse(dateD, dateF, false, 'dmy'); }
  get f() { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
  get option() { return this.form.get('options') as FormArray; }
}
