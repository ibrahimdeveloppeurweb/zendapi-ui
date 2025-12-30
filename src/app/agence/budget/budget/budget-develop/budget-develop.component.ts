import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Budget } from '@model/budget';
import { Globals } from '@theme/utils/globals';
import { BudgetService } from '@service/budget/budget.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { EmitterService } from '@service/emitter/emitter.service';
import { BudgetAddComponent } from '../budget-add/budget-add.component';
interface GroupedOptionBudget {
  loadCategoryLibelle: string;
  typeLoadLibelles: { code: string, libelle: string; montantP: number ;montantV: number; charges: number; }[];
  totalMontantP: number;
  totalMontantV: number;
  totalCharges: number;
  uuid: string
  loadCategoryCode: string
}
@Component({
  selector: 'app-budget-develop',
  templateUrl: './budget-develop.component.html',
  styleUrls: ['./budget-develop.component.scss'],
})
export class BudgetDevelopComponent implements OnInit {
  title = '';
  type = '';
  budget: Budget;
  userSession = Globals.user;
  form: FormGroup;
  budgetList = [];
  budgetTotalV = 0;
  budgetTotalP = 0;
  selectedCategory: any;
  global = { country: Globals.country, device: Globals.device };
  groupedOptions: GroupedOptionBudget[] = [];

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private budgetService: BudgetService
  ) {
    this.newForm();
    this.getBudget();
  }

  ngOnInit(): void {}

  getBudget() {
    this.budget = this.budgetService.getBudget();
    this.type = this.budgetService.getType();    
    this.title = this.type == "VALIDE" ? 'Valider le '+ this.budget.libelle : 'Saisir le ' + this.budget.libelle;    
     this.budget.optionBudgets.forEach((item) => {      
      this.options.push(
        this.formBuild.group({
          uuid: [item.uuid],
          codeCategory: [
            item.typeLoad && item.typeLoad.loadCategory
              ? item.typeLoad.loadCategory.code
              : '',
          ],
          libelleCategory: [
            item.typeLoad && item.typeLoad.loadCategory
              ? item.typeLoad.loadCategory.libelle
              : '',
          ],
          uuidCategory: [
            item.typeLoad && item.typeLoad.loadCategory
              ? item.typeLoad.loadCategory.uuid
              : '',
          ],
          libelleType: [item.typeLoad ? item.typeLoad.libelle : ''],
          codeType: [item.typeLoad ? item.typeLoad.code : ''],
          budgetP: [item.montantP ? item.montantP : 0],
          budgetV: [item.montantV == 0 ? item.montantP : item.montantV],
        })
      );
      this.onChangeMontant();
    });
  }

  onChangeMontant() {
    let totalP = 0;
    let totalV = 0;
    this.options.controls.forEach((elem) => {
      if (elem.value.budgetP != undefined) {
        totalP += elem.value.budgetP;
        totalV +=
          elem.value.budgetV == 0 ? elem.value.budgetP : elem.value.budgetV;
      }
    });
    this.budgetTotalV = totalV;
    this.budgetTotalP = totalP;
  }
  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      etat: [null],
      options: this.formBuild.array([]),
    });
  }
  addBudget(row) {
    if (this.form.valid) {
      this.budgetService.addBudget(this.form.getRawValue()).subscribe(
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
  printer(row): void {
    // this.budgetService.getPrinter('SHOW', this.userSession.uuid, row.uuid);
  }
  onSubmit(etat) {
    if (this.form.valid) {
      console.log('this.budget', this.budget);
      this.form.patchValue({ uuid: this.budget.uuid, etat: etat });
      console.log('this.form.getRawValue()', this.form.getRawValue());
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

  onConfirme(budget, type?, autre?) {
    let etat = '';
   
    if(budget.etat == 'VALIDE') {
      etat = 'VALIDE';
    }else if(budget.etat == 'EN COURS') {
      if (type == 'BROUILLON') {
        etat = 'EN COURS';
      }else if (autre == 'VALIDE' && type == 'EN COURS') {
        etat = 'EN COURS';        
      }else {
        etat = 'VALIDE';        
      }
    }else {
      if (type == 'BROUILLON') {
        if (budget.etat == 'EN COURS') {
          etat = 'EN COURS';
        } else {
          etat = 'BROUILLON';
        }
    } else if (autre == 'VALIDE' && type == 'EN COURS') {
        if (budget.etat == 'EN COURS' && this.type != 'VALIDE') {
          etat = 'EN COURS';
        } else if(this.type == 'BROUILLON'){
          etat = 'EN COURS';
        }
    } else if(this.type == 'BROUILLON') {
        if (budget.etat == 'BROUILLON' && this.type == 'BROUILLON') {
          etat = 'EN COURS';
        } else{
          etat = 'VALIDE';
        }
      }
    }
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
    }).then((result) => {
      if (result.isConfirmed) { 
        if (etat == 'BROUILLON' && budget.etat == 'BROUILLON') {
          this.addBudget(budget);
        } else if (budget.etat == 'BROUILLON' && type == 'VALIDE') {
          this.onSubmit(etat);
        } else if (budget.etat == 'EN COURS' && type == 'BROUILLON') {
          this.addBudget(budget);
        } else {
          this.onSubmit(etat);
        }
      }      
    });
  }
  addType(row) {
  this.budgetService.setBudget(row);
  this.budgetService.edit = true;
  this.modale(BudgetAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
   modale(component, type, size, center, backdrop) {
    this.modalService
      .open(component, {
        ariaLabelledBy: type,
        size: size,
        centered: center,
        backdrop: backdrop,
      })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  get options() {
    return this.form.get('options') as FormArray;
  }
}
