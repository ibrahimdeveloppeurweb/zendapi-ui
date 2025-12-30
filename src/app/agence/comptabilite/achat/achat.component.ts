import { JournauxService } from '@service/configuration/journaux.service';
import { Component, OnInit } from '@angular/core';
import { OperationService } from '@service/configuration/operation.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-achat',
  templateUrl: './achat.component.html',
  styleUrls: ['./achat.component.scss']
})
export class AchatComponent implements OnInit {

  filter: any;
  action: boolean = true;
  dtOptions: any = {};
  etat: boolean = false;se;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  type: string = 'ACHAT';
  etatRow = [
    { label: 'PREVU', value: 'PREVU' },
    { label: 'EN COURS', value: 'EN COURS' },
    { label: 'STOPPER', value: 'STOPPER' },
    { label: 'ACHEVE', value: 'ACHEVE' }
  ];
  typeRow = [
    { label: 'ACHAT', value: 'ACHAT' },
    { label: 'VENTE', value: 'VENTE' },
    { label: 'TRESORERIE', value: 'TRESORERIE' },
    { label: 'NOTE DE FRAIS', value: 'NOTE_FRAIS' },
  ];
  nameTitle: string = "Libellé"
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = ""
  etatTitle: string = "Etat ?"
  categorieRow = [];
  achats: any[] =[]
  operationsT: any[] = []

  constructor(
    private journauxService: JournauxService,
    private operationService: OperationService
  ) {
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

  onFilter($event){

  }

  onChangeLoad($event){
    this.type = $event
    if (this.type === "ACHAT"){

    } else if (this.type === "VENTE") {

    } else if (this.type === "TRESORERIE") {
      // this.operationService.getList().subscribe((res) => {
      //   console.log(res)
      //   if (res) {
      //     this.operationsT = res
      //   }
      // })
    } else if (this.type === "NOTE_FRAIS") {

    }
  }

}
