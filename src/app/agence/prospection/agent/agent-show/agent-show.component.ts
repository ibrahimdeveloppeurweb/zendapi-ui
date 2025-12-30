import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { EtapeComponent } from '../etape/etape.component';
import { AgentService } from '@service/agent/agent.service';
import { OffreService } from '@service/offre/offre.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { ProspectionService } from '@service/prospection/prospection.service';
import { ProspectionAddComponent } from '@agence/prospection/prospection/prospection-add/prospection-add.component';


@Component({
  selector: 'app-agent-show',
  templateUrl: './agent-show.component.html',
  styleUrls: ['./agent-show.component.scss']
})
export class AgentShowComponent implements OnInit {

  agent: any;
  view: boolean;
  viewImage: number;
  prospects: any [];
  activeTab: string = 'DETAIL';

  activites = [
    {
      user: 'Bamba lamine',
      profil: 'assets/images/avatar-default.png',
      createdAt: '03 juillet 2023',
      content: '2021 - Explorez le tableau « Petit texte » de professeur robot, auquel 912 utilisateurs de Pinterest sont abonnés. Voir plus d',
      image: [
        {file: 'assets/images/building.png'},
        {file: 'assets/images/offre.jpeg'},
      ]
    },
    {
      user: 'Bamba lamine',
      profil: "assets/images/avatar-default.png",
      createdAt: '03 juillet 2023',
      content: '2021 - Explorez le tableau « Petit texte » de professeur robot, auquel 912 utilisateurs de Pinterest sont abonnés. Voir plus d',
      image: [
        {file: 'assets/images/building.png'},
        {file: 'assets/images/offre.jpeg'},
      ]
    }
  ]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private offreService: OffreService,
    private agentService: AgentService,
    private prospectionService: ProspectionService,
    // private reservationService: ReservationService,
  ) {
    this.viewImage = 1;
    // this.prospect = this.prospectService.getProspection();
    this.agentService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
      return this.agent = res;
    });
   }

  ngOnInit(): void {
  }

  onChangeLoad(bool: boolean, type) {
    this.activeTab = type;
    this.view = bool
    if(type === 'DETAIL'){
      this.prospectionService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        return this.agent = res;
      });
    } else if(type === 'PROSPECT'){
      this.prospectionService.getList().subscribe((res: any) => {
        return this.prospects = res
      })
    } else if(type === 'ACTIVITE'){
      this.activites= this.activites
    }
  }

  showProspect(item){
    this.prospectionService.setProspection(item);
    this.router.navigate(['/admin/prospection/show/' + item.uuid]);
  }
  editProspect(item){
    this.prospectionService.setProspection(item)
    this.prospectionService.edit = true
    this.modal(ProspectionAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  deleteProspect(item){
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
  assignerProspect(item){}

  etapeProspect(item){
    this.agentService.typeAssignattion = 'AGENT'
    this.agentService.uuidEtape = item?.uuid
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

  back() { this.router.navigate(['/admin/prospection']) }

}
