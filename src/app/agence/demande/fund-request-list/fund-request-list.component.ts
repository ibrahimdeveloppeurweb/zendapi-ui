import { FilterService } from '@service/filter/filter.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FundRequestService } from '@service/fund-request/fund-request.service';
import { FundRequestAddComponent } from '@demande/fund-request-add/fund-request-add.component';
import { FundRequestShowComponent } from '@demande/fund-request-show/fund-request-show.component';
import { FundRequestDisburseComponent } from '@demande/fund-request-disburse/fund-request-disburse.component';
import { FundRequest } from '@model/fund-request';
import { Globals } from '@theme/utils/globals';
import { NgxPermissionsService } from 'ngx-permissions';
import { ImportationComponent } from '@agence/modal/importation/Importation.component';
import { CookieService } from 'ngx-cookie-service';
import { OnBoardingService } from '@theme/utils/on-boarding.service';

@Component({
  selector: 'app-fund-request-list',
  templateUrl: './fund-request-list.component.html',
  styleUrls: ['./fund-request-list.component.scss']
})
export class FundRequestListComponent implements OnInit {
  @Input() funds: FundRequest[] = [];
  @Input() action: boolean = true
  @Input() isFilterVisible: boolean = true
  @Input() tresorerie = true;
  filter: any
  total: number = 0
  totalD: number = 0
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  treasurys = []
  type: string = 'DEMANDE'
  typeRow = [
    { label: "DEMANDE DE FOND", value: "DEMANDE" },
  ]
  etatRow = [
    { label: 'DECAISSE', value: 'DECAISSE' },
    { label: 'ATTENTE', value: 'ATTENTE' }
  ]
  categorieRow = [];
  nameTitle: string = "Motif"
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = "Type de demande"
  etatTitle: string = "Etat ?"
  cookie: string = ''

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private filterService: FilterService,
    private fundRequestService: FundRequestService,
    public boarding: OnBoardingService,
    private cookieService: CookieService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.fundRequestService.getList().subscribe(res => {
      this.etat = res ? true : false;
      this.funds = res;
      this.funds.forEach(item => {
        this.total += item?.montant
        this.totalD += item?.montantD
      })
      return this.funds; }, error => {});
  }

  ngOnInit(): void {
    console.log(this.funds)
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'FUND_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'FUND_DISBURSE' || data.action === 'FUND_CONFRIMATION' ||
        data.action === 'FUND_SEND' || data.action === 'FUND_VALIDATE' || data.action === 'FUND_REJECT') {
        this.update(data.payload);
      }
    });
  }
  ngAfterViewInit(): void {
    this.cookie = this.cookieService.get('fund-request');
    var etat = this.cookie ? true : false;
    // if(this.cookie !== 'on-boarding-fund-request') {
    //   this.boarding.request(etat);
    // }
    // this.boarding.request(etat);
  }
  appendToList(row): void {
    this.funds.unshift(row);
  }
  update(row): void {
    const index = this.funds.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.funds[index] = row;
    }
  }
  onFilter($event) {
    this.filterService.type = this.type;
    this.filter = null
    this.funds = []
    this.total = 0
    this.totalD = 0
    this.filterService.search($event, 'demande', null).subscribe(
      res => {
        this.filter = this.filterService.filter
        if(this.type === 'DEMANDE'){
          this.funds = res;
          this.funds.forEach(item => {
            this.total += item?.montant
            this.totalD += item?.montantD
          })
          return this.funds;
        }
    }, err => { })
  }
  onPrinter() {
    this.fundRequestService.getPrinter('LISTE', this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
  }
  onModel(){
    this.fundRequestService.getGenerer();
  }
  onExport() {
    this.fundRequestService.getExport(this.userSession?.agencyKey, this.userSession?.uuid, this.filter);
  }
  onImport(){
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ImportationComponent);
    modalRef.componentInstance.type = this.type;
  }
  addFundRequest() {
    this.modalService.dismissAll()
    this.fundRequestService.edit = false
    this.modal(FundRequestAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  showFundRequest(row) {
    this.fundRequestService.setFundRequest(row)
    this.modal(FundRequestShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerFund(row): void {
    this.fundRequestService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  disburseFund(row) {
    this.fundRequestService.setFundRequest(row)
    this.modal(FundRequestDisburseComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  editFundRequest(row) {
    this.fundRequestService.setFundRequest(row)
    this.fundRequestService.edit = true
    this.modal(FundRequestAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  sendFund(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment transmettre cette demande?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
      this.fundRequestService.send(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'FUND_SEND', payload: res?.data});
          }
        }
      });
      }
    });
  }
  rejectFund(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment rejeter cette demande?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
      this.fundRequestService.reject(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'FUND_REJECT', payload: res?.data});
          }
        }
      });
      }
    });
  }
  validateFund(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider ccette demande?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
      this.fundRequestService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'FUND_VALIDATE', payload: res?.data});
          }
        }
      });
      }
    });
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
        this.fundRequestService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.funds.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.funds.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
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
