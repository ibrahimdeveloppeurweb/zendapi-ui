import { LotissementModule } from '@lotissement/lotissement.module';
import { TicketModule } from './reclamation/ticket.module';
import { ExtraModule } from '@extra/extra.module';
import { LandingModule } from '@landing/landing.module';
import { PrestataireModule } from '@prestataire/prestataire.module';
import { ToastrModule } from 'ngx-toastr';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { ProprietaireModule } from "@proprietaire/proprietaire.module";
import { LocataireModule } from '@locataire/locataire.module';
import { TresorerieModule } from '@tresorerie/tresorerie.module';
import { ChantierModule } from '@chantier/chantier.module';
import { ClientModule } from '@client/client.module';
import { LOCALE_ID } from '@angular/core';
import localeFr from '@angular/common/locales/fr';
import { ParametreModule } from '@parametre/parametre.module';
import { PromotionModule } from '@promotion/promotion.module';
import { ModalModule } from '@modal/modal.module';
import { DemandeModule } from '@demande/demande.module';
import { LocalisationModule } from '@localisation/localisation.module';
import { SharedModule } from '@theme/shared/shared.module';
import { SyndicModule } from './syndic/syndic.module';
import { BudgetModule } from './budget/budget.module';
import { AssembleeModule } from './assemblee/assemblee.module';
import { ComptabiliteModule } from './comptabilite/comptabilite.module';
import { RessourceModule } from './ressource/ressource.module';
registerLocaleData(localeFr);

@NgModule({
  imports: [
    CommonModule,
    ProprietaireModule,
    LocataireModule,
    TresorerieModule,
    DemandeModule,
    ClientModule,
    TicketModule,
    ParametreModule,
    PromotionModule,
    LotissementModule,
    ModalModule,
    SharedModule,
    ExtraModule,
    LandingModule,
    ChantierModule,
    PrestataireModule,
    SyndicModule,
    BudgetModule,
    RessourceModule,
    // ComptabiliteModule,
    AssembleeModule,
    LocalisationModule,
    ToastrModule.forRoot({
      timeOut: 4000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    })
  ],
  providers: [{ provide: LOCALE_ID, useValue: "fr-FR" }],
  declarations: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AgenceModule { }
