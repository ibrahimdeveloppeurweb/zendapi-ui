
import { Ville} from '@model/ville';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { TypeBienService } from '@service/type-bien/type-bien.service';
import { TypeBien } from '@model/type-bien';
import { TypeBienAddComponent } from '../type-bien-add/type-bien-add.component';
import { TypeBienShowComponent } from '../type-bien-show/type-bien-show.component';

@Component({
  selector: 'app-type-bien-list',
  templateUrl: './type-bien-list.component.html',
  styleUrls: ['./type-bien-list.component.scss'],
})
export class TypeBienListComponent implements OnInit {
  @Input() typeBiens: TypeBien[]= [];
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = true
  userSession = Globals.user


  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private typeBienService: TypeBienService,
  ) {
    this.typeBienService.getList().subscribe((res: any) => {
      this.typeBiens = res
    })
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'TYPE_BIEN_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'TYPE_BIEN_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.typeBiens.unshift(...item);
  }
  update(item): void {
    const index = this.typeBiens.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.typeBiens[index] = item;
    }
  }
  addTypeBien() {
    this.modalService.dismissAll();
    this.typeBienService.edit = false;
    this.modal(TypeBienAddComponent, 'modal-basic-title', 'md', true, 'static');
  }
  editTypeBien(row) {
    this.typeBienService.setTyepBien(row)
    this.typeBienService.edit = true
    this.modal(TypeBienAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  showTypeBien(row) {
    this.typeBienService.setTyepBien(row)
    this.modal(TypeBienShowComponent, 'modal-basic-title', 'md', true, 'static')
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
        this.typeBienService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.typeBiens.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.typeBiens.splice(index, 1);
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
