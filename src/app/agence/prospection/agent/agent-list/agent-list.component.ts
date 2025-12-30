import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgentService } from '@service/agent/agent.service';
import { AgentAddComponent } from '../agent-add/agent-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { environment } from '@env/environment';

@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.scss']
})
export class AgentListComponent implements OnInit {

  @Input() agents: any[] = [];
  publicUrl = environment.publicUrl;

  constructor(
    public router: Router,
    private modalService: NgbModal,
    private agentService: AgentService
  ) { }

  ngOnInit(): void {
  }

  showAgent(item){
    this.agentService.setAgent(item);
    this.router.navigate(['/admin/prospection/agent/show/' + item.uuid]);
  }

  editAgent(item){
    this.agentService.setAgent(item)
    this.agentService.edit = true
    this.modal(AgentAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  deleteAgent(item){
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
        this.agentService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.agents.findIndex(x => x.id === item.id);
            if (index !== -1) { this.agents.splice(index, 1); }
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
    }).result.then((result) => { }, (reason) => { });
  }

}
