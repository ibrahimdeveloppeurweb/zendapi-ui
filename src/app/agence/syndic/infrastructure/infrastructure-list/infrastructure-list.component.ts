import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfrastructureService } from '@service/syndic/infrastructure.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { InfrastructureAddComponent } from '../infrastructure-add/infrastructure-add.component';
import { InfrastructureShowComponent } from '../infrastructure-show/infrastructure-show.component';

@Component({
  selector: 'app-infrastructure-list',
  templateUrl: './infrastructure-list.component.html',
  styleUrls: ['./infrastructure-list.component.scss']
})
export class InfrastructureListComponent implements OnInit {

  @Input() infrastructures: any[] = []
  dtOptions = {}
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private infrastructureService: InfrastructureService
  ) { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

  showInfrastructure(item){
    this.infrastructureService.setInfrastructure(item)
    this.modal(InfrastructureShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }

  editInfrastructure(item){
    this.infrastructureService.setInfrastructure(item)
    this.infrastructureService.edit = true
    this.modal(InfrastructureAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printInfrastructure(item){
    this.infrastructureService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, item?.trustee?.uuid, item.uuid);
  }

  delete(item){
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
        this.infrastructureService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.infrastructures.findIndex(x => x.id === item.id);
            if (index !== -1) { this.infrastructures.splice(index, 1); }
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
      if(result == 'INFRASTRUCTURE'){
        this.infrastructureService.getList().subscribe((res: any) => {
          return this.infrastructures = res
        })
      }
   }, (reason) => { });
  }

  onSubStringLongName(str: string): any {
    if (str !== null) {
      if (str.length > 35) {
        return str.substring(0, 35) + ' ...';
      } else {
        return str;
      }
    } else {
      return '';
    }
  }

}
