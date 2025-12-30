import { NgModule } from '@angular/core';
import { AuthGuard } from '@auth/guard/auth.guard';
import { ClientGuard } from '@client/client.guard';
import { LockGuard } from '@auth/guard/lock.guard';
import { Routes, RouterModule } from '@angular/router';
import { LoggedGuard } from '@auth/guard/logged.guard';
import { LocataireGuard } from '@locataire/locataire.guard';
import { AuthComponent } from "@layout/auth/auth.component";
import { RapportGuard } from '@agence/rapport/rapport.guard';
import { AdminComponent } from "@layout/admin/admin.component";
import { UtilisateurGuard } from '@utilisateur/utilisateur.guard';
import { ProprietaireGuard } from '@proprietaire/proprietaire.guard';
import { NoFoundComponent } from '@theme/shared/no-found/no-found.component';
import { OutilsComponent } from '@agence/extra/outils/outils/outils.component';
import { HomeComponent } from '@agence/landing/ticket/home/home.component';
import { LandingComponent } from '@agence/landing/landing.component';

const routes: Routes = [
  { path: "", redirectTo: "admin/dashboard/principal", pathMatch: "full" },
  {
    path: "auth",
    component: AuthComponent,
    children: [
      {
        path: "login",
        loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule),
        canActivate: [LoggedGuard]
      },
      {
        path: "forgot",
        loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule),
        canActivate: [LoggedGuard]
      },
      {
        path: "lock",
        loadChildren: () => import('./auth/auth.module').then(module => module.AuthModule),
        canActivate: [LockGuard]
      }
    ]
  },
  {
    path: "admin",
    component: AdminComponent,
    children:[
      {
        path: "dashboard",
        loadChildren: ()=> import("./dashboard/dashboard.module").then(module => module.DashboardModule)
      },
      {
        path: "validation",
        loadChildren: ()=> import("./validation/validation.module").then(module => module.ValidationModule)
      },
      {
        path: "proprietaire",
        loadChildren: ()=>import("./agence/proprietaire/proprietaire.module").then(module => module.ProprietaireModule),
        canActivate: [ProprietaireGuard]
      },
      {
        path: "locataire",
        loadChildren: ()=>import("./agence/locataire/locataire.module").then(module => module.LocataireModule),
        canActivate: [LocataireGuard]
      },
      {
        path: "tresorerie",
        loadChildren: ()=>import("./agence/tresorerie/tresorerie.module").then(module => module.TresorerieModule)
      },
      {
        path: "demande",
        loadChildren: ()=>import("./agence/demande/demande.module").then(module => module.DemandeModule)
      },
      {
        path: "client",
        loadChildren: ()=>import("./agence/client/client.module").then(module => module.ClientModule),
        canActivate: [ClientGuard]
      },
      {
        path: "prospection",
        loadChildren: ()=>import("./agence/prospection/prospection.module").then(module => module.ProspectionModule),
      },
      {
        path: "intervention",
        loadChildren: ()=>import("./agence/chantier/chantier.module").then(module => module.ChantierModule)
      },
      {
        path: "prestataire",
        loadChildren: ()=>import("./agence/prestataire/prestataire.module").then(module => module.PrestataireModule)
      },
      {
        path: "rapport",
        loadChildren: ()=>import("./agence/rapport/rapport.module").then(module => module.RapportModule),
        canActivate: [RapportGuard]
      },
      {
        path: "user",
        loadChildren: ()=>import("./security/utilisateur/utilisateur.module").then(module => module.UtilisateurModule),
        canActivate: [UtilisateurGuard]
      },
      {
        path: "extra",
        loadChildren: ()=>import("./agence/extra/extra.module").then(module => module.ExtraModule)
      },
      {
        path: "ticket",
        loadChildren: ()=>import("./agence/reclamation/ticket.module").then(module => module.TicketModule)
      },
      {
        path: "parametre",
        loadChildren: ()=>import("./agence/parametre/parametre.module").then(module => module.ParametreModule)
      },
      {
        path: "promotion",
        loadChildren: ()=>import("./agence/promotion/promotion.module").then(module => module.PromotionModule)
      },
      {
        path: "lotissement",
        loadChildren: ()=>import("./agence/lotissement/lotissement.module").then(module => module.LotissementModule)
      },
      {
        path: "localisation",
        loadChildren: ()=>import("./agence/localisation/localisation.module").then(module => module.LocalisationModule)
      },
      {
        path: "prospection",
        loadChildren: ()=>import("./agence/prospection/prospection.module").then(module => module.ProspectionModule)
      },
      {
        path: "syndic",
        loadChildren: ()=>import("./agence/syndic/syndic.module").then(module => module.SyndicModule),
      },
      {
        path: "budget",
        loadChildren: ()=>import("./agence/budget/budget.module").then(module => module.BudgetModule),
      },
      {
        path: "assemblee",
        loadChildren: ()=>import("./agence/assemblee/assemblee.module").then(module => module.AssembleeModule),
      },
      {
        path: "comptabilite",
        loadChildren: ()=>import("./agence/comptabilite/comptabilite.module").then(module => module.ComptabiliteModule),
      },
      {
        path: "ressource",
        loadChildren: ()=>import("./agence/ressource/ressource.module").then(module => module.RessourceModule),
      }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: "outils", component: OutilsComponent,
    children: [
      {
        path: "", data: {preload: true, delai: 1},
        loadChildren: ()=> import("./agence/extra/extra-routing.module").then(module => module.ExtraRoutingModule)
      },
    ]
  },
  {
    path: "landing", component: LandingComponent,
    children: [
      {
        path: "", data: {preload: true, delai: 1},
        loadChildren: ()=> import("./agence/landing/landing-routing.module").then(module => module.LandingRoutingModule)
      },
    ]
  },
  { path: "**", component: NoFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
