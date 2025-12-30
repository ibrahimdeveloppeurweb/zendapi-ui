import { Category } from '@model/category';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '@service/category/category.service';
import { CategoryAddComponent } from '../category-add/category-add.component';

@Component({
  selector: 'app-category-show',
  templateUrl: './category-show.component.html',
  styleUrls: ['./category-show.component.scss']
})
export class CategoryShowComponent implements OnInit {

  title: string = ""
  category: Category
  constructor(
    private modalService: NgbModal,
    public modale: NgbActiveModal,
    private categoryService: CategoryService
  ) { 
    this.category = this.categoryService.getCategory()
    this.title = "Détails categorie " + this.category.libelle
  }

  ngOnInit(): void {
  }

  edit(){
    this.categoryService.setCategory(this.category)
    this.categoryService.edit = true
    this.modal(CategoryAddComponent, 'modal-basic-title', 'lg', true, 'static')
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
