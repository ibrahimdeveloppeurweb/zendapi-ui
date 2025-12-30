import { ToastyModule } from 'ng2-toasty';
import { CommonModule } from '@angular/common';
import { TinymceModule } from 'angular2-tinymce';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from '@theme/shared/components';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { SharedModule } from '@theme/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SmsAddComponent } from '@parametre/sms/sms-add/sms-add.component';
import { ParametreRoutingModule } from '@parametre/parametre-routing.module';
import { MailAddComponent } from '@parametre/mail/mail-add/mail-add.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { GeneralAddComponent } from '@parametre/general/general-add/general-add.component';
import { SettingListComponent } from '@parametre/setting/setting-list/setting-list.component';
import { TemplateAddComponent } from '@parametre/template/template-add/template-add.component';
import { EquipmentAddComponent } from '@parametre/equipment/equipment-add/equipment-add.component';
import { EquipmentShowComponent } from '@parametre/equipment/equipment-show/equipment-show.component';
import { EquipmentListComponent } from '@parametre/equipment/equipment-list/equipment-list.component';
import { CompteDefautComponent } from './configuration-syndic/compte-defaut/compte-defaut.component';
import { CompteTvaAddComponent } from './configuration-syndic/compte-tva/compte-tva-add/compte-tva-add.component';
import { CompteTvaListComponent } from './configuration-syndic/compte-tva/compte-tva-list/compte-tva-list.component';
import { CompteTvaShowComponent } from './configuration-syndic/compte-tva/compte-tva-show/compte-tva-show.component';
import { LengthCodeComptableComponent } from './configuration-syndic/length-code-comptable/length-code-comptable.component';
import { JournauxAddComponent } from './configuration-syndic/journaux/journaux-add/journaux-add.component';
import { JournauxListComponent } from './configuration-syndic/journaux/journaux-list/journaux-list.component';
import { JournauxShowComponent } from './configuration-syndic/journaux/journaux-show/journaux-show.component';
import { PlanAuxiliaireComponent } from './configuration-syndic/plan-auxiliaire/plan-auxiliaire.component';
import { PlanComptableAddComponent } from './configuration-syndic/plan-comptable/plan-comptable-add/plan-comptable-add.component';
import { PlanComptableListComponent } from './configuration-syndic/plan-comptable/plan-comptable-list/plan-comptable-list.component';
import { PlanComptableShowComponent } from './configuration-syndic/plan-comptable/plan-comptable-show/plan-comptable-show.component';
import { PlanModeleAddComponent } from './configuration-syndic/plan-modele/plan-modele-add/plan-modele-add.component';
import { PlanModeleListComponent } from './configuration-syndic/plan-modele/plan-modele-list/plan-modele-list.component';
import { PlanModeleShowComponent } from './configuration-syndic/plan-modele/plan-modele-show/plan-modele-show.component';
import { TantiemeAddComponent } from './tantieme/tantieme-add/tantieme-add.component';
import { TantiemeListComponent } from './tantieme/tantieme-list/tantieme-list.component';
import { TantiemeShowComponent } from './tantieme/tantieme-show/tantieme-show.component';
import { CategoryAddComponent } from './categorie/category-add/category-add.component';
import { CategoryListComponent } from './categorie/category-list/category-list.component';
import { CategoryShowComponent } from './categorie/category-show/category-show.component';
import { TresorerieComponent } from './configuration-syndic/tresorerie/tresorerie.component';
import { ChargeComponent } from './configuration-syndic/charge/charge.component';
import { NoteFraisComponent } from './configuration-syndic/note-frais/note-frais.component';
import { ProduitComponent } from './configuration-syndic/produit/produit.component';
import { CityListComponent} from'./city/city-list/city-list.component';
import { CommonListComponent} from'./common/common-list/common-list.component';
import { NeighborhoodListComponent } from './neighborhood/neighborhood-list/neighborhood-list.component';
import { CountryAddComponent } from './country/country-add/country-add.component';
import { CountryListComponent } from './country/country-list/country-list.component';
import { CountryShowComponent } from './country/country-show/country-show.component';
import { CommonShowComponent } from './common/common-show/common-show.component';
import { NeighborhoodShowComponent } from './neighborhood/neighborhood-show/neighborhood-show.component';
import { CityAddComponent } from './city/city-add/city-add.component';
import { CommonAddComponent } from './common/common-add/common-add.component';
import { NeighborhoodAddComponent } from './neighborhood/neighborhood-add/neighborhood-add.component';
import { TypeBienListComponent } from './type-bien/type-bien-list/type-bien-list.component';
import { TypeBienShowComponent } from './type-bien/type-bien-show/type-bien-show.component';
import { TypeBienAddComponent } from './type-bien/type-bien-add/type-bien-add.component';
import {
  PaystackAccountAddComponent
} from "@parametre/paystack-account/paystack-account-add/paystack-account-add.component";
import {
  PaystackAccountShowComponent
} from "@parametre/paystack-account/paystack-account-show/paystack-account-show.component";


@NgModule({
  declarations: [
    TemplateAddComponent,
    SmsAddComponent,
    MailAddComponent,
    GeneralAddComponent,
    SettingListComponent,
    EquipmentAddComponent,
    EquipmentShowComponent,
    EquipmentListComponent,
    CompteDefautComponent,
    CompteTvaAddComponent,
    CompteTvaListComponent,
    CompteTvaShowComponent,
    LengthCodeComptableComponent,
    JournauxAddComponent,
    JournauxListComponent,
    JournauxShowComponent,
    PlanAuxiliaireComponent,
    PlanComptableAddComponent,
    PlanComptableListComponent,
    PlanComptableShowComponent,
    PlanModeleAddComponent,
    PlanModeleListComponent,
    PlanModeleShowComponent,
    TresorerieComponent,
    ChargeComponent,
    NoteFraisComponent,
    ProduitComponent,
    TantiemeAddComponent,
    TantiemeListComponent,
    TantiemeShowComponent,
    CategoryAddComponent,
    CategoryListComponent,
    CategoryShowComponent,
    CityListComponent,
    CommonListComponent,
    CommonShowComponent,
    CountryAddComponent,
    CityAddComponent,
    CommonAddComponent,
    CountryListComponent,
    CountryShowComponent,
    NeighborhoodAddComponent,
    NeighborhoodListComponent,
    NeighborhoodShowComponent,
    TypeBienListComponent,
    TypeBienShowComponent,
    TypeBienAddComponent,
    PaystackAccountAddComponent,
    PaystackAccountShowComponent

  ],
  imports: [
    CommonModule,
    ParametreRoutingModule,
    NgbModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    TinymceModule,
    ModalModule,
    ToastyModule,
    DataTablesModule,
    NgxPermissionsModule.forRoot(),
    NgbTooltipModule,
  ],
  exports: [
    TemplateAddComponent,
    SmsAddComponent,
    MailAddComponent,
    GeneralAddComponent,
    SettingListComponent,
    EquipmentAddComponent,
    EquipmentShowComponent,
    EquipmentListComponent,
    CompteDefautComponent,
    CompteTvaAddComponent,
    CompteTvaListComponent,
    CompteTvaShowComponent,
    LengthCodeComptableComponent,
    JournauxListComponent,
    JournauxShowComponent,
    PlanAuxiliaireComponent,
    PlanComptableAddComponent,
    PlanComptableListComponent,
    PlanComptableShowComponent,
    PlanModeleAddComponent,
    PlanModeleListComponent,
    PlanModeleShowComponent,
    TresorerieComponent,
    ChargeComponent,
    NoteFraisComponent,
    ProduitComponent,
    TantiemeListComponent,
    CityListComponent,
    CommonListComponent,
    CountryShowComponent,
    CommonShowComponent,
    CityAddComponent,
    CommonAddComponent,
    NeighborhoodAddComponent,
    NeighborhoodListComponent,
    NeighborhoodShowComponent,
    PaystackAccountAddComponent,
    PaystackAccountShowComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ParametreModule { }
