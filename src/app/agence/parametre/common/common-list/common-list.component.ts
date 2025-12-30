
import { Common } from '@model/common';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from '@service/common/common.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { CommonAddComponent } from '../common-add/common-add.component';
import { CommonShowComponent } from '../common-show/common-show.component';
@Component({
  selector: 'app-common-list',
  templateUrl: './common-list.component.html',
  styleUrls: ['./common-list.component.scss']
})
export class CommonListComponent implements OnInit {
  @Input() commons: Common[]
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = true
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private commonService: CommonService,
  ) {
    this.commonService.getList().subscribe((res: any) => {
      this.commons = res
      console.log(this.commons);
    })
  }

  ngOnInit(): void {
    this.etat = this.commons ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
    console.log(data)
      if (data.action === 'COMMON_ADD') {
        this.appendToList(data.payload);
      }
      
      if (data.action === 'COMMON_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.commons.unshift(...item);
  }
  update(item): void {
    const index = this.commons.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.commons[index] = item;
    }
  }
  addCommon() {
    this.modalService.dismissAll();
    this.commonService.edit = false;
    this.modal(CommonAddComponent, 'modal-basic-title', 'md', true, 'static');
  }
  editCommon(row) {
    this.commonService.setCommon(row)
    this.commonService.edit = true
    this.modal(CommonAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  showCommon(row) {
    this.commonService.setCommon(row)
    this.modal(CommonShowComponent, 'modal-basic-title', 'md', true, 'static')
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
        this.commonService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.commons.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.commons.splice(index, 1);
              console.log(item?.isDelete);
            }
            Swal.fire('', res?.message, res?.status);
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

