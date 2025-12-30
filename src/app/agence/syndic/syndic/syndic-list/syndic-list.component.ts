import { Component, OnInit } from '@angular/core';
import { SyndicService } from '@service/syndic/syndic.service';
import { MandateSyndicService } from '@service/syndic/mandate-syndic.service';
import { Globals } from '@theme/utils/globals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SyndicAddComponent } from '../syndic-add/syndic-add.component';
import { SyndicMandateAddComponent } from '@agence/syndic/syndic-mandate/syndic-mandate-add/syndic-mandate-add.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CoproprieteService } from '@service/syndic/copropriete.service';
import { InfrastructureService } from '@service/syndic/infrastructure.service';
import { CondominiumAddComponent } from '@agence/proprietaire/condominium/condominium-add/condominium-add.component';
import { InfrastructureAddComponent } from '@agence/syndic/infrastructure/infrastructure-add/infrastructure-add.component';
import { environment } from '@env/environment';
import { HomeCoService } from '@service/syndic/home-co.service';
import { FilterService } from '@service/filter/filter.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { RentalService } from '@service/rental/rental.service';
import { HouseService } from '@service/house/house.service';
import { OwnerService } from '@service/owner/owner.service';
import { Rental } from '@model/rental';
import { House } from '@model/house';
import { Owner } from '@model/owner';
import { OwnerAddComponent } from '@agence/proprietaire/owner/owner-add/owner-add.component';
import { RentalAddComponent } from '@agence/proprietaire/rental/rental-add/rental-add.component';
import { HouseAddComponent } from '@agence/proprietaire/house/house-add/house-add.component';
import { BudgetAddComponent } from '@agence/budget/budget/budget-add/budget-add.component';
import { TypeLoadAddComponent } from '@agence/budget/type-load/type-load-add/type-load-add.component';
import { SyndicCondominiumAddComponent } from '@agence/syndic/syndic-condominium/syndic-condominium-add/syndic-condominium-add.component';
import { OwnerCoAddComponent } from '@agence/syndic/owner-co/owner-co-add/owner-co-add.component';
import { OwnerCoService } from '@service/owner-co/owner-co.service';
import { OwnerCoShowComponent } from '@agence/syndic/owner-co/owner-co-show/owner-co-show.component';
import { BudgetService } from '@service/budget/budget.service';
import { Budget } from '@model/budget';
import { TypeLoad } from '@model/typeLoad';
import { TypeLoadService } from '@service/typeLoad/type-load.service';

@Component({
  selector: 'app-syndic-list',
  templateUrl: './syndic-list.component.html',
  styleUrls: ['./syndic-list.component.scss']
})
export class SyndicListComponent implements OnInit {

  filter: any;
  action: boolean = true;
  dtOptions: any = {};
  etat: boolean = false;se;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  type: string = 'SYNDIC';
  categorie: boolean = false
  etatRow = [
    { label: 'PREVU', value: 'PREVU' },
    { label: 'EN COURS', value: 'EN COURS' },
    { label: 'STOPPER', value: 'STOPPER' },
    { label: 'ACHEVE', value: 'ACHEVE' }
  ];
  typeRow = [
    { label: 'SYNDIC', value: 'SYNDIC' },
    { label: 'CO-PROPRIETAIRE', value: 'CO-PROPRIETAIRE' },
    { label: 'BIEN', value: 'BIEN' },
    { label: 'LOCATIVE', value: 'LOCATIVE' },
    { label: 'MANDAT', value: 'MANDAT' },
    { label: 'INFRASTRUCTURE', value: 'INFRASTRUCTURE' },
    { label: 'BUDGET', value: 'BUDGET' },
    { label: 'TYPE LOAD', value: 'TYPE_LOAD' },
  ];
  nameTitle: string = "Libellé"
  bienTitle: string = ""
  userTitle: string = "Crée par"
  categorieTitle: string = ""
  etatTitle: string = "Etat ?"
  categorieRow = [];
  name = true
  bien = false
  dateD = true
  dateF = true
  agency = Globals.user.agencyKey
  syndics: any[] = []
  mandats: any[] = []
  owners: Owner[];
  houses: House[];
  rentals: Rental[];
  coowners: Rental[];
  publicUrl = environment.publicUrl;
  coproprietes: any[] = []
  infrastructures: any[] = []
  visible: boolean = false;
  min: boolean = false;
  max: boolean = false;
  budgets: Budget[] = [];
  typeLoads: TypeLoad[] = [];

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private filterService: FilterService,
    private homeCoService: HomeCoService,
    private ownerCoService: OwnerCoService,
    private houseService: HouseService,
    private rentalService: RentalService,
    private syndicServicee: SyndicService,
    private mandatService: MandateSyndicService,
    private coproprieteService: CoproprieteService,
    private infrastructureService: InfrastructureService,
    private permissionsService: NgxPermissionsService,
    private emitter: EmitterService,
    private budgetService: BudgetService,
    private typeLoadService: TypeLoadService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen'))
      ? JSON.parse(localStorage.getItem('permission-zen'))
      : [];
    this.permissionsService.loadPermissions(permission);

    if(this.syndicServicee.return === 'SYNDIC_LIST'){
      this.onChangeLoad('LOT')
      this.syndicServicee.return = null
    }else {
      this.syndicServicee.getList(null).subscribe(res => {
        this.syndics = res;
        return this.syndics;
      })
    }
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'SYNDIC_ADD' || data.action === 'SYNDIC_UPDATE') {
        this.onChangeLoad('SYNDIC');
      }
      if (data.action === 'MANDAT_SYNDIC_ADD' || data.action === 'MANDAT_SYNDIC_UPDATED') {
        this.onChangeLoad('MANDAT');
      }
      if (data.action === 'COPROPRIETE_ADD' || data.action === 'COPROPRIETE_UPDATED') {
        this.onChangeLoad('LOT');
      }
    });
  }

  onFilter($event){
    this.syndics = []
    this.mandats = []
    this.coproprietes = []
    this.owners = []
    this.coowners = []
    this.infrastructures = []
    $event.type = this.type
    this.budgets = [];
      this.typeLoads = [];
    if (this.type === 'BUDGET' || this.type === 'TYPE_LOAD') {
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
      
    } else {
      this.filterService.search($event, 'trustee', null).subscribe(
        res => {
          if(this.type === 'SYNDIC'){
            return this.syndics = res
          } else if(this.type === 'MANDAT'){
            this.mandats = res
            return this.mandats = res
          } else if(this.type === 'LOT'){
            return this.coproprietes = res
          } else if(this.type === 'INFRASTRUCTURE'){
            return this.infrastructures = res
          } else if (this.type === 'PROPRIETAIRE') {
            this.owners = res;
            return this.owners;
          }  else if (this.type === 'CO-PROPRIETAIRE') {
            this.coowners = res;
            return this.coowners;
          } else if (this.type === 'BIEN') {
            this.houses = res;
            return this.houses;
          } else if (this.type === 'LOCATIVE') {
            this.rentals = res;
            return this.rentals;
          }
        }
      )
      
    }
  
  }

  onChangeLoad($event){
    this.type = $event
    if ($event === 'SYNDIC') {
      this.etat = false
      this.name = true
      this.nameTitle = 'Syndic'
      this.bien = false
      this.bienTitle = 'Libellé'
      this.categorie = false
      this.typeRow = [
        { label: 'SYNDIC', value: 'SYNDIC' },
        { label: 'MANDAT', value: 'MANDAT' },
        { label: 'LOT', value: 'LOT' },
        { label: 'INFRASTRUCTURE', value: 'INFRASTRUCTURE' },
      ];
      this.syndicServicee.getList(null).subscribe(res => { return this.syndics = res; }, error => { });
    }else if ($event === 'MANDAT') {
      this.categorie = false
      this.etat = false
      this.name = false
      this.bien = true
      this.bienTitle = 'Libellé'
      this.typeRow = [
        { label: 'MANDAT', value: 'MANDAT' },
        { label: 'SYNDIC', value: 'SYNDIC' },
        { label: 'LOT', value: 'LOT' },
        { label: 'INFRASTRUCTURE', value: 'INFRASTRUCTURE' },
      ];
      this.mandatService.getList(null).subscribe(res => {
         return this.mandats = res; }, error => { });
    }else if($event === 'LOT'){
      this.categorie = true
      this.name = true
      this.nameTitle = 'Numéro de lot'
      this.categorieTitle = 'Type de lot'
      this.bien = false
      this.categorieRow = [
        { label: 'VERTICAL', value: 'VERTICAL' },
        { label: 'HORIZONTAL', value: 'HORIZONTAL' }
      ];
      this.typeRow = [
        { label: 'LOT', value: 'LOT' },
        { label: 'SYNDIC', value: 'SYNDIC' },
        { label: 'MANDAT', value: 'MANDAT' },
        { label: 'INFRASTRUCTURE', value: 'INFRASTRUCTURE' },
      ];
      this.homeCoService.getList(null,null,null,null).subscribe((res: any) => {
        return this.coproprietes = res
      })
    }else if($event === 'INFRASTRUCTURE'){
      this.name = true
      this.bien = true
      this.nameTitle = 'Numéro de lot'
      this.bienTitle = 'Libellé infrastructure'
      this.categorie = true
      this.categorieTitle = "Type d'infrastructure"
      this.categorieRow = [
        {label: 'Ascenseur', value: 'ASCENSEUR'},
        {label: 'Partie commune', value: 'PARTIE COMMUNE'},
        {label: 'Parking', value: 'PARKING'},
        {label: 'Jardin', value: 'JARDIN'},
        {label: 'Piscine', value: 'PISCINE'},
        {label: 'Aire de jeux', value: 'AIRE DE JEUX'}
      ];
      this.typeRow = [
        { label: 'INFRASTRUCTURE', value: 'INFRASTRUCTURE' },
        { label: 'SYNDIC', value: 'SYNDIC' },
        { label: 'MANDAT', value: 'MANDAT' },
        { label: 'LOT', value: 'LOT' },
      ];
      this.infrastructureService.getList(null).subscribe((res: any) => { return this.infrastructures = res }, error => { })
    } else if ($event === 'PROPRIETAIRE') {
      this.bien = false;
      this.min = false;
      this.max = false;
      this.nameTitle = "Nom / Raison sociale"
      this.categorieTitle = 'Type de propriétaire'
      this.etatRow = [];
      this.categorieRow = [
        { label: 'PARTICULIER', value: 'PARTICULIER' },
        { label: 'ENTREPRISE', value: 'ENTREPRISE' }
      ];
      this.visible = false;
      this.ownerCoService.getList().subscribe(res => {
        return this.owners = res;
      }, error => { });
      this.etat = true
      this.etatTitle = "Mandats"
    }  else if ($event === 'CO-PROPRIETAIRE') {
      this.bien = false;
      this.min = false;
      this.max = false;
      this.nameTitle = "Nom / Raison sociale"
      this.categorieTitle = 'Type de co-propriétaire'
      this.etatRow = [];
      this.categorieRow = [
        { label: 'PARTICULIER', value: 'PARTICULIER' },
        { label: 'ENTREPRISE', value: 'ENTREPRISE' }
      ];
      this.visible = false;
      this.ownerCoService.getList(null, null, true).subscribe(res => {
        return this.coowners = res;
      }, error => { });
      this.etat = true
      this.etatTitle = "Mandats"
    } else if ($event === 'BIEN') {
      this.bien = true;
      this.min = false;
      this.max = false;
      this.bienTitle = "Nom du bien"
      this.nameTitle = "Propriétaire"
      this.categorieTitle = 'Type de bien'
      this.etatRow = [
        { label: 'DISPONIBLE', value: 'DISPONIBLE' },
        { label: 'VENDU', value: 'VENDU' }
      ];
      this.categorieRow = [
        { label: 'EN LOCATION', value: 'LOCATION' },
        { label: 'EN VENTE', value: 'VENTE' }
      ];
      this.visible = false;
      this.houseService.getList().subscribe(res => { return this.houses = res; }, error => { });
      this.etatTitle = "Disponibilité ?"
    } else if ($event === 'LOCATIVE') {
      this.bien = true;
      this.min = true;
      this.max = true;
      this.bienTitle = "Nom du bien"
      this.nameTitle = "Propriétaire"
      this.categorieTitle = 'Type de locative'
      this.categorieRow = [
        { label: 'STUDIO', value: 'STUDIO' },
        { label: 'APPARTEMENT', value: 'APPARTEMENT' },
        { label: 'PALIER', value: 'PALIER' },
        { label: 'VILLA', value: 'VILLA' },
        { label: 'MAGASIN', value: 'MAGASIN' },
        { label: 'BUREAU', value: 'BUREAU' },
        { label: 'SURFACE', value: 'SURFACE' },
        { label: 'RESTAURANT', value: 'RESTAURANT' },
        { label: 'HALL', value: 'HALL' },
        { label: 'SALLE CONFERENCE', value: 'SALLE CONFERENCE' },
        { label: 'PARKING', value: 'PARKING' }
      ];
      this.etatRow = [
        { label: 'DISPONIBLE', value: 'DISPONIBLE' },
        { label: 'RESERVE', value: 'RESERVE' },
        { label: 'OCCUPE', value: 'OCCUPE' }
      ];
      this.visible = false;
      this.rentalService.getList().subscribe(res => { return this.rentals = res; }, error => { });
    }else if (this.type == "BUDGET") {
      this.bien = false;
      this.min = false;
      this.max = false;
      this.dateD = false;
      this.dateF = false;
      this.categorie = false;
      this.bienTitle = "Nom du bien"
      this.nameTitle = "Syndic"
      this.etatRow = [
        { label: 'BUDGET', value: 'BUDGET' },
      ];
   
      this.budgetService.getList().subscribe(
        (res) => {
          console.log(res);
          
          return (this.budgets = res);
        },
        (error) => { }
      );
    }else if (this.type == "TYPE_LOAD") {
      this.bien = false;
      this.min = false;
      this.max = false;
      this.dateD = false;
      this.dateF = false;
      this.categorie = false;
      this.bienTitle = "Nom du bien"
      this.nameTitle = "Type de charge"
      this.etatRow = [
        { label: 'BUDGET', value: 'BUDGET' },
      ];
      this.typeLoadService.getList().subscribe(
        (res) => {
          return (this.typeLoads = res);
        },
        (error) => { }
      );
    }
  }

  addSyndic(){
    this.syndicServicee.edit = false
    this.modal(SyndicAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  showSyndic(row){
    this.syndicServicee.setSyndic(row);
    this.router.navigate(['/admin/syndic/show/' + row.uuid]);
  }

  editSyndic(row){
    this.syndicServicee.setSyndic(row)
    this.syndicServicee.edit = true
    this.modal(SyndicAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  addHouseCo(type) {
    this.modalService.dismissAll();
    this.ownerCoService.edit = false;
    this.ownerCoService.type = type;
    this.modal(OwnerCoAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  addMandat(){
    this.mandatService.edit = false
    this.modal(SyndicMandateAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  addCopropriete(){
    this.modalService.dismissAll()
    this.coproprieteService.edit = false
    this.modal(SyndicCondominiumAddComponent, 'modal-basic-title', 'xl', true, 'static',)
  }

  addInfrastructure(){
    this.infrastructureService.edit = false
    this.modal(InfrastructureAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

    addBudget() {
      console.log('addBudget');
      this.modalService.dismissAll();
       this.budgetService.edit = false;
      this.modal(BudgetAddComponent, 'modal-basic-title', 'xl', true, 'static');
    }

    addTypeLoad() {
      this.modalService.dismissAll();
      // this.typeLoadService.edit = false;
      this.modal(TypeLoadAddComponent, 'modal-basic-title', 'lg', true, 'static');
    }

  

  showHouse(row){
    this.coproprieteService.setCopropriete(row)
    this.coproprieteService.exit = 'SYNDIC_LIST'
    this.router.navigate(['/admin/syndic/copropriete/show/' + row.uuid]);
  }

  editHouse(row){
    this.coproprieteService.setCopropriete(row)
    this.coproprieteService.edit = true
    this.modal(SyndicCondominiumAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printHouse(row){
    if (row.type === 'VERTICAL') {
      this.coproprieteService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row?.trustee?.uuid, row.uuid);
    }
    else if (row.type === 'HORIZONTAL') {
      this.homeCoService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row?.trustee?.uuid, row.uuid);
    }
  }

  deleteCopropriete(item) {
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
        this.coproprieteService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.coproprietes.findIndex(x => x.id === item.id);
            if (index !== -1) { this.coproprietes.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }
  addHouse(type) {
    this.modalService.dismissAll();
    this.houseService.edit = false;
    this.houseService.house = null;
    this.houseService.disponible = type;
    this.modal(HouseAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addRental() {
    this.modalService.dismissAll();
    this.rentalService.edit = false;
    this.rentalService.rental = null;
    this.modal(RentalAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  editOwnerCo(row) {
    this.ownerCoService.setOwnerCo(row);
    this.ownerCoService.edit = true;
    this.ownerCoService.type = row.type;
    this.modal(OwnerCoAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showOwnerCo(row) {
     this.ownerCoService.setOwnerCo(row);
    this.router.navigate(['/admin/syndic/coproprietaire/show/' + row.uuid]);
    // this.modal(OwnerCoShowComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerOwner(row): void {
    this.ownerCoService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid, null);
  }
  deleteOwner(item) {
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
        this.ownerCoService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.coowners.findIndex(x => x.id === item.id);
            if (index !== -1) { this.coowners.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }

  printSyndic(item){
    this.syndicServicee.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, item?.uuid);
  }

  onPrinter() {
    if (this.type === 'SYNDIC') {
      this.syndicServicee.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
    else if (this.type === 'MANDAT') {
      this.mandatService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, null);
    }
    else if (this.type === 'LOT') {
      this.homeCoService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, null);
    }
    else if (this.type === 'INFRASTRUCTURE') {
      this.infrastructureService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter, null);
    }
  }

  onExport() {
    if (this.type === 'SYNDIC') {
      this.syndicServicee.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }

  deleteSyndic(item) {
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
        this.syndicServicee.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.syndics.findIndex(x => x.id === item.id);
            if (index !== -1) { this.syndics.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {
      if(result == 'SYNDIC'){
        this.syndicServicee.getList(this.agency).subscribe((res: any) => {
          return this.syndics = res
        })
      }else if(result == 'MANDAT'){
        this.syndicServicee.getList(this.agency).subscribe((res: any) => {
          return this.syndics = res
        })
        this.mandatService.getList(null).subscribe((res: any) => {
          return this.mandats = res
        })
      }else if(result == 'INFRASTRUCTURE'){
        this.infrastructureService.getList(null, null).subscribe((res: any) => {
          return this.infrastructures = res
        })
      }else if(result == 'LOT'){
        this.coproprieteService.getList().subscribe((res: any) => {
          return this.coproprietes = res
        })
      }
     }, (reason) => { });
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
        if(item.type === 'HORIZONTAL'){
          this.homeCoService.getDelete(item?.uuid).subscribe((res: any) => {
            if (res?.status === 'success') {
              const index = this.coproprietes.findIndex(x => x.id === item.id);
              if (index !== -1) { this.coproprietes.splice(index, 1); }
              Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
            }
          });
        }
        else if(item.type === 'VERTICAL'){
          this.coproprieteService.getDelete(item?.uuid).subscribe((res: any) => {
            if (res?.status === 'success') {
              const index = this.coproprietes.findIndex(x => x.id === item.id);
              if (index !== -1) { this.coproprietes.splice(index, 1); }
              Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
            }
          });
        }
      }
    });
  }
}
