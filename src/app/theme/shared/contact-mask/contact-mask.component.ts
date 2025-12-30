import { Country } from '@model/country';
import { Globals } from '@theme/utils/globals';
import { CountryService } from '@service/country/country.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-contact-mask',
  templateUrl: './contact-mask.component.html',
  styleUrls: ['./contact-mask.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactMaskComponent implements OnInit {
  country: Country;
  countries: Country[] = [];
  search: string = null;
  mask: any[] = [/[0-9]/];
  model: string = null
  @Input() placeholder: string = "Entrez votre pays";
  @Input() name: any;
  @Input() selected: string = null;
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Output() value = new EventEmitter();
  valid: boolean = false;
  contact: string = null;
  global = Globals.country;

  constructor(private countryService: CountryService, private cd: ChangeDetectorRef)
  {
    this.countryService.getList().subscribe(res => {
      this.countries = res;
      this.country = this.countries.find(row => row?.nom === this.global)
      console.log(this.countries, this.country)
      this.onSelect(this.country)
    })
  }

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  onSelect(item?: any) {
    this.country = item
    this.mask = item?.mask ? [/[0-9]/] : [];
    let tab = [];
    if (item?.mask) {
      this.contact = null
      this.model = null
      this.search = null;
      const iterator = item?.mask[Symbol.iterator]();
      let str = iterator.next();
      while (!str.done) {
        str = iterator.next();
        tab.push(str.value)
      }

      tab.forEach(element => {
        if (element !== undefined) {
          this.mask.push(element === '9' ? /\d/ : element)

        }
      })
    }
    console.log(this.mask)
    this.onValue(this.contact)
    this.cd.detectChanges();
  }

  onValue(event) {
    let value = event?.target?.value !== undefined && event?.target.value ? event.target.value : event;
    this.value.emit(value);
    this.onValid(value)
  }

  onValidOld(event?: string) {
    this.contact = event;
    if (event && event?.indexOf('_') > -1) {
      this.valid = false
    } else if (event && event.indexOf('_') <= -1) {
      this.valid = true
    } else {
      this.valid = false
    }
  }

  onValid(value: string) {
    this.valid = value && !value.includes('_'); // Le champ est valide s'il n'y a pas de '_'
  }

  clear(){
    this.selected = null;
    this.onValid(this.selected)
    this.cd.detectChanges();
  }

}
