import { Component, Input, OnInit } from '@angular/core';
import { Category } from '@model/category';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { CategoryService } from '@service/category/category.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { CategoryShowComponent } from '../category-show/category-show.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  @Input() categories: Category[]
  type: string = 'CATEGORY'
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private categorieService: CategoryService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'CATEGORY_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'CATEGORY_UPDATED') {
        this.update(data.payload);
      }
    });
  }
  appendToList(row): void {
    this.categories.unshift(row);
  }
  update(row): void {
    const index = this.categories.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.categories[index] = row;
    }
  }
  add(){
    this.categorieService.edit = false
    this.modal(CategoryAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  edit(item){
    this.categorieService.setCategory(item)
    this.categorieService.edit = true
    this.modal(CategoryAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  show(item){
    this.categorieService.setCategory(item)
    this.modal(CategoryShowComponent, 'modal-basic-title', 'lg', true, 'static')
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
        this.categorieService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.categories.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.categories.splice(index, 1);
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
