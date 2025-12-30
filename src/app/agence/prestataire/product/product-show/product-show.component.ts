import { Component, OnInit } from '@angular/core';
import { Product } from '@model/product';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '@service/product/product.service';
import { Globals } from '@theme/utils/globals';
import { ProductAddComponent } from '@agence/prestataire/product/product-add/product-add.component';

@Component({
  selector: 'app-product-show',
  templateUrl: './product-show.component.html',
  styleUrls: ['./product-show.component.scss']
})
export class ProductShowComponent implements OnInit {
  title: string = ""
  product: Product
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private productService: ProductService
  ) {
    this.product = this.productService.getProduct()
    this.title = "Détails sur le produit " + this.product.libelle
  }

  ngOnInit(): void {
  }

  editProduct(row) {
    this.modalService.dismissAll()
    this.productService.setProduct(row)
    this.productService.edit = true
    this.modal(ProductAddComponent, 'modal-basic-title', 'md', true, 'static')
  }

  printerProduct(row): void {
    this.productService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
