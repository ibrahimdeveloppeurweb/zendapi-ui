import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TantiemeService } from '@service/syndic/tantieme.service';
import { TantiemeAddComponent } from '../tantieme-add/tantieme-add.component';

@Component({
  selector: 'app-tantieme-list',
  templateUrl: './tantieme-list.component.html',
  styleUrls: ['./tantieme-list.component.scss']
})
export class TantiemeListComponent implements OnInit {

  tantiemes: any[] = []
  dtOptions = {}
  agency = Globals.user.agencyKey

  constructor(
    private modalService: NgbModal,
    private tantiemeService: TantiemeService
  ) {
    this.tantiemeService.getList(null, null).subscribe((res: any) => {
      this.tantiemes = res
    })
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
  }

  add(){
    this.tantiemeService.edit = false
    this.modal(TantiemeAddComponent, 'modal-basic-title', 'md', true, 'static');
  }

  edit(item){
    this.tantiemeService.setTantieme(item)
    this.tantiemeService.edit = true
    this.modal(TantiemeAddComponent, 'modal-basic-title', 'md', true, 'static');
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
        this.tantiemeService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.tantiemes.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.tantiemes.splice(index, 1);
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
      if(result == 'TANTIEME'){
        this.tantiemeService.getList(null, null).subscribe((res: any) => {
          this.tantiemes = res
        })
      }
     }, (reason) => { });
  }


}
