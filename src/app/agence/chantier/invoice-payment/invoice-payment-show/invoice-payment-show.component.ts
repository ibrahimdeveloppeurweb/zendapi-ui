import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-invoice-payment-show',
  templateUrl: './invoice-payment-show.component.html',
  styleUrls: ['./invoice-payment-show.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicePaymentShowComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
