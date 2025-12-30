import { Component, Input, OnInit } from '@angular/core';
import { Product } from '@model/product';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { ProductService } from '@service/product/product.service';
import { ProductAddComponent } from '@agence/prestataire/product/product-add/product-add.component';
import { ProductShowComponent } from '@agence/prestataire/product/product-show/product-show.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @Input() products: Product[];
  type: string = 'PRODUIT';
  dtOptions: any = {};
  etat: boolean = false;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private productService: ProductService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen'))
      ? JSON.parse(localStorage.getItem('permission-zen'))
      : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.etat = this.products ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PRODUCT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PRODUCT_UPDATE') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.products.unshift(row);
  }
  appendToListFamily(row): void {
    this.products.unshift(row);
  }
  update(row): void {
    const index = this.products.findIndex((x) => x.uuid === row.uuid);
    if (index !== -1) {
      this.products[index] = row;
    }
  }
  editProduct(row) {
    this.productService.setProduct(row);
    this.productService.edit = true;
    this.modal(ProductAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showProduct(row) {
    this.productService.setProduct(row);
    this.modal(ProductShowComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  printerProduct(row): void {
    this.productService.getPrinter(
      'SHOW',
      this.userSession?.agencyKey,
      this.userSession?.uuid,
      row?.uuid
    );
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
      reverseButtons: true,
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.productService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.products.findIndex((x) => x.uuid === item.uuid);
            if (index !== -1) {
              this.products.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
  }
  modal(component, type, size, center, backdrop) {
    this.modalService
      .open(component, {
        ariaLabelledBy: type,
        size: size,
        centered: center,
        backdrop: backdrop,
      })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
}
