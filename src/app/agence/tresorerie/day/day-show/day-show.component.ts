 import { Component, OnInit } from '@angular/core';
import { Day } from '@model/day';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DayService } from '@service/day/day.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-day-show',
  templateUrl: './day-show.component.html',
  styleUrls: ['./day-show.component.scss']
})
export class DayShowComponent implements OnInit {
  title: string = "";
  soldeF: number = 0;
  totalR: number = 0;
  totalD: number = 0;
  day: Day;
  suppliesEntr = [];
  suppliesSort = [];
  supplies = [];
  payments = [];
  paymentsCustomer = [];
  revers = [];
  paymentsF = [];
  spents = [];
  funds = [];
  global = {country: Globals.country, device: Globals.device};
  userSession = Globals.user;

  constructor(
    public modale: NgbActiveModal,
    private dayService: DayService
  ) {
    this.day = this.dayService.getDay();
    this.title = "Détails de la " + this.day?.libelle;
  }

  ngOnInit(): void {
    this.soldeF = this.day?.soldeI;
    this.totalR = this.day?.soldeI;
    //Approvisionnement
    this.day.supplies.forEach((item) =>{
      this.supplies.push({
        date: item?.createdAt,
        libelle: item?.libelle,
        compte: item.emetteur.uuid === this.day.treasury.uuid ? "DEBIT" : "CREDIT",
        recette: item.recepteur.uuid === this.day.treasury.uuid ? item?.montant : 0,
        depense: item.emetteur.uuid === this.day.treasury.uuid ? item?.montant : 0,
        solde: item.recepteur.uuid === this.day.treasury.uuid ? item?.montant + this.soldeF : this.soldeF - item?.montant,
      });
      if (item.emetteur.uuid === this.day.treasury.uuid) {
        this.totalD = this.totalD + item?.montant;
        this.soldeF = this.soldeF - item?.montant;
      } else if (item.recepteur.uuid === this.day.treasury.uuid) {
        this.totalR = this.totalR + item?.montant;
        this.soldeF = item?.montant + this.soldeF;
      }
    });

    //Locataire
    this.day?.payments?.forEach((item) =>{
      this.payments?.push({
        date: item?.createdAt,
        libelle: item?.invoice?.libelle,
        compte: item?.compte,
        recette: item?.compte === "CREDIT" ? item?.montant : 0,
        depense: item?.compte === "DEBIT" ? item?.montant : 0,
        solde: item?.compte === "CREDIT" ? item?.montant + this.soldeF : this.soldeF - item?.montant,
      });
      if (item?.compte === "CREDIT") {
        this.totalR = this.totalR + item?.montant;
        this.soldeF = item?.montant + this.soldeF;
      } else if (item?.compte === "DEBIT") {
        this.totalD = this.totalD + item?.montant;
        this.soldeF = this.soldeF - item?.montant;
      }
    });

    //Client
    this.day?.paymentsCustomer?.forEach((item) =>{
      this.paymentsCustomer?.push({
        date: item?.createdAt,
        libelle: item?.invoice?.libelle,
        compte: item?.compte,
        recette: item?.compte === "CREDIT" ? item?.montant : 0,
        depense: item?.compte === "DEBIT" ? item?.montant : 0,
        solde: item?.compte === "CREDIT" ? item?.montant + this.soldeF : this.soldeF - item?.montant,
      });
      if (item?.compte === "CREDIT") {
        this.totalR = this.totalR + item?.montant;
        this.soldeF = item?.montant + this.soldeF;
      } else if (item?.compte === "DEBIT") {
        this.totalD = this.totalD + item?.montant;
        this.soldeF = this.soldeF - item?.montant;
      }
    });

    //Financement
    this.day?.paymentsFunding?.forEach((item) =>{
      this.paymentsF?.push({
        date: item?.createdAt,
        libelle: item?.invoice?.libelle,
        compte: "DEBIT",
        recette: 0,
        depense: item?.montant,
        solde: this.soldeF - item?.montant,
      })
      this.totalD = this.totalD + item?.montant;
      this.soldeF =  this.soldeF - item?.montant;
    });

    //Paiement de reversement
    this.day?.paymentRepayments?.forEach((item) =>{
      this.revers?.push({
        date: item?.createdAt,
        libelle: item?.invoice?.libelle,
        compte: "DEBIT",
        recette: 0,
        depense: item?.montant,
        solde: this.soldeF - item?.montant,
      })
      this.totalD = this.totalD + item?.montant;
      this.soldeF =  this.soldeF - item?.montant;
    });

    //Demande de fonds
    this.day?.fundRequests?.forEach((item) =>{
      if( item?.etat === 'DECAISSER'){
        this.funds?.push({
          date: item?.createdAt,
          libelle: item?.motif,
          compte: "DEBIT",
          recette: 0,
          depense: item?.montantD,
          solde: this.soldeF - item?.montantD ,
        })
        this.totalD = this.totalD + item?.montantD;
        this.soldeF = this.soldeF - item?.montantD;
      }
    });

    //Dépense
    this.day?.spents?.forEach((item) =>{
      this.spents?.push({
        date: item?.createdAt,
        libelle: item?.motif,
        compte: "DEBIT",
        recette: 0,
        depense: item?.montant,
        solde: this.soldeF - item?.montant ,
      })
      this.totalD = this.totalD + item?.montant;
      this.soldeF = this.soldeF - item?.montant;
    });
  }
  printerDay(row): void {
    this.dayService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

}
