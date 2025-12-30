import { NgxPermissionsService } from 'ngx-permissions';
import { RentalAddComponent } from '@proprietaire/rental/rental-add/rental-add.component';
import { Component, OnInit } from '@angular/core';
import { Rental } from '@model/rental';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RentalService } from '@service/rental/rental.service';
import { Globals } from '@theme/utils/globals';
import { UploaderService } from '@service/uploader/uploader.service';
import { environment } from '@env/environment';
import { PieceService } from '@service/piece/piece.service';
import { EquipmentService } from '@service/equipment/equipment.service';
import { PieceAddComponent } from '@agence/proprietaire/piece/piece-add/piece-add.component';
import { EquipmentAddComponent } from '@agence/proprietaire/equipment/equipment-add/equipment-add.component';
import { EmitterService } from '@service/emitter/emitter.service';
import { RessourceTiersService } from '@service/ressource-tiers/ressource-tiers.service';
import { TicketService } from '@service/ticket/ticket.service';
import { TicketAddComponent } from '@agence/reclamation/ticket/ticket-add/ticket-add.component';

@Component({
  selector: 'app-rental-show',
  templateUrl: './rental-show.component.html',
  styleUrls: ['./rental-show.component.scss']
})
export class RentalShowComponent implements OnInit {
  title: string = ""
  rental: Rental
  pieces: any[] = []
  tickets: any[] = []
  ressources: any[] = []
  type = "INFORMATION"
  activeTab = "INFORMATION"
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  file: any;
  dtOptions: any = {};
  publicUrl = environment.publicUrl;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private uploader: UploaderService,
    private pieceService: PieceService,
    private rentalService: RentalService,
    private equimentService: EquipmentService,
    private ressourceService: RessourceTiersService,
    private permissionsService: NgxPermissionsService,
    public ticketService: TicketService
  ) {
    this.rental = this.rentalService.getRental()
    this.title = "Détails locative N° " + this.rental.libelle
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PIECE_ADD') {
        this.pieces.unshift(data.payload);
      }
    });
  }

  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  onChangeLoad(type){
    this.activeTab = type
    this.type = type
    this.pieces = []
    this.tickets = []
    this.ressources = []
    if(type === "PIECE"){
      this.pieceService.getList(this.rental.uuid).subscribe(res => {
        this.pieces = res;
        return this.pieces;
      }, error => {});
    }else if(type === "RESSOURCE") {
      this.ressourceService.getList(this.rental.uuid).subscribe(res => {
        this.ressources = res;
        return this.ressources;
      }, error => {});
    }else if(type === "TICKET") {
        this.ticketService.getList(null,null,null,null,null,null,null,this.rental.uuid).subscribe(res => {
          return this.tickets = res; 
      }, error => { });
     
    }
  }


  addPiece(){
    this.rentalService.setRental(this.rental);
    this.modal(PieceAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  showPiece(item){

  }
  addRessource(){
    
  }
  showRessource(){

  }
  editRessource(){
    
  }
  addTicket(){
    this.modalService.dismissAll();
    this.ticketService.edit = false 
    this.modal(TicketAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  addEquipement(){
    this.equimentService.edit = false;
    this.rentalService.setRental(this.rental);
    this.modal(EquipmentAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  editRental(row) {
    this.modalService.dismissAll()
    this.rentalService.setRental(row)
    this.rentalService.edit = true
    this.modal(RentalAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerRental(row): void {
    this.rentalService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => {});
  }
}
