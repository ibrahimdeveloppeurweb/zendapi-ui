import { Component, OnInit, HostListener } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

import { House } from '@model/house';
import { Owner } from '@model/owner';
import { Rental } from '@model/rental';

import { HouseService } from '@service/house/house.service';
import { RentalService } from '@service/rental/rental.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { UploaderService } from '@service/uploader/uploader.service';

import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-rental-block-add',
  templateUrl: './rental-block-add.component.html',
  styleUrls: ['./rental-block-add.component.scss']
})
export class RentalBlockAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = 'Gestion des blocs et locatives';
  form: FormGroup;
  submit: boolean = false;
  
  // Données
  houses: House[] = [];
  selectedHouse: House | null = null;
  blocks: any[] = [];
  selectedBlock: any | null = null;
  blockRentals: Rental[] = [];
  
  // États
  isLoadingHouses = false;
  isLoadingBlocks = false;
  isLoadingRentals = false;
  
  // Mode d'action
  actionMode: string = 'view'; // 'view', 'addBlock', 'editBlock', 'addRental', 'editRental'
  
  required = Globals.required;
  global = { country: Globals.country, device: Globals.device };
  
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

  etageRow = [
    { label: 'REZ DE CHAUSSÉE', value: 'REZ DE CHAUSSEE' },
    { label: '1er étage', value: 'ETAGE 1' },
    { label: '2e étage', value: 'ETAGE 2' },
    { label: '3e étage', value: 'ETAGE 3' },
    { label: '4e étage', value: 'ETAGE 4' },
    { label: '5e étage', value: 'ETAGE 5' },
    { label: '6e étage', value: 'ETAGE 6' },
    { label: '7e étage', value: 'ETAGE 7' },
    { label: '8e étage', value: 'ETAGE 8' },
    { label: '9e étage', value: 'ETAGE 9' },
    { label: '10e étage', value: 'ETAGE 10' },
    { label: '11e étage', value: 'ETAGE 11' },
    { label: '12e étage', value: 'ETAGE 12' }
  ];

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private toastr: ToastrService,
    private emitter: EmitterService,
    private houseService: HouseService,
    private rentalService: RentalService,
    private uploadService: UploaderService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Ne pas charger automatiquement les maisons, attendre la sélection du propriétaire
  }

  /**
   * Initialise le formulaire
   */
  initForm() {
    this.form = this.formBuild.group({
      // Sélection du bien
      selectedHouseId: [null, [Validators.required]],
      ownerUuid: [null],
      house: [null, [Validators.required]],
      
      // Formulaire pour bloc
      blockForm: this.formBuild.group({
        uuid: [null],
        id: [null],
        libelle: [null, [Validators.required]],
        type: ['STUDIO', [Validators.required]],
        loyer: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        charge: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        pasPorte: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        superficie: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
        nbLocatives: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
        nbPieces: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
      }),
      
      // Formulaire pour locative
      rentalForm: this.formBuild.group({
        uuid: [null],
        id: [null],
        blockHouseId: [null],
        porte: [null, [Validators.required]],
        type: ['STUDIO', [Validators.required]],
        etage: ['REZ DE CHAUSSEE'],
        piece: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        superficie: [null, [Validators.pattern(ValidatorsEnums.number)]],
        montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        charge: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        pasPorte: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        total: [0]
      })
    });

    // Écouter les changements du bien sélectionné
    this.form.get('house')?.valueChanges.subscribe(houseUuid => {
      if (houseUuid && this.houses) {
        this.selectedHouse = this.houses.find(house => house.uuid === houseUuid) || null;
        if (this.selectedHouse) {
          this.loadBlocks();
          this.actionMode = 'view';
          this.selectedBlock = null;
          this.blockRentals = [];
        }
      }
    });

    // Calculer le total automatiquement pour les locatives
    const rentalForm = this.form.get('rentalForm') as FormGroup;
    rentalForm.get('montant')?.valueChanges.subscribe(() => this.calculateRentalTotal());
    rentalForm.get('charge')?.valueChanges.subscribe(() => this.calculateRentalTotal());
  }
  
  /**
   * Définit l'UUID du propriétaire et charge ses biens
   */
  setOwnerUuid(uuid: string) {
    this.f.ownerUuid.setValue(uuid);
    this.loadHouses();
  }

  /**
   * Charge les biens d'un propriétaire
   */
  loadHouses() {
    this.isLoadingHouses = true;
    if (!this.f.ownerUuid.value) {
      this.isLoadingHouses = false;
      this.houses = [];
      return;
    }
    
    this.houseService.getList(this.f.ownerUuid.value, 'LOCATION').subscribe(
      (res: House[]) => {
        this.houses = res;
        this.isLoadingHouses = false;
      },
      error => {
        this.isLoadingHouses = false;
        this.toast('Erreur lors du chargement des biens', 'Erreur', 'error');
      }
    );
  }

  /**
   * Sélectionne un bien et charge ses blocs
   */
  selectHouse(event: any) {
    const houseUuid = event.target ? event.target.value : event;
    this.selectedHouse = this.houses.find(house => house.uuid === houseUuid) || null;
    this.form.get('house')?.setValue(this.selectedHouse ? this.selectedHouse.uuid : null);
    
    if (this.selectedHouse) {
      this.loadBlocks();
      this.actionMode = 'view';
      // Réinitialiser la sélection de bloc
      this.selectedBlock = null;
      this.blockRentals = [];
    }
  }

  /**
   * Charge les blocs du bien sélectionné
   */
  loadBlocks() {
    if (!this.selectedHouse) return;
    
    this.isLoadingBlocks = true;
    this.houseService.getBlocks(this.selectedHouse.uuid).subscribe(
      (res: any[]) => {
        this.blocks = res;
        this.isLoadingBlocks = false;
        
        // Initialiser les états d'accordéon
        this.initializeBlockStates();
        
        // AMÉLIORATION: Sélectionner automatiquement le premier bloc s'il existe
        if (this.blocks.length > 0) {
          this.selectBlock(this.blocks[0]);
        }
      },
      error => {
        this.isLoadingBlocks = false;
        this.toast('Erreur lors du chargement des blocs', 'Erreur', 'error');
      }
    );
  }

  /**
   * Sélectionne un bloc et charge ses locatives
   */
  selectBlock(block: any) {
    this.selectedBlock = block;
    this.loadBlockRentals();
  }

  /**
   * AMÉLIORATION: Charge les locatives d'un bloc depuis la propriété 'rentals' du bloc
   */
  loadBlockRentals() {
    if (!this.selectedBlock) {
      this.blockRentals = [];
      return;
    }
    
    // Récupérer les locatives directement depuis le bloc
    this.blockRentals = this.selectedBlock.rentals || [];
    
    // Si pas de locatives dans le bloc, essayer de les récupérer via l'API
    if (this.blockRentals.length === 0 && this.selectedBlock.id) {
      this.isLoadingRentals = true;
      
      // Optionnel: appel API pour récupérer les locatives si elles ne sont pas dans le bloc
      this.rentalService.getByBlockId(this.selectedBlock.id).subscribe(
        (rentals: Rental[]) => {
          this.blockRentals = rentals;
          this.isLoadingRentals = false;
        },
        error => {
          // En cas d'erreur, utiliser un tableau vide
          this.blockRentals = [];
          this.isLoadingRentals = false;
        }
      );
    }
  }

  // États pour gérer l'accordéon des blocs
  collapsedBlocks: { [key: string]: boolean } = {};
  
  // Gestion des locatives en mode édition par bloc
  editingLocatives: { [key: string]: boolean } = {};

  /**
   * Toggle l'état d'un bloc (plié/déplié)
   */
  toggleBlockCollapse(blockId: string) {
    this.collapsedBlocks[blockId] = !this.collapsedBlocks[blockId];
  }

  /**
   * Vérifie si un bloc est plié
   */
  isBlockCollapsed(blockId: string): boolean {
    return this.collapsedBlocks[blockId] || false;
  }

  /**
   * Active/désactive le mode édition des locatives pour un bloc
   */
  toggleEditingLocatives(blockId: string) {
    this.editingLocatives[blockId] = !this.editingLocatives[blockId];
    
    if (this.editingLocatives[blockId]) {
      // Passer en mode édition : créer des lignes vides si nécessaire
      const block = this.blocks.find(b => (b.id || b.uuid || b.libelle) === blockId);
      if (block) {
        this.selectedBlock = block;
        this.addEmptyRentalsForBlock();
      }
    }
  }

  /**
   * Vérifie si les locatives d'un bloc sont en mode édition
   */
  isEditingLocatives(blockId: string): boolean {
    return this.editingLocatives[blockId] || false;
  }

  /**
   * Ajoute des lignes vides pour compléter le nombre de locatives prévues
   */
  addEmptyRentalsForBlock() {
    if (!this.selectedBlock) return;
    
    const currentRentals = this.selectedBlock.rentals || [];
    const targetCount = this.selectedBlock.nbLocatives;
    const missingCount = targetCount - currentRentals.length;
    
    if (missingCount > 0) {
      for (let i = 0; i < missingCount; i++) {
        const newRental = {
          uuid: null,
          id: null,
          blockHouseId: this.selectedBlock.id,
          porte: this.generatePorteNumber(currentRentals.length + i + 1),
          type: this.selectedBlock.type,
          etage: 'REZ DE CHAUSSEE',
          piece: this.selectedBlock.nbPieces,
          superficie: this.selectedBlock.superficie,
          montant: this.selectedBlock.loyer,
          charge: this.selectedBlock.charge,
          pasPorte: this.selectedBlock.pasPorte,
          total: this.selectedBlock.loyer + this.selectedBlock.charge,
          etat: 'DISPONIBLE',
          isNew: true // Marquer comme nouvelle ligne
        };
        
        currentRentals.push(newRental);
      }
      
      this.selectedBlock.rentals = currentRentals;
    }
  }

  /**
   * Génère automatiquement le numéro de porte pour une position donnée
   */
  generatePorteNumber(position: number): string {
    if (!this.selectedHouse || !this.selectedBlock) return '';
    
    const numerotation = this.selectedHouse.numerotation;
    
    let porte = '';
    if (numerotation === 3) { // Libre saisie
      porte = `${this.selectedBlock.libelle}-${position}`;
    } else if (numerotation === 1) { // Alphabétique
      const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
        'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      const letter = alphabet[Math.min(position - 1, 25)];
      porte = `${this.selectedBlock.libelle}-${letter}`;
    } else { // Numérique
      porte = `${this.selectedBlock.libelle}-${position}`;
    }
    
    return porte;
  }

  /**
   * Calcule le total pour une locative lors de la modification
   */
  onChangeRentalValues(rental: any) {
    const montant = rental.montant || 0;
    const charge = rental.charge || 0;
    rental.total = montant + charge;
  }

  /**
   * Sauvegarde toutes les locatives d'un bloc (amélioration)
   */
  saveBlockRentals(blockId: string) {
    const block = this.blocks.find(b => (b.id || b.uuid || b.libelle) === blockId);
    if (!block || !block.rentals) return;

    this.emitter.loading();
    
    // Filtrer les locatives nouvelles ou modifiées avec validation
    const rentalsToSave = block.rentals.filter((rental: any) => {
      const isValidRental = rental.porte && rental.porte.trim() !== '';
      return (rental.isNew || rental.isModified) && isValidRental;
    });

    if (rentalsToSave.length === 0) {
      this.emitter.stopLoading();
      this.editingLocatives[blockId] = false;
      this.toast('Aucune modification à sauvegarder', 'Information', 'info');
      return;
    }

    // Préparer les données pour l'API
    // const savePromises = rentalsToSave.map((rental: any) => {
    //   const rentalData = {
    //     uuid: rental.uuid,
    //     id: rental.id,
    //     blockHouseId: block.id,
    //     porte: rental.porte,
    //     type: rental.type || block.type,
    //     etage: rental.etage || 'REZ DE CHAUSSEE',
    //     piece: rental.piece || block.nbPieces,
    //     superficie: rental.superficie || block.superficie,
    //     montant: rental.montant || block.loyer,
    //     charge: rental.charge || block.charge,
    //     pasPorte: rental.pasPorte || block.pasPorte,
    //     total: (rental.montant || block.loyer) + (rental.charge || block.charge),
    //     houseId: this.selectedHouse?.id,
    //     house: this.selectedHouse?.uuid
    //   };
      
    //   if (rental.isNew) {
    //     // Nouvelle locative
    //     delete rentalData.id;
    //     delete rentalData.uuid;
    //     return this.rentalService.add(rentalData).toPromise();
    //   } else {
    //     // Modification d'une locative existante
    //     return this.rentalService.update(rentalData).toPromise();
    //   }
    // });

    // // Exécuter toutes les sauvegardes
    // Promise.all(savePromises).then(
    //   (results) => {
    //     this.emitter.stopLoading();
    //     const successResults = results.filter(r => r?.status === 'success');
    //     const successCount = successResults.length;
        
    //     if (successCount > 0) {
    //       this.toast(
    //         `${successCount} locative(s) sauvegardée(s) avec succès`,
    //         'Succès',
    //         'success'
    //       );
          
    //       // Recharger les blocs pour mettre à jour
    //       this.loadBlocks();
    //       this.editingLocatives[blockId] = false;
          
    //       this.emitter.emit({
    //         action: 'RENTALS_SAVED',
    //         payload: { blockId, count: successCount }
    //       });
    //     } else {
    //       this.toast('Aucune locative n\'a pu être sauvegardée', 'Avertissement', 'warning');
    //     }

    //     // Traiter les erreurs
    //     const errorCount = results.length - successCount;
    //     if (errorCount > 0) {
    //       this.toast(
    //         `${errorCount} erreur(s) lors de la sauvegarde`,
    //         'Avertissement',
    //         'warning'
    //       );
    //     }
    //   }
    // ).catch(
    //   error => {
    //     this.emitter.stopLoading();
    //     this.toast('Erreur lors de la sauvegarde des locatives', 'Erreur', 'error');
    //     console.error('Erreur saveBlockRentals:', error);
    //   }
    // );
  }

  /**
   * Annule l'édition des locatives d'un bloc
   */
  cancelEditingLocatives(blockId: string) {
    this.editingLocatives[blockId] = false;
    // Recharger les données du bloc pour annuler les modifications
    this.loadBlocks();
  }

  /**
   * Supprime une locative existante (version simplifiée)
   */
  deleteRental(rental: any) {
    if (rental.isNew) {
      // Si c'est une nouvelle ligne, la supprimer simplement de la liste
      const block = this.selectedBlock;
      if (block && block.rentals) {
        const index = block.rentals.indexOf(rental);
        if (index > -1) {
          block.rentals.splice(index, 1);
        }
      }
      return;
    }

    // Si c'est une locative existante, demander confirmation
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Êtes-vous sûr de vouloir supprimer la locative "${rental.porte}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.emitter.loading();
        
        // this.rentalService.delete(rental.id).subscribe(
        //   res => {
        //     this.emitter.stopLoading();
        //     if (res?.status === 'success') {
        //       this.toast('Locative supprimée avec succès', 'Succès', 'success');
        //       this.loadBlocks();
        //       this.emitter.emit({
        //         action: 'RENTAL_DELETED',
        //         payload: rental
        //       });
        //     } else {
        //       this.toast(res?.message || 'Erreur lors de la suppression', 'Erreur', 'error');
        //     }
        //   },
        //   error => {
        //     this.emitter.stopLoading();
        //     this.toast('Erreur lors de la suppression de la locative', 'Erreur', 'error');
        //     console.error('Erreur deleteRental:', error);
        //   }
        // );
      }
    });
  }

  /**
   * Supprime une locative depuis la vue accordéon (méthode alternative)
   */
  deleteRentalFromAccordion(rental: Rental) {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Êtes-vous sûr de vouloir supprimer la locative "${rental.porte}" ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.emitter.loading();
        
        // this.rentalService.delete(rental.id).subscribe(
        //   res => {
        //     this.emitter.stopLoading();
        //     if (res?.status === 'success') {
        //       this.toast('Locative supprimée avec succès', 'Succès', 'success');
        //       this.loadBlocks();
        //       this.emitter.emit({
        //         action: 'RENTAL_DELETED',
        //         payload: rental
        //       });
        //     } else {
        //       this.toast(res?.message || 'Erreur lors de la suppression', 'Erreur', 'error');
        //     }
        //   },
        //   error => {
        //     this.emitter.stopLoading();
        //     this.toast('Erreur lors de la suppression de la locative', 'Erreur', 'error');
        //     console.error('Erreur deleteRentalFromAccordion:', error);
        //   }
        // );
      }
    });
  }

  /**
   * Initialise l'état des blocs (tous dépliés par défaut)
   */
  initializeBlockStates() {
    this.blocks.forEach(block => {
      const blockKey = block.id || block.uuid || block.libelle;
      if (this.collapsedBlocks[blockKey] === undefined) {
        this.collapsedBlocks[blockKey] = false; // Déplié par défaut
      }
    });
  }

  /**
   * Change le mode d'action avec gestion des états
   */
  setActionMode(mode: string, item?: any) {
    // Réinitialiser l'état de soumission lors du changement de mode
    this.submit = false;
    this.actionMode = mode;
    
    switch (mode) {
      case 'addBlock':
        this.resetBlockForm();
        break;
      case 'editBlock':
        if (item) {
          this.populateBlockForm(item);
        }
        break;
      case 'addRental':
        this.resetRentalForm();
        if (this.selectedBlock) {
          this.populateRentalFromBlock();
        }
        break;
      case 'editRental':
        if (item) {
          this.populateRentalForm(item);
        }
        break;
      case 'view':
        // Réinitialiser l'état de soumission quand on revient en mode vue
        this.submit = false;
        break;
    }
  }

  /**
   * Méthode utilitaire pour valider les données avant sauvegarde
   */
  validateBlockData(blockData: any): string | null {
    if (!blockData.libelle || blockData.libelle.trim() === '') {
      return 'Le libellé du bloc est obligatoire';
    }
    if (!blockData.type) {
      return 'Le type du bloc est obligatoire';
    }
    if (blockData.nbPieces < 1) {
      return 'Le nombre de pièces doit être au moins 1';
    }
    if (blockData.nbLocatives < 1) {
      return 'Le nombre de locatives doit être au moins 1';
    }
    if (blockData.superficie < 1) {
      return 'La superficie doit être supérieure à 0';
    }
    return null; // Pas d'erreur
  }

  /**
   * Méthode pour rafraîchir les données après une modification
   */
  refreshData() {
    if (this.selectedHouse) {
      this.loadBlocks();
    }
  }

  /**
   * Réinitialise le formulaire de bloc
   */
  resetBlockForm() {
    const blockForm = this.form.get('blockForm') as FormGroup;
    blockForm.reset({
      uuid: null,
      id: null,
      libelle: null,
      type: 'STUDIO',
      loyer: 0,
      charge: 0,
      pasPorte: 0,
      superficie: 1,
      nbLocatives: 1,
      nbPieces: 1
    });
  }

  /**
   * Remplit le formulaire de bloc avec les données existantes
   */
  populateBlockForm(block: any) {
    const blockForm = this.form.get('blockForm') as FormGroup;
    blockForm.patchValue({
      uuid: block.uuid,
      id: block.id,
      libelle: block.libelle,
      type: block.type,
      loyer: block.loyer,
      charge: block.charge,
      pasPorte: block.pasPorte,
      superficie: block.superficie,
      nbLocatives: block.nbLocatives,
      nbPieces: block.nbPieces
    });
  }

  /**
   * Réinitialise le formulaire de locative
   */
  resetRentalForm() {
    const rentalForm = this.form.get('rentalForm') as FormGroup;
    rentalForm.reset({
      uuid: null,
      id: null,
      blockHouseId: this.selectedBlock?.id || null,
      porte: null,
      type: 'STUDIO',
      etage: 'REZ DE CHAUSSEE',
      piece: 1,
      superficie: null,
      montant: 0,
      charge: 0,
      pasPorte: 0,
      total: 0,
      folderUuid: null,
      picture: null
    });
    
    // Réinitialiser les FormArrays - SUPPRIMÉ
  }

  /**
   * Remplit les données de locative à partir du bloc sélectionné
   */
  populateRentalFromBlock() {
    if (!this.selectedBlock) return;
    
    const rentalForm = this.form.get('rentalForm') as FormGroup;
    rentalForm.patchValue({
      blockHouseId: this.selectedBlock.id,
      type: this.selectedBlock.type,
      piece: this.selectedBlock.nbPieces,
      superficie: this.selectedBlock.superficie,
      montant: this.selectedBlock.loyer,
      charge: this.selectedBlock.charge,
      pasPorte: this.selectedBlock.pasPorte
    });
    
    this.calculateRentalTotal();
    // this.generatePorteNumber();
  }

  /**
   * Remplit le formulaire de locative avec les données existantes
   */
  populateRentalForm(rental: Rental) {
    const rentalForm = this.form.get('rentalForm') as FormGroup;
    rentalForm.patchValue({
      uuid: rental.uuid,
      id: rental.id,
      blockHouseId: rental.blockHouse?.id,
      porte: rental.porte,
      type: rental.type,
      etage: rental.etage,
      piece: rental.piece,
      superficie: rental.superficie,
      montant: rental.montant,
      charge: rental.charge,
      pasPorte: rental.pasPorte,
      total: rental.total
    });
  }

  /**
   * Calcule le total pour une locative
   */
  calculateRentalTotal() {
    const rentalForm = this.form.get('rentalForm') as FormGroup;
    const montant = rentalForm.get('montant')?.value || 0;
    const charge = rentalForm.get('charge')?.value || 0;
    rentalForm.get('total')?.setValue(montant + charge);
  }

  // /**
  //  * Génère automatiquement le numéro de porte
  //  */
  // generatePorteNumber() {
  //   if (!this.selectedHouse || !this.selectedBlock) return;
    
  //   const existingCount = this.blockRentals.length;
  //   const nextNumber = existingCount + 1;
  //   const numerotation = this.selectedHouse.numerotation;
    
  //   let porte = '';
  //   if (numerotation === 3) { // Libre saisie
  //     porte = `${this.selectedBlock.libelle}-${nextNumber}`;
  //   } else if (numerotation === 1) { // Alphabétique
  //     const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
  //       'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  //     const letter = alphabet[Math.min(nextNumber - 1, 25)];
  //     porte = `${this.selectedBlock.libelle}-${letter}`;
  //   } else { // Numérique
  //     porte = `${this.selectedBlock.libelle}-${nextNumber}`;
  //   }
    
  //   const rentalForm = this.form.get('rentalForm') as FormGroup;
  //   rentalForm.get('porte')?.setValue(porte);
  // }

  /**
   * Sauvegarde un bloc (avec gestion d'erreurs améliorée)
   */
  saveBlock() {
    this.submit = true;
    const blockForm = this.form.get('blockForm') as FormGroup;
    
    if (blockForm.valid && this.selectedHouse) {
      this.emitter.loading();
      
      const blockData = {
        ...blockForm.value,
        houseId: this.selectedHouse.id,
        house: this.selectedHouse.uuid // Ajout de l'UUID du bien
      };
      
      // Appel du service pour sauvegarder le bloc
      // Note: Vous devrez peut-être adapter les noms des méthodes selon votre service
      // const saveObservable = blockData.id ? 
      //   this.houseService.updateBlock(blockData) : 
      //   this.houseService.addBlock ? this.houseService.addBlock(blockData) : this.houseService.createBlock(blockData);
      
      // saveObservable.subscribe(
      //   res => {
      //     this.emitter.stopLoading();
      //     if (res?.status === 'success') {
      //       this.toast(
      //         `Bloc ${blockData.id ? 'modifié' : 'créé'} avec succès`,
      //         'Succès',
      //         'success'
      //       );
      //       this.loadBlocks();
      //       this.actionMode = 'view';
      //       this.submit = false;
            
      //       // Réinitialiser le formulaire après création
      //       if (!blockData.id) {
      //         this.resetBlockForm();
      //       }
            
      //       this.emitter.emit({
      //         action: blockData.id ? 'BLOCK_UPDATED' : 'BLOCK_CREATED',
      //         payload: res.data
      //       });
      //     } else {
      //       this.toast(res?.message || 'Erreur lors de la sauvegarde', 'Erreur', 'error');
      //     }
      //   },
      //   error => {
      //     this.emitter.stopLoading();
      //     // Gestion des erreurs spécifiques
      //     let errorMessage = 'Erreur lors de la sauvegarde du bloc';
      //     if (error?.error?.message) {
      //       errorMessage = error.error.message;
      //     } else if (error?.message) {
      //       errorMessage = error.message;
      //     }
          
      //     this.toast(errorMessage, 'Erreur', 'error');
      //     console.error('Erreur saveBlock:', error);
      //   }
      // );
    } else {
      // Affichage des erreurs de validation
      this.markFormGroupTouched(blockForm);
      this.toast('Veuillez remplir tous les champs obligatoires', 'Attention', 'warning');
    }
  }

  /**
   * Marque tous les champs d'un FormGroup comme touchés pour afficher les erreurs
   */
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  /**
   * Sauvegarde une locative
   */
  saveRental() {
    this.submit = true;
    const rentalForm = this.form.get('rentalForm') as FormGroup;
    
    if (rentalForm.valid && this.selectedHouse && this.selectedBlock) {
      this.emitter.loading();
      
      const rentalData = {
        ...rentalForm.value,
        houseId: this.selectedHouse.id,
        house: this.selectedHouse.uuid,
        blockHouseId: this.selectedBlock.id
      };
      
      const saveObservable = rentalData.id ? 
        this.rentalService.update(rentalData) : 
        this.rentalService.add(rentalData);
      
      saveObservable.subscribe(
        res => {
          this.emitter.stopLoading();
          if (res?.status === 'success') {
            this.toast(
              `Locative ${rentalData.id ? 'modifiée' : 'créée'} avec succès`,
              'Succès',
              'success'
            );
            // AMÉLIORATION: Recharger les blocs pour mettre à jour les locatives
            this.loadBlocks();
            this.actionMode = 'view';
            this.emitter.emit({
              action: rentalData.id ? 'RENTAL_UPDATED' : 'RENTAL_CREATED',
              payload: res.data
            });
          }
        },
        error => {
          this.emitter.stopLoading();
          this.toast('Erreur lors de la sauvegarde de la locative', 'Erreur', 'error');
        }
      );
    } else {
      this.toast('Veuillez remplir tous les champs obligatoires', 'Attention', 'warning');
    }
  }

  /**
   * Supprime un bloc
   */
  deleteBlock(block: any) {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Êtes-vous sûr de vouloir supprimer le bloc "${block.libelle}" ? Cette action supprimera également toutes les locatives associées.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.emitter.loading();
        
        // this.houseService.deleteBlock(block.id).subscribe(
        //   res => {
        //     this.emitter.stopLoading();
        //     if (res?.status === 'success') {
        //       this.toast('Bloc supprimé avec succès', 'Succès', 'success');
        //       this.loadBlocks();
        //       if (this.selectedBlock?.id === block.id) {
        //         this.selectedBlock = null;
        //         this.blockRentals = [];
        //       }
        //       this.emitter.emit({
        //         action: 'BLOCK_DELETED',
        //         payload: block
        //       });
        //     } else {
        //       this.toast(res?.message || 'Erreur lors de la suppression', 'Erreur', 'error');
        //     }
        //   },
        //   error => {
        //     this.emitter.stopLoading();
        //     this.toast('Erreur lors de la suppression du bloc', 'Erreur', 'error');
        //     console.error('Erreur deleteBlock:', error);
        //   }
        // );
      }
    });
  }

  // /**
  //  * Supprime une locative
  //  */
  // deleteRental(rental: Rental) {
  //   Swal.fire({
  //     title: 'Confirmer la suppression',
  //     text: `Êtes-vous sûr de vouloir supprimer la locative "${rental.porte}" ?`,
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Supprimer',
  //     cancelButtonText: 'Annuler',
  //     confirmButtonColor: '#d33'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.emitter.loading();
  //       // Décommenter selon votre implémentation
  //       // this.rentalService.delete(rental.id).subscribe(
  //       //   res => {
  //       //     this.emitter.stopLoading();
  //       //     if (res?.status === 'success') {
  //       //       this.toast('Locative supprimée avec succès', 'Succès', 'success');
  //       //       this.loadBlocks(); // Recharger pour mettre à jour
  //       //       this.emitter.emit({
  //       //         action: 'RENTAL_DELETED',
  //       //         payload: rental
  //       //       });
  //       //     }
  //       //   },
  //       //   error => {
  //       //     this.emitter.stopLoading();
  //       //     this.toast('Erreur lors de la suppression de la locative', 'Erreur', 'error');
  //       //   }
  //       // );
        
  //       // Simulation pour le moment
  //       this.emitter.stopLoading();
  //       this.toast('Fonctionnalité à implémenter', 'Information', 'info');
  //     }
  //   });
  // }

  /**
   * Fermeture du modal
   */  
  @HostListener('document:keydown', ['$event']) 
  onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose();
    }
  }

  onClose() {
    // Fermeture simplifiée sans gestion de fichiers
    this.modal.close('ferme');
  }

  /**
   * Affichage des messages
   */
  toast(msg: string, title: string, type: string) {
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

  /**
   * TrackBy function pour optimiser les performances de la liste des blocs
   */
  trackByBlockId(index: number, block: any): any {
    return block.id || block.uuid || block.libelle || index;
  }

  /**
   * TrackBy function pour optimiser les performances de la liste des locatives
   */
  trackByRentalId(index: number, rental: any): any {
    return rental.id || rental.uuid || index;
  }

  // Getters pour les formulaires
  get f() { return this.form.controls; }
  get blockForm() { return this.form.get('blockForm') as FormGroup; }
  get rentalForm() { return this.form.get('rentalForm') as FormGroup; }
}