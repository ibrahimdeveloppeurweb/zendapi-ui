import { Spent } from "@model/spent";
import { Supply } from "@model/supply";
import { Payment } from "@model/payment";
import { Treasury } from "@model/treasury";
import { FundRequest } from "@model/fund-request";
import { PaymentFunding } from "@model/payment-funding";
import { PaymentCustomer } from "@model/payment-customer";
import { PaymentRepayment} from "@model/payment-repayment";

export interface Day {
  id?: string;
  uuid?: string;
  code?: string;
  libelle?: string;
  date?: string;
  soldeI?: number;
  soldeF?: number;
  solde?: number;
  spents?: Spent[];
  supplies?: Supply[];
  treasury?: Treasury;
  payments?: Payment[];
  fundRequests?: FundRequest[];
  paymentsFunding?: PaymentFunding[];
  paymentsCustomer?: PaymentCustomer[];
  paymentRepayments?: PaymentRepayment[];
  endAt?: string;
  updatedAt?: string;
  createdAt?: string;
  end?: string;
  create?: string;
  update?: string;
}
