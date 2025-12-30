import { Quote } from '@model/quote';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteService } from '@service/quote/quote.service';
import { QuoteAddComponent } from '../quote-add/quote-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { VALIDATION } from '@theme/utils/functions';
import { QuoteShowComponent } from '../quote-show/quote-show.component';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-quote-list',
  templateUrl: './quote-list.component.html',
  styleUrls: ['./quote-list.component.scss']
})
export class QuoteListComponent implements OnInit {
  @Input() quotes: Quote[]
  @Input() mode: string = "LOCATIVE"
  @Input() isBon = false;
  @Input() prestataire = true;
  @Input() construction = true;

  type: string = 'DEVIS'
  dtOptions: any = {};
  etat :boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  validation = VALIDATION
  total = 0;
  modelRef: any;

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private quoteService: QuoteService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.etat = this.quotes ? true : false;
    if(this.etat){ this.quotes.forEach(item => { this.total += item?.montant }) }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'QUOTE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'QUOTE_VALIDATE' || data.action === 'QUOTE_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.quotes.unshift(row);
  }
  update(row): void {
    const index = this.quotes.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.quotes[index] = row;
    }
  }
  editQuote(row) {
    this.quoteService.setQuote(row)
    this.quoteService.edit = true
     this.quoteService.construction = null
    this.modal(QuoteAddComponent, 'modal-basic-title', 'xl', true, 'static')
    this.modelRef.componentInstance.type = row.trustee != null?  "SYNDIC":"LOCATIVE"
    this.modelRef.componentInstance.isBon = this.isBon
  }
  showQuote(row) {
    this.quoteService.setQuote(row)
    this.modal(QuoteShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerQuote(row): void {
    this.quoteService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  validateQuote(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet financement ?',
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
      this.quoteService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'QUOTE_VALIDATE', payload: res?.data});
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
        this.quoteService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.quotes.findIndex(x => x.uuid === item.uuid);
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
  }
  modal(component, type, size, center, backdrop) {
    this.modelRef = this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    });
  }
}
