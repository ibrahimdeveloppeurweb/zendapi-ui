import { QuoteAddComponent } from '@chantier/quote/quote-add/quote-add.component';
import { Component, OnInit } from '@angular/core';
import { Quote } from '@model/quote';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteService } from '@service/quote/quote.service';
import { VALIDATION } from '@theme/utils/functions';
import { Globals } from '@theme/utils/globals';
import { UploaderService } from '@service/uploader/uploader.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-quote-show',
  templateUrl: './quote-show.component.html',
  styleUrls: ['./quote-show.component.scss']
})
export class QuoteShowComponent implements OnInit {
  title: string = ""
  quote: Quote
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user;
  validation = VALIDATION
  file: string;
  publicUrl = environment.publicUrl;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private quoteService: QuoteService
  ) {
    this.quote = this.quoteService.getQuote()
    this.title =  this.quote.isBon? "Détails du bon de commande " + this.quote.libelle: "Détails du devis de " + this.quote.libelle
  }

  ngOnInit(): void {
  }

  editQuote(row) {
    this.modalService.dismissAll()
    this.quoteService.setQuote(row)
    this.quoteService.edit = true
    this.modal(QuoteAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerQuote(row): void {
    this.quoteService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }

  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
}
