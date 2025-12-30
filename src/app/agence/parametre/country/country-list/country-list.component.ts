import { Country } from '@model/country';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { CountryShowComponent } from '../country-show/country-show.component';
import { CountryService } from '@service/country/country.service';
import { CountryAddComponent } from '../country-add/country-add.component';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit {
  @Input() country: Country[]
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = true
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private countryService: CountryService,
  ) {
    this.countryService.getList().subscribe((res: any) => {
      this.country = res
      console.log(this.country);
    })
  }

  ngOnInit(): void {
    this.etat = this.country ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'COUNTRY_ADD') {
        this.appendToList(data.payload);
      }
      
      if (data.action === 'COUNTRY_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.country.unshift(...item);
  }
  update(item): void {
    const index = this.country.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.country[index] = item;
    }
  }
  editCountry(row) {
    this.countryService.setCountry(row)
    this.countryService.edit = true
    this.modal(CountryAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  showCountry(row) {
    this.countryService.setCountry(row)
    this.modal(CountryShowComponent, 'modal-basic-title', 'md', true, 'static')
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
      if (willDelete.dismiss) {
      } else {
        this.countryService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.country.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.country.splice(index, 1);
              console.log(item?.isDelete);
            }
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
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
}

