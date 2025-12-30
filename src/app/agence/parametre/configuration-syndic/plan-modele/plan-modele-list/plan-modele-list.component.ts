import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanModeleService } from '@service/configuration/plan-modele.service';
import { Globals } from '@theme/utils/globals';
import { PlanModeleAddComponent } from '../plan-modele-add/plan-modele-add.component';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: 'app-plan-modele-list',
  templateUrl: './plan-modele-list.component.html',
  styleUrls: ['./plan-modele-list.component.scss']
})
export class PlanModeleListComponent implements OnInit {

  dtOptions: any = {}
  models: any[] =[]
  nbActif = 0

  constructor(
    private modalService: NgbModal,
    private planModeleService: PlanModeleService
  ) { 
    this.onListModel()
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
  }

  add(){
    this.planModeleService.edit = false
    this.modal(PlanModeleAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  edit(item){
    this.planModeleService.setPlanModel(item)
    this.planModeleService.edit = true
    this.modal(PlanModeleAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  onChange(item){
    this.planModeleService.getList().subscribe((res: any) => {
      let actif = 0
      let libelle = ''
      res.forEach(element => {
        if(element.etat === 'ACTIF'){
          actif = actif + 1 
          libelle = item.modelP
        }
      });
      if(actif === 1 && item.etat === 'INACTIF'){
        Swal.fire(
          "OUPS !",
          "Désolé le modèle de pln comptable "+ libelle +" est déjà actif. Merci !!!",
          "warning"
        );
        this.onListModel()
      }else if(actif === 0){
        this.onLoad(item.uuid)
      }else if(actif === 1 && item.etat === 'ACTIF'){
        this.onLoad(item.uuid)
      }
    })
  }

  onLoad(uuid){
    this.planModeleService.getEtat(uuid).subscribe((res: any) => {
      this.planModeleService.getList().subscribe((res: any) => {
        this.models = res
      })
    })
  }

  onListModel(){
    this.planModeleService.getList().subscribe((res: any) => {
      console.log(res)
      this.models = res
    })
  }

  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: '<i class="fas fa-trash-alt"></i> Supprimer',
      confirmButtonColor: '#d33',
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.planModeleService.getDelete(item.uuid).subscribe((res: any) => {
          if (res.status === 'success') {
            const index = this.models.findIndex((x) => {
              return x.uuid === item.uuid;
            });
            if (index !== -1) {
              this.models.splice(index, 1);
            }
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
      if(result == 'ferme'){
        this.onListModel()
      }
     }, (reason) => { });
  }

}
