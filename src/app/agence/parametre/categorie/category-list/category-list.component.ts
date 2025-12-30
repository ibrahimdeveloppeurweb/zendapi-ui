import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { LoadCategoryService } from '@service/load-category/load-category.service';
import { LoadCategory } from '@model/load-category';
import { CategoryShowComponent } from '../category-show/category-show.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  @Input() loadCategory: LoadCategory[] = [];
  dtOptions: any = {};
  etat: boolean = false
  userSession = Globals.user


  constructor(
    private router: Router,
    private emitter: EmitterService,
    private modalService: NgbModal,
    private loadCategoryService: LoadCategoryService,
  ) { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.etat = this.loadCategory ? true : false;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'TYPELOAD_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'TYPELOAD_UPDATE') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.loadCategory.unshift(...item);
  }
  update(item): void {
    const index = this.loadCategory.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.loadCategory[index] = item;
    }
  }

  add(){
    this.loadCategoryService.edit = false
    this.modal(CategoryAddComponent, 'modal-basic-title', 'md', true, 'static');
  }

  show(row) {
    this.loadCategoryService.setLoadCategory(row)
    this.modal(CategoryShowComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  showDq(item) {
    this.router.navigate(['/outils/gantt/' + item.uuid + '/DQ']);
  }
  edit(row) {
    this.loadCategoryService.setLoadCategory(row)
    this.loadCategoryService.edit = true
    this.modal(CategoryAddComponent, 'modal-basic-title', 'md', true, 'static')
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
        this.loadCategoryService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.loadCategory.findIndex(x => x.uuid === item.uuid);
            this.emitter.emit({action: 'CATEGORY_ADD', payload: res.data});
            // if (index !== -1) {
            //   this.loadCategory.splice(index, 1);
            // }
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
  }
  print(row) {
    this.loadCategoryService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid)
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
