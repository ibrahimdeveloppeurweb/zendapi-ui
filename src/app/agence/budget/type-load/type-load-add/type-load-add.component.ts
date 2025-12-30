import { CategoryAddComponent } from '@agence/parametre/categorie/category-add/category-add.component';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TypeLoad } from '@model/typeLoad';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanComptableService } from '@service/configuration/plan-comptable.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { LoadCategoryService } from '@service/load-category/load-category.service';
import { ProductService } from '@service/product/product.service';
import { SubFamilyService } from '@service/subFamily/sub-family.service';
import { TypeLoadService } from '@service/typeLoad/type-load.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-type-load-add',
  templateUrl: './type-load-add.component.html',
  styleUrls: ['./type-load-add.component.scss']
})
export class TypeLoadAddComponent implements OnInit {

  title: string = ""
  edit: boolean = false
  typeLoad: TypeLoad
  form: FormGroup
  productForm: FormGroup
  categories= []
  listProduits: any[] = [];
  submit: boolean = false
  selectedCategory: any;
  required = Globals.required

  constructor(
    public modale: NgbActiveModal,
    private formBuild: FormBuilder,
    private productService: ProductService,
    private modalService: NgbModal,
    private typeLoadService: TypeLoadService,
    private emitter: EmitterService,
    private loadCategoryService: LoadCategoryService,
    public toastr: ToastrService
  ) {
    this.edit = this.typeLoadService.edit
    this.typeLoad = this.typeLoadService.getTypeLoad()
    this.title = (!this.edit) ? "Créer un type de charge" : "Modifier un type de charge: "+this. typeLoad.libelle;
    this.newForm()
  }

  ngOnInit(): void {
    // this.loadCategories()
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      code: [null],
      category: [null, [Validators.required]],
      libelle: [null, this.getValidators('libelle')],
      products: this.formBuild.array([]),
      selectedTypeLoads: [null],
    });
    this.productForm = this.formBuild.group({
      uuid: [null],
      id: [null],
      libelle: [null, [Validators.required]],
    });
  }
  getValidators(fieldName: string) {
    if (this.edit) {
      return Validators.required;
    }
    return null;
  }
  add() {
    this.loadCategoryService.edit = false;
    this.modal(CategoryAddComponent, 'modal-basic-title', 'md', true, 'static');
  }
  addType() {
    let element = this.productForm.value
    let verif = true
    this.products.controls.forEach((control: FormControl) => {
      const value = control.value;
      if(value.libelle == element.libelle) {
            verif = false
        }
    });

    if (verif) {
      this.products.push(
        this.formBuild.group({
          index: [this.products.length + 1],
          libelle: [element.libelle],
        })
      );
      for (var i = 0; i < this.listProduits.length; i++) {
        if (this.listProduits[i].uuid == this.f.category.value) {
          this.listProduits.splice(i, 1);
        }
      }
      this.listProduits = [...this.listProduits];
      this.f.libelle.setValue(null);
      this.productForm.reset();
    }else {
      Swal.fire( 'Attention !', 'Ce Type de charge a été déjà ajouté!', 'warning' );
    }
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.typeLoadService.getTypeLoad() }
      this.selectedCategory = {
        title: data.loadCategory.searchableTitle,
        detail: data.loadCategory.searchableDetail
      }
      this.form.patchValue(data)
      this.f.category.setValue(data.loadCategory ? data.loadCategory.uuid : null)
    }
  }
  setCategoryUuid(uuid) {
    if(uuid){
      this.f.category.setValue(uuid);
    } else {
      this.f.category.setValue(null);
    }
  }
  loadCategories() {
    this.loadCategoryService.getList().subscribe((res) => {
        return this.categories = res;
      }, error => {}
    )
  }
  onSubmit() {
      this.submit = true;
      if(this.products.value.length === 0 && this.edit === false) {
        Swal.fire( 'Attention !', 'Veuillez ajouter les types de charges', 'warning' );
        return;
      }else {
        if (this.form.valid) {
          this.typeLoadService.add(this.form.getRawValue()).subscribe(res => {
            if (res?.status === 'success') {
              this.modale.close('ferme');
              if (this.form.getRawValue().uuid) {
                this.emitter.emit({action: 'TYPELOAD_UPDATE', payload: res?.data});
              } else {
                this.emitter.emit({action: 'TYPELOAD_ADD', payload: res?.data});
              }
            }
          }, error => {});
        } else {
          return;
        }
      }      
  }
  onDelete(item, i) {
    this.listProduits = [...this.listProduits, item];
    this.products.removeAt(i);
    this.deleted.push(
      this.formBuild.group({
        uuid: [item.uuid],
      })
    );
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
  onClose() {
    this.form.reset()
    this.modale.close('ferme');
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => { });
  }
  get f() { return this.form.controls; }
  get r() { return this.productForm.controls}
  get products() { return this.form.get('products') as FormArray; }
  get deleted() { return this.form.get('deleted') as FormArray; }
}
