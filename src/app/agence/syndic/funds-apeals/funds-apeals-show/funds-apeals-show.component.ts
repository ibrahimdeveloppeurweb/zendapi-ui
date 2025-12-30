import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FundsapealService } from '@service/syndic/fundsapeal.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-funds-apeals-show',
  templateUrl: './funds-apeals-show.component.html',
  styleUrls: ['./funds-apeals-show.component.scss']
})
export class FundsApealsShowComponent implements OnInit {

  userSession = Globals.user;
  title: string = ''
  fundsApeal: any
  dtOptions = {}
  impayers: any[];
  totalImpayers: 0;
  showImpayers = false;

  constructor(
    public modale: NgbActiveModal,
    private fundsApealService: FundsapealService
  ) {
    this.fundsApeal = this.fundsApealService.getFundSapeal()
    this.title = "Détails sur l'appel de charge " + this.fundsApeal.libelle

    this.fundsApealService.getImpayers(this.fundsApeal.uuid).subscribe((res: any) => {
      this.impayers = res;
      console.log('res', res);
      console.log('this.impayers', this.impayers);
      let i = 1;
      res.forEach(elt => {
        if(elt.uuid !== this.fundsApeal.uuid){
          i++;
          this.totalImpayers += elt.reste;
        }
      });
      if(this.fundsApeal.etat !== 'IMPAYER' && res.length > 0) {
        this.showImpayers = true;
      }
      if(this.fundsApeal.etat == 'IMPAYER' && res.length > 1) {
        this.showImpayers = true;
      }
      console.log('this.showImpayers', this.showImpayers);
      console.log('this.totalImpayers', this.totalImpayers);
      return this.impayers;
    })
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

  printerFundsApeal(row): void {
    this.fundsApealService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row.trustee.uuid, row.uuid);
  }


}
