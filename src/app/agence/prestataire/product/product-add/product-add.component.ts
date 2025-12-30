import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '@service/product/product.service';
import { Product } from '@model/product';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SubFamilyService } from '@service/subFamily/sub-family.service';
import { FamilyAddComponent } from '@agence/prestataire/family/family-add/family-add.component';
import { SubFamilyAddComponent } from '@agence/prestataire/subFamily/sub-family-add/sub-family-add.component';
import { FamilyService } from '@service/family/family.service';
import { PlanComptableService } from '@service/configuration/plan-comptable.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  title: string = ""
  type: string = ""
  sousFamille: string = ""
  edit: boolean = false
  product: Product
  form: FormGroup
  submit: boolean = false
  show: boolean = false
  required = Globals.required;
  familySelected:any
  selecteSubFamily= ''
  accountSelected:any
  selectedSubFamily: string[] = [];
  subFamilys= []
  accounts= []
  typeRow = [
    { label: 'PRODUIT', value: 'PRODUIT' },
    { label: 'SERVICE', value: 'SERVICE' }
  ]
  AchatRow = [
    { label: 'EN ACHAT', value: 'EN ACHAT' },
    { label: 'EN VENTE', value: 'EN VENTE' },
    { label: 'EN ACHAT & VENTE', value: 'ACHAT VENTE' }
  ]

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,  
    private productService: ProductService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private familyService: FamilyService,
    private subFamilyService: SubFamilyService,
    public toastr: ToastrService,
    private planComptableService: PlanComptableService
  ) {
    this.edit = this.productService.edit
    if(this.edit) { this.show = true}
    this.product = this.productService.getProduct()
    this.title = (!this.edit) ? "Ajouter une ressource" : "Modifier la ressource "+this.product.libelle
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form =  this.formBuild.group({
      uuid: [null],
      id: [null],
      prixVHT: [null],
      stock: [null],
      stockAlerte: [null],      
      account: [null],
      type: [null, [Validators.required]],
      etat: [null, [Validators.required]],
      libelle: [null, [Validators.required]],
      prix: [null, [Validators.required]],
      unite: [null, [Validators.required]],
      family: [null, [Validators.required]],
      subFamily:[null, [Validators.required]],
      numero:[null],
    })
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.productService.getProduct() }    
      this.familySelected = {
        title: data.subFamily.family.searchableTitle,
        detail: data.subFamily.family.searchableDetail
      }
      this.generateNumero((data.auxiliairy ? data.auxiliairy.uuid : null), data.libelle)
      if (data.account) {
        this.accountSelected = {
          title: data.account.searchableTitle,
          detail: data.account.searchableDetail
        }
      } 
      this.sousFamille = data.subFamily.libelle
      this.form.patchValue(data)
      this.f.family.setValue(data.subFamily.family.uuid)
      this.f.account.setValue(data.account.uuid)
      this.f.subFamily.setValue(data.subFamily.uuid)

    }
  }
  setFamilyUuid(uuid) {
    if(uuid){
      if(this.edit) {
        this.show = true;
      }
      if(this.sousFamille.length == 0) {
        this.show = false;
      } 
      this.f.family.setValue(uuid);    
      this.loadSubFamily(uuid)
    } else {
      this.show = false;
      this.sousFamille = ''  
      this.f.family.setValue(null);
      this.f.subFamily.setValue(null)
    }
  }
  setAccountUuid(uuid) {
    if(uuid){
      this.f.account.setValue(uuid);
      if (this.f.libelle.value) {
        this.generateNumero(uuid, this.f.libelle.value)
      }
    } else {
      this.f.account.setValue(null);
    }
  }
  onDesignationChange() {
    let accountUuid = this.f.account.value
    let libelle = this.f.libelle.value
    if (accountUuid && libelle) {
      this.generateNumero(accountUuid, libelle)
    }
  } 
  loadSubFamily(uuid) {
    this.subFamilyService.getList(uuid).subscribe((res) => {   
        return this.subFamilys = res;
      }, error => {}
    )
  }
  addFamily() {
    this.familyService.edit = false
    this.modal(FamilyAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  addSubFamily() {
    this.subFamilyService.edit = false
    this.modal(SubFamilyAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  onSubmit() {
    if (this.form.valid) {
      this.submit = true;
      const PRODUCT = this.form.value;
      this.productService.add(PRODUCT).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modale.dismiss();
            this.modale.close('ferme');
            this.emitter.emit({action: this.edit ? 'PRODUCT_UPDATED' : 'PRODUCT_ADD', payload: res?.data});
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      return;
    }
  } 
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => { });
  }
  onClose(){
    this.form.reset()
    this.modale.close('ferme');
  }
  toast(msg, title, type): void {
    if (type === 'info') {
      this.toastr.info(msg, title);
    } else if (type === 'success') {
      this.toastr.success(msg, title);
    } else if (type === 'warning') {
      this.toastr.warning(msg, title);
    } else if (type === 'error') {
      this.toastr.error(msg, title);
    }
  }

  generateNumero(uuid, libelle) {
    if (uuid && libelle) {
      this.planComptableService.getSingle(uuid).subscribe((res) => {
        if (res) {
          let string = res.baseNumero.toString()
          let label_prefix = libelle.substring(0, 3).toUpperCase();
          let numero = string + label_prefix;

          if (numero.length < 6) {
            while (numero.length < 6) {
              string += "0";
              numero = string + label_prefix;
            }
          } else if (numero.length > 6) {
            let difference = numero.length - 6;
            string = string.slice(0, -difference);
            numero = string + label_prefix;
          }

          this.f.numero.setValue(numero)
        }
      })
    }
  }
  
  get f() { return this.form.controls }
}
