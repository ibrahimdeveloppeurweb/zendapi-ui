import { RessourceTiersService } from '@service/ressource-tiers/ressource-tiers.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ressource } from '@model/ressource';
import { Component, OnInit, Input } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import { EmitterService } from '@service/emitter/emitter.service';

@Component({
  selector: 'app-ressource-historique',
  templateUrl: './ressource-historique.component.html',
  styleUrls: ['./ressource-historique.component.scss']
})
export class RessourceHistoriqueComponent implements OnInit {
  @Input() historiques: any[] = []
  @Input() ressource: Ressource
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private ressoureService: RessourceTiersService,
    private emitter: EmitterService
  ) { 
  }

  ngOnInit(): void {
  }

}
