import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProspectionService } from '@service/prospection/prospection.service';
import { AgentService } from '@service/agent/agent.service';
import { OffreService } from '@service/offre/offre.service';
import { OffreTypeService } from '@service/offre-type/offre-type.service';
import { ProspectionAddComponent } from '../prospection-add/prospection-add.component';
import { AgentAddComponent } from '@agence/prospection/agent/agent-add/agent-add.component';
import { OffreAddComponent } from '@agence/prospection/offre/offre-add/offre-add.component';
import { ReservationAddComponent } from '@agence/prospection/reservation/reservation-add/reservation-add.component';
import { OffreTypeAddComponent } from '@agence/prospection/offre-type/offre-type-add/offre-type-add.component';
import { Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EtapeComponent } from '@agence/prospection/agent/etape/etape.component';
import { EmitterService } from '@service/emitter/emitter.service';
import { TunnelService } from '@service/tunnel/tunnel.service';
import { Tunnel } from '@model/tunnel';
import { EtapeService } from '@service/etape/etape.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@service/auth/auth.service';
import { ActivityAddComponent } from '@agence/proprietaire/activity/activity-add/activity-add.component';
import { ActivityService } from '@service/activity/activity.service';
import { CustomerService } from '@service/customer/customer.service';
import { CustomerAddComponent } from '@agence/client/customer/customer-add/customer-add.component';
import { FilterService } from '@service/filter/filter.service';
import { ReservationService } from '@service/reservation/reservation.service';
import { ActionAddComponent } from '@agence/prospection/action/action-add/action-add.component';
import { ResponseService} from '@service/response/response.service'
import { ResponseAddComponent } from '@agence/prospection/response/response-add/response-add.component';
import { CityAddComponent } from '@agence/parametre/city/city-add/city-add.component';
import { CommonAddComponent, } from '@agence/parametre/common/common-add/common-add.component';
import { NeighborhoodAddComponent, } from '@agence/parametre/neighborhood/neighborhood-add/neighborhood-add.component';
import { VilleService } from '@service/ville/ville.service';
import { CommonService } from '@service/common/common.service';




@Component({
  selector: 'app-prospection-location',
  templateUrl: './prospection-location.component.html',
  styleUrls: ['./prospection-location.component.scss']
})
export class ProspectionLocationComponent implements OnInit {

  publicUrl = environment.publicUrl;
  public activeTab: string = '';
  type: string = 'PROSPECT_LOCATION'
  nameTitle: string = "Nom / Raison sociale"
  userTitle: string = "Crée par"
  bienTitle: string = "Commercial"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de propriétaire"
  etatTitle: string = "Disponibilité ?"
  categorieRow = []
  etatRow = []
  typeRow = [
    { label: 'PROSPECT', value: 'PROSPECT_LOCATION' },
    { label: 'OFFRE', value: 'OFFRE' },
    { label: 'PRÉ-RÉSERVATION', value: 'RESERVATION' },
    { label: 'AVIS', value: 'AVIS DE RECHERCHE' },
    { label: 'REPONSE OFFICIELLE', value: 'REPONSE OFFICIELLE' },
  ]
  tunnel: Tunnel
  first: any
  prospectsRow: any[] = []
  prospects: any[] = []
  contacts: any[] = []
  qualifs: any[] = []
  negoces: any[] = []
  gagnes: any[] = []
  perdus: any[] = []
  suivis: any[] = []
  agents: any[] = []
  offres: any[] = []
  response: any[] = []
  typeOffres: any[] = []
  reservations: any[] = [
    {
      code: 'AZ-7537-6527-123',
      libelle: 'Pré-réservation 1',
      prospect: 'Olamide',
      telephone: '+1 (644) 489-0018',
      offre: 'Offre A',
      prix: 100000
    }
  ]
  cardColors = ['azure', 'beige', 'bisque', 'blanchedalmond', 'burlywood', 'cornsilk', 'gainsboro', 'ghostwhite', 'ivory', 'khaki'];
  pickColor = () => {
    const rand = Math.floor((Math.random() * 10));
    return this.cardColors[rand];
  };
  scene: any
  columns: any = []
  userSession = Globals.user;

  private timeOut = null;
  private filter = null;
  private throttle = 500;
  private request = null;
  public url = environment.serverUrl;
  constructor(
    public router: Router,
    private http: HttpClient,
     private auth: AuthService,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private agentService: AgentService,
    private offreService: OffreService,
    private filterService: FilterService,
    private tunnelService: TunnelService,
    private activityService: ActivityService,
    private offreTypeService: OffreTypeService,
    private ReservationService: ReservationService,
    private prospectionService: ProspectionService,
    private responseService : ResponseService ,
    private commonService : CommonService,
    private villeService : VilleService

  ) {
    this.tunnelService.getList('LOCATION').subscribe((res: any) => {
      if(res[0]){
        this.tunnel = res[0]
        this.first = this.tunnel.etapes[0].uuid
        this.activeTab = this.first

      }
      return this.tunnel
    }, error => { });

    this.prospectionService.getList(null, this.first).subscribe((res: any) => {
      this.loadData(res)
      return this.prospectsRow = res
    })
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PROSPECT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PROSPECT_UPDATED') {
        this.updateCard(data.payload);
      }
      if (data.action === 'PROSPECT_ETAPE') {
        this.splice(data.payload);
      }
    });
  }
  getTimeDifference(){}

	loadData(datas) {
    this.scene = null
    this.columns = []
    if(this.tunnel && this.tunnel?.etapes.length > 0 ){
      this.tunnel?.etapes.forEach(item => {
        let array = [];
        datas.forEach(prospect => {
          if (item.libelle === prospect.etape) {
            array.push({
              type: 'draggable',
              id: prospect.uuid,
              props: {
                className: 'card',
                style: { backgroundColor: this.pickColor() }
              },
              data: prospect
            });
          }
        });
        this.columns.push({
          id: item?.id,
          uuid: item.uuid,
          type: 'container',
          name: item.libelle,
          props: {
            orientation: 'vertical',
            className: 'card-container'
          },
          children: array
        })
      });

      this.scene = {
        type: 'container',
        props: {
          orientation: 'horizontal'
        },
        children: this.columns
      }

    }
	}

	onCardDrop(columnId, dropResult) {
		if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
			const scene = Object.assign({}, this.scene);
			const column = scene.children.filter(p => p.id === columnId)[0];
			const columnIndex = scene.children.indexOf(column);

			const newColumn = Object.assign({}, column);
			newColumn.children = this.applyDrag(newColumn.children, dropResult);
      if (dropResult.addedIndex !== null) {
        this.changeStepApi(newColumn.name, dropResult.payload.id)
      }
			scene.children.splice(columnIndex, 1, newColumn);
			this.scene = scene;
		}
	}

	getCardPayload(columnId, id) {
    return (index) => {
      const column = this.scene.children.find((column) => column.id === columnId);
      const prospect = column.children[index];
      return {
        type: 'draggable',
        columnId: columnId,
        id: prospect.id,
        uuid: prospect.uuid,
        props: {
          className: 'card',
          style: { backgroundColor: this.pickColor() }
        },
        data: prospect.data
      };
    };
	}
	changeStepApi(columnId, step) {
    const token = this.auth.getDataToken()?.token;
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      const url = this.url + '/private/agency/prospect/migrer';
      const body = {etape: columnId, prospect: step};


      if (this.timeOut) {
        if (this.request) {
          this.request.unsubscribe();
        }
        clearTimeout(this.timeOut);
      }
      this.timeOut = setTimeout((value) => {
        this.emitter.disallowLoading();
        this.http.post(url, body, { headers }).subscribe((res: any) => {
            if (res?.status === 'success') {
              this.updateCard(res.data)
            }
          },
          (error: any) => { }
        );
      }, this.throttle);
    } else {
      // Handle the case when the token is not available
    }
	}
  applyDrag(arr, dragResult) {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;

    const result = [...arr];
    let itemToAdd = payload;

    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }

    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }

    return result;
  }
  updateCard(data) {
    this.scene.children.forEach(first => {
      first.children.forEach(item => {
        if (item.id === data.uuid) {
          item.data = data;
        }
      });

    });
  }
  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    this.prospects = []
    this.prospectsRow = []
    this.offres = []
    this.scene = null
    this.filterService.search($event, 'crm', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if(this.type === 'PROSPECT_LOCATION'){
          this.scene = null
          this.loadData(res)
          this.prospectsRow = res;
          return this.prospectsRow;
        } else if(this.type === 'OFFRE'){
          this.offres = res;
          return this.offres;
        }
    }, err => { })
  }

  appendToList(item): void {
    this.prospectsRow.unshift(item);
  }

  update(item): void {
    const index = this.prospectsRow.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.prospectsRow[index] = item;
    }
  }
  splice(item): void {
    const index = this.prospectsRow.findIndex(x => x.uuid === item.uuid);
    this.prospectsRow.splice(index, 1);
  }

  onChangeTabs(bool: boolean, type: string) {
    this.activeTab = type
    this.prospectsRow = []
    this.prospectionService.getList(null, type).subscribe((res: any) => {
      res.forEach((item: any) => {
        this.prospectsRow.push(item)
      })
      return this.prospectsRow
    })
  }

  onChangeLoad(bool, type) {
    this.type = type
    this.activeTab = type
    this.prospectsRow = []
    this.agents = []
    this.offres = []
    this.typeOffres = []
    if (type === 'PROSPECT_LOCATION') {
      this.prospectionService.getList(null, this.first).subscribe((res: any) => {
        res.forEach((item: any) => {
          this.prospectsRow.push(item)
        })
        return this.prospectsRow
      })
    } else if (type === 'OFFRE') {
      this.offreService.getList().subscribe((res: any) => {
        return this.offres = res
      })
      this.offres = this.offres
    } else if (type === 'TYPE_OFFRE') {
      this.offreTypeService.getList().subscribe((res: any) => {
        return this.typeOffres = res
      })
      this.typeOffres = this.typeOffres
    } else if (type === 'RESERVATION') {
      // this.reservationService.getList().subscribe((res: any) => {
      //   return this.reservations = res
      // })
      this.reservations = this.reservations
    }
    else if (type === 'RESPONSE') {
      this.responseService.getList().subscribe((res: any) => {
        return this.response = res
      })
      this.response = this.response
    }
  }

  onPrinter() {
    if (this.type === 'PROSPECT_LOCATION') {
      this.prospectionService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'OFFRE') {
      this.offreService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'RESERVATION') {
      this.ReservationService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }

  action(prospect) {
    this.modalService.dismissAll();
    this.prospectionService.edit = false;
    this.prospectionService.uuid = prospect.uuid;
    this.modal(ActionAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }

  add(type,) {
    if (type === 'PROSPECT_LOCATION') {
      this.modalService.dismissAll();
      this.prospectionService.edit = false;
      this.prospectionService.status = 'LOCATION';
      this.prospectionService.type = 'PARTICULIER';
      this.modal(ProspectionAddComponent, 'modal-basic-title', 'xl', true, 'static');
    } else if (type === 'AGENT') {
      this.modalService.dismissAll();
      this.agentService.edit = false;
      this.modal(AgentAddComponent, 'modal-basic-title', 'xl', true, 'static');
    } else if (type === 'OFFRE') {
      this.modalService.dismissAll();
      this.offreService.edit = false;
      this.modal(OffreAddComponent, 'modal-basic-title', 'xl', true, 'static');
    } else if (type === 'TYPE_OFFRE') {
      this.modalService.dismissAll();
      this.offreService.edit = false;
      this.modal(OffreTypeAddComponent, 'modal-basic-title', 'lg', true, 'static');
    } else if (type === 'BESOIN') {
      this.modalService.dismissAll();
      // this.reservationService.edit = false;
      this.modal(ReservationAddComponent, 'modal-basic-title', 'xl', true, 'static');
    }

    else if (type === 'RESPONSE') {
      this.modalService.dismissAll();
      this.responseService.edit = false;
      this.modal(ResponseAddComponent, 'modal-basic-title', 'xl', true, 'static');
    } 

  }

  showProspect(item) {
    this.prospectionService.setProspection(item);
    this.router.navigate(['/admin/prospection/show/' + item.uuid]);
  }

  transformation(item) {
    if(item?.infoProgress > 90){
      Swal.fire({
        title: '',
        text: "La conversion de ce prospect en client marque le début d'un nouveau processus de création du dossier d'achat pour le client.",
        icon: '',
        showCancelButton: true,
        showCloseButton: true,
        cancelButtonText: 'Annuler',
        confirmButtonText: 'OK <i class="fas fa-attachment"></i>',
        confirmButtonColor: '#3EE655',
        reverseButtons: true
      }).then((willDelete) => {
        if (willDelete.dismiss) {
        } else {
          this.prospectionService.setProspection(item)
          this.prospectionService.edit = true
          this.prospectionService.completed = true
          this.prospectionService.transformation = true
          this.modal(ProspectionAddComponent, 'modal-basic-title', 'xl', true, 'static')
        }
      });
    }else {
      Swal.fire({
        title: '',
        text: "Toutes les informations obligatoires sur le compte du prospect n'ont pas été renseignées. Veuillez les compléter avant de le convertir en client.",
        icon: '',
        showCancelButton: true,
        showCloseButton: true,
        cancelButtonText: 'Annuler',
        confirmButtonText: 'Completer <i class="fas fa-attachment"></i>',
        confirmButtonColor: '#3EE655',
        reverseButtons: true
      }).then((willDelete) => {
        if (willDelete.dismiss) {
        } else {
          this.prospectionService.setProspection(item)
          this.prospectionService.edit = true
          this.prospectionService.completed = true
          this.modal(ProspectionAddComponent, 'modal-basic-title', 'xl', true, 'static')
        }
      });
    }
  }

  edit(item) {
    this.prospectionService.setProspection(item)
    this.prospectionService.edit = true
    this.prospectionService.completed = true
    this.modal(ProspectionAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printerProspect(item) {
    this.prospectionService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, item?.uuid);
  }

  abonner(item) {
    Swal.fire({
      title: '',
      text: "En vous abonnant au compte de ce prospect, vous serez automatiquement informé de toutes les activités et changements liés à son compte. Cette fonctionnalité vous permettra de suivre de près les mises à jour, les interactions et les événements importants associés au compte du prospect. Vous ne manquerez ainsi aucune information cruciale concernant ce prospect.",
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Abonner <i class="fas fa-attachment"></i>',
      confirmButtonColor: '#3EE655',
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.agentService.typeAssignattion = 'ABONNEES'
        this.prospectionService.setProspection(item)
        this.modal(EtapeComponent, 'modal-basic-title', 'md', true, 'static')
      }
    });
  }

  note(item) {
    this.modalService.dismissAll();
    this.activityService.edit = false;
    this.prospectionService.setProspection(item);
    this.modal(ActivityAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }

  deleteProspect(item) {
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
        this.prospectionService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.prospects.findIndex(x => x.id === item.id);
            if (index !== -1) { this.prospects.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }

  assignerProspect(item) {
    this.agentService.typeAssignattion = 'PROSPECT_LOCATION'
    this.prospectionService.setProspection(item)
    this.modal(EtapeComponent, 'modal-basic-title', 'md', true, 'static')
  }

  etapeProspect(item) {
    this.agentService.typeAssignattion = 'ABONNEES'
    this.prospectionService.setProspection(item)
    this.modal(EtapeComponent, 'modal-basic-title', 'md', true, 'static')
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
