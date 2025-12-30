import { Component, OnInit } from '@angular/core';
import { Day } from '@model/day';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { DayService } from '@service/day/day.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-day-end',
  templateUrl: './day-end.component.html',
  styleUrls: ['./day-end.component.scss']
})
export class DayEndComponent implements OnInit {
  title: string = ""
  soldeF: number = 0
  totalR: number = 0
  totalD: number = 0
  day: Day
  suppliesEntr = []
  suppliesSort = []
  revers = []
  paymentsEntr = []
  paymentsSort = []
  paymentsCustEntr = []
  paymentsCustSort = []
  paymentsF = []
  spents = []
  funds = []
  global = {country: Globals.country, device: Globals.device}

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private dayService: DayService,
    private emitter: EmitterService
  ){
    this.day = this.dayService.getDay()
    this.title = "Cloture de la journee" + this.day.code
  }

  ngOnInit(): void {
    this.soldeF = this.day?.soldeI
    this.totalR = this.day?.soldeI
    this.day.supplies.forEach((item) =>{
      if (item.emetteur.uuid === this.day.treasury.uuid) {
        this.suppliesSort.push({
          date: item?.createdAt,
          libelle: item?.libelle,
          montant: item?.montant,
          solde: item?.montant + this.soldeF,
        })
        this.totalD = this.totalD + item?.montant
        this.soldeF = this.soldeF - item?.montant
      }
      if (item.recepteur.uuid === this.day.treasury.uuid) {
        this.suppliesEntr.push({
          date: item?.createdAt,
          libelle: item?.libelle,
          montant: item?.montant,
          solde: item?.montant + this.soldeF,
        })
        this.totalR = this.totalR + item?.montant
        this.soldeF = item?.montant + this.soldeF
      }
    })

    this.day.payments.forEach((item) =>{
      if (item?.compte === "CREDIT") {
        this.paymentsEntr.push({
          date: item?.createdAt,
          libelle: item?.invoice?.libelle,
          montant: item?.montant,
          solde: item?.montant + this.soldeF,
        })
        this.totalR = this.totalR + item?.montant
        this.soldeF = item?.montant + this.soldeF
      }
      if (item?.compte === "DEBIT") {
        this.paymentsSort.push({
          date: item?.createdAt,
          libelle: item?.invoice?.libelle,
          montant: item?.montant,
          solde: item?.montant + this.soldeF,
        })
        this.totalD = this.totalD + item?.montant
        this.soldeF = this.soldeF - item?.montant
      }
    })

    this.day.paymentsCustomer.forEach((item) =>{
      if (item?.compte === "CREDIT") {
        this.paymentsCustEntr.push({
          date: item?.createdAt,
          libelle: item?.invoice?.libelle,
          montant: item?.montant,
          solde: item?.montant + this.soldeF,
        })
        this.totalR = this.totalR + item?.montant
        this.soldeF = item?.montant + this.soldeF
      }
      if (item?.compte === "DEBIT") {
        this.paymentsCustSort.push({
          date: item?.createdAt,
          libelle: item?.invoice?.libelle,
          montant: item?.montant,
          solde: item?.montant + this.soldeF,
        })
        this.totalD = this.totalD + item?.montant
        this.soldeF = this.soldeF - item?.montant
      }
    })

    this.day.paymentsFunding.forEach((item) =>{
      this.paymentsF.push({
        date: item?.createdAt,
        libelle: item?.invoice?.libelle,
        montant: item?.montant,
        solde: this.soldeF - item?.montant,
      })
      this.totalD = this.totalD + item?.montant
      this.soldeF =  this.soldeF - item?.montant
    })
    
    this.day.fundRequests.forEach((item) =>{
      if( item?.etat === 'DECAISSER'){
        this.funds.push({
          date: item?.createdAt,
          libelle: item?.motif,
          montant: item?.montantD,
          solde: this.soldeF - item?.montantD ,
        })
        this.totalD = this.totalD + item?.montantD
        this.soldeF = this.soldeF - item?.montantD
      }
    })

    this.day.spents.forEach((item) =>{
      this.spents.push({
        date: item?.createdAt,
        libelle: item?.motif,
        montant: item?.montant,
        solde: this.soldeF - item?.montant ,
      })
      this.totalD = this.totalD + item?.montant
      this.soldeF = this.soldeF - item?.montant
    })

    this.day.paymentRepayments.forEach((item) =>{
      this.revers.push({
        date: item?.createdAt,
        libelle: item?.invoice?.libelle,
        montant: item?.montant,
        solde: this.soldeF - item?.montant,
      })
      this.totalD = this.totalD + item?.montant
      this.soldeF =  this.soldeF - item?.montant
    })
  }

  onEnd(row){
    if(row){
      this.dayService.end(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.modale.close('ferme');
            this.emitter.emit({action: 'DAY_END', payload: res?.data});
          }
        }
      });
    }
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
