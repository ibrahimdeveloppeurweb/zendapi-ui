import { HomeTypeAddComponent } from '@promotion/home-type/home-type-add/home-type-add.component';
import { HomeTypeService } from '@service/home-type/home-type.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeType } from '@model/home-type';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-type-show',
  templateUrl: './home-type-show.component.html',
  styleUrls: ['./home-type-show.component.scss']
})
export class HomeTypeShowComponent implements OnInit {
  title: string = ""
  homeType: HomeType

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private homeTypeService: HomeTypeService
  ) {
    this.homeType = this.homeTypeService.getHomeType()
    this.title = "Détails du type de maison "+ this.homeType?.libelle
  }

  ngOnInit() {
  }

  editHome(data) {
    this.homeTypeService.setHomeType(data)
    this.homeTypeService.edit = true
    this.modal(HomeTypeAddComponent, 'modal-basic-title', 'xl', true, 'static')
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
