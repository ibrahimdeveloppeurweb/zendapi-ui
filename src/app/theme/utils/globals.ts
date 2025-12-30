export class Globals {
  public static country: string = JSON.parse(localStorage.getItem('token-zen-data')) ? JSON.parse(localStorage.getItem('token-zen-data')).country : null;
  public static device: string = JSON.parse(localStorage.getItem('token-zen-data')) ? JSON.parse(localStorage.getItem('token-zen-data')).device : null;
  public static required: any = {
    novide: 'Ce champ est requis.',
    nolettre: 'Ce champ ne peut contenir de lettre.',
    nonumber: 'Ce champ ne peut contenir de chiffre.',
    noemail: 'Ce champ doit être au format E-mail.',
    min: 'Ce mot est trop court.',
    max: 'Ce mot est trop long.'
  };
  public static lat: number = 5.360410;
  public static lng: number = -4.009880;
  public static zoom: number = 15;
  public static dataTable = {
    pagingType: 'full_numbers',
    pageLength: 5,
    lengthMenu: [5, 10, 25, 50],
    processing: true,
    language: {
      processing: 'Traitement en cours...',
      search: 'Recherche:',
      lengthMenu: '_MENU_',
      info: 'Affichage de l\'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments',
      infoEmpty: 'Affichage de l\'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments',
      infoFiltered: '(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)',
      infoPostFix: '',
      loadingRecords: 'Veuillez patientez...',
      zeroRecords: 'Aucun &eacute;l&eacute;ment &agrave; afficher',
      emptyTable: 'Aucune donn&eacute;e disponible dans le tableau',
      paginate: {
        sFirst: 'Premier',
        sPrevious: 'Pr&eacute;c&eacute;dent',
        sNext: 'Suivant',
        sLast: 'Dernier'
      },
      aria: {
        sSortAscending: ': activer pour trier la colonne par ordre croissant',
        sSortDescending: ': activer pour trier la colonne par ordre d&eacute;croissant'
      }
    },
    searching: true,
    ordering: false
  };
  public static user: any = {
    uuid: JSON.parse(localStorage.getItem('token-zen-data')) ? JSON.parse(localStorage.getItem('token-zen-data')).uuid : null,
    agencyKey: JSON.parse(localStorage.getItem('token-zen-data')) ? JSON.parse(localStorage.getItem('token-zen-data')).agencyKey : null,
    nom: JSON.parse(localStorage.getItem('token-zen-data')) ? JSON.parse(localStorage.getItem('token-zen-data')).nom : null,
    telephone: JSON.parse(localStorage.getItem('token-zen-data')) ? JSON.parse(localStorage.getItem('token-zen-data')).telephone : null,
    email: JSON.parse(localStorage.getItem('token-zen-data')) ? JSON.parse(localStorage.getItem('token-zen-data')).email : null,
    isFirstUser: JSON.parse(localStorage.getItem('token-zen-data')) ? JSON.parse(localStorage.getItem('token-zen-data')).isFirstUser : null,
    role: JSON.parse(localStorage.getItem('token-zen-data')) ? JSON.parse(localStorage.getItem('token-zen-data')).role : null,
    photo: JSON.parse(localStorage.getItem('token-zen-data')) ? JSON.parse(localStorage.getItem('token-zen-data')).photo : null,
  };
  public static autorisation: any = JSON.parse(localStorage.getItem('token-zen-data')) ? JSON.parse(localStorage.getItem('token-zen-data')).autorisation : null;
  public static numMask: any[] = [/[0-9]/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/, ' ', /\d/, /\d/];
}

