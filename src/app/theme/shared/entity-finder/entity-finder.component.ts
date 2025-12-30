import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {clearTimeout} from 'highcharts';
import {environment} from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {EmitterService} from '@service/emitter/emitter.service';
import { AddEntityFinderComponent } from '../add-entity-finder/add-entity-finder.component';
import { FamilleAddComponent } from '@agence/ressource/famille/famille-add/famille-add.component';
import { CategoryAddComponent } from '@agence/reclamation/category/category-add/category-add.component';
import { EtapeAddComponent } from '@agence/reclamation/etape/etape-add/etape-add.component';
import { SousFamilleAddComponent } from '@agence/ressource/sousFamille/sous-famille-add/sous-famille-add.component';
import { TicketAddComponent } from '@agence/reclamation/ticket/ticket-add/ticket-add.component';
import { EquipmentAddComponent } from '../../../agence/parametre/equipment/equipment-add/equipment-add.component';
import { TypeBienAddComponent } from '../../../agence/parametre/type-bien/type-bien-add/type-bien-add.component';

@Component({
  selector: 'app-entity-finder',
  templateUrl: './entity-finder.component.html',
  styleUrls: ['./entity-finder.component.scss']
})
export class EntityFinderComponent implements OnInit {

  @Input() class = null;
  @Input() idOrUuid = "UUID";
  @Input() isAutoCreate = false;
  @Input() isAdd = false;
  @Input() groups = ['default'];
  @Input() namespace = 'Client';
  @Input() required = false;
  @Input() enabled = true;
  @Input() disabledMessage = 'Désactivé';
  @Input() filterBy: any;
  @Input() label?: any;
  @Input() placeholder = 'Selectionnez un élément';
  @Output() uuid = new EventEmitter();
  @Input() disabled = false;
  @Input() params = [];

  private timeOut = null;
  private throttle = 500;
  public isTyping = false;
  public isSearching = false;
  private request = null;
  public results = [];
  @Input() selected = null;
  public url = environment.serverUrl;
  public publicUrl = environment.publicUrl;

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private emitter: EmitterService,
  ) {

  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'EQUIPMENT_ADD' || data.action === 'EQUIPMENT_UPDATED') {
        this.isAdd = false;
      }
    });
  }

  search(value) {
    this.isTyping = true;
    if (this.timeOut) {
      if (this.request) {
        this.request.unsubscribe();
      }
      clearTimeout(this.timeOut);
    }
    if (value.trim === '') {
      this.isTyping = false;
      return;
    }
    const body = {interface: 'AGENCY', namespace: this.namespace, class: this.class, groups: this.groups, value: value, params: this.params};
    this.timeOut = setTimeout((value) => {
      this.isTyping = false;
      this.isSearching = true;
      this.emitter.disallowLoading();
      this.request = this.http.post(this.url + '/private/extra/shared/', body).subscribe((res: any) => {
        this.isSearching = false;
        if (res?.status === 'success') {
          this.results = res?.data;
          if (res?.data.length == 0) {
            this.isAdd = true;
          }
        }
      }, (error: any) => {
        this.isSearching = false;
      });
    }, this.throttle);
  }

  select(entity) {
    this.results = [];
    this.selected = entity;
    if (this.idOrUuid === 'UUID') {
      this.uuid.emit(entity.uuid);
    }else{
      this.uuid.emit(entity.id);
    }
  }

  clear() {
    this.uuid.emit(null);
    this.selected = null;
    this.results = [];
  }
  onAdd(){
    if (this.class === "Famille") {
      this.modal(FamilleAddComponent, 'modal-basic-title', 'md', true, 'static')
    } else if (this.class === "SousFamille") {
      this.modal(SousFamilleAddComponent, 'modal-basic-title', 'md', true, 'static')
    } else if (this.class === "Category") {
      this.modal(CategoryAddComponent, 'modal-basic-title', 'md', true, 'static')
    }else if (this.class === "EtapeTraitement") {
      this.modal(EtapeAddComponent, 'modal-basic-title', 'md', true, 'static')
    }
    else if (this.class === "Equipment") {
      this.modal(EquipmentAddComponent, 'modal-basic-title', 'md', true, 'static')
    }  else if (this.class === "TypeBien") {
      this.modal(TypeBienAddComponent, 'modal-basic-title', 'md', true, 'static')
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
