import { LotAddComponent } from '@lotissement/lot/lot-add/lot-add.component';
import { LotService } from '@service/lot/lot.service';
import { environment } from '@env/environment';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '@theme/utils/globals';
import { Lot } from '@model/lot';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentCustomer } from '@model/payment-customer';

@Component({
  selector: 'app-lot-show',
  templateUrl: './lot-show.component.html',
  styleUrls: ['./lot-show.component.scss']
})
export class LotShowComponent implements OnInit {
  public viewImage: number;
  files = [];
  payments: PaymentCustomer[];
  title: string = "";
  lot: Lot;
  global = {country: Globals.country, device: Globals.device};
  userSession = Globals.user;
  publicUrl = environment.publicUrl;
  total: number = 0;

  constructor(
    public modale: NgbActiveModal,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private lotService: LotService
  ) {
    this.viewImage = 1;
    this.lotService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
      if(res){
        if(res?.folder?.files.length > 0){
          res?.folder?.files.forEach((file, index) =>{
            if(index < 5){
              this.files.push(file);
            }
          });
        }
        this.lot = res;
        this.payments = this.lot?.folderCustomer?.invoice?.payments;
        this.payments?.forEach(item => { return this.total = this.total + item?.montant });
        return this.lot;
      }
    });
  }

  ngOnInit(): void {
  }

  editLot(row) {
    this.lotService.setLot(row)
    this.lotService.edit = true
    this.modal(LotAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  printerLot(row): void {
    this.lotService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  back(){ this.router.navigate(['/admin/lotissement']) }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => {});
  }

}
