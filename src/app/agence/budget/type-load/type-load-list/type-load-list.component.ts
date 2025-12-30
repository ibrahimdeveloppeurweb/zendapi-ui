import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { TypeLoadService } from '@service/typeLoad/type-load.service';
import { Globals } from '@theme/utils/globals';
import { TypeLoad } from "@model/typeLoad";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TypeLoadShowComponent } from '../type-load-show/type-load-show.component';
import { TypeLoadAddComponent } from '../type-load-add/type-load-add.component';

@Component({
  selector: 'app-type-load-list',
  templateUrl: './type-load-list.component.html',
  styleUrls: ['./type-load-list.component.scss']
})
export class TypeLoadListComponent implements OnInit {
  @Input() typeLoads: TypeLoad[] = [];
  dtOptions: any = {};
  etat: boolean = false
  userSession = Globals.user


  constructor(
    private router: Router,
    private emitter: EmitterService,
    private modalService: NgbModal,
    private TypeLoadService: TypeLoadService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.etat = this.typeLoads ? true : false;
    // this.emitter.event.subscribe((data) => {
    //   if (data.action === 'TYPELOAD_ADD') {
    //     this.appendToList(data.payload);
    //   }
    //   if (data.action === 'TYPELOAD_UPDATE') {
    //     this.update(data.payload);
    //   }
    // });
  }

  appendToList(item): void {
    console.log('rkkrr', item);
    this.typeLoads.unshift(...item);
  }
  update(item): void {
    const index = this.typeLoads.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.typeLoads[index] = item;
    }
  }
  show(row) {
    this.TypeLoadService.setTypeLoad(row)
    this.modal(TypeLoadShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  showDq(item) {
    this.router.navigate(['/outils/gantt/' + item.uuid + '/DQ']);
  }
  edit(row) {
    this.TypeLoadService.setTypeLoad(row)
    this.TypeLoadService.edit = true
    this.modal(TypeLoadAddComponent, 'modal-basic-title', 'lg', true, 'static')
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
        this.typeLoads = []
        this.TypeLoadService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            this.emitter.emit({action: 'TYPELOAD_ADD', payload: res.data});            
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
  }
  print(row) {
    this.TypeLoadService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid)
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
