
import { Country } from '@model/country';
import { Component, OnInit } from '@angular/core';
import { CountryService } from '@service/country/country.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-country-show',
  templateUrl: './country-show.component.html',
  styleUrls: ['./country-show.component.scss']
})
export class CountryShowComponent implements OnInit {
  title: string = null;
  country: Country;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private countryService: CountryService
  ) { }

  ngOnInit(): void {
    this.country = this.countryService.getCountry();
    this.title = 'Détail d\'un pays ' + this.country?.nom;
  }

  onClose(){
    this.modale.close('ferme');
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

