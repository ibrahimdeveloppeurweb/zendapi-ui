import { Component, OnInit } from '@angular/core';
import { CategoryAddComponent } from '../category-add/category-add.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadCategory } from '@model/load-category';
import { Globals } from '@theme/utils/globals';
import { LoadCategoryService } from '@service/load-category/load-category.service';

@Component({
  selector: 'app-category-show',
  templateUrl: './category-show.component.html',
  styleUrls: ['./category-show.component.scss']
})
export class CategoryShowComponent implements OnInit {

  title = '';
  loadCategory: LoadCategory;
  userSession = Globals.user

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private loadCategoryService: LoadCategoryService
  ) {
    this.loadCategory= this.loadCategoryService.getLoadCategory()
    this.title = "Détails de la catégorie de charge: " + this.loadCategory.libelle
  }

  ngOnInit(): void {
  }

  edit(row) {
    this.modalService.dismissAll();
    this.loadCategoryService.setLoadCategory(row);
    this.loadCategoryService.edit = true;
    this.modal(CategoryAddComponent, 'modal-basic-title', 'md', true, 'static');
  }

  printer(row): void {
    // this.loadCategoryService.getPrinter('SHOW', this.userSession.uuid, row.uuid);
  }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {
    }, (reason) => {
    });
  }
}
