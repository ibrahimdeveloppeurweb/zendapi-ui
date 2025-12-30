import { Globals } from '@theme/utils/globals';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Budget } from '@model/budget';
import * as Highcharts from 'highcharts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BudgetService } from '@service/budget/budget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterService } from '@service/filter/filter.service';
import { HomeService } from '@service/home/home.service';
import { environment } from '@env/environment';
import { Home } from '@model/home';
import { UploaderService } from '@service/uploader/uploader.service';
import { Worksite } from '@model/worksite';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Tasks } from '@model/tasks';
import { TypeLoadService } from '@service/typeLoad/type-load.service';
import { FundsapealService } from '@service/syndic/fundsapeal.service';
import { BudgetAddComponent } from '@agence/budget/budget/budget-add/budget-add.component';
import { BudgetDevelopComponent } from '@agence/budget/budget/budget-develop/budget-develop.component';
import { BudgetEtatBudgetaireComponent } from '@agence/budget/budget/budget-etat-budgetaire/budget-etat-budgetaire.component';
import { BudgetEtatFinancierComponent } from '@agence/budget/budget/budget-etat-financier/budget-etat-financier.component';

interface GroupedOptionBudget {
  loadCategoryLibelle: string;
  typeLoadLibelles: { code: string, libelle: string; montantP: number ;montantV: number; charges: number; }[];
  totalMontantP: number;
  totalMontantV: number;
  totalCharges: number;
  loadCategoryCode: string
}

interface GroupedEtatBudget {
  loadCategoryLibelle: string;
  budgetValide: any;
  charges:number;
  typeLoadLibelles: { code: string,libelle: string; montantV: number ; charges:number; invoiceDetails:[]
    spents : {tresorerie:string, reference:string ,houseCo:string ,homeCo:string ,infrastructure:string ,code:string , libelle: string, budgetV:number, motif: string, date: string, montant: number}[]
  }[];
}

interface GroupedEtatFinancier {
  loadCategoryLibelle: string;
  loadCategoryCode: string;
  montant:number,
  paye:number,
  impaye:number,
  typeLoadLibelles:{}[];
}

@Component({
  selector: 'app-syndic-budget-show',
  templateUrl: './syndic-budget-show.component.html',
  styleUrls: ['./syndic-budget-show.component.scss']
})

export class SyndicBudgetShowComponent implements OnInit {
  public activeTab = 'BUDGET';
  ilot = false;
  lot = false;
  mtnFiltre = false;
  showTask = false;
  name= false;
  totalMontantP= 0
  totalEncaisse= 0
  totalMontantV= 0
  totalMontantVEtat = 0
  totalFactures= 0
  totalFactureP= 0
  totalFactureImP= 0
  totalCharges= 0
  totalChargesEtat= 0
  totalPaye= 0
  totalMontant= 0
  totalImPaye= 0
  totalMontantFiances = 0
  totalMontantFinance = 0
  totalPayeFinance= 0
  totalFondPaye= 0
  totalImPayeFinance = 0
  isHovered: boolean = false;

  montant: number = 0
  paye: number = 0
  reste: number = 0

  publicUrl = environment.publicUrl;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  budget: Budget;
  recaps = []
  dtOptions: any = Globals.dataTable;
  groupedOptions: GroupedOptionBudget[] = [];
  groupedEtatBugets: GroupedEtatBudget[] = [];
  groupedEtatFinancier : GroupedEtatFinancier[] = [];
  fundsapeals: any[] = []

  //variable du graph
  public Highcharts = Highcharts;
  public barBasicChartOptions: any
  public pieChartData: any;
  @ViewChild('doughnutChart', {static: false}) doughnutChart: ElementRef; // doughnut
  public pieChartTag: CanvasRenderingContext2D;

  type = 'BUDGET';
  etatRow = [
    { label: 'DISPONIBLE', value: 'DISPONIBLE' },
    { label: 'INDISPONIBLE', value: 'INDISPONIBLE' }
  ];
  typeRow = [
    { label: 'BUDGET', value: 'BUDGET' },
    { label: 'MAISON', value: 'MAISON' }
  ];
  categorieRow = [
    { label: 'RURAL', value: 'RURAL' },
    { label: 'URBAIN', value: 'URBAIN' }
  ];
  nameTitle = 'Catégorie de charge';
  userTitle = 'Crée par';
  ilotTitle = 'N° Ilot';
  lotTitle = 'N° Lot';
  minTitle = 'Montant MIN';
  maxTitle = 'Montant MAX';
  categorieTitle = 'Type de BUDGET';
  etatTitle = 'Disponibilité ?';
  file: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private typeLoadService: TypeLoadService,
    private fundsapealService: FundsapealService,
    private filterService: FilterService,
    private budgetService: BudgetService,
  ) {
    this.onChangeLoad(this.type);
  }

  ngOnInit(): void {
  }

  onFilter($event) {
    this.recaps = [];
    this.fundsapeals = []
    $event.type = this.activeTab;
    if($event.type !== 'APPEL_CHARGE') {
      this.filterService.search($event, 'budget', this.budget.uuid).subscribe(
        res => {
            if (this.activeTab === 'ETAT_BUDGETAIRE') {
              this.groupedEtatBugets = []
              this.etatBudgetaire(res,$event?.name)
            }
            if (this.activeTab === 'ETAT_FINANCIER') {  
              this.groupedEtatFinancier = []
              this.etatFinancier(res,$event?.name)
            }      
        }, err => { }
      );
    }

  }

  onChangeLoad(type): void {
    this.activeTab = type;
    if (type === 'BUDGET') {
      this.ilot = false;
      this.lot = false;
      this.mtnFiltre = false;
      if (!this.budget) {
        this.budgetService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          this.ligneBudgetaire(res);
          this.budget = res;
        });      
      }
    }
    if (type === 'ETAT_BUDGETAIRE') {
      this.typeRow = [{ label: 'Récapitulatif', value: 'RECAPITULATIF' }];
      this.name = true;
      this.nameTitle = 'Catégorie de charge';
      this.categorieRow = [];
      this.etatRow = [];     
      this.budgetService.getList(this.route.snapshot.params.id, 'ETAT_BUDGETAIRE').subscribe((res) => {        
        this.etatBudgetaire(res)
      }, error => { });
    }
    if (type === 'ETAT_FINANCIER') {
      this.typeRow = [{ label: 'Etat financier', value: 'ETAT_FINANCIER' }];
      this.name = true;
      this.nameTitle = 'Catégorie de charge';
      this.categorieRow = [];
      this.etatRow = [];     
      this.budgetService.getList(this.route.snapshot.params.id, 'ETAT_FINANCIER').subscribe((res: any) => {      
        this.etatFinancier(res)
      }, error => { });
    }
    if(type === 'APPEL_CHARGE') {
      this.fundsapealService.getList(this.budget.trustee.uuid, null).subscribe((res: any) => {
        let montant = 0
        let paye = 0
        let reste = 0
        res.forEach((item: any) => {
          montant += Number(item.montant)
          paye += Number(item.payer)
          reste += Number(item.reste)
        })
        this.montant = montant
        this.paye = paye
        this.reste = reste
        return this.fundsapeals = res
      })  
    }
  }
  ligneBudgetaire(res) {
    this.groupedOptions = []
    res.optionBudgets.forEach((option) => {
      const loadCategoryLibelle = option.typeLoad.loadCategory.libelle;
      const loadCategoryCode = option.typeLoad.loadCategory.code;
      const typeLoadLibelle = option.typeLoad.libelle;
      
      const code = option.typeLoad.code
      const montantP = option.montantP 
      const montantV = option.montantV 
      const charges = option.charges 
      const existingGroup = this.groupedOptions.find(
        (group) => group.loadCategoryLibelle === loadCategoryLibelle
      );
    
      if (existingGroup) {
        existingGroup.typeLoadLibelles.push({code: code, libelle: typeLoadLibelle, montantP: montantP , montantV: montantV, charges: charges});
        existingGroup.totalMontantP += montantP;
        existingGroup.totalMontantV += montantV;
        existingGroup.totalCharges += charges;
      } else {
        const newGroup: GroupedOptionBudget = {
          loadCategoryLibelle,
          loadCategoryCode,
          typeLoadLibelles: [{code:code, libelle: typeLoadLibelle, montantP: montantP, montantV: montantV , charges: charges}],
          totalMontantP: montantP,
          totalMontantV: montantV,
          totalCharges: charges,
        };
        this.groupedOptions.push(newGroup);
      }
    });
    //calcul des totaux
    let totalMontantP = 0
    let totalMontantV = 0
    let totalCharges = 0
    this.groupedOptions.forEach(element => {  
      totalMontantP += element.totalMontantP
      totalMontantV += element.totalMontantV  
      totalCharges += element.totalCharges  
    }); 

    let totalPaye = 0
    res.fundsApeals.forEach((option) => {
      totalPaye += option.payer
    });
    
    this.totalMontantP = totalMontantP
    this.totalEncaisse = totalPaye
    this.totalMontantV = totalMontantV
    this.totalCharges = totalCharges

  }
  etatBudgetaire(res,name?) {
    this.groupedEtatBugets = []
    if(res.length > 0) { 
      res[0].optionBudgets.forEach((option) => {
        const loadCategoryLibelle = option.typeLoad.loadCategory.libelle;
       
        let budget = this.groupedOptions.find(item=>{
          if(item.loadCategoryLibelle === loadCategoryLibelle) {
            return item.totalMontantV
          }
        })
        const budgetValide = budget.totalMontantV     
        const codeType = option.typeLoad.code
        const libelleType = option.typeLoad.libelle
  
        const montantV = option.montantV
        const charges = option.charges
  
        if(option.charges > 0) {
          let tresorerie  =''
          let despense = []
          option.spents.forEach(element => {
            const reference = element.code
            const houseCo = element.houseCo ? element.houseCo.nom : 'N/A'
            const homeCo = element.homeCo ? element.homeCo.nom : 'N/A'
            const infrastructure = element.infrastructure ? element.infrastructure.nom : 'N/A'
            const createdAt = element.createdAt ? element.createdAt : 'N/A';
            tresorerie = element.treasury ? element.treasury.nom : 'N/A'        
             despense.push({ tresorerie:tresorerie, reference:reference ,createdAt:createdAt,houseCo:houseCo ,homeCo:homeCo ,infrastructure:infrastructure , code:option.code, budgetV:montantV, libelle:option.libelle, motif: element.motif, montant: element.montant, date: element.date});
          });
  
          let totalP = 0
          let totalM = 0
          let totalIm = 0        
  
          const invoiceDetails = option.invoiceCos
          option.invoiceCos.forEach(element => {
            totalP += element.paye
            totalM += element.montant
            totalIm += element.impaye
            const reference = element.code
            const libelle = element.libelle ? element.libelle : 'N/A'
            const createdAt = element.createdAt ? element.createdAt : 'N/A';        
           });    
          
           const existingGroup = this.groupedEtatBugets.find(
            (group) => group.loadCategoryLibelle === loadCategoryLibelle
          );
          
          if (existingGroup) {
            existingGroup.typeLoadLibelles.push({code: codeType, libelle: libelleType, montantV: montantV, charges: charges ,spents:despense,invoiceDetails:invoiceDetails});        
            existingGroup.charges += charges;
          } else {
            const newGroup: GroupedEtatBudget = {
              loadCategoryLibelle,
              budgetValide,
              charges,
              typeLoadLibelles: [{code: codeType, libelle: libelleType, montantV: montantV, charges: charges ,spents:despense,invoiceDetails:invoiceDetails}],          
            };
            this.groupedEtatBugets.push(newGroup);
          }    
        }    
      });
  
      if (name != 'undefined' && name != undefined) {
          this.groupedEtatBugets = this.groupedEtatBugets.filter((element) => element.loadCategoryLibelle.toLowerCase().includes(name.toLowerCase()));     
      }else {
        this.groupedEtatBugets 
      }
    }  
    let totalMontantV = 0
    let totalCharges = 0
    this.groupedEtatBugets.forEach(element => {  
      element.typeLoadLibelles.forEach(item => {
        totalMontantV += item.montantV  
        totalCharges += item.charges  
      });
    });   
    this.totalMontantVEtat = totalMontantV
    this.totalChargesEtat = totalCharges
  }
  etatFinancier(res,name?) {
    this.groupedEtatFinancier = []
    let totalP = 0
    let totalM = 0
    let totalIm = 0
    let totalMontant = 0
    let totalPaye = 0
    let totalImPaye = 0
    if(res.length > 0) {
      res[0].optionBudgets.forEach((option) => {
        const loadCategoryLibelle = option.typeLoad.loadCategory.libelle;
        const loadCategoryCode = option.typeLoad.loadCategory.code;    
        const codeType = option.typeLoad.code
        const libelleType = option.typeLoad.libelle
        if(option.charges > 0 && option.invoiceCos.length > 0) {        
          let despense = []
          option.invoiceCos.forEach(element => {
            totalP = element.montantPaye
            totalM = element.montant
            totalIm = element.impaye
            const options = element.options
            const reference = element.code
            const libelle = element.libelle 
            const createdAt = element.createdAt ? element.createdAt : null;        
            const houseCo = element.houseCo ? element.houseCo.nom : null
            const homeCo = element.homeCo ? element.homeCo.nom : null
            const infrastructure = element.infrastructure ? element.infrastructure.nom : null
            const type = element.type
            const details = element
             despense.push({ houseCo:houseCo, homeCo:homeCo, infrastructure:infrastructure, type:type, reference:reference ,createdAt:createdAt, code:element.code, libelle:libelle, motif: element.motif, montant: element.montant, date: element.date, options:options,details:details});
          });    
          const impaye = totalIm       
          const montant = totalM       
          const paye = totalP       
               
          const existingGroup = this.groupedEtatFinancier.find(
            (group) => group.loadCategoryLibelle === loadCategoryLibelle
          );
        
          if (existingGroup) {
            existingGroup.typeLoadLibelles.push(despense);
            existingGroup.montant += montant;
            existingGroup.paye += paye;
            existingGroup.impaye += impaye;
          } else {
            const newGroup: GroupedEtatFinancier = {
              loadCategoryLibelle,
              loadCategoryCode,
              montant,
              paye,
              impaye,
              typeLoadLibelles:[despense],          
            };
            this.groupedEtatFinancier.push(newGroup);
          }   
        }
    
      });
      if (name != 'undefined' && name != undefined) {
        this.groupedEtatFinancier = this.groupedEtatFinancier.filter((element) => element.loadCategoryLibelle.toLowerCase().includes(name.toLowerCase()));     
      }else {
        this.groupedEtatFinancier 
      }
    }
    this.groupedEtatFinancier.forEach(element => {  
      element.typeLoadLibelles.forEach(item => {
        totalMontant += item[0]['details']['montant']  
        totalPaye += item[0]['details']['montantPaye']   
        totalImPaye += item[0]['details']['impaye']       
      });    
    });  
    
    this.totalMontantFiances = totalMontant    
    this.totalPayeFinance= totalPaye
    this.totalImPayeFinance = totalMontant - totalPaye

  }
  edit(row,type) {
    this.budgetService.setBudget(row);
    this.budgetService.edit = true;
    this.budgetService.type = 'BUDGET'
    this.budgetService.uuidSyndic = row?.trustee?.uuid
    if(type =='MODIFIER') {
      this.modal(BudgetAddComponent, 'modal-basic-title', 'xl', true, 'static')
    }else {
      this.modal(BudgetDevelopComponent, 'modal-basic-title', 'xl', true, 'static')
    }
  } 
  printerBudget(row,type): void {
    this.budgetService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid, type);
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
      if (willDelete.dismiss) { }
      else {
        this.budgetService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {this.back()}
        });}
    });
  }
  updateZoom(event): void {}
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  showEtat(data,item,type) {
    this.typeLoadService.setTypeLoad(data)
    this.typeLoadService.setInfo(item)
    if(type != 'ETAT_FINANCIER') {
      this.modal(BudgetEtatBudgetaireComponent, 'modal-basic-title', 'xl', true, 'static');   
    }else {
      this.modal(BudgetEtatFinancierComponent, 'modal-basic-title', 'xl', true, 'static');   
    }
  }
  back(){ window.history.back(); }
  toggleExpand(row: any) {
    row.isExpanded = !row.isExpanded;
  }
}
