
import { forkJoin, of } from 'rxjs';
import { Ticket } from '@model/ticket';
import { Router } from '@angular/router';
import { catchError } from "rxjs/operators";
import {environment} from '@env/environment';
import { Globals } from '@theme/utils/globals';
import {HttpClient} from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TicketAddComponent } from '../ticket-add/ticket-add.component';
import { TicketService } from '@service/ticket/ticket.service';
import { FilterService } from '@service/filter/filter.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QualificationAddComponent } from '@agence/reclamation/qualification/qualification-add/qualification-add.component';
import { RapportComponent } from '../rapport/rapport.component';
import { NoteComponent } from '../note/note.component';


class FilterItem {
  key?: string;
  type?: string;
  libelle?: string;
  icon?: string;
  status?: boolean;
  color?: string;
  row?: any[];
  value?: string;
}

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss']
})
export class TicketListComponent implements OnInit, AfterViewInit  {
  users: any[] = [];
  tenants: any[] = [];
  tickets: Ticket[];
  ticketsStats: Ticket[];
  chats: any[];
  owners: any[] = [];
  houses: any[] = [];
  rentals: any[] = [];
  categories: any[] = [];
  etatRow = [
    {
      'libelle' : 'OUVERT',
      'uuid' : 'OUVERT'
    },
    {
      'libelle' : 'EN COURS',
      'uuid' : 'EN COURS'
    },
    {
      'libelle' : 'FERME',
      'uuid' : 'FERME'
    }
  ];


  searchTerm: string = '';
  searchTermInput: string = '';
  filterItems: any[] = []; // Les éléments filtrés pour afficher dans la liste de filtres
  filtersList: any[] = []; // La liste des filtres sélectionnés
  // La liste originale des éléments à filtrer
  originalItems: FilterItem[] =[
    {
      key: "reference",
      type: "text",
      libelle: "Reference",
      status: true,
      icon: "fas fa-hashtag",
      row: [],
      value: null
    },
    {
      key: "categorie",
      type: "textbox",
      libelle: "Catégorie",
      status: true,
      icon: "fas fa-ruler",
      row: this.categories,
      value: null
    },
    {
      key: "assinger",
      type: "textbox",
      libelle: "Assinger",
      status: true,
      icon: "fas fa-user",
      row: [],
      value: null
    },
    {
      key: "tenant",
      type: "textbox",
      libelle: "Locataire",
      status: true,
      icon: "fas fa-user",
      row: [],
      value: null
    },
    {
      key: "owner",
      type: "textbox",
      libelle: "Propriétaire",
      status: true,
      icon: "fas fa-user",
      row: [],
      value: null
    },
    {
      key: "house",
      type: "textbox",
      libelle: "Bien",
      status: true,
      icon: "feather icon-home",
      row: [],
      value: null
    },
    {
      key: "rental",
      type: "textbox",
      libelle: "Locative",
      status: true,
      icon: "feather icon-home",
      row: [],
      value: null
    },
    {
      key: "etat",
      type: "textbox",
      libelle: "Etat",
      status: true,
      icon: "fas fa-star",
      row: this.etatRow,
      value: null
    },
    {
      key: "date",
      type: "date",
      libelle: "Date Creation",
      status: false,
      icon: "fas fa-clock",
      row: [],
      value: null
    },
    {
      key: "periode",
      type: "date-2",
      libelle: "Periode",
      status: false,
      icon: "fas fa-clock",
      row: [],
      value: null
    },
  ]

	public activeTab = "OUVERT";
  public url = environment.serverUrl;
  public view = 'TABLE';
  public showComment = false;
  public loading = false;

  dtOptions: any = {};
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  events = [
    { id: '1', name: 'Alpha Corp', eventColor: '#ff5733' },
    { id: '2', name: 'Beta Ltd', eventColor: '#33ff57' },
    { id: '3', name: 'Gamma Inc', eventColor: '#3357ff' },
    { id: '4', name: 'Delta LLC', eventColor: '#ff33aa' },
    { id: '5', name: 'Epsilon SA', eventColor: '#ffaa33' },
    { id: '6', name: 'Zeta GmbH', eventColor: '#33aaff' },
    { id: '7', name: 'Eta Co', eventColor: '#aa33ff' },
    { id: '8', name: 'Theta Pvt Ltd', eventColor: '#aaff33' },
    { id: '9', name: 'Iota Ventures', eventColor: '#ff33aa' },
    { id: '10', name: 'Kappa Solutions', eventColor: '#33ffaa' },
  ];
  datas =  [
    { id: 1, startDate: '2024-08-01', endDate: '2024-08-07', name: 'ALPHA CORP : Project Launch', allDay: true, resourceId: '1', eventColor: '#ff5733' },
    { id: 2, startDate: '2024-08-02', endDate: '2024-08-08', name: 'BETA LTD : Team Meeting', allDay: true, resourceId: '2', eventColor: '#33ff57' },
    { id: 3, startDate: '2024-08-03', endDate: '2024-08-09', name: 'GAMMA INC : Product Demo', allDay: true, resourceId: '3', eventColor: '#3357ff' },
    { id: 4, startDate: '2024-08-04', endDate: '2024-08-10', name: 'DELTA LLC : Client Visit', allDay: true, resourceId: '4', eventColor: '#ff33aa' },
    { id: 5, startDate: '2024-08-05', endDate: '2024-08-11', name: 'EPSILON SA : Strategy Meeting', allDay: true, resourceId: '5', eventColor: '#ffaa33' },
    { id: 6, startDate: '2024-08-06', endDate: '2024-08-12', name: 'ZETA GMBH : Workshop', allDay: true, resourceId: '6', eventColor: '#33aaff' },
    { id: 7, startDate: '2024-08-07', endDate: '2024-08-13', name: 'ETA CO : Annual Review', allDay: true, resourceId: '7', eventColor: '#aa33ff' },
    { id: 8, startDate: '2024-08-08', endDate: '2024-08-14', name: 'THETA PVT LTD : Training', allDay: true, resourceId: '8', eventColor: '#aaff33' },
    { id: 9, startDate: '2024-08-09', endDate: '2024-08-15', name: 'IOTA VENTURES : Sales Conference', allDay: true, resourceId: '9', eventColor: '#ff33aa' },
    { id: 10, startDate: '2024-08-10', endDate: '2024-08-16', name: 'KAPPA SOLUTIONS : Product Launch', allDay: true, resourceId: '10', eventColor: '#33ffaa' },
  ];
  calendarOptions: any = {
    viewPreset: 'dayAndWeek',
    resources: this.events,
    events: this.datas
  };

  faire = 0
  cours = 0
  ferme = 0

  constructor(
    public router: Router,
    private http: HttpClient,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private filterService: FilterService,
    public ticketService: TicketService
  ) {
    this.loadTickets()
    const storedView = localStorage.getItem('view');
    if (storedView) {
      this.view = storedView;
    }
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.filtersList = this.originalItems; // Ou effectuer une copie si nécessaire
    this.originalItems.forEach(item => {
      if(!item.status){
        this.filterItems.push(item)
      }
    });

    this.loadFiltersFromLocalStorage();

    this.emitter.event.subscribe((data) => {
      if (data.action === 'TICKET_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'TICKET_UPDATED') {
        this.update(data.payload);
      }
      if (data.action === 'TICKET_FERME') {
        let ticket =  data.payload
        this.delete(ticket)
         const index = this.ticketsStats.findIndex(x => x.uuid === ticket.uuid);
        if (index !== -1) {
          this.ticketsStats[index] = ticket;
          this.calculate(this.ticketsStats)
        }

     
      }
    });

  }

  ngAfterViewInit() {
    this.loadData();
  }


  appendToList(ticket): void {
    this.tickets.unshift(ticket);
    this.ticketsStats.unshift(ticket);
    this.calculate(this.ticketsStats)
  }
  update(ticket): void {
    const index = this.tickets.findIndex(x => x.uuid === ticket.uuid);
    if (index !== -1) {
      this.tickets[index] = ticket;
    }
  }

  delete(ticket): void {
    console.log(ticket);
    const index = this.tickets.findIndex(x => x.id === ticket.id);
    if (index !== -1) {
      this.tickets.splice(index, 1);
    }
  }


  calculate(ticket){
    let faire = 0
    let cours = 0
    let ferme = 0
    ticket.forEach(item => {
      if (item.etat === 'OUVERT' && item.qualifier === 'NON') {
        faire = faire + 1
      }
      if (item.etat === 'EN COURS' && item.qualifier === 'OUI') {
        cours = cours + 1
      }
  
      if (item.etat === 'FERME' && item.qualifier === 'OUI') {
        ferme = ferme + 1
      }
    });
    this.faire = faire
    this.cours = cours
    this.ferme = ferme
  
  }


  add(){
    this.modalService.dismissAll();
    this.ticketService.edit = false
    this.modal(TicketAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  edit(item) {
    this.ticketService.setTicket(item)
    this.ticketService.edit = true
    this.modal(TicketAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  show(item) {
    this.router.navigate(['/admin/ticket/show/' + item.uuid]);
  }
  comment(item) {
    this.showComment = !this.showComment;
  }
  qualifier(item) {
    this.modalService.dismissAll();
    this.ticketService.uuid = item.uuid
    this.modal(QualificationAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }



  fermer(item){
    this.ticketService.uuid = item.uuid;
    this.modal(RapportComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  note(item){
    this.ticketService.uuid = item.uuid;
    this.modal(NoteComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  onView(){
    this.view = this.view
    localStorage.setItem('view', this.view);
  }
  // changement de tabs
  onTabs(type){
    this.activeTab = type
    let qualifier = 'NON'
    if(type === "OUVERT"){
      qualifier = 'NON'
    }else if (type === "EN COURS") {
      qualifier = 'OUI'
    } else if (type === "FERME") {
      qualifier = 'OUI'
    } 
    console.log(qualifier);
    
    this.tickets = []
    this.ticketService.getList(type, qualifier).subscribe(res => {
      return this.tickets = res; 
    }, error => { });
  }
  // recupere les tickets OUVERT 
  loadTickets(){
    this.ticketService.getList(null,null).subscribe(res => {
      this.calculate(res)
      return this.ticketsStats = res; 
    }, error => { });
    this.ticketService.getList().subscribe(res => {
      return this.tickets = res; 
    }, error => { });

  }
  // faire la requete de filtre vers l api
  onFilter(){
    const form = this.configForm()
    form.step = this.activeTab
    form.type = "TICKET"
    this.filterService.type = "TICKET"
    this.tickets = []
    let qualifier = 'NON'
    if( this.activeTab === "OUVERT"){
      qualifier = 'NON'
    }else if ( this.activeTab === "EN COURS") {
      qualifier = 'OUI'
    } else if ( this.activeTab === "FERME") {
      qualifier = 'OUI'
    } 
    form.etat = qualifier
    this.filterService.search(form, 'ticket', null).subscribe(
      res => {
        this.tickets = res;
        return this.tickets;
      }, err => { }
    )
  }
  configForm() {
    let data: { [key: string]: any } = {};
    this.filtersList.forEach(item => {
      if (item) {
        if (item.key) {
          data[item.key] = item.value !== undefined ? item.value  : null;
        } else {
          console.warn('Element missing key or value:', item);
        }
      }
    });
    return data
  }
  // Filtre la liste des éléments en fonction du terme de recherche
  filter() {
    this.filterItems = this.originalItems.filter(item =>
      item.libelle.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  // Ajoute un filtre sélectionné à la liste des filtres actifs
  addFilter(item) {
    item.status = true;
    this.filtersList.push(item);

    // Supprime l'élément de la liste des filtres disponibles
    this.filterItems = this.filterItems.filter(filterItem => filterItem !== item);    
    this.saveFiltersToLocalStorage(); // Sauvegarde après ajout

  }
  // Supprime un filtre de la liste des filtres actifs
  removeFilter(item) {
    item.status = false;

    // Supprime l'élément de la liste des filtres actifs
    this.filtersList = this.filtersList.filter(filterItem => filterItem !== item);

    // Ajoute l'élément à la liste des filtres disponibles
    this.filterItems.push(item);
    this.saveFiltersToLocalStorage(); // Sauvegarde après suppression
  }
  // Sauvegarde l'état des filtres dans le localStorage
  saveFiltersToLocalStorage() {
    localStorage.setItem('filtersList', JSON.stringify(this.filtersList));
  }
  // Charge les filtres sauvegardés depuis le localStorage
  loadFiltersFromLocalStorage() {
    const savedFilters = localStorage.getItem('filtersList');
    if (savedFilters) {
      this.filtersList = JSON.parse(savedFilters);
      // Remettre à jour l'état des items dans `originalItems`
      this.filterItems = this.originalItems.filter(item =>
        !this.filtersList.some(filterItem => filterItem.libelle === item.libelle)
      );
    }
  }
  // ajouter les donner dynamiques du back au filtre
  updateFilter(){
    this.filtersList.forEach(item => {
      if(item.key === "assinger"){
        item.row = this.users
        item.row = item.row.map(obj => ({
          libelle: obj.list.libelle,
          uuid: obj.list.uuid
        }));
      }
      if(item.key === "owner"){
        item.row = this.owners
        item.row = item.row.map(obj => ({
          libelle: obj.list.libelle,
          uuid: obj.list.uuid
        }));
      }
      if(item.key === "house"){
        item.row = this.houses
        item.row = item.row.map(obj => ({
          libelle: obj.list.libelle,
          uuid: obj.list.uuid
        }));
      }
      if(item.key === "rental"){
        item.row = this.rentals
        item.row = item.row.map(obj => ({
          libelle: obj.list.libelle,
          uuid: obj.list.uuid
        }));
      }
      if(item.key === "tenant"){
        item.row = this.tenants
        item.row = item.row.map(obj => ({
          libelle: obj.list.libelle,
          uuid: obj.list.uuid
        }));
      }
      if(item.key === "assinger"){
        item.row = this.users
        item.row = item.row.map(obj => ({
          libelle: obj.list.libelle,
          uuid: obj.list.uuid
        }));
      }
      if(item.key === "categorie"){
        item.row = this.categories
        item.row = item.row.map(obj => ({
          libelle: obj.list.libelle,
          uuid: obj.list.uuid
        }));
      }
      if(item.key === "etat"){
        item.row = this.etatRow
      }
    });
  }
  // recherche dans le champs
  filterInput(item) {
    this.filterItems = this.originalItems.filter(item =>
      item.libelle.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  clickCalandar(arg) {
    alert('date click! ' + arg.dateStr)
  }
  loadData() {
    forkJoin([
      this.loadUsers(),
      this.loadHouses(),
      this.loadTenants(),
      this.loadOwners(),
      this.loadRentals(),
      this.loadCategories()
    ]).subscribe(results => {
      // qualifierer les résultats aux variables appropriées
      this.users = results[0];
      this.houses = results[1];
      this.tenants = results[2];
      this.owners = results[3];
      this.rentals = results[4];
      this.categories = results[5];

      this.updateFilter()

      // Mettre à jour les éléments de filterItems qui dépendent de ces listes
    }, error => {
      console.error('Erreur lors du chargement des données :', error);
    });
  }
  loadUsers() {
    return this.http.get<any[]>(this.url + '/private/agency/user/filter').pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
  loadHouses() {
    return this.http.get<any[]>(this.url + '/private/agency/house/filter').pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des maisons :', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
  loadTenants() {
    return this.http.get<any[]>(this.url + '/private/agency/tenant/filter').pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des locataires :', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
  loadOwners() {
    return this.http.get<any[]>(this.url + '/private/agency/owner/filter').pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des propriétaires :', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
  loadRentals() {
    return this.http.get<any[]>(this.url + '/private/agency/rental/filter').pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des locations :', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
  loadCategories() {
    return this.http.get<any[]>(this.url + '/private/agency/category/filter').pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des locations :', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
  change(item: any, newValue: any = null) {
    // Vérifier si newValue est un tableau
    if (Array.isArray(newValue)) {
      // Créer un tableau pour stocker les UUIDs
      const uuids = newValue.map(element => element.uuid);
      // Mettre à jour item.value avec le tableau des UUIDs
      item.value = uuids;
    } else {
      // Si newValue n'est pas un tableau, affecter newValue directement
      item.value = newValue;
    }
  }
  monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months+2;
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
