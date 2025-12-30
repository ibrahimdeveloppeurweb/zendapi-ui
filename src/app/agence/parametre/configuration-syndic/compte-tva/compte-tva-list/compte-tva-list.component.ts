import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompteTvaService } from '@service/configuration/compte-tva.service';
import { Globals } from '@theme/utils/globals';
import { CompteTvaAddComponent } from '../compte-tva-add/compte-tva-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-compte-tva-list',
  templateUrl: './compte-tva-list.component.html',
  styleUrls: ['./compte-tva-list.component.scss']
})
export class CompteTvaListComponent implements OnInit {

  taxes: any[] = []
  dtOptions = {}
  agency = Globals.user.agencyKey

  constructor(
    private modalService: NgbModal,
    private compteTvaService: CompteTvaService
  ) { 
    this.compteTvaService.getList().subscribe((res: any) => {
      this.taxes = res
    })
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
  }

  add(){
    this.compteTvaService.edit = false
    this.modal(CompteTvaAddComponent, 'modal-basic-title', 'md', true, 'static');
  }

  edit(item){
    this.compteTvaService.setCompteTva(item)
    this.compteTvaService.edit = true
    this.modal(CompteTvaAddComponent, 'modal-basic-title', 'md', true, 'static');
  }

  onChange(item){
    this.compteTvaService.getEtat(item.uuid).subscribe((res: any) => {
      console.log(res)
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
        this.compteTvaService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.taxes.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.taxes.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
        });
        Swal.fire('', 'Enrégistrement supprimé avec succès !', 'success');
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
        this.compteTvaService.getList().subscribe((res: any) => {
          this.taxes = res
        })
      }
     }, (reason) => { });
  }
}
