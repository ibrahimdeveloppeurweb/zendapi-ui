import { Rental } from '@model/rental';
import { ToastrService } from 'ngx-toastr';
import { Ressource } from '@model/ressource';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EmitterService } from '@service/emitter/emitter.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RessourceTiersService } from '@service/ressource-tiers/ressource-tiers.service';
import { House } from '@model/house';
import { HouseService } from '@service/house/house.service';
import { Piece } from '@model/inventory';
import { PieceAddComponent } from '@agence/proprietaire/piece/piece-add/piece-add.component';
import { RentalService } from '@service/rental/rental.service';
import { PieceService } from '@service/piece/piece.service';

@Component({
  selector: 'app-ressource-assign',
  templateUrl: './ressource-assign.component.html',
  styleUrls: ['./ressource-assign.component.scss']
})
export class RessourceAssignComponent implements OnInit {
  form: FormGroup;
  submit = false;
  required = Globals.required;
  title = null; 
  ownerSelected: any; 
  pieceSelected: any; 
  house: House; 
  rental: Rental; 
  pieces: Piece[]=[]; 
  houses: House[]=[]; 
  rentals: Rental[]=[]; 
  ressource: Ressource
  constructor(
    public toastr: ToastrService,
    public modal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private houseService: HouseService,
    private pieceService: PieceService,
    private rentalService: RentalService,
    private ressourceService: RessourceTiersService
  ) { 
    this.title = 'Affecter la ressource a une locative';
    this.ressource = this.ressourceService.getRessource()
    this.newForm()
    this.f.ressource.setValue(this.ressource.uuid)
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PIECE_ADD') {
        this.pieces.unshift(data.payload);
      }
    });
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      owner: [null],
      house: [null],
      piece: [null, [Validators.required]],
      rental: [null, [Validators.required]],
      ressource: [null, [Validators.required]],
      emplacement: [null, [Validators.required]]
    });
  }
  setOwnerUuid(uuid) {
    if(uuid){
      this.f.owner.setValue(uuid);
      this.loadHouses();
    } else {
      this.houses = [];
      this.rentals = [];
      this.f.owner.setValue(null);
      this.f.house.setValue(null);
      this.f.rental.setValue(null);
    }
  }
  loadHouses() {
    this.houseService.getList(this.f.owner.value, 'LOCATION', 'DISPONIBLE').subscribe(res => {
      this.houses = res;
      return this.houses;
    }, error => {});
  }
  selectHouse(value) {
    this.rentals = [];
    this.rental = null;
    this.f.rental.setValue(null);
    this.house = this.houses.find(item => {
      if (item.uuid === value) {
        if (item?.resilie) {
          Swal.fire({
            title: 'Attention !',
            text: 'Le mandat de ce bien a été résilié !',
            icon: 'warning',
            timer: 3000,
            allowOutsideClick: false,
            showConfirmButton: false,
          })
          this.f.house.setValue(null);
          this.houses = [];
          this.rentals = [];
          return null;
        }
        return item;
      }
    });
    this.house?.rentals.forEach(val => {
      this.rentals.push(val);
    });
    this.f.house.setValue(value);
  }
  onChangeRental(event) {
    this.rental = this.rentals.find((item) => {
      if (item.uuid === event) {  return item;  }
    });
    if(this.rental){
      this.loadPieces(this.rental.uuid)
    }
  }
  setPieceUuid(uuid){
    this.f.piece.setValue(uuid)
  }
  loadPieces(uuid) {
    this.pieceService.getList(uuid).subscribe(res => {
      this.pieces = res;
      return this.pieces;
    }, error => {});
  }
  onConfirme() {
    Swal.fire({
      title: '',
      text: 'Confirmez-vous l\'enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.onSubmit();
      }
    });
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const form = this.form.value;
      this.ressourceService.assign(form).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: 'RESSOURCE_ASSIGN', payload: res?.data});
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.toast('Votre formualire n\'est pas valide.', 'Attention !', 'warning');
      return;
    }
  }
  onAdd(){
    this.rentalService.setRental(this.rental);
    this.modale(PieceAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }
  onReset() {
    this.form.reset()
  }
  modale(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  toast(msg, title, type): void {
    if (type === 'info') {
      this.toastr.info(msg, title);
    } else if (type === 'success') {
      this.toastr.success(msg, title);
    } else if (type === 'warning') {
      this.toastr.warning(msg, title);
    } else if (type === 'error') {
      this.toastr.error(msg, title);
    }
  }
  get f(): any { return this.form.controls; }
}
