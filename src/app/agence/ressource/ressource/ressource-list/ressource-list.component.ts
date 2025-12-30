
import { Ticket } from '@model/ticket';
import { Router } from "@angular/router";
import { Ressource } from '@model/ressource';
import {environment} from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterService } from '@service/filter/filter.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { RessourceAddComponent } from '../ressource-add/ressource-add.component';
import { RessourceTiersService } from '@service/ressource-tiers/ressource-tiers.service';
import { RessourceAssignComponent } from '../ressource-assign/ressource-assign.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { RessourceHorsUsageComponent } from '@agence/ressource/ressource-hors-usage/ressource-hors-usage.component';


@Component({
  selector: 'app-ressource-list',
  templateUrl: './ressource-list.component.html',
  styleUrls: ['./ressource-list.component.scss']
})
export class RessourceListComponent implements OnInit {
  ressources: Ressource[] = []
  etat: boolean = false
  actif: string;
  inactif: string;
  type = "RESSOURCE";
  widget : any
  filter : any
  visible: boolean = false;
  public loading = false;
  tickets: Ticket;
  public showComment = false;
  dtOptions: any = {};
  annees = [];
  anneeRow = [];
  currentYear: number;
  typeRow = [{label: 'RESSOURCE', value: 'RESSOURCE'}];
  categorieRow = [
    {label: 'Ressource de base', value: 'BASE'},
    {label: 'Ressource composite', value: 'COMPOSITE'}
  ];
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de Ressource"
  etatTitle: string = "Etat"
  nameTitle: string = "Désignation "
  anneesTitle: string = "Année d'exercice"

  name: boolean = true;
  nameType = 'TEXT';
  nameClass= 'Tenant';
  nameNamespace= 'Client';
  nameGroups= 'tenant';

  autreTitle = "Famille";
  autre: boolean = true;
  autreType = 'ENTITY';
  autreClass= 'Famille';
  autreNamespace= 'Client';
  autreGroups= 'famille';

  bienTitle: string = "Sous Famille"
  bien: boolean = true
  bienType = 'ENTITY';
  bienClass= 'SousFamille';
  bienNamespace= 'Client';
  bienGroups= 'sous-famille';

  libelleTitle: string = "N° Contrat"
  libelle: boolean = false
  libelleType = 'TEXT';
  libelleClass= 'House';
  libelleNamespace= 'Client';
  libelleGroups= 'house';

  etatRow = [
    { label: "EN STOCK", value: "EN STOCK" },
    { label: "EN UTILISATION", value: "EN UTILISATION" },
    { label: "EN PANNE", value: "EN PANNE" }
  ]
  max: boolean = false;
  min: boolean = false;
  stocks = 0
  uses = 0
  pannes = 0
  hors = 0
  useA = 0
  useI = 0
  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private filterService: FilterService,
    public ressourceService: RessourceTiersService
  ) {
    this.getYear();
    this.ressourceService.getList().subscribe(res => {
      this.calculate(res)
      return this.ressources = res;
    }, error => {});

  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'RESSOURCE_ADD') {
        this.appendToList(data.payload);
      }
     if (data.action === 'RESSOURCE_UPDATED') {
        this.update(data.payload);
      }
      if (data.action === 'RESSOURCE_HORS_SERVICE' || 'RESSOURCE_METTRE_SERVICE') {
        this.update(data.payload);
      }

    });
  }
  calculate(ressources){
    let st = 0
    let use = 0
    let pannes = 0
    let hors = 0
    let useA = 0
    let useI = 0
    ressources.forEach(item => {
      if (item.etat === 'EN STOCK') {
        st = st + 1
      }
      if (item.etat === 'EN UTILISATION') {
        use = use + 1
      }
      if (item.utilisation === 'ACTIF') {
        useA = useA + 1
      }else if(item.utilisation === 'INACTIF'){
        useI = useI + 1
      }
      if (item.etat === 'EN PANNE') {
        pannes = pannes + 1
      }

      if (item.etat === 'HORS SERVICE') {
        hors = hors + 1
      }
    });
    this.stocks = st
    this.uses = use
    this.pannes = pannes
    this.hors = hors
    this.useA = useA
    this.useI = useI
  }

  etatRessource(){
    this.uses;
  }
  appendToList(item): void {
    this.ressources.unshift(item);
    this.calculate(this.ressources)
  }
  update(item): void {
    const index = this.ressources.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.ressources[index] = item;
    }
    this.calculate(this.ressources)
  }
  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    this.ressources = []
    this.filterService.search($event, 'ressource', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if(this.type === 'RESSOURCE'){
          this.ressources = res;
          this.calculate(res)
        }
    }, err => { })
  }
  onChangeLoad($event) {
    this.type = $event
    if($event === 'RESSOURCE'){
    }
  }
  add() {
    this.modalService.dismissAll();
    this.ressourceService.edit = false
    this.modal(RessourceAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  edit(item) {
    this.modalService.dismissAll();
    this.ressourceService.edit = true
    this.ressourceService.setRessource(item)
    this.modal(RessourceAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  show(item) {
    this.router.navigate(['/admin/ressource/show/' + item.uuid]);
  }
  assigner(item) {
    this.modalService.dismissAll();
    this.ressourceService.setRessource(item)
    this.modal(RessourceAssignComponent, 'modal-basic-title', 'lg', true, 'static');
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
        this.ressourceService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') { this.router.navigate(['/admin/ressource']) }
        });
      }
    });
  }

  hs(item) {
    this.ressourceService.uuid = item.uuid
    this.modal(RessourceHorsUsageComponent, 'modal-basic-title', 'xl', true, 'static');

  }


  utilisation(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment mettre  cette ressource en utilisation ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Utiliser <i class="fas fa-spinner"></i>',
      confirmButtonColor: '#ffba57',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) { }
      else {
        this.ressourceService.utilisation(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {  
            this.emitter.emit({action: 'RESSOURCE_METTRE_SERVICE', payload: res?.data}); 
            this.router.navigate(['/admin/ressource'])
          }
        });
      }
    });
  }

  activateUtilisation(item, etat) {
    let title = "Voulez-vous vraiment activer  cette ressource en utilisation ?";
    let valider = "Valider";
    if (etat === "ACTIF") {
      title = "Voulez-vous vraiment activer  cette ressource en utilisation ?"
    } else {
       title = "Voulez-vous vraiment  désactiver  cette ressource en utilisation ?"
    }
    Swal.fire({
      title: '',
      text: title,
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: valider+'<i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) { }
      else {
        this.ressourceService.activation(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {  
            this.emitter.emit({action: 'RESSOURCE_ACTIVATION', payload: res?.data}); 
            this.router.navigate(['/admin/ressource'])
          }
        });
      }
    });
  }

  onExport() {}
  onImport() {}
  onModel() {}

  getYear(){
    const startYear = 2000;
    const currentYear = 2090;
    const currentYearValue = new Date().getFullYear();

    for (let year = startYear; year <= currentYear; year++) {
      this.anneeRow.push(year);
      if (year === currentYearValue) {
        this.currentYear = year;
      }
    }

    for (const key in this.anneeRow) {
      this.annees.push({
        label: this.anneeRow[key],
        value: this.anneeRow[key]
      });
    }
  }


  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }

}
