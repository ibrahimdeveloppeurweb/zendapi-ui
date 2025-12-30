import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeLoadService } from '@service/typeLoad/type-load.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-budget-etat-budgetaire',
  templateUrl: './budget-etat-budgetaire.component.html',
  styleUrls: ['./budget-etat-budgetaire.component.scss']
})
export class BudgetEtatBudgetaireComponent implements OnInit {

  title = '';
  typeLoad:any=[];
  typeInfo: any = []
  userSession = Globals.user
  global = { country: Globals.country, device: Globals.device };

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private typeLoadService: TypeLoadService
  ) {
    this.typeLoad= this.typeLoadService.getTypeLoad()
    this.typeInfo= this.typeLoadService.getInfo()
    
    console.log('typeInfo',this.typeInfo)
    console.log('typeLoad',this.typeLoad)
    this.title = "Détails de l'etat budgétaire de: " + this.typeInfo.libelle
  }

  ngOnInit(): void {
  }
  printer(row): void {
    // this.budgetService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid, type);
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {
    }, (reason) => {
    });
  }
}
