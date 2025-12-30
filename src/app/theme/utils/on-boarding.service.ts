import { Injectable } from '@angular/core';
import * as introJs from 'intro.js/intro.js';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class OnBoardingService {
  introJS = introJs();
  prevLabel: string = 'Précédent';
  nextLabel: string ='Suivant';
  doneLabel: string = 'Terminer';

  constructor(private cookieService: CookieService) {
  }

  customer(etat) {
    this.cookieService.set('customer', 'on-boarding-customer');
    var steps = [
      {
        title: 'Le filtre',
        element: document.querySelector('.btn-filter-customer'),
        intro: 'La zone de filtre',
        position: 'bottom'
      },
      {
        title: 'Interface boutons',
        element: document.querySelector('.btn-all-customer'),
        intro: 'Les boutons d\'ajouts',
      },
      {
        title: 'Bouton client',
        element: document.querySelector('.btn-customer'),
        intro: 'Ajouter un nouveau client',
      },
      {
        title: 'Bouton dossier',
        element: document.querySelector('.btn-folder'),
        intro: 'Ajouter un nouveau dossier',
      },
      {
        title: 'Bouton paiement',
        element: document.querySelector('.btn-payment'),
        intro: 'Ajouter un nouveau paiement',
      },
      {
        title: 'Bouton d\'action',
        element: document.querySelector('.btn-outil-customer'),
        intro: 'Vous pouvez imprimer, exporter, importer et générer un modèle en fonction du filtre',
        position: 'left'
      },
      {
        title: 'La liste',
        element: document.querySelector('.list-customer'),
        intro: 'Affichage de la liste après le filtre',
        position: 'top'
      }
    ];
    if(etat === false) {
      this.introJS.setOptions({
        tooltipClass: 'customTooltip',
        showProgress: true,
        prevLabel: this.prevLabel,
        nextLabel: this.nextLabel,
        doneLabel: this.doneLabel,
        steps: steps
      }).start();
    } else {
      introJs().addHints().onhintclick(() => {
        var introJS = introJs();
        introJS.setOptions({
          tooltipClass: 'customTooltip',
          showProgress: true,
          prevLabel: this.prevLabel,
          nextLabel: this.nextLabel,
          doneLabel: this.doneLabel,
          steps: steps
        }).start();
      });
    }
  }

  tenant(etat) {
    this.cookieService.set('tenant', 'on-boarding-tenant');
    var steps = [
      {
        title: 'Le filtre',
        element: document.querySelector('.btn-filter-tenant'),
        intro: 'La zone de filtre',
        position: 'bottom'
      },
      {
        title: 'Interface boutons',
        element: document.querySelector('.btn-all-tenant'),
        intro: 'Les boutons d\'ajouts',
      },
      {
        title: 'Bouton locataire',
        element: document.querySelector('.btn-tenant'),
        intro: 'Ajouter un nouveau locataire',
      },
      {
        title: 'Bouton contrat & résiliation',
        element: document.querySelector('.btn-contract'),
        intro: 'Ajouter un nouveau contrat et une nouvelle résiliation',
      },
      {
        title: 'Bouton etat des lieux',
        element: document.querySelector('.btn-inventory'),
        intro: 'Ajouter un nouvel etat des lieux',
      },
      {
        title: 'Bouton facture',
        element: document.querySelector('.btn-invoice'),
        intro: 'Ajouter une nouvelle facture loyer, nouvelle facture pénalité et autre facture',
      },
      {
        title: 'Bouton paiement',
        element: document.querySelector('.btn-paymentTenant'),
        intro: 'Ajouter un nouveau paiement',
      },
      {
        title: 'Bouton génération',
        element: document.querySelector('.btn-generer-tenant'),
        intro: 'Vous pouvez générer des avis écheances, des loyers et des pénalités ',
        position: 'left'
      },
      {
        title: 'Bouton d\'action',
        element: document.querySelector('.btn-outil-tenant'),
        intro: 'Vous pouvez imprimer, exporter, importer et générer un modèle en fonction du filtre',
        position: 'left'
      },
      {
        title: 'La liste',
        element: document.querySelector('.list-tenant'),
        intro: 'Affichage de la liste après le filtre',
        position: 'top'
      }
    ];
    if(etat === false) {
      this.introJS.setOptions({
        tooltipClass: 'customTooltip',
        showProgress: true,
        prevLabel: this.prevLabel,
        nextLabel: this.nextLabel,
        doneLabel: this.doneLabel,
        steps: steps
      }).start();
    } else {
      introJs().addHints().onhintclick(() => {
        var introJS = introJs();
        introJS.setOptions({
          tooltipClass: 'customTooltip',
          showProgress: true,
          prevLabel: this.prevLabel,
          nextLabel: this.nextLabel,
          doneLabel: this.doneLabel,
          steps: steps
        }).start();
      });
    }
  }

  owner(etat) {
    this.cookieService.set('owner', 'on-boarding-owner');
    var steps = [
      {
        title: 'Le filtre',
        element: document.querySelector('.btn-filter-owner'),
        intro: 'La zone de filtre',
        position: 'bottom'
      },
      {
        title: 'Interface boutons',
        element: document.querySelector('.btn-all-owner'),
        intro: 'Les boutons d\'ajouts',
      },
      {
        title: 'Bouton propriétaire',
        element: document.querySelector('.btn-owner'),
        intro: 'Ajouter un nouveau propriétaire',
      },
      {
        title: 'Bouton bien',
        element: document.querySelector('.btn-house'),
        intro: 'Ajouter un nouveau bien',
      },
      {
        title: 'Bouton locative',
        element: document.querySelector('.btn-rental'),
        intro: 'Ajouter une nouvelle locative',
      },
      {
        title: 'Bouton mandate',
        element: document.querySelector('.btn-mandate'),
        intro: 'Ajouter un nouveau mandate',
      },
      {
        title: 'Bouton reversement',
        element: document.querySelector('.btn-repayment'),
        intro: 'Ajouter un nouveau reversement',
      },
      {
        title: 'Bouton d\'action',
        element: document.querySelector('.btn-outil-owner'),
        intro: 'Vous pouvez imprimer, exporter, importer et générer un modèle en fonction du filtre',
        position: 'left'
      },
      {
        title: 'La liste',
        element: document.querySelector('.list-owner'),
        intro: 'Affichage de la liste après le filtre',
        position: 'top'
      }
    ];
    if(etat === false) {
      this.introJS.setOptions({
        tooltipClass: 'customTooltip',
        showProgress: true,
        prevLabel: this.prevLabel,
        nextLabel: this.nextLabel,
        doneLabel: this.doneLabel,
        steps: steps
      }).start();
    } else {
      introJs().addHints().onhintclick(() => {
        var introJS = introJs();
        introJS.setOptions({
          tooltipClass: 'customTooltip',
          showProgress: true,
          prevLabel: this.prevLabel,
          nextLabel: this.nextLabel,
          doneLabel: this.doneLabel,
          steps: steps
        }).start();
      });
    }
  }

  promotion(etat) {
    this.cookieService.set('promotion', 'on-boarding-promotion');
    var steps = [
      {
        title: 'Le filtre',
        element: document.querySelector('.btn-filter-promotion'),
        intro: 'La zone de filtre',
        position: 'bottom'
      },
      {
        title: 'Interface boutons',
        element: document.querySelector('.btn-all-promotion'),
        intro: 'Les boutons d\'ajouts',
      },
      {
        title: 'Bouton promotion',
        element: document.querySelector('.btn-promotion'),
        intro: 'Ajouter un nouveau propriétaire',
      },
      {
        title: 'Bouton bien',
        element: document.querySelector('.btn-home'),
        intro: 'Ajouter un(e) nouvelle(eau) maison / appartement',
      },
      {
        title: 'Bouton bâtiment/Immeuble',
        element: document.querySelector('.btn-building'),
        intro: 'Ajouter un bâtiment/immeuble',
      },
      {
        title: 'Bouton type',
        element: document.querySelector('.btn-home-type'),
        intro: 'Ajouter de nouveau type de maison / appartement',
      },
      {
        title: 'Bouton d\'action',
        element: document.querySelector('.btn-outil-promotion'),
        intro: 'Vous pouvez imprimer, exporter, importer et générer un modèle en fonction du filtre',
        position: 'left'
      },
      {
        title: 'La liste',
        element: document.querySelector('.list-promotion'),
        intro: 'Affichage de la liste après le filtre',
        position: 'top'
      }
    ];
    if(etat === false) {
      this.introJS.setOptions({
        tooltipClass: 'customTooltip',
        showProgress: true,
        prevLabel: this.prevLabel,
        nextLabel: this.nextLabel,
        doneLabel: this.doneLabel,
        steps: steps
      }).start();
    } else {
      introJs().addHints().onhintclick(() => {
        var introJS = introJs();
        introJS.setOptions({
          tooltipClass: 'customTooltip',
          showProgress: true,
          prevLabel: this.prevLabel,
          nextLabel: this.nextLabel,
          doneLabel: this.doneLabel,
          steps: steps
        }).start();
      });
    }
  }

  subdivision(etat) {
    this.cookieService.set('subdivision', 'on-boarding-subdivision');
    var steps = [
      {
        title: 'Le filtre',
        element: document.querySelector('.btn-filter-subdivision'),
        intro: 'La zone de filtre',
        position: 'bottom'
      },
      {
        title: 'Interface lotissement',
        element: document.querySelector('.btn-all-subdivision'),
        intro: 'Les boutons d\'ajouts',
      },
      {
        title: 'Bouton lotissement',
        element: document.querySelector('.btn-subdivision'),
        intro: 'Ajouter un nouveau lotissement',
      },
      {
        title: 'Bouton ilot',
        element: document.querySelector('.btn-ilot'),
        intro: 'Ajouter un nouvel ilot',
      },
      {
        title: 'Bouton lot',
        element: document.querySelector('.btn-lot'),
        intro: 'Ajouter un nouveau lot',
      },
      {
        title: 'Bouton d\'outil lotissement',
        element: document.querySelector('.btn-outil-subdivision'),
        intro: 'Vous pouvez imprimer, exporter, importer et générer un modèle en fonction du filtre',
        position: 'left'
      },
      {
        title: 'La liste',
        element: document.querySelector('.list-subdivision'),
        intro: 'Affichage de la liste après le filtre',
        position: 'top'
      }
    ];
    if(etat === false) {
      this.introJS.setOptions({
        tooltipClass: 'customTooltip',
        showProgress: true,
        prevLabel: this.prevLabel,
        nextLabel: this.nextLabel,
        doneLabel: this.doneLabel,
        steps: steps
      }).start();
    } else {
      introJs().addHints().onhintclick(() => {
        var introJS = introJs();
        introJS.setOptions({
          tooltipClass: 'customTooltip',
          showProgress: true,
          prevLabel: this.prevLabel,
          nextLabel: this.nextLabel,
          doneLabel: this.doneLabel,
          steps: steps
        }).start();
      });
    }
  }

  construction(etat) {
    this.cookieService.set('construction', 'on-boarding-construction');
    var steps = [
      {
        title: 'Le filtre',
        element: document.querySelector('.btn-filter-construction'),
        intro: 'La zone de filtre',
        position: 'bottom'
      },
      {
        title: 'Interface lotissement',
        element: document.querySelector('.btn-all-construction'),
        intro: 'Les boutons d\'ajouts',
      },
      {
        title: 'Interface lotissement',
        element: document.querySelector('.btn-Intervention'),
        intro: 'Les boutons d\'ajouts',
      },
      {
        title: 'Bouton lotissement',
        element: document.querySelector('.btn-Quote'),
        intro: 'Ajouter une nouvelle Devise',
      },
      {
        title: 'Bouton ilot',
        element: document.querySelector('.btn-Funding'),
        intro: 'Ajouter un nouveau financement',
      },
      {
        title: 'Bouton lot',
        element: document.querySelector('.btn-Realization'),
        intro: 'Ajouter une nouveau réalisation',
      },
      {
        title: 'Bouton d\'outil lotissement',
        element: document.querySelector('.btn-outil-construction'),
        intro: 'Vous pouvez imprimer, exporter, importer et générer un modèle en fonction du filtre',
        position: 'left'
      },
      {
        title: 'La liste',
        element: document.querySelector('.list-construction'),
        intro: 'Affichage de la liste après le filtre',
        position: 'top'
      }
    ];
    if(etat === false) {
      this.introJS.setOptions({
        tooltipClass: 'customTooltip',
        showProgress: true,
        prevLabel: this.prevLabel,
        nextLabel: this.nextLabel,
        doneLabel: this.doneLabel,
        steps: steps
      }).start();
    } else {
      introJs().addHints().onhintclick(() => {
        var introJS = introJs();
        introJS.setOptions({
          tooltipClass: 'customTooltip',
          showProgress: true,
          prevLabel: this.prevLabel,
          nextLabel: this.nextLabel,
          doneLabel: this.doneLabel,
          steps: steps
        }).start();
      });
    }
  }

  provider(etat) {
    this.cookieService.set('provider', 'on-boarding-provider');
    var steps = [
      {
        title: 'Le filtre',
        element: document.querySelector('.btn-filter-provider'),
        intro: 'La zone de filtre',
        position: 'bottom'
      },
      {
        title: 'Interface lotissement',
        element: document.querySelector('.btn-all-provider'),
        intro: 'Les boutons d\'ajouts',
      },
      {
        title: 'Interface lotissement',
        element: document.querySelector('.btn-provider'),
        intro: 'Ajouter un nouveau prestataire',
      },
      {
        title: 'Bouton lotissement',
        element: document.querySelector('.btn-product'),
        intro: 'Ajouter un nouveau produit',
      },
      {
        title: 'Bouton d\'outil lotissement',
        element: document.querySelector('.btn-outil-provider'),
        intro: 'Vous pouvez imprimer, exporter, importer et générer un modèle en fonction du filtre',
        position: 'left'
      },
      {
        title: 'La liste',
        element: document.querySelector('.list-provider'),
        intro: 'Affichage de la liste après le filtre',
        position: 'top'
      }
    ];
    if(etat === false) {
      this.introJS.setOptions({
        tooltipClass: 'customTooltip',
        showProgress: true,
        prevLabel: this.prevLabel,
        nextLabel: this.nextLabel,
        doneLabel: this.doneLabel,
        steps: steps
      }).start();
    } else {
      introJs().addHints().onhintclick(() => {
        var introJS = introJs();
        introJS.setOptions({
          tooltipClass: 'customTooltip',
          showProgress: true,
          prevLabel: this.prevLabel,
          nextLabel: this.nextLabel,
          doneLabel: this.doneLabel,
          steps: steps
        }).start();
      });
    }
  }

  treasury(etat) {
    this.cookieService.set('treasury', 'on-boarding-treasury');
    var steps = [
      {
        title: 'Le filtre',
        element: document.querySelector('.btn-filter-treasury'),
        intro: 'La zone de filtre',
        position: 'bottom'
      },
      {
        title: 'Interface tresorie',
        element: document.querySelector('.btn-all-treasury'),
        intro: 'Les boutons d\'ajouts',
      },
      {
        title: 'Interface tresorie',
        element: document.querySelector('.btn-treasury'),
        intro: 'Ajouter une nouvelle trésorerie',
      },
      {
        title: 'Bouton Approvisionnement',
        element: document.querySelector('.btn-Supply'),
        intro: 'Ajouter un nouveau Approvisionnement',
      },
      {
        title: 'Bouton d\'outil tresorie',
        element: document.querySelector('.btn-outil-treasury'),
        intro: 'Vous pouvez imprimer, exporter, importer et générer un modèle en fonction du filtre',
        position: 'left'
      },
      {
        title: 'La liste',
        element: document.querySelector('.list-treasury'),
        intro: 'Affichage de la liste après le filtre',
        position: 'top'
      }
    ];
    if(etat === false) {
      this.introJS.setOptions({
        tooltipClass: 'customTooltip',
        showProgress: true,
        prevLabel: this.prevLabel,
        nextLabel: this.nextLabel,
        doneLabel: this.doneLabel,
        steps: steps
      }).start();
    } else {
      introJs().addHints().onhintclick(() => {
        var introJS = introJs();
        introJS.setOptions({
          tooltipClass: 'customTooltip',
          showProgress: true,
          prevLabel: this.prevLabel,
          nextLabel: this.nextLabel,
          doneLabel: this.doneLabel,
          steps: steps
        }).start();
      });
    }
  }

  request(etat) {
    this.cookieService.set('fund-request', 'on-boarding-fund-request');
    var steps = [
      {
        title: 'Le filtre',
        element: document.querySelector('.btn-filter-fund-request'),
        intro: 'La zone de filtre',
        position: 'bottom'
      },
      {
        title: 'Interface demande',
        element: document.querySelector('.btn-all-fund-request'),
        intro: 'Les boutons d\'ajouts',
      },
      {
        title: 'Bouton demande',
        element: document.querySelector('.btn-fund-request'),
        intro: 'Ajouter une nouvelle Demande',
      },
      {
        title: 'Bouton d\'outil demande',
        element: document.querySelector('.btn-outil-fund-request'),
        intro: 'Vous pouvez imprimer, exporter, importer et générer un modèle en fonction du filtre',
        position: 'left'
      },
      {
        title: 'La liste',
        element: document.querySelector('.list-fund-request'),
        intro: 'Affichage de la liste après le filtre',
        position: 'top'
      }
    ];
    if(etat === false) {
      this.introJS.setOptions({
        tooltipClass: 'customTooltip',
        showProgress: true,
        prevLabel: this.prevLabel,
        nextLabel: this.nextLabel,
        doneLabel: this.doneLabel,
        steps: steps
      }).start();
    } else {
      introJs().addHints().onhintclick(() => {
        var introJS = introJs();
        introJS.setOptions({
          tooltipClass: 'customTooltip',
          showProgress: true,
          prevLabel: this.prevLabel,
          nextLabel: this.nextLabel,
          doneLabel: this.doneLabel,
          steps: steps
        }).start();
      });
    }
  }

  treasuryShow(etat) {
    this.cookieService.set('treasury-show', 'on-boarding-treasury-show');
    var steps = [
      {
        title: 'Le filtre',
        element: document.querySelector('.btn-filter-treasury-show'),
        intro: 'La zone de filtre',
        position: 'bottom'
      },
      {
        title: 'Interface trésoreie vue',
        element: document.querySelector('.btn-all-treasury-show'),
        intro: 'Les boutons d\'ajouts',
      },
      {
        title: 'Bouton de retour',
        element: document.querySelector('.btn-treasury-show-back'),
        intro: 'Revenez en arrière',
      },
      {
        title: 'Bouton demande',
        element: document.querySelector('.btn-treasury-show-Spent'),
        intro: 'Ajouter une nouvelle dépense',
      },
      {
        title: 'Bouton paiement',
        element: document.querySelector('.btn-treasury-show-payment'),
        intro: 'Ajouter un nouveau paiement',
      },
      {
        title: 'Bouton confirmation',
        element: document.querySelector('.btn-treasury-show-confirmation'),
        intro: 'Effectuer la confirmation',
      },
      {
        title: 'La liste',
        element: document.querySelector('.list-treasury-show'),
        intro: 'Affichage de la liste après le filtre',
        position: 'top'
      }
    ];
    if(etat === false) {
      this.introJS.setOptions({
        tooltipClass: 'customTooltip',
        showProgress: true,
        prevLabel: this.prevLabel,
        nextLabel: this.nextLabel,
        doneLabel: this.doneLabel,
        steps: steps
      }).start();
    } else {
      introJs().addHints().onhintclick(() => {
        var introJS = introJs();
        introJS.setOptions({
          tooltipClass: 'customTooltip',
          showProgress: true,
          prevLabel: this.prevLabel,
          nextLabel: this.nextLabel,
          doneLabel: this.doneLabel,
          steps: steps
        }).start();
      });
    }
  }
}
