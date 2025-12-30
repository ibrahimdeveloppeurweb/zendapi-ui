import { Component, OnInit } from '@angular/core';
import { SettingSms } from '@model/setting-sms';
import { SettingService } from '@service/setting/setting.service';
import { TemplateService } from '@service/template/template.service';
import { SmsService } from '@service/sms/sms.service';
import { SettingMail } from '@model/setting-mail';
import { MailService } from '@service/mail/mail.service';
import { Setting } from '@model/setting';
import { NgxPermissionsService } from 'ngx-permissions';
import { EquipmentService } from '@service/equipment/equipment.service'
import { Equipment } from '@model/equipment';
import { LoadCategoryService } from '@service/load-category/load-category.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { LoadCategory } from '@model/load-category';
import { VilleService } from '@service/ville/ville.service';
import { Ville } from '@model/ville';
import { Common } from '@model/common';
import { Quartier } from '@model/quartier';
import { Country } from '@model/country';
import { CommonService } from '@service/common/common.service';
import { QuartierService } from '@service/quartier/quartier.service';
import { CountryService } from '@service/country/country.service';

@Component({
  selector: 'app-setting-list',
  templateUrl: './setting-list.component.html',
  styleUrls: ['./setting-list.component.scss']
})
export class SettingListComponent implements OnInit {
  type: string = "GENERAL"
  general: Setting;
  template: SettingMail;
  sms: SettingSms;
  mail: SettingMail;
  citys: Ville[] = [];
  commons: Common[] = [];
  countrys: Country[] = [];
  quartiers: Quartier[] = [];
  equipments: Equipment[] = [];
  loadCategory: LoadCategory[] = [];
  typeBiens: any[] = [];
  years: any[] = [];

  constructor(
    private smsService: SmsService,
    private emitter: EmitterService,
    private mailService: MailService,
    private villeService: VilleService,
    private commonService: CommonService,
    private settingService: SettingService,
    private countryService: CountryService,
    private templateService: TemplateService,
    private quartierService: QuartierService,
    private equipmentService: EquipmentService,
    private loadCategoryService: LoadCategoryService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.onDisplay(this.type)
  }

  ngOnInit(): void {
    this.emitter.event.subscribe((data) => {
      if (data.action === 'CATEGORY_ADD' || data.action === 'CATEGORY_UPDATE') {
        this.onDisplay('CATEGORY');
      }
    });
  }

  onDisplay(type: string) {
    this.type = type;
    console.log(type);

    if (type === 'GENERAL') {
      this.settingService.type = type;
      this.settingService.getSingle().subscribe((res: any)=> {
        return this.general = res;
      }, error => {});
    } else if(type === 'SMS'){
      this.smsService.type = type;
      this.smsService.getSingle().subscribe((res: any)=> {this.sms = res}, error => {});
    } else if(type === 'MAIL'){
      this.mailService.type = type;
      this.mailService.getSingle().subscribe((res: any)=> {this.mail = res}, error => {});
    } else if(type === 'TEMPLATE'){
      // this.templateService.getSingle().subscribe((res: any)=> {this.template = res}, error => {});
      this.templateService.type = type;
    } else if(type === 'EQUIPEMENT'){
      this.equipmentService.getList().subscribe((res: any)=> {this.equipments = res}, error => {});
    }else if(type === 'LENGTH_CODE_COMPTABLE'){
      console.log('type', type)
    } else if(type === 'TANTIEME'){
    }else if (type === 'CATEGORY') {
      this.loadCategoryService.getList().subscribe((res) => {return (this.loadCategory = res);},(error) => { });
    }else if (type === 'CITY') {
    this.villeService.getList().subscribe((res) => {return (this.citys = res);},(error) => { });
    }else if (type === 'COMMON') {
      this.commonService.getList().subscribe((res) => {return (this.commons = res);},(error) => { });
    }else if (type === 'NEIGHBORHOOD') {
      this.quartierService.getList().subscribe((res) => {return (this.quartiers = res);},(error) => { });
    }
    else if (type === 'COUNTRY') {
      this.countryService.getList().subscribe((res) => {return (this.countrys = res);},(error) => { });
    }  else if (type === 'TYPE_BIEN') {
      // console.log(this.type);

      // typeBiens
      // this.countryService.getList().subscribe((res) => {return (this.countrys = res);},(error) => { });
    } else if (type === 'PAYSTACK') {
      console.log('PAYSTACK')
    }

  }

  onChange(type: string){
    this.type = type
  }
}
