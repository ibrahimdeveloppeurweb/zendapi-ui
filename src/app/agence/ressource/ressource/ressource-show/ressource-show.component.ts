import { Ressource } from '@model/ressource';
import {environment} from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from "@angular/router";
import { FilterService } from '@service/filter/filter.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { RessourceAddComponent } from '../ressource-add/ressource-add.component';
import { RessourceTiersService } from '@service/ressource-tiers/ressource-tiers.service';
import { Rental } from '@model/rental';
import { Ticket } from '@model/ticket';
import { RessourceAssignComponent } from '../ressource-assign/ressource-assign.component';
import { RessourceHorsUsageComponent } from '@agence/ressource/ressource-hors-usage/ressource-hors-usage.component';


@Component({
  selector: 'app-ressource-show',
  templateUrl: './ressource-show.component.html',
  styleUrls: ['./ressource-show.component.scss']
})
export class RessourceShowComponent implements OnInit {
  public activeTab: string = 'RESSOURCE';
  public type: string = 'RESSOURCE';
  ressource: Ressource
  rentals: Rental[] = []
  tickets: Ticket[] = []
  historiques: any[] = []
  hors: any[] = []
  publicUrl = environment.publicUrl;
  userSession = Globals.user;
  global = {country: Globals.country, device: Globals.device};
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
  name: boolean = true;
  nameType = 'TEXT';
  nameClass= 'Tenant';
  nameNamespace= 'Client';
  nameGroups= 'tenant';

  autreTitle = "Famille";
  autre: boolean = true;
  autreType = 'ENTITY';
  autreClass= 'Owner';
  autreNamespace= 'Client';
  autreGroups= 'owner';
  
  bienTitle: string = "Sous Famille"
  bien: boolean = true
  bienType = 'ENTITY';
  bienClass= 'House';
  bienNamespace= 'Client';
  bienGroups= 'house';
  
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
  url = 'uploads/qr-code/'
  file: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private uploader: UploaderService,
    private filterService: FilterService,
    public ressourceService: RessourceTiersService,

  ) { 
    this.onChangeLoad(this.type);
  }


  ngOnInit(): void {
    if (!this.ressource) {
      this.ressourceService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        this.url = this.url + res.qrCode.nom
        return this.ressource = res;
      });
    }

  }
  onChangeLoad(type): void {
    this.activeTab = type;
    this.type = type;
    if (this.activeTab === 'RESSOURCE') {
      if (!this.ressource) {
        this.ressourceService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          return this.ressource = res;
        });
      }

    }else if(this.activeTab === 'TICKET') {
      this.typeRow = [{label: 'TICKET', value: 'TICKET'}];

    }else if(this.activeTab === 'HISTORIQUE') {
      this.ressourceService.getHistorique(this.route.snapshot.params.id).subscribe((res: any) => {
        console.log(res)
        return this.historiques = res;
      });
    }else if(this.activeTab === 'HORS') {
      this.typeRow = [{label: 'HORS  SERVICE', value: 'HORS'}];

      this.ressourceService.getHistorique(this.route.snapshot.params.id,'HORS_SERVICE').subscribe((res: any) => {
        console.log(res)
        return this.hors = res;
      });

    }
  }
  edit(row) {
    this.ressourceService.setRessource(row);
    this.ressourceService.edit = true;
    this.ressourceService.type = row.type;
    this.modal(RessourceAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printer(row): void {
    // this.ressourceService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  assigner(item) {
    this.modalService.dismissAll();
    this.ressourceService.setRessource(item)
    this.modal(RessourceAssignComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  hs(item) {
    this.ressourceService.uuid = item.uuid
    this.modal(RessourceHorsUsageComponent, 'modal-basic-title', 'lg', true, 'static');

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
    let title = ""
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
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
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
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
  back() { this.router.navigate(['/admin/ressource']) }
}
