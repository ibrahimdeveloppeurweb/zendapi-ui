import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Budget } from '@model/budget';
import { EmitterService } from '@service/emitter/emitter.service';
import { BudgetService } from '@service/budget/budget.service';
import { FilterService } from '@service/filter/filter.service';
import { TypeLoadService } from '@service/typeLoad/type-load.service';
import { NgxPermissionsService } from 'ngx-permissions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TypeLoad } from '@model/typeLoad';
import { TypeLoadAddComponent } from '@agence/budget/type-load/type-load-add/type-load-add.component';
import { BudgetAddComponent } from '../budget-add/budget-add.component';
import { LoadCategory } from '@model/load-category';
import { Globals } from '@theme/utils/globals';
import { BudgetShowComponent } from '../budget-show/budget-show.component';
import { BudgetDevelopComponent } from '../budget-develop/budget-develop.component';
import { FundsapealService } from '@service/syndic/fundsapeal.service';
import { CategoryAddComponent } from '@agence/parametre/categorie/category-add/category-add.component';

@Component({
  selector: 'app-budget-list',
  templateUrl: './budget-list.component.html',
  styleUrls: ['./budget-list.component.scss'],
})
export class BudgetListComponent implements OnInit {
  ilot: boolean = false;
  lot: boolean = false;
  mtnFiltre: Boolean = false;
  code: Boolean = false;
  name: boolean = true;
  budgets: Budget[] = [];
  typeLoads: TypeLoad[] = [];
  loadCategory: LoadCategory[] = [];
  userSession = Globals.user
  global = {country: Globals.country, device: Globals.device};
  dtOptions: any = Globals.dataTable;
  filter: any;
  type: string = 'BUDGET';

  etatRow = [
    { label: 'INDISPONIBLE', value: 'INDISPONIBLE' },
    { label: 'DISPONIBLE', value: 'DISPONIBLE' },
  ];
  typeRow = [
    { label: 'BUDGET', value: 'BUDGET' },
    { label: 'TYPE DE CHARGE', value: 'TYPE_LOAD' },
  ];
  userTitle: string = 'Crée par';
  nameTitle: string = 'Syndic';
  ilotTitle: string = 'N° Ilot';
  lotTitle: string = 'N° Lot';
  minTitle: string = 'Montant MIN';
  maxTitle: string = 'Montant MAX';
  etatTitle: string = 'Disponibilité ?';
  annee: boolean = true
  cookie: string = '';

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private typeLoadService: TypeLoadService,
    private filterService: FilterService,
    private budgetService: BudgetService,
    private fundsapealService: FundsapealService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen'))
      ? JSON.parse(localStorage.getItem('permission-zen'))
      : [];
    this.permissionsService.loadPermissions(permission);
    this.budgetService.getList().subscribe(
      (res) => {
        return (this.budgets = res);
      },
      (error) => { }
    );
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'BUDGET_ADD' || data.action === 'BUDGET_UPDATE') {
        this.onChangeLoad('BUDGET');
      }
      if (data.action === 'TYPELOAD_ADD' || data.action === 'TYPELOAD_UPDATE') {
        this.onChangeLoad('TYPE_LOAD');
      }
    });
  }

  addTypeLoad() {
    this.modalService.dismissAll();
    this.typeLoadService.edit = false;
    this.modal(TypeLoadAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  appendToListType(item): void {
    this.typeLoads.unshift(item);
  }
  appendToList(item): void {
    this.typeLoads.unshift(item);
  }

  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null;
    this.budgets = [];
    this.typeLoads = [];
    this.filterService.search($event, 'budget', null).subscribe(
      (res) => {
        this.filter = this.filterService.filter;
        if (this.type === 'BUDGET') {
          this.budgets = res;
          return this.budgets;
        } else if (this.type === 'TYPE_LOAD') {
          this.typeLoads = res;
          return this.typeLoads;
        }
      },
      (err) => { }
    );
  }
  onChangeLoad($event) {
    this.type = $event;
    if ($event === 'BUDGET') {
      this.budgets = []
      this.ilot = false;
      this.lot = false;
      this.mtnFiltre = false;
      this.nameTitle = 'Syndic';
      this.name = true;
      this.etatTitle = 'Disponibilité ?';
      this.annee = true

      this.etatRow = [
        { label: 'BROUILLON', value: 'BROUILLON' },
        { label: 'ATTENTE', value: 'ATTENTE' },
        { label: 'EN COURS', value: 'EN COURS' },
        { label: 'VALIDE', value: 'VALIDE' },
        { label: 'REJETER', value: 'REJETER' },
        { label: 'TERMINE', value: 'TERMINE' },
      ];
      this.budgetService.getList().subscribe(
        (res) => {
          return (this.budgets = res);
        },
        (error) => { }
      );
    } else if ($event === 'TYPE_LOAD') {
      this.typeLoads = []
      this.mtnFiltre = true;
      this.ilot = false;
      this.name = false;
      this.lot = true;
      this.lotTitle = 'Type de charge';
      this.nameTitle = 'Bâtiment';
      this.etatTitle = null;
      this.annee = false
      this.etatRow = [];
      this.typeLoadService.getList().subscribe(
        (res) => {
          return (this.typeLoads = res);
        },
        (error) => { }
      );
    }
  }
  onPrinter() {
    if(this.type === 'BUDGET'){
      this.budgetService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if(this.type === 'TYPE_LOAD') {
      this.typeLoadService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }
  onModel() {
    // if(this.type === 'BUDGET'){
    //   this.budgetService.getGenerer();
    // } else if(this.type === 'BUILDING') {
    //   this.buildingService.getGenerer();
    // } else if(this.type === 'MAISON') {
    //   this.homeService.getGenerer();
    // } else if(this.type === 'HOMETYPE') {
    //   this.homeTypeService.getGenerer();
    // } else if(this.type === 'TYPE_CHANTIER') {
    //   this.workSiteService.getGenerer();
    // } else if(this.type === 'RAPPORT') {
    //   this.reportService.getGenerer();
    // }
  }
  validation(item, etat) {
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
        console.log('item',item)
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
  onExport() {
    // if(this.type === 'BUDGET'){
    //   this.budgetService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    // } else if(this.type === 'MAISON') {
    //   this.homeService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    // } else if(this.type === 'HOMETYPE') {
    //   this.homeTypeService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    // } else if(this.type === 'TYPE_CHANTIER') {
    //   this.workSiteService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    // } else if(this.type === 'RAPPORT') {
    //   this.reportService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    // }
  }
  add() {
    console.log('addBudget');
    this.modalService.dismissAll();
    this.budgetService.edit = false;
    this.modal(BudgetAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  edit(row,type) {
    this.budgetService.setBudget(row);
    this.budgetService.edit = true;
    this.budgetService.type = 'BUDGET'
    this.budgetService.uuidSyndic = row?.trustee?.uuid
    this.modal(BudgetAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  show(row, type) {
    this.budgetService.setBudget(row);
    this.budgetService.setType(type);
    if (type == 'SHOW') {
      this.router.navigate(['/admin/budget/show/' + row.uuid]);
    }else {
      this.modal(BudgetDevelopComponent, 'modal-basic-title', 'xl', true, 'static')
    }
  }
  delete(item) {
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
              this.onChangeLoad('BUDGET');
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
          Swal.fire('', error.message, 'error');
        })
      }
    });
  }
  printerBudget(row): void {
    this.budgetService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid,'BUDGET');
  }
  modal(component, type, size, center, backdrop) {
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

  generateFundsApeals(item, type) {
    let text = "";
    if(type == 'GENERAL'){
      text = 'généraux';
    }
    else if(type == 'RESERVE'){
      text = 'de réserve';
    }

    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment générer les appels de charges '+text+' ?',
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
              Swal.fire('Succès', 'Les appels de charges '+text+' ont été générés avec succès', 'success');
          }
        }, error => {
          Swal.fire('', error.message, 'error');
        })
      }
    });
  }

  generateStaticFundsApeals(uuid) {
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
        this.fundsapealService.generateFundsApeal(null, uuid).subscribe(res => {
          if (res?.code === 200) {
            Swal.fire('Succès', 'Les appels de charges ont été générés avec succès', 'success');
          }
        }, error => {
          Swal.fire('', error.error?.message, 'error');
        })
      }
    });
  }
}
