import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-invoice-payment-list',
  templateUrl: './invoice-payment-list.component.html',
  styleUrls: ['./invoice-payment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoicePaymentListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
