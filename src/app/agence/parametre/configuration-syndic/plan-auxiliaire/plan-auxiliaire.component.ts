import { Component, OnInit } from '@angular/core';
import { PlanAuxiliaireService } from '@service/configuration/plan-auxiliaire.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-plan-auxiliaire',
  templateUrl: './plan-auxiliaire.component.html',
  styleUrls: ['./plan-auxiliaire.component.scss']
})
export class PlanAuxiliaireComponent implements OnInit {

  dtOptions: any = {};
  auxiliaires: any[] = [];
  agency = Globals.user.agencyKey

  // auxiliaires = [
  //   {code: '100000', libelle: 'Mr Delamouche', type: 'Salarié'},
  //   {code: '100000', libelle: 'Mme patate', type: 'Salarié'},
  //   {code: '100000', libelle: 'Mme Norbertine', type: 'Salarié'},
  //   {code: '100000', libelle: 'Mr faustin', type: 'Salarié'},
  //   {code: '100000', libelle: 'Mr lukluk', type: 'Salarié'},
  //   {code: '100000', libelle: 'Mr lukluk', type: 'Salarié'},
  // ]
  constructor(
    private planAuxiliaireService: PlanAuxiliaireService
  ) {
    this.planAuxiliaireService.getList(this.agency).subscribe((res) => {
      console.log(res)
      if (res) {
        this.auxiliaires = res
      }
    })
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
  }

  show(item){

  }

}
