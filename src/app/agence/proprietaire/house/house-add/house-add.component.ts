import { House } from '@model/house';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HouseService } from '@service/house/house.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, HostListener, OnInit } from '@angular/core';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@service/user/user.service';
import { DualListComponent } from 'angular-dual-listbox';
import { TypeBienService } from '@service/type-bien/type-bien.service';

@Component({
  selector: 'app-house-add',
  templateUrl: './house-add.component.html',
  styleUrls: ['./house-add.component.scss']
})
export class HouseAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = '';
  form: FormGroup;
  submit: boolean = false;
  edit: boolean = false;
  disponible: string = '';
  house: House;
  required = Globals.required;
  numerotationRow = [
    { label: 'ALPHABET', value: 1 },
    { label: 'NUMÉRIQUE', value: 2 },
    { label: 'LIBRE SAISIE', value: 3 }
  ];
  typeRow = [
    {
      label: 'Habitation',
      type: [
        { label: 'STUDIO', value: 'STUDIO' },
        { label: 'APPARTEMENT', value: 'APPARTEMENT' },
        { label: 'VILLA BASSE', value: 'VILLA BASSE' },
        { label: 'COURS COMMUNE', value: 'COURS COMMUNE' },
        { label: 'PALIER', value: 'PALIER' },
        { label: 'VILLA', value: 'VILLA' },
        { label: 'CHAMBRE', value: 'CHAMBRE' },
        { label: 'TERRAIN', value: 'TERRAIN' },
        { label: 'DEPÔT', value: 'DEPOT' },
      ]
    },
    {
      label: 'Commercial',
      type: [
        { label: 'MAGASIN', value: 'MAGASIN' },
        { label: 'BUREAU', value: 'BUREAU' },
        { label: 'BUREAU PRIVÉ', value: 'BUREAU PRIVE' },
        { label: 'BUREAU VIRTUEL', value: 'BUREAU VIRTUEL' },
        { label: 'OPEN SPACE', value: 'OPEN SPACE' },
        { label: 'SURFACE', value: 'SURFACE' },
        { label: 'RESTAURANT', value: 'RESTAURANT' },
        { label: 'HALL', value: 'HALL' },
        { label: 'SALLE DE CONFÉRENCE', value: 'SALLE CONFERENCE' },
        { label: 'PARKING', value: 'PARKING' }
      ]
    },
    {
      label: 'Autre',
      type: [
        { label: 'ÉVÈNEMENTIELLE', value: 'EVENEMENTIELLE' },
        { label: 'SALLE DE RÉUNION', value: 'SALLE REUNION' }
      ]
    }
  ];
  numRow = [];
  titre: boolean = false;
  optionTitreRow = [
    { label: 'Attestation villageoise', value: 'Attestation villageoise' },
    { label: 'Lettre d\'attribution', value: 'Lettre d\'attribution' },
    { label: 'Titre foncier', value: 'Titre foncier' },
    { label: 'ACP', value: 'ACP' },
    { label: 'CPF', value: 'CPF' },
    { label: 'ACD', value: 'ACD' },
    { label: 'Certificat de propriété', value: 'Certificat de propriété' }
  ];
  boolRow = [
    { label: 'NON', value: false },
    { label: 'OUI', value: true }
  ];
  domaine: string = 'URBAIN';
  approuve: boolean = false;
  type: string = 'IMMEUBLE';
  lat = Globals.lat;
  lng = Globals.lng;
  zoom = Globals.zoom;
  map?: any;
  ownerSelected?: any;

  tab = 1;
  niveauRow = [];
  keepSorted = true;
  key: string;
  display: string;
  filter = false;
  source: Array<any>;
  confirmed: Array<any>;
  userAdd = '';
  disabled = false;
  sourceLeft = true;
  private DEFAULT_FORMAT = {
    add: 'Ajouter',
    remove: 'Supprimer',
    all: 'Tout selectionner',
    none: 'Annuler',
    direction:
      DualListComponent.LTR,
    draggable: true
  };
  format: any = this.DEFAULT_FORMAT;
  private sourceStations: Array<any>;
  private confirmedStations: Array<any>;
  private stations: Array<any> = [];

  usersRow = []
  typeBiens: any[] = []
  typeBienSelected: any;
  collapsedBlocks: Set<string> = new Set();

  constructor(
    public modal: NgbActiveModal,
    private houseService: HouseService,
    private formBuild: FormBuilder,
    public toastr: ToastrService,
    public emitter: EmitterService,
    private userService: UserService,
    public uploadService: UploaderService,
    private typeBienService: TypeBienService,
  ) {
    this.edit = this.houseService.edit;
    this.disponible = this.houseService.disponible;
    this.house = this.houseService.getHouse();
    this.title = (!this.edit) ? 'Ajouter un bien' : 'Modifier le bien ' + this.house?.nom;
    this.newForm();
    this.typeBienService.getList().subscribe(res => { return this.typeBiens = res; }, error => { });
  }

  ngOnInit(): void {
    this.editForm();
    this.userService.getList().subscribe(res => {
      if (res) {
        res?.forEach(item => {
          this.stations.push({
            key: item?.id,
            station: item?.libelle,
            state: item?.uuid
          })
        });
        this.doReset();
      }
    })
    this.form.get('isBlock')?.valueChanges.subscribe(value => {
      this.form.get('isBlock')?.setValue(value === 'true', { emitEvent: false });
    });
  }

  newForm() {
    const defaults = {
      uuid: [null],
      id: [null],
      owner_id: [null, [Validators.required]],
      ownerUuid: [],
      nom: [null, [Validators.required]],
      disponible: [this.disponible],
      folderUuid: [null],
      valeur: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      type: ['IMMEUBLE', [Validators.required]],
      typeBien: [null, [Validators.required]],
      ville: [null, [Validators.required]],
      commune: [null, [Validators.required]],
      quartier: [null, [Validators.required]],
      lng: [null],
      lat: [null],
      zoom: [null],
      isBlock: [false],
      nbrBlock: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      hauteur: [0, [Validators.pattern(ValidatorsEnums.number)]],
      altitude: [0, [Validators.pattern(ValidatorsEnums.number)]],
      lot: [null],
      ilot: [null],
      numCie: [null],
      numSodeci: [null],
      niveau: [0],
      superficie: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      angle: [false],
      presEau: [false],
      piedsEau: [false],
      bordureVoie: [false],
      terreFerme: [false],
      distanceEau: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      distanceRoute: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      ecole: [false],
      marche: [false],
      autreType: [null],
      basFond: [false],
      village: [null],
      nbrPiece: [null],
      salleEau: [false],
      description: [null],
      files: this.formBuild.array([]),
      users: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      blocks: this.formBuild.array([]),
    };
    switch (this.disponible) {
      case 'LOCATION': {
        Object.assign(defaults, {
          nbrLocative: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          numerotation: [2, [Validators.required, Validators.pattern(ValidatorsEnums.number)]],
          rentals: this.formBuild.array([]),
        });
        break;
      }
      case 'VENTE': {
        Object.assign(defaults, {
          domaine: ['URBAIN', [Validators.required]],
          numTitre: [null],
          optionTitre: [null],
          approuve: [false],
          numApprobation: [null],
          dateApprobation: [null],
          nbrParking: [false],
          nbrNiveau: [null],
          bornage: [false],
          viabilisation: [false],
          jardin: [false],
          piscine: [false],
          titre: [false, [Validators.required]]
        });
        break;
      }
    }
    this.form = this.formBuild.group(defaults);
    this.form.get('titre')?.valueChanges.subscribe(res => {
      this.f.numTitre.setValue(null)
      this.f.optionTitre.setValue(null)
      if (res === true) {
        this.form.get('numTitre').setValidators(Validators.required)
        this.form.get('optionTitre').setValidators(Validators.required)
      } else {
        this.form.get('numTitre').clearValidators()
        this.form.get('optionTitre').clearValidators()
      }
      this.form.get('numTitre').updateValueAndValidity()
      this.form.get('optionTitre').updateValueAndValidity()
    })
    this.form.get('type')?.valueChanges.subscribe(res => {
      this.f.autreType.setValue(null)
      if (res === 'AUTRES') {
        this.form.get('autreType').setValidators(Validators.required)
      } else {
        this.form.get('autreType').clearValidators()
      }
      this.form.get('autreType').updateValueAndValidity()
    })
    this.form.get('approuve')?.valueChanges.subscribe(res => {
      this.f.numApprobation.setValue(null)
      this.f.dateApprobation.setValue(null)
      if (res === true) {
        this.form.get('numApprobation').setValidators(Validators.required)
        this.form.get('dateApprobation').setValidators(Validators.required)
      } else {
        this.form.get('numApprobation').clearValidators()
        this.form.get('dateApprobation').clearValidators()
      }
      this.form.get('numApprobation').updateValueAndValidity()
      this.form.get('dateApprobation').updateValueAndValidity()
    })
    this.form.get('type')?.valueChanges.subscribe(res => {
      this.f.numApprobation.setValue(null)
      this.f.dateApprobation.setValue(null)
      if (res === 'IMMEUBLE') {
        this.form.get('niveau').setValidators(Validators.required)
      } else {
        this.form.get('niveau').clearValidators()
      }
      this.form.get('niveau').updateValueAndValidity()
    })
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.houseService.getHouse() };
      this.lat = data.lat ? data.lat : Globals.lat;
      this.lng = data.lng ? data.lng : Globals.lng;
      this.ownerSelected = {
        photoSrc: data.owner?.photoSrc,
        title: data.owner?.searchableTitle,
        detail: data.owner?.searchableDetail
      };
      this.approuve = data?.approuve;
      this.titre = data?.titre;
      data.optionTitre = data?.optionTitre;
      data.numTitre = data?.numTitre;
      data.dateApprobation = DateHelperService.monFormatDateReverse(data.dateApprobation);
      this.form.get('owner_id').setValue(this.house.owner.uuid);
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder?.uuid);
      if (data?.disponible === 'VENTE') {
        this.f.optionTitre.setValue(data?.optionTitre);
        this.f.numTitre.setValue(data?.numTitre);
      }
      this.setCurrentHomeType(data?.typeBien);
    }
  }
  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      this.houseService.add(this.form.getRawValue()).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({ action: this.edit ? 'HOUSE_UPDATED' : 'HOUSE_ADD', payload: res?.data });
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.toast('Votre formualire n\'est pas valide.', 'Attention !', 'warning');
      return;
    }
  }
  onConfirme() {
    Swal.fire({
      title: '',
      text: 'Confirmez-vous l\'enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.onSubmit();
      }
    });
  }

  // Ajoutez ces méthodes à la classe HouseAddComponent
  
  /**
   * Gère le changement du nombre de blocs
   */
  onChangeBlock() {
    // Ne pas réinitialiser les tableaux pour préserver les données existantes
    // Si le nombre de blocs est de 0, on ne fait rien
    if (this.f.nbrBlock.value <= 0) {
      return;
    }
    
    // Si aucun bloc n'existe, en créer un par défaut
    if (this.block.length === 0) {
      this.addBlock();
    }
  }
  
  /**
   * Ajoute un nouveau bloc au formulaire
   */
  addBlock() {
    // Vérifier que le nombre de blocs ajoutés ne dépasse pas le nombre défini
    if (this.block.length < this.f.nbrBlock.value) {
      this.block.push(
        this.formBuild.group({
          uuid: [null],
          id: [null],
          libelle: [null, [Validators.required]],
          type: ['STUDIO', [Validators.required]],
          montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          charge: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          pasPorte: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          superficie: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
          nbrLocative: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
          piece: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
        })
      );
    } else {
      this.toast('Vous avez atteint le nombre maximum de blocs', 'Information', 'info');
    }
  }
  
  /**
   * Supprime un bloc du formulaire
   * @param index Index du bloc à supprimer
   */
  removeBlock(index: number) {
    // Supprimer le bloc
    const blocName = this.block.at(index).get('libelle').value;
    this.block.removeAt(index);
    
    // Supprimer les locatives associées au bloc
    this.rental.controls = this.rental.controls.filter(
      (_, i) => this.rental.at(i).get('blocIndex').value !== index
    );
    
    // Supprimer l'état de collapse
    this.collapsedBlocks.delete(blocName);
  }
  
  /**
   * Génère les locatives pour un bloc spécifique
   * @param blockIndex Index du bloc pour lequel générer les locatives
   */
  generateLocatives(blockIndex: number) {
    // Vérifier que le bloc existe
    if (!this.block || !this.block.at(blockIndex)) {
      this.toast('Bloc non trouvé', 'Erreur', 'error');
      return;
    }
  
    const bloc = this.block.at(blockIndex);
    
    // Vérifications de sécurité
    if (!bloc || !bloc.get('nbrLocative') || !bloc.get('libelle')) {
      this.toast('Données du bloc incomplètes', 'Erreur', 'error');
      return;
    }
    
    const nbLocatives = bloc.get('nbrLocative').value;
    const blocName = bloc.get('libelle').value;
    
    if (!blocName) {
      this.toast('Veuillez saisir un libellé pour le bloc', 'Attention !', 'warning');
      return;
    }
    
    if (!nbLocatives || nbLocatives <= 0) {
      this.toast('Veuillez saisir un nombre de locatives valide', 'Attention !', 'warning');
      return;
    }
    
    // Créer une liste des locatives qui ne sont pas liées à ce bloc
    const currentLocatives = [];
    
    if (this.rental && this.rental.controls) {
      for (let i = 0; i < this.rental.controls.length; i++) {
        const control = this.rental.at(i);
        if (control && control.get('blocIndex') && control.get('blocIndex').value !== blockIndex) {
          currentLocatives.push(control);
        }
      }
    }
    
    // Réinitialiser le tableau de locatives
    this.rental.clear();
    
    // Remettre les locatives qui ne sont pas liées à ce bloc
    currentLocatives.forEach(control => {
      this.rental.push(control);
    });
    
    // Générer les nouvelles locatives
    for (let i = 0; i < nbLocatives; i++) {
      const num = i + 1;
      this.rental.push(
        this.formBuild.group({
          uuid: [null],
          id: [null],
          blocIndex: [blockIndex], // Pour identifier le bloc parent
          blocLabel: [blocName],
          numerotation: [null],
          niveau: [null],
          montant: [bloc.get('montant').value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          charge: [bloc.get('charge').value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          total: [bloc.get('montant').value + bloc.get('charge').value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          porte: [((this.f.numerotation.value == 3) ? '' : blocName + '-' + num), [Validators.required]],
          type: [bloc.get('type').value, [Validators.required]],
          pasPorte: [bloc.get('pasPorte').value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          piece: [bloc.get('piece').value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          superficie: [bloc.get('superficie').value, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
        })
      );
    }
    
    this.toast(`${nbLocatives} locatives générées pour le bloc "${blocName}"`, 'Succès', 'success');
  }
  
  /**
   * Récupère les noms uniques des blocs pour lesquels des locatives ont été générées
   * Cette méthode est maintenue pour assurer la compatibilité avec le code existant
   * mais n'est plus utilisée dans le modèle HTML modifié
   */
  getUniqueBlockNames(): string[] {
    const blockNames = new Set<string>();
    if (this.rental && this.rental.controls) {
      this.rental.controls.forEach(control => {
        if (control && control.get('blocLabel') && control.get('blocLabel').value) {
          blockNames.add(control.get('blocLabel').value);
        }
      });
    }
    return Array.from(blockNames);
  }
  
  /**
   * Récupère les locatives appartenant à un bloc spécifique
   * Cette méthode est maintenue pour assurer la compatibilité avec le code existant
   * mais n'est plus utilisée dans le modèle HTML modifié
   */
  getBlockLocatives(blocName: string): any[] {
    if (!this.rental || !this.rental.controls) {
      return [];
    }
    return this.rental.controls.filter(control => 
      control && control.get('blocLabel') && control.get('blocLabel').value === blocName
    );
  }
  
  /**
   * Récupère l'index d'une locative dans le FormArray
   * Cette méthode est maintenue pour assurer la compatibilité avec le code existant
   * mais n'est plus utilisée dans le modèle HTML modifié
   */
  getLocativeIndex(locative: any): number {
    if (!this.rental || !this.rental.controls) {
      return 0;
    }
    return this.rental.controls.indexOf(locative);
  }
  
  /**
   * Bascule l'état de collapse d'un bloc
   * Cette méthode est maintenue pour assurer la compatibilité avec le code existant
   * mais n'est plus utilisée dans le modèle HTML modifié
   */
  toggleBlockCollapse(blocName: string): void {
    if (!this.collapsedBlocks) {
      this.collapsedBlocks = new Set<string>();
    }
    
    if (this.collapsedBlocks.has(blocName)) {
      this.collapsedBlocks.delete(blocName);
    } else {
      this.collapsedBlocks.add(blocName);
    }
  }
  
  /**
   * Vérifie si un bloc est plié
   * Cette méthode est maintenue pour assurer la compatibilité avec le code existant
   * mais n'est plus utilisée dans le modèle HTML modifié
   */
  isBlockCollapsed(blocName: string): boolean {
    if (!this.collapsedBlocks) {
      this.collapsedBlocks = new Set<string>();
    }
    return !this.collapsedBlocks.has(blocName);
  }
  
  // Modifiez la méthode onChangeLocative() pour prendre en compte la gestion par bloc
  // Remplacez la méthode existante par celle-ci:
  
  onChangeLocative() {
    if (!this.f.isBlock.value) {
      this.rental.clear();
      var nbr = (this.f.nbrLocative.value >= 0) ? this.f.nbrLocative.value : 0;
      if (this.rental.controls.length < nbr) {
        for (let i = 0; i < nbr; i++) {
          var num = i + 1;
          this.rental.push(
            this.formBuild.group({
              uuid: [null],
              id: [null],
              numerotation: [null],
              niveau: [null],
              montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
              charge: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
              total: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
              porte: [((this.f.numerotation.value == 3) ? '' : num), [Validators.required]],
              type: ['STUDIO', [Validators.required]],
              piece: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
              superficie: [null, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
            })
          );
        }
        return this.rental;
      } else if (nbr === 0) {
        let i = this.rental.controls.length - (nbr === 0 ? 1 : nbr);
        return this.rental.removeAt(i);
      } else {
        return this.rental.controls.splice(0, this.rental.controls.length);
      }
    } else {
      // Pour le mode bloc, on ne réinitialise pas les locatives
      // Les locatives seront générées par bloc
      return;
    }
  }
  onChangeNumerotation(): string[] | number[] {
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
      'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    this.onChangeLocative()
    if (this.f.numerotation.value == 1) {
      return this.numRow = alphabet.map(x => x);
    } else {
      return this.numRow = [];
    }
  }
  onChangeNum(row) {
    console.log(row.value.numerotation)
    var num = row.value.porte.toString();
    var al = row.value.numerotation ? row.value.numerotation : (this.f.numerotation.value == 1 ? 'A' : '');
    var porte = num.toString().length > 2 ? num : al + '' + num;
    row.controls.porte.setValue(this.find_valeur(porte));
  }
  onChange(champ): any {
    if (champ === 'titre') {
      return this.titre = !this.titre;
    } else if (champ === 'domaine') {
      return this.domaine = this.f.domaine.value;
    } else if (champ === 'approuve') {
      return this.approuve = !this.approuve;
    } else if (champ === 'type') {
      return this.type = this.f.type.value;
    }
  }
  setOwnerUuid(uuid) {
    this.f.ownerUuid.setValue(uuid);
    this.f.owner_id.setValue(uuid);
  }
  loadfile(data) {
    if (data && data !== null) {
      const file = data.todo.file
      this.file.push(
        this.formBuild.group({
          uniqId: [data.todo.uniqId, [Validators.required]],
          fileName: [file.name, [Validators.required]],
          fileSize: [file.size, [Validators.required]],
          fileType: [file.type, [Validators.required]],
          loaded: [data.todo.loaded, [Validators.required]],
          chunk: [data.chunk, [Validators.required]],
        })
      );
    }
  }

    /**
   * Type de maison courant
   * @param type 
   */
    setCurrentHomeType(type){
      this.setTypeBienUuid(type?.uuid);
      this.typeBienSelected = {
        photoSrc: type?.photoSrc,
        title: type?.searchableTitle,
        detail: type?.searchableDetail
      };
    }
    /**
   * Selection du type de maison
   * @param uuid 
   */
    setTypeBienUuid(uuid){
      if(uuid){
        this.f.typeBien.setValue(uuid);
      } else {
        this.f.typeBien.setValue(null);
      }
    }
  loadNiveau() {
    const niveau = this.f.niveau.value; // Supposons que niveau est un nombre, par exemple 3
    this.niveauRow = []; // Réinitialiser le tableau

    for (let i = 0; i < niveau; i++) {
      if (i == 0) {
        this.niveauRow.push(`REZ DE CHAUSSEZ`);
      } else {
        this.niveauRow.push(`ETAGE ${i}`);
      }
    }

    console.log(this.niveauRow);
  }
  files(data) {
    if (data && data !== null) {
      data.forEach(item => {
        this.folder.push(
          this.formBuild.group({
            uuid: [item?.uuid, [Validators.required]],
            name: [item?.name],
            path: [item?.path]
          })
        );
      });
    }
  }
  upload(files): void {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value): void {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, { [property]: value });
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }
  setData() {
    this.users.clear();
    this.confirmed.forEach(item => {
      this.users.controls.push(
        this.formBuild.group({
          uuid: [item?.state],
          libelle: [item?.station],
        })
      );
    })
  }
  private useStations() {
    this.key = 'key';
    this.display = 'station';
    this.keepSorted = true;
    this.source = this.sourceStations;
    this.confirmed = this.confirmedStations;
  }
  doReset() {
    this.sourceStations = JSON.parse(JSON.stringify(this.stations));
    this.confirmedStations = new Array<any>();
    if (this.usersRow.length > 0) {
      this.usersRow.forEach(item => {
        this.stations.forEach((key, i) => {
          if (item.id === key.key) { this.confirmedStations.push(this.stations[i]); }
        })
        this.users.controls.push(
          this.formBuild.group({
            uuid: [item?.uuid],
            libelle: [item?.nom],
          })
        );
      })
    }
    this.useStations();
  }
  filterBtn() { return (this.filter ? 'Hide Filter' : 'Show Filter'); }
  doDisable() { this.disabled = !this.disabled; }
  disableBtn() { return (this.disabled ? 'Enable' : 'Disabled'); }
  swapDirection() {
    this.sourceLeft = !this.sourceLeft;
    this.format.direction = this.sourceLeft ? DualListComponent.LTR : DualListComponent.RTL;
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }
  onClose() {
    if (!this.edit && this.form.value.folderUuid) {
      var data = { uuid: this.form.value.folderUuid, path: 'bien' }
      this.uploadService.getDelete(data).subscribe((res: any) => {
        if (res) {
          if (res?.status === 'success') {
            this.form.reset()
            this.modal.close('ferme');
          }
        }
        return res
      });
    } else {
      this.form.reset()
      this.modal.close('ferme');
    }
  }
  onReset() {
    if (this.form.value.folderUuid) {
      this.toast('Impossible de de vider le formulaire lorsque un upload a été éffectué', 'Une erreur a été rencontrée', 'warning');
    } else {
      this.form.reset()
      this.formBuild.array([])
      this.form.controls['folderUuid'].setValue(null);
    }
  }
  updateGeo(event): void {
    const lat = event.coords.lat;
    const lng = event.coords.lng;
    this.lat = lat;
    this.lng = lng;
    this.form.controls.lat.setValue(event.coords.lat);
    this.form.controls.lng.setValue(event.coords.lng);
  }
  updateZoom(event): void {
    this.form.controls.zoom.setValue(event);
  }
  toast(msg, title, type): void {
    if (type === 'info') {
      this.toastr.info(msg, title);
    } else if (type === 'success') {
      this.toastr.success(msg, title);
    } else if (type === 'warning') {
      this.toastr.warning(msg, title);
    } else if (type === 'error') {
      this.toastr.error(msg, title);
    }
  }
  find_valeur(string) {
    if (string.length > 2) {
      var debt = this.find_unique_characters(string.toString().substr(0, 2));
      var fin = string.toString().substr(2)
      return debt + '' + fin
    } else {
      return string
    }
  }
  find_unique_characters(string) {
    var unique = '';
    for (var i = 0; i < string.length; i++) {
      if (unique.indexOf(string[i]) == -1) {
        unique += string[i];
      }
    }
    return unique;
  }
  get f() { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get users() { return this.form.get('users') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
  get rental() { return this.form.get('rentals') as FormArray; }
  get block() { return this.form.get('blocks') as FormArray; }
}
