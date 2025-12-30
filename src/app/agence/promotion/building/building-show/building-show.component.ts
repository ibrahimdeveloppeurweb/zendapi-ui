import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Building } from '@model/building';
import { Home } from '@model/home';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuildingService } from '@service/building/building.service';
import { FilterService } from '@service/filter/filter.service';
import { HomeService } from '@service/home/home.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { BuildingAddComponent } from '../building-add/building-add.component';

@Component({
  selector: 'app-building-show',
  templateUrl: './building-show.component.html',
  styleUrls: ['./building-show.component.scss']
})
export class BuildingShowComponent implements OnInit {
  public activeTab: string = 'BUILDING';
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device};
  userSession = Globals.user;
  building: Building;
  homes: Home[] = [];
  type: string = 'BUILDING';
  etatRow = [
    {label: 'DISPONIBLE', value: 'DISPONIBLE'},
    {label: 'INDISPONIBLE', value: 'INDISPONIBLE'}
  ];
  typeRow = [
    {label: 'PROMOTION', value: 'PROMOTION'},
    {label: 'MAISON', value: 'MAISON'}
  ];

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private homeService: HomeService,
    private filterService: FilterService,
    private buildingService: BuildingService
  ) {
    this.onChangeLoad(this.type);
  }

  ngOnInit() {
  }


  onFilter($event) {
    this.homes = []
    $event.type = this.activeTab
    this.filterService.search($event, 'building', this.building.uuid).subscribe(
      res => {
      if(this.activeTab === 'MAISON'){
        return this.homes = res;
      }
    }, err => { })
  }
  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  onChangeLoad(type): void {
    this.activeTab = type;
    if(type === 'BUILDING'){
      // this.ilot = false;
      // this.lot = false;
      // this.mtnFiltre = false
      if(!this.building){
        this.buildingService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
          return this.building = res;
        });
      }
    }
    if(type === 'MAISON') {
      this.typeRow = [{label: 'MAISON', value: 'MAISON'}];
      // this.mtnFiltre = true
      // this.ilot = true;
      // this.lot = true;
      this.etatRow = [
        { label: 'DISPONIBLE', value: 'DISPONIBLE' },
        { label: 'RESERVE', value: 'RESERVE' },
        { label: 'VENDU', value: 'VENDU' }
      ]
      this.homeService.getList(null, this.building.uuid).subscribe((res) => {
        return this.homes = res;
        }, error => {}
      );
    }
  }
  editBuilding(row) {
    this.buildingService.setBuilding(row)
    this.buildingService.edit = true
    this.modal(BuildingAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerBuilding(row): void {
    this.buildingService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) { }
      else {
        this.buildingService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {this.back()}
        });}
    });
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  back(){ window.history.back(); }
}
