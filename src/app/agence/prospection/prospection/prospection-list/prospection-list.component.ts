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
import * as moment from 'moment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@service/auth/auth.service';
import { ActivityAddComponent } from '@agence/proprietaire/activity/activity-add/activity-add.component';
import { ActivityService } from '@service/activity/activity.service';
import { FilterService } from '@service/filter/filter.service';
import { ReservationService } from '@service/reservation/reservation.service';
import { PaymentReservationService } from '@service/payment-reservation/payment-reservation.service';
import { PaymentProspectAddComponent } from '@agence/prospection/payment/payment-prospect-add/payment-prospect-add.component';
import { ActionAddComponent } from '@agence/prospection/action/action-add/action-add.component';





@Component({
  selector: 'app-prospection-list',
  templateUrl: './prospection-list.component.html',
  styleUrls: ['./prospection-list.component.scss']
})
export class ProspectionListComponent implements OnInit {

  publicUrl = environment.publicUrl;
  public activeTab: string = '';
  type: string = 'PROSPECT'
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de propriétaire"
  etatTitle: string = "Disponibilité ?"
  categorieRow = []
  etatRow = []
  typeRow = [
    { label: 'PROSPECT', value: 'PROSPECT' },
    { label: 'PROSPECT ARCHIVER', value: 'ARCHIVER' },
    { label: 'PRÉ-RÉSERVATION', value: 'RESERVATION' },
    { label: 'PAIEMENT', value: 'PAIEMENT' },
    { label: 'OFFRE', value: 'OFFRE' },
    
  ]
  tunnel: Tunnel
  first: any
  prospectsRow: any[] = []
  archives: any[] = []
  prospects: any[] = []
  contacts: any[] = []
  qualifs: any[] = []
  negoces: any[] = []
  gagnes: any[] = []
  perdus: any[] = []
  suivis: any[] = []
  agents: any[] = []
  offres: any[] = []

  payements: any[] = []
  typeOffres: any[] = []
  reservations: any[] = []

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

  isCode: boolean = false;

  nameTitle: string = "Nom / Raison sociale"
  name: boolean = true;
  nameType = 'TEXT';
  nameClass= 'Tenant';
  nameNamespace= 'Client';
  nameGroups= 'tenant';

  autreTitle = "Promotion";
  autre: boolean = true;
  autreType = 'ENTITY';
  autreClass= 'Promotion';
  autreNamespace= 'Client';
  autreGroups= 'promotion';

  bienTitle: string = "Projet de lotissement"
  bien: boolean = true
  bienType = 'ENTITY';
  bienClass= 'Subdivision';
  bienNamespace= 'Client';
  bienGroups= 'subdivision';

  libelleTitle: string = "Commercial"
  libelle: boolean = true
  libelleType = 'ENTITY';
  libelleClass= 'User';
  libelleNamespace= 'Admin';
  libelleGroups= 'user';

  max: boolean = false;
  min: boolean = false;
  dtOptions: any = {};
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
    private reservationService: ReservationService,
    private prospectionService: ProspectionService,
    private paymentReservationService : PaymentReservationService,
 
    

  ) {
    this.tunnelService.getList('ACHAT').subscribe((res: any) => {
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
    this.dtOptions = Globals.dataTable;
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
      this.loadData(this.prospectsRow)
    });
  }

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
    var data = dropResult.payload.data;
    // if(data.isMigrate){

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
    // }else{
    //   if(data && data.migrateItems.length > 0){
    //     let actionsManquantesHtml = data.migrateItems.map(item => `<b>${item}</b><br>`).join('');
    //     Swal.fire({
    //       title: "<strong><u>Action commerciale requise</u></strong>",
    //       icon: "warning",
    //       html: `
    //         <p>Vous devez réaliser ces actions avant de permettre au prospect de passer à l'étape suivante.</p><br>
    //         ${actionsManquantesHtml}
    //       `,
    //       showCloseButton: false,
    //       showCancelButton: false,
    //       focusConfirm: false,
    //       confirmButtonText: "Ok",
    //       confirmButtonAriaLabel: "Ok"
    //     });
    //   }else{
    //     Swal.fire({
    //       title: "<strong><u>Action commerciale requise</u></strong>",
    //       icon: "warning",
    //       html: `
    //         <p>Vous devez réaliser les actions avant de permettre au prospect de passer à l'étape suivante.</p><br>
    //       `,
    //       showCloseButton: false,
    //       showCancelButton: false,
    //       focusConfirm: false,
    //       confirmButtonText: "Ok",
    //       confirmButtonAriaLabel: "Ok"
    //     });
    //   }
    // }
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
        this.http.post(url, body, { headers }).subscribe((res: any) => {
            if (res?.status === 'success') {
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
        if(this.type === 'PROSPECT'){
          this.scene = null
          this.loadData(res)
          this.prospectsRow = res;
          return this.prospectsRow;
        } else if(this.type === 'OFFRE'){
          this.offres = res;
          return this.offres;
        } else if(this.type === 'ARCHIVER'){
          this.archives = res;
          return this.archives;
        }
    }, err => { })
  }
  onChangeLoad(type) {
    this.type = type
    this.activeTab = type
    this.prospectsRow = []
    this.agents = []
    this.offres = []
    this.typeOffres = []
    if (type === 'PROSPECT') {
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
      this.nameTitle = "Prospect"
      this.name = true;
      this.nameType = 'ENTITY';
      this.nameClass= 'Prospect';
      this.nameNamespace= 'Client';
      this.nameGroups = 'prospect';
      this.reservationService.getList().subscribe((res: any) => {
        return this.reservations = res
      })
    } else if (type === 'PAIEMENT') {
      this.paymentReservationService.getList().subscribe((res: any) => {
        return this.payements = res
      })

    } else if (type === 'ARCHIVER') {
      this.prospectionService.getList(null, this.first, null, null, "OUI").subscribe((res: any) => {
        return this.archives = res
      })
    }
  }
  onPrinter() {
    if (this.type === 'PROSPECT') {
      this.prospectionService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'OFFRE') {
      this.offreService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    } else if (this.type === 'RESERVATION') {
      this.reservationService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
    }
  }

  action(prospect) {
    this.modalService.dismissAll();
    this.prospectionService.edit = false;
    this.prospectionService.uuid = prospect.uuid;
    this.modal(ActionAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }

  add(type,) {
    if (type === 'PROSPECT') {
      this.modalService.dismissAll();
      this.prospectionService.edit = false;
      this.prospectionService.status = 'ACHAT';
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
    } else if (type === 'RESERVATION') {
      this.modalService.dismissAll();
      this.reservationService.edit = false;
      this.reservationService.type = "VENTE";
      this.modal(ReservationAddComponent, 'modal-basic-title', 'lg', true, 'static');
    
    } else if (type === 'PAIEMENT') {
      this.modalService.dismissAll();
      this.paymentReservationService.edit = false;
      this.modal(PaymentProspectAddComponent, 'modal-basic-title', 'xl', true, 'static');
    }else if (type === 'ACTION') {
      this.modalService.dismissAll();
      this.modal(ActionAddComponent, 'modal-basic-title', 'lg', true, 'static');
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

  archiver(item) {
    Swal.fire({
      title: "Souhaitez-vous archiver ce prospect ?",
      input: "textarea",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Archiver",
      cancelButtonText: "Annuler",
      confirmButtonColor: '#d33', 
      preConfirm: async (motif) => {
        const data = {
          prospect: item.uuid,
          motif: motif
        }
        this.prospectionService.archiver(data).subscribe(
          res => {
            if (res?.status === 'success') {
              const index = this.prospectsRow.findIndex(x => x.id === res.data.id);
              if (index !== -1) { this.prospectsRow.splice(index, 1); }
            }
            this.emitter.stopLoading();
          },
        error => { });
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {

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
    this.agentService.typeAssignattion = 'PROSPECT'
    this.prospectionService.setProspection(item)
    this.modal(EtapeComponent, 'modal-basic-title', 'md', true, 'static')
  }

  etapeProspect(item) {
    this.agentService.typeAssignattion = 'ABONNEES'
    this.prospectionService.setProspection(item)
    this.modal(EtapeComponent, 'modal-basic-title', 'md', true, 'static')
  }

  getTimeDifference(date) {
    const Date = moment(date);
    const now = moment();

    const diff = moment.duration(now.diff(Date));
    const days = diff.asDays();
    const hours = diff.hours();
    const minutes = diff.minutes();
    const seconds = diff.seconds();

    var dayString = (Math.floor(days) > 0) ? ((Math.floor(days) == 1) ? "1 jour, " : Math.floor(days) + " jours, ") : "";
    var hourString = (Math.floor(hours) > 0) ? (Math.floor(hours) + " heures, ") : '';
    var minuteString = ( Math.floor(minutes) > 0) ? (Math.floor(minutes) + " minutes, ") : "";
    var secondString = (seconds > 0) ? (seconds + " secondes") : "";

    return dayString + hourString + minuteString + secondString;
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
