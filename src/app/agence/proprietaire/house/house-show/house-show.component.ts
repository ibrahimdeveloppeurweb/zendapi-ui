import { House } from '@model/house';
import { Component, Inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '@theme/utils/globals';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseService } from '@service/house/house.service';
import { environment } from '@env/environment';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HouseAddComponent } from '@proprietaire/house/house-add/house-add.component';
import { PaymentCustomer } from '@model/payment-customer';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { RentalService } from '@service/rental/rental.service';
import { RentalAddComponent } from '@proprietaire/rental/rental-add/rental-add.component';
import { RentalShowComponent } from '@proprietaire/rental/rental-show/rental-show.component';
import { TicketService } from '@service/ticket/ticket.service';

@Component({
  selector: 'app-house-show',
  templateUrl: './house-show.component.html',
  styleUrls: ['./house-show.component.scss']
})
export class HouseShowComponent implements OnInit {
  form: FormGroup
  public viewImage: number;
  house: House;
  tickets: any[] = []
  rentals: any[] = []
  files = [];
  payments: PaymentCustomer[]
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  total = 0;
  isHidden = false
  public activeTab: string = 'BIEN';

  constructor(
    private router: Router,
    private formBuild: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private houseService: HouseService,
    private rentalService: RentalService,
    public ticketService: TicketService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.newForm()
    this.viewImage = 1;
    this.onChangeLoad(this.activeTab)
 
  }

  ngOnInit(): void {
  }
  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      house: [null, [Validators.required]],
      users: this.formBuild.array([])
    });
  }

  onChangeLoad(type): void {
    this.activeTab = type;
    if (type === 'BIEN') {
      this.houseService.getSingle(this.route.snapshot.params.id).subscribe((res: any) => {
        if(res){
          if(res?.folder?.files.length > 0){
            res?.folder?.files.forEach((file:never, index) =>{
              if(index < 5){
                this.files.push(file);
              }
            });
          }
          res.attribuates.forEach(item => {
            this.users.push(
              this.formBuild.group({
                uuid: [item.uuid],
                checked: [false, [Validators.required]],
                type: [{value: item?.user?.type, disabled: true}],
                libelle: [{value: item?.user?.libelle, disabled: true}],
                sexe: [{value: item?.user?.sexe, disabled: true}],
                photoSrc: [{value: item?.user?.photoSrc, disabled: true}],
                telephone: [{value: item?.user?.telephone, disabled: true}],
                isOnline: [{value: item?.user?.isOnline, disabled: true}],
                email: [{value: item?.user?.email, disabled: true}],
                service: [{value: item?.user?.service?.nom, disabled: true}]
              })
            )
          });
          this.house = res;
          if (this.house?.blockHouses?.length > 0) {
            const uuid = this.house?.blockHouses[0].uuid
            this.loadRentalsForBlock(uuid)
          }
          this.payments = this.house?.folderCustomer?.invoice?.payments;
          if(this.payments){
            this.payments.forEach(item => { return this.total = this.total + item?.montant })
          }
          return this.house;
        }
      });
    } else if (type === 'TICKET'){
      this.ticketService.getList(null,null,null,null,null,null,this.route.snapshot.params.id,null).subscribe(res => {
        return this.tickets = res; 
    }, error => { });
   
    }
    }

  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  showTenant(row) {
    this.router.navigate(['/admin/locataire/show/' + row.occupantUuid]);
  }
  editRental(row) {
    this.rentalService.setRental(row)
    this.rentalService.edit = true
    this.modal(RentalAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showRental(row) {
    this.rentalService.setRental(row)
    this.modal(RentalShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerRental(row): void {
    this.rentalService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  editHouse(row) {
    this.houseService.setHouse(row);
    this.houseService.edit = true;
    this.houseService.disponible = row?.disponible;
    this.modal(HouseAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  onSelectAll($event){
    this.users.controls.forEach(item => {
      item.get('checked').setValue($event.target.checked)
      if($event.target.checked === true){
        this.isHidden = true
      }
      if($event.target.checked === false) {
        this.isHidden = false
      }
    })

  }
  onSelect($event, item){
    item.get('checked').setValue($event.target.checked)
    var check = false
    this.users.controls.forEach(item => {
      if(item.get('checked').value === true){
        check = true
      }
    })
    this.isHidden = check
  }
  onConfirme(){
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
    this.f.house.setValue(this.house.uuid)
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.houseService.retirer(data).subscribe(res => {
        if (res?.status === 'success') {
          // this.document.location.reload();
        }
      });
    } else { return; }
  }
  printerHouse(row): void {
    this.houseService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  back(){ this.router.navigate(['/admin/proprietaire']) }
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
        this.houseService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {this.router.navigate(['/admin/proprietaire'])}
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
  get f() { return this.form.controls; }
  get users() { return this.form.get('users') as FormArray; }
  
  // Gestionnaire pour le changement d'onglet
  onTabChange(event: any): void {
  }
  
  // Gestionnaire pour le clic sur le titre d'onglet
  onTabClick(uuid: any, index: number): void {
    this.loadRentalsForBlock(uuid) 
    console.log('Clic sur onglet:', uuid, 'Index:', index);
  }
  loadRentalsForBlock(uuid: any) {
    this.rentals = [];
    if (uuid) {
      this.rentalService.getByBlockId(uuid).subscribe((res:any) => {
        this.rentals = res
      });
    }
  }
}
