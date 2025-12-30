import {Injectable} from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'gestion',
    title: 'GESTION IMMOBILIERE',
    type: 'group',
    icon: 'feather icon-monitor',
    children: [
      {
        id: 'dashboard',
        title: 'Portefeuille de gestion',
        type: 'item',
        icon: 'feather icon-credit-card',
        url: '/admin/dashboard/wallet',
        breadcrumbs: true,
        classes: 'nav-item',
      },
      {
        id: 'dashboard',
        title: 'Tableau de bord',
        type: 'collapse',
        icon: 'fas fa-chart-line',
        children: [
          { id: 'default', title: 'Principale', type: 'item', url: '/admin/dashboard/principal', breadcrumbs: true },
          { id: 'proprietaire', title: 'Propriétaire', type: 'item', url: '/admin/dashboard/proprietaire', breadcrumbs: true },
          { id: 'locataire', title: 'Locataire', type: 'item', url: '/admin/dashboard/locataire', breadcrumbs: true },
          { id: 'promotion', title: 'Promotion', type: 'item', url: '/admin/dashboard/promotion', breadcrumbs: true },
          { id: 'lotissement', title: 'Lotissement', type: 'item', url: '/admin/dashboard/lotissement', breadcrumbs: true },
          // { id: 'lotissement', title: 'CRM', type: 'item', url: '/admin/dashboard/crm', breadcrumbs: true }
        ]
      },
      {
        id: 'validation',
        title: 'Mes Validations',
        type: 'item',
        icon: 'feather icon-check-square',
        url: '/admin/validation/mes-validation',
        breadcrumbs: true,
        classes: 'nav-item',
      },
      {
        id: 'tiers',
        title: 'Tiers',
        type: 'collapse',
        icon: 'fas fa-child',
        children: [
          { id: 'proprietaire', title: 'Propriétaire', type: 'item', url: '/admin/proprietaire', breadcrumbs: true },
          { id: 'locataire', title: 'Locataire', type: 'item', url: '/admin/locataire', breadcrumbs: true },
          { id: 'client', title: 'Client', type: 'item', url: '/admin/client', breadcrumbs: true }
        ]
      },
      {
        id: 'dashboard',
        title: 'CRM',
        type: 'collapse',
        icon: 'feather icon-share-2',
        children: [
          { id: 'dashboard', title: 'Prospect Vente', type: 'item', url: '/admin/prospection/vente', breadcrumbs: true },
          { id: 'dashboard', title: 'Prospect Location' , type: 'item', url: '/admin/prospection/location', breadcrumbs: true },
          { id: 'dashboard', title: 'Paramètre', type: 'item', url: '/admin/prospection/parametre', breadcrumbs: true }
        ]
      },
      {
        id: 'patrimoines',
        title: 'Patrimoines',
        type: 'collapse',
        icon: 'fas fa-city',
        children: [
          { id: 'promotion', title: 'Promotion', type: 'item', url: '/admin/promotion', breadcrumbs: true },
          { id: 'lotissement', title: 'Lotissement', type: 'item', url: '/admin/lotissement', breadcrumbs: true }
        ]
      },
      {
        id: 'syndic',
        title: 'Syndic',
        type: 'item',
        url: '/admin/syndic',
        icon: 'feather icon-box',
        classes: 'nav-item',
      },
      {
        id: 'syndic',
        title: 'Budget',
        type: 'item',
        icon: 'feather icon-layers',
        url: '/admin/budget',
        classes: 'nav-item',
      },
      // {
      //   id: 'crm',
      //   title: 'Assemblée générale',
      //   type: 'item',
      //   icon: 'feather icon-compass',
      //   url: '/admin/assemblee',
      //   classes: 'nav-item',
      // },
      // {
      //   id: 'patrimoines',
      //   title: 'Comptabilité',
      //   type: 'collapse',
      //   icon: 'fas fa-receipt',
      //   children: [
      //     { id: 'ventilation', title: 'Ventilation', type: 'item', url: '/admin/comptabilite/ventilation', breadcrumbs: true },
      //     { id: 'achat', title: 'Enregistrement compta...', type: 'item', url: '/admin/comptabilite/achat', breadcrumbs: true },
      //     { id: 'journaux', title: 'Journaux', type: 'item', url: '/admin/comptabilite/journaux', breadcrumbs: true }
      //   ]
      // },

      // {
      //   id: 'tresorerie',
      //   title: 'Cartographies',
      //   type: 'collapse',
      //   icon: 'feather icon-map',
      //   children: [
      //     { id: 'tresorerie', title: 'Lotissements', type: 'item', url: '/outils/geo-localisation/null/LOTISSEMENT/LIST', breadcrumbs: true },
      //     { id: 'demande', title: 'Patrimoines', type: 'item', url: '/outils/geo-localisation/null/PATRIMOINE/LIST', breadcrumbs: true },
      //   ]
      // },
      {
        id: 'tresorerie',
        title: 'Trésorerie',
        type: 'collapse',
        icon: 'fas fa-piggy-bank',
        breadcrumbs: true,
        children: [
          { id: 'tresorerie', title: 'Trésorerie ', type: 'item', url: '/admin/tresorerie', breadcrumbs: true },
          { id: 'demande', title: 'Demandes ', type: 'item', url: '/admin/demande', breadcrumbs: true },
        ]
      },
      {
        id: 'rapport',
        title: 'Rapport',
        type: 'collapse',
        icon: 'fas fa-file-alt',
        breadcrumbs: true,
        children: [
          { id: 'proprietaire', title: 'Propriétaire', type: 'item', url: '/admin/rapport/proprietaire', breadcrumbs: true },
          { id: 'locataire', title: 'Locataire', type: 'item', url: '/admin/rapport/locataire', breadcrumbs: true },
          { id: 'client', title: 'Client', type: 'item', url: '/admin/rapport/client', breadcrumbs: true }
        ]
      }
    ]
  },
  // {
  //   id: 'gestion',
  //   title: 'MODULE SYNDIC',
  //   type: 'group',
  //   icon: 'feather icon-monitor',
  //   children: [
  //     {
  //       id: 'tiers',
  //       title: 'Syndic',
  //       type: 'item',
  //       url: '/admin/syndic',
  //       icon: 'feather icon-box',
  //       classes: 'nav-item',
  //     },

  {
    id: 'extra',
    title: 'EXTRA',
    type: 'group',
    icon: 'feather icon-monitor',
    children: [
      {
        id: 'intervention',
        title: 'Moyens généraux',
        type: 'collapse',
        icon: 'fas fa-paint-roller',
        breadcrumbs: true,
        children: [
          { id: 'prestataire', title: 'Fournisseur et Prestataire', type: 'item', url: '/admin/prestataire', breadcrumbs: true },
          { id: 'intervention', title: 'Intervention', type: 'item', url: '/admin/intervention', breadcrumbs: true },
        ]
      },
      {
        id: 'ticket',
        title: 'Ticket',
        type: 'collapse',
        icon: 'fas fa-ticket-alt',
        children: [
          { id: 'ticket', title: 'Tableau de bord', type: 'item', url: '/admin/dashboard/dash-ticket', breadcrumbs: true },
          { id: 'ticket', title: 'Ticket', type: 'item', url: '/admin/ticket', breadcrumbs: true },
          { id: 'ticket', title: 'Configuration', type: 'item', url: '/admin/ticket/configuration', breadcrumbs: true },
        ]
      },
      {
        id: 'ticket',
        title: 'Ressource',
        type: 'collapse',
        icon: 'fas fa-cubes',
        children: [
          { id: 'ticket', title: 'Tableau de bord', type: 'item', url: '/admin/dashboard/dash-ressource', breadcrumbs: true },
          { id: 'ticket', title: 'ressource', type: 'item', url: '/admin/ressource', breadcrumbs: true },
          { id: 'ticket', title: 'Configuration', type: 'item', url: '/admin/ressource/configuration', breadcrumbs: true },
        ]
      },
      {
        id: 'extra',
        title: 'Extra',
        type: 'collapse',
        icon: 'feather icon-map',
        children: [
          { id: 'mapp', title: 'Géolocalisation des biens', type: 'item', url: '/admin/extra/maps', breadcrumbs: true },
          { id: 'calendrier', title: 'Calendrier', type: 'item', url: '/admin/extra/calendrier', breadcrumbs: true },
          { id: 'send', title: 'Envoi Mail/Sms', type: 'item', url: '/admin/extra/send', breadcrumbs: true },
        ]
      }
    ]
  },
  {
    id: 'securite',
    title: 'SECURITE',
    type: 'group',
    icon: 'feather icon-monitor',
    children: [
      {
        id: 'utilisateur',
        title: 'Utilisateur',
        type: 'collapse',
        icon: 'fas fa-user-check',
        children: [
          { id: 'user', title: 'Utilisateur', type: 'item', url: '/admin/user', breadcrumbs: true },
        ]
      }
    ]
  }
];

@Injectable()
export class NavigationItem {
  public get() {
    return NavigationItems;
  }
}
