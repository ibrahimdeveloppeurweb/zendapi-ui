import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OperationService } from '@service/configuration/operation.service';
import { Globals } from '@theme/utils/globals';
import { OperationAddComponent } from '../operation-add/operation-add.component';

@Component({
  selector: 'app-operation-list',
  templateUrl: './operation-list.component.html',
  styleUrls: ['./operation-list.component.scss']
})
export class OperationListComponent implements OnInit {

  filter: any;
  action: boolean = true;
  total = 0;
  dtOptions: any = {};
  etat: boolean = false;
  visible: boolean = false;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  type: string = 'JOURNAUX';
  syndics: any[] = [];
  mandate: any[];
  copropriete: any[];
  etatRow = [
    { label: 'PREVU', value: 'PREVU' },
    { label: 'EN COURS', value: 'EN COURS' },
    { label: 'STOPPER', value: 'STOPPER' },
    { label: 'ACHEVE', value: 'ACHEVE' }
  ];
  typeRow = [
    { label: 'JOURNAUX', value: 'JOURNAUX' },
    { label: 'GRAND LIVRE', value: 'LIVRE' },
    { label: 'BALANCE DES COMPTES', value: 'BALANCE' }
  ];
  nameTitle: string = "Libellé"
  userTitle: string = "Crée par"
  minTitle: string = "Montant MIN"
  maxTitle: string = "Montant MAX"
  categorieTitle: string = ""
  etatTitle: string = "Etat ?"
  cookie: string = ''
  categorieRow = [];
  operations: any[] =[]


  constructor(
    private modalService: NgbModal,
    private operationService: OperationService,
  ) {
    this.operationService.getList(this.userSession.agencyKey).subscribe((res) => {
      console.log(res)
      if (res) {
        res.forEach((operation) => {
          if (!operation.isVentilated) {
            this.operations.push(operation)
          }
        })
      }
    })
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

  onFilter($event){
  }

  onChangeLoad($event){
    this.type = $event
  }

  edit(item) {
    this.operationService.edit = true
    this.operationService.setOperation(item)
    this.modal(OperationAddComponent, 'modal-basic-title', 'lg', true, 'static')
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
