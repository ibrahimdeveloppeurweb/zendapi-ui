import { ProviderListComponent } from '@prestataire/provider/provider-list/provider-list.component';
import { ProviderAddComponent } from '@prestataire/provider/provider-add/provider-add.component';
import { DataTablesModule } from 'angular-datatables';
import { ArchwizardModule } from 'angular-archwizard';
import { ToastyModule } from 'ng2-toasty';
import { TextMaskModule } from 'angular2-text-mask';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgbTooltipModule, NgbDatepickerModule, NgbDropdownModule, NgbCarouselModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";

import { PrestataireRoutingModule } from '@prestataire/prestataire-routing.module';
import { SharedModule } from "@theme/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProviderShowComponent } from './provider/provider-show/provider-show.component';
import { ChantierModule } from '@agence/chantier/chantier.module';

import { QuoteListComponent } from '@agence/chantier/quote/quote-list/quote-list.component';
import { DemandeModule } from '@agence/demande/demande.module';
import { ProductAddComponent } from '@agence/prestataire/product/product-add/product-add.component';
import { ProductListComponent } from '@agence/prestataire/product/product-list/product-list.component';
import { ProductShowComponent } from '@agence/prestataire/product/product-show/product-show.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FamilyAddComponent } from './family/family-add/family-add.component';
import { FamilyShowComponent } from './family/family-show/family-show.component';
import { FamilyListComponent } from './family/family-list/family-list.component';
import { SubFamilyListComponent } from './subFamily/sub-family-list/sub-family-list.component';
import { SubFamilyAddComponent } from './subFamily/sub-family-add/sub-family-add.component';
import { SubFamilyShowComponent } from './subFamily/sub-family-show/sub-family-show.component';
import { JobAddComponent } from './job/job-add/job-add.component';
import { JobListComponent } from './job/job-list/job-list.component';
import { JobShowComponent } from './job/job-show/job-show.component';


import { LocataireModule } from '@agence/locataire/locataire.module';
import { ProviderContractAddComponent } from './provider-contract/provider-contract-add/provider-contract-add.component';
import { ProviderContractListComponent } from './provider-contract/provider-contract-list/provider-contract-list.component';
import { ProviderContractShowComponent } from './provider-contract/provider-contract-show/provider-contract-show.component';


@NgModule({
  declarations: [
    ProviderListComponent,
    ProviderAddComponent,
    ProviderShowComponent,
    ProductAddComponent,
    ProductListComponent,
    ProductShowComponent,
    FamilyAddComponent,
    FamilyShowComponent,
    FamilyListComponent,
    SubFamilyListComponent,
    SubFamilyAddComponent,
    SubFamilyShowComponent,
    JobListComponent,
    JobAddComponent,
    JobShowComponent,
    ProviderContractAddComponent,
    ProviderContractListComponent,
    ProviderContractShowComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    TextMaskModule,
    ToastyModule,
    NgbTabsetModule,
    NgbCarouselModule,
    ArchwizardModule,
    PrestataireRoutingModule,
    SharedModule,
    DemandeModule,
    DataTablesModule,
    ChantierModule,
    LocataireModule,
    NgxPermissionsModule.forRoot()
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
  ]
})
export class PrestataireModule { }
