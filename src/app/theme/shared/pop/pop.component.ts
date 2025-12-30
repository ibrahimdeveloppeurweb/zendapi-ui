import { CustomerAddComponent } from '@agence/client/customer/customer-add/customer-add.component';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '@service/customer/customer.service';

@Component({
  selector: 'app-pop',
  templateUrl: './pop.component.html',
  styleUrls: ['./pop.component.scss']
})
export class PopComponent implements OnInit {


  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
  }

  add(type){
    this.modale.close('ferme')
    this.modalService.dismissAll();
    this.customerService.edit = false;
    this.customerService.type = type;
    this.customerService.categorie = 'PROSPECT'
    this.modal(CustomerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {
     
    }, (reason) => { });
  }
  back(){
    this.modale.close('ferme')
    this.customerService.categorie = ''
    this.customerService.uuidProspect = ''
  }


}
