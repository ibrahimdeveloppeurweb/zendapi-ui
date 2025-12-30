import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanComptableService } from '@service/configuration/plan-comptable.service';
import { Globals } from '@theme/utils/globals';
import { PlanComptableAddComponent } from '../plan-comptable-add/plan-comptable-add.component';
import { PlanComptableShowComponent } from '../plan-comptable-show/plan-comptable-show.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';


@Component({
  selector: 'app-plan-comptable-list',
  templateUrl: './plan-comptable-list.component.html',
  styleUrls: ['./plan-comptable-list.component.scss']
})
export class PlanComptableListComponent implements OnInit {

  dtOptions: any = {};
  agency = Globals.user.agencyKey
  plans: any[] =[]
  plan: any

  constructor(
    private modalService: NgbModal,
    private planComptableServce: PlanComptableService
  ) {
    this.planComptableServce.getList().subscribe((res: any) => {
      this.plans = res
    })
   }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

  add(){
    this.planComptableServce.edit = false
    this.modal(PlanComptableAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  show(item){
    this.planComptableServce.setPlanComptable(item)
    this.modal(PlanComptableShowComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  edit(item){
    this.planComptableServce.setPlanComptable(item)
    this.planComptableServce.edit = true
    this.modal(PlanComptableAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  onChange(item){
    this.planComptableServce.getEtat(item.uuid).subscribe((res: any) => {
      if(res){}
    })
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
        this.planComptableServce.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.plans.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.plans.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
        });
        Swal.fire('', 'Enrégistrement supprimé avec succès !', 'success');
      }
    });
  }
  
  onImport() {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = 'ACCOUNT';
  }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { 
      if(result == 'ferme'){
        this.planComptableServce.getList().subscribe((res: any) => {
          this.plans = res
        })
      }
    }, (reason) => { });
  }

}
