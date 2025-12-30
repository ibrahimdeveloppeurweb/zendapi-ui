import { Lot } from '@model/lot';
import { Islet } from '@model/islet';
import { Subdivision } from '@model/subdivision';
import { Component, OnInit } from '@angular/core';
import { LotService } from '@service/lot/lot.service';
import { IsletService } from '@service/islet/islet.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {

  title: string = ""
  dtOptions: any = {};
  global = {country: Globals.country, device: Globals.device}
  entity: Lot
  lot: Lot
  islet: Islet
  subdivision: Subdivision
  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private lotService: LotService,
    private isletService: IsletService,
    private subdivisionService: SubdivisionService
  ) { 
    this.entity = this.lotService.getLot()
    this.islet = this.isletService.getIslet()
    this.subdivision = this.subdivisionService.getSubdivision()
    this.lotService.getSingle(this.entity.uuid).subscribe((res: any) => {
      this.lot = res.data
      return this.lot
    })
    this.title = "Information supplementaire"
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
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
  onClose(){
    this.lotService.setLot(null)
    this.isletService.setIslet(null)
    this.subdivisionService.setSubdivision(null)
    this.modale.close('ferme');
  }

}
