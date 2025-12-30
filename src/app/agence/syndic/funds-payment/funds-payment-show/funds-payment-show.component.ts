import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FundsPaymentService } from '@service/syndic/funds-payment.service';
import { UploaderService } from '@service/uploader/uploader.service';

@Component({
  selector: 'app-funds-payment-show',
  templateUrl: './funds-payment-show.component.html',
  styleUrls: ['./funds-payment-show.component.scss']
})
export class FundsPaymentShowComponent implements OnInit {

  title: string = ''
  fundsPayment: any
  file: any
  publicUrl = environment.publicUrl;

  constructor(
    public modale: NgbActiveModal,
    private uploader: UploaderService,
    private fundsPaymentService: FundsPaymentService
  ) {
    this.fundsPayment = this.fundsPaymentService.getFundsPayment()
    this.title = "Détails sur le règlement " + this.fundsPayment.code
  }

  ngOnInit(): void {
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
