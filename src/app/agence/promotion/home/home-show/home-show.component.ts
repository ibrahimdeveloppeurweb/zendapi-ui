import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { Home } from '@model/home';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '@service/home/home.service';
import { HomeAddComponent } from '../home-add/home-add.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '@service/customer/customer.service';
import { PaymentCustomer } from '@model/payment-customer';
import { ReportListComponent } from '@agence/promotion/report/report-list/report-list.component';
import { ReportService } from '@service/report/report.service';

@Component({
  selector: 'app-home-show',
  templateUrl: './home-show.component.html',
  styleUrls: ['./home-show.component.scss']
})
export class HomeShowComponent implements OnInit {
  public viewImage: number;
  title: string = ""
  home: Home
  payments: PaymentCustomer[]
  files= []
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  total = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private reportService: ReportService,
    private homeService: HomeService,
    private customerService: CustomerService
  ) {
    this.viewImage = 1;
    this.homeService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
      if(res){
        if(res?.folder?.files.length > 0){
          res?.folder?.files.forEach((file, index) =>{
            if(index < 5){
              this.files.push(file);
            }
          });
        }
        this.home = res;
        this.payments = this.home?.folderCustomer?.invoice?.payments;
        this.payments?.forEach(item => { return this.total = this.total + item?.montant })
        return this.home;
      }
    });
  }

  ngOnInit(): void {
  }
  editHome(data) {
    this.homeService.setHome(data)
    this.homeService.edit = true
    this.modal(HomeAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  showCustomer(row) {
    this.customerService.setCustomer(row)
    this.router.navigate(['/admin/client/show/'+row.uuid])
  }
  showReport(row) {
    this.reportService.setEtat(true)
    this.reportService.setReport(row?.reports)
    this.modal(ReportListComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  show(row,type) {
    this.router.navigate(['/outils/gantt/' + row.uuid + '/'+type]);
  }
  printerHome(row): void {
    this.homeService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  back(){ this.router.navigate(['/admin/promotion']) }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
}
