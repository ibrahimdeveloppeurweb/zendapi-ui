import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Budget } from '@model/budget';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanComptableService } from '@service/configuration/plan-comptable.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { ProductService } from '@service/product/product.service';
import { SubFamilyService } from '@service/subFamily/sub-family.service';
import { BudgetService } from '@service/budget/budget.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TypeLoadService } from '@service/typeLoad/type-load.service';
import { TypeLoad } from '@model/typeLoad';
import { LoadCategoryService } from '@service/load-category/load-category.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { TantiemeService } from '@service/syndic/tantieme.service';
import { MandateSyndicService } from '@service/syndic/mandate-syndic.service';

@Component({
  selector: 'app-budget-add',
  templateUrl: './budget-add.component.html',
  styleUrls: ['./budget-add.component.scss'],
})
export class BudgetAddComponent implements OnInit {
  title: string = '';
  edit: boolean = false;
  showTask: boolean = false;
  mandat: boolean = true;
  showTantieme: any[] = [];
  budget: Budget;
  trustes: any[] = [];
  mandats: any[] = [];
  trustee: any;
  typeLoad: TypeLoad;
  form: FormGroup;
  productForm: FormGroup;
  typeLoadForm: FormGroup;
  typetList: any[] = [];
  familySelected = '';
  currentMandat: any ='';
  selectedSubFamily: string[] = [];
  typeLoads: any = [];
  submit: boolean = false;
  accounts: any;
  syndicYear: any;
  syndicSelected: any;
  yearSelected: any;
  agency = Globals.user.agencyKey;
  productSelected: any;
  required = Globals.required;
  selectedCategory: any;
  modeCotisation: any;
  selectedTypeLoads: string[] = [];
  selectedTantieme: string[] = [];
  tantiemes = [];
  tantiemesOld = [];

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private productService: ProductService,
    private mandateSyndicService : MandateSyndicService,
    private budgetService: BudgetService,
    private emitter: EmitterService,
    private typeLoadService: TypeLoadService,
    private syndicService: SyndicService,
    private tantiemeService: TantiemeService,
    public toastr: ToastrService
  ) {
    this.getListtrustee();
    this.edit = this.budgetService.edit;
    this.budget = this.budgetService.getBudget();
    this.typeLoads = this.typeLoadService.getList();
    this.title = !this.edit
      ? 'Créer un budget'
      : 'Modifier le ' + this.budget.libelle;
    this.newForm();
    if(this.budgetService.type === 'SYNDIC'){
      this.getListtrustee()
      this.syndicService.getSingle(this.budgetService.uuidSyndic).subscribe((res: any) => {
        this.f.trustee.setValue(res.uuid)
        this.modeCotisation = res.mode
        this.loadTrantieme(res.uuid)
      })
      this.loadSyndicMandat(this.budgetService.uuidSyndic)
      this.budgetService.type = null
      this.budgetService.uuidSyndic = null
    }
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      trustee: [null, [Validators.required]],
      mandat: [null, [Validators.required]],
      types: this.formBuild.array([]),
      deleted: this.formBuild.array([]),
    });
    this.typeLoadForm = this.formBuild.group({
      uuid: [null],
      id: [null],
      category: [null, [Validators.required]],
      tantieme: [null, this.getValidators('tantieme')],
      typeLoad: [null, [Validators.required]],
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.budgetService.getBudget() };
      this.getListtrustee();

      this.syndicService
        .getSingle(this.budgetService.uuidSyndic)
        .subscribe((res: any) => {
          this.loadTrantieme(res.uuid);
          this.f.trustee.setValue(res.uuid);
        });

      this.loadSyndicMandat(this.budgetService.uuidSyndic)

      this.mandateSyndicService.getList(this.budgetService.uuidSyndic).subscribe((res: any) => {
        if(res) {
          res.filter(item=>{
            if(item.anneeEx === data.anneeEx) {
              this.loadSyndicMandat(this.budgetService.uuidSyndic)
              this.f.mandat.setValue(item.uuid);
            }
          })
        }
      })

      this.f.uuid.setValue(data.uuid);
      data.optionBudgets.forEach((element) => {
        this.types.push(
          this.formBuild.group({
            uuid: [element.uuid],
            type: [element.typeLoad.uuid],
            category: [element.typeLoad.loadCategory.libelle],
            categoryUuid: [element.typeLoad.loadCategory.uuid],
            typeLoad: [element.typeLoad.uuid],
            libelle: [element.typeLoad.loadCategory.libelle],
            tantieme: [element.typeLoad.loadCategory.currentTantieme ? element.typeLoad.loadCategory.currentTantieme.uuid : ''],
            libTantieme: [element.typeLoad.loadCategory.currentTantieme ? element.typeLoad.loadCategory.currentTantieme.libelle : ''],
            details: [element.typeLoad.libelle],
          })
        );
      });
    }
  }
  getValidators(fieldName: string) {
    if (this.showTantieme.length == 0) {
      return Validators.required;
    }
    return null;
  }
  setSyndicUuid(uuid) {
    if (uuid) {
      this.f.trustee.setValue(uuid);
      this.loadSyndic(uuid);
      this.loadTrantieme(uuid);
    } else {
      this.f.trustee.setValue(null);
    }
  }
  setMandatUuid(uuid) {
    if (uuid) {
      this.f.mandat.setValue(uuid);
    } else {
      this.f.mandat.setValue(null);
    }
  }
  getListtrustee() {
    this.syndicService.getList(this.agency).subscribe(
      (res) => {
        this.trustes = res;
      },
      (error) => {}
    );
  }
  getMandat() {
    this.syndicService.getList(this.agency).subscribe(
      (res) => {
        this.trustes = res;
      },
      (error) => {}
    );
  }
  loadTrantieme(uuid) {
    this.tantiemeService.getList(null, uuid).subscribe(
      (res) => {
        this.tantiemesOld = res
        return this.tantiemes = res;
      },
      (error) => {}
    );
  }
  addType() {
    if (this.typeLoadForm.value.typeLoad && this.typeLoadForm.value.typeLoad.length == 0 ||this.typeLoadForm.value.typeLoad == null ) {
      Swal.fire(
        'Attention !',
        'Veuillez selectionnez des types de charge !',
        'warning'
      );
      return;
    }
    if (this.showTantieme.length === 0 && this.modeCotisation === 'TANTIEME' &&  this.typeLoadForm.value.tantieme == null) {
      Swal.fire(
        'Attention !',
        'Veuillez selectionnez le millième lié à cette catégorie de charge!',
        'warning'
      );
    }
    const verif = this.types.controls.filter((item) => {
      return this.typeLoadForm.value.typeLoad.find((row) => {

        if (
          row.uuid === item.get('type').value &&
          // row.loadCategory.uuid === item.get('categoryUuid').value
          row.categoryUuid === item.get('categoryUuid').value
        ) {
          return row;
        }
      });
    });

    if(this.showTantieme.length == 0 && this.modeCotisation === 'TANTIEME') {
      const tantieme = this.typeLoadForm.value.tantieme.uuid;
      this.tantiemes = this.tantiemes.filter(function (row) {
        return row.uuid != tantieme;
      });
    }
    if (verif.length == 0) {
      this.typeLoadForm.value.typeLoad.forEach((element) => {

        this.types.push(
          this.formBuild.group({
            index: [this.types.length + 1],
            category: [this.typeLoadForm.value.category],
            categoryUuid: [element.categoryUuid],
            typeSelect: [this.typeLoadForm.value.type],
            type: [element.uuid, [Validators.required]],
            libelle: [element.categoryLibelle],
            details: [element.libelle],
            tantieme: [ this.modeCotisation === 'TANTIEME' ? (this.typeLoadForm.value.tantieme ? this.typeLoadForm.value.tantieme.uuid : this.showTantieme[0].value.tantieme) : null],
            libTantieme: [
              this.modeCotisation === 'TANTIEME' ? ( this.typeLoadForm.value.tantieme
                ? this.typeLoadForm.value.tantieme.libelle
                : this.showTantieme[0].value.libelle) : null
            ],
          })
        );
      });
      for (var i = 0; i < this.typetList.length; i++) {
        if (this.typetList[i].uuid == this.t.category.value) {
          this.typetList.splice(i, 1);
        }
      }

      this.typetList = [...this.typetList];
      this.selectedTypeLoads = [];
      this.selectedTantieme = [];
      this.t.category.setValue(null);
      this.selectedCategory = null;
      this.typeLoadForm.reset();
    } else {
      Swal.fire(
        'Attention !',
        'Cette type de charge de cette catégorie a été déjà ajouté!',
        'warning'
      );
    }
  }
  loadSyndic(uuid) {
    this.syndicService.getSingle(uuid).subscribe(
      (res: any) => {
        console.log(res)
        this.trustee = res;
        this.modeCotisation = this.trustee.mode
        this.loadSyndicMandat(uuid)
      },
      (error) => {}
    );
  }
  loadSyndicMandat(uuid) {
    this.mandateSyndicService.getList(uuid).subscribe((res: any) => {
      return this.mandats = res
    })
  }
  loadCategories(uuid) {
    this.typeLoadService.getList(uuid).subscribe(
      (res) => {
        return (this.typeLoads = res);
      },
      (error) => {}
    );
  }
  setCategoryUuid(uuid) {
    if (uuid) {
      this.t.category.setValue(uuid);
      this.showTantieme = []
      console.log(this.types)
      this.types.controls.find(item=>{
        if(uuid == item.value.category) {
          this.showTantieme.push(item)
        }
      })
      this.loadCategories(uuid);
    } else {
      this.t.typeLoad.setValue(null);
      this.t.category.setValue(null);
      this.selectedTypeLoads = null;
    }
  }
  onSubmit() {
    if (this.form.valid && this.f.trustee.value) {
      this.submit = true;
      this.budgetService.add(this.form.getRawValue()).subscribe(
        (res) => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
            if (this.form.getRawValue().uuid) {
              this.emitter.emit({
                action: 'BUDGET_UPDATE',
                payload: res?.data,
              });
            } else {
              this.emitter.emit({
                action: 'BUDGET_ADD',
                payload: res?.data,
              });
            }
          }
        },
        (error) => {}
      );
    } else {
      return;
    }
  }
  onConfirme() {
    Swal.fire({
      title: '',
      text: "Confirmez-vous l'enregistrement ?",
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true,
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.onSubmit();
      }
    });
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
  onDelete(item, i) {
    this.loadTrantieme(this.f.trustee.value);
    this.typetList = [...this.typetList, item];
    this.types.removeAt(i);
    this.deleted.push(
      this.formBuild.group({
        uuid: [item.uuid],
      })
    );
  }
  get f() {
    return this.form.controls;
  }
  get t() {
    return this.typeLoadForm.controls;
  }
  get deleted() {
    return this.form.get('deleted') as FormArray;
  }
  get budgets() {
    return this.form.get('budgets') as FormArray;
  }
  get types() {
    return this.form.get('types') as FormArray;
  }
}
