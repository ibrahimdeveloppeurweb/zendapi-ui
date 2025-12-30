import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Construction} from '@model/construction';
import {Funding} from '@model/funding';
import {House} from '@model/house';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ConstructionService} from '@service/construction/construction.service';
import {FundingService} from '@service/funding/funding.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Globals } from '@theme/utils/globals';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';
import { EmitterService } from '@service/emitter/emitter.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-funding-add',
  templateUrl: './funding-add.component.html',
  styleUrls: ['./funding-add.component.scss'],
  providers: [DatePipe]
})
export class FundingAddComponent implements OnInit {
  title: string = '';
  edit: boolean = false;
  form: FormGroup;
  selectRow = [];
  submit: boolean = false;
  isHidden: boolean = false;
  funding: Funding;
  house: House;
  fundings = [];
  constructions = [];
  houses = [];
  required = Globals.required;
  currentConstruction?: any;
  global = {country: Globals.country, device: Globals.device};
  construction: Construction;
  availablePeriods: any[] = []; // Liste de tous les mois disponibles
  showPeriodSelection: boolean = false; // Pour afficher/masquer la section de sélection

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private fundingService: FundingService,
    private datePipe: DatePipe,
    private emitter: EmitterService,
    private constructionService: ConstructionService,
    public toastr: ToastrService
  ) {
    this.edit = this.fundingService.edit;
    this.funding = this.fundingService.getFunding();
    this.title = (!this.edit) ? 'Ajouter un financement' : 'Modifier le financement ' + this.funding.construction.nom;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
    if (this.fundingService?.construction != null) {
      this.setConstructionUuid(this.fundingService?.construction?.uuid);
      this.currentConstruction = {
        title: this.fundingService?.construction?.nom,
        detail: this.fundingService?.construction?.telephone
      };
    }
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      financeur: [null, [Validators.required]],
      date: [null, [Validators.required]],
      construction: [null, [Validators.required]],
      interet: [0, [Validators.required]],
      montantP: [0, [Validators.required]],
      montantA: [0, [Validators.required]],
      mois: [0, [Validators.required]],
      options: this.formBuild.array([]),
    });
  }

  editForm() {
    if (this.edit) {
      const data = {...this.fundingService.getFunding()};
      this.setConstructionUuid(data.construction.uuid);
      data.date = DateHelperService.fromJsonDate(data?.date);
      this.construction = data?.construction;
      this.currentConstruction = {
        photoSrc: data?.construction?.photoSrc,
        title: data?.construction?.nom,
        detail: data?.construction?.budget
      };
      this.form.patchValue(data);
      this.onChangeTotal();
    }
  }

  setConstructionUuid(uuid) {
    this.f.construction.setValue(uuid);
    if (!this.edit && uuid) {
      this.constructionService.getSingle(uuid).subscribe((res: any) => {
        this.construction = res;
        return this.construction;
      });
    }
    if (!uuid) {
      this.f.date.setValue(null);
      this.f.financeur.setValue(null);
      this.f.interet.setValue(0);
      this.f.mois.setValue(0);
      this.f.montantA.setValue(0);
      this.f.montantP.setValue(0);
      this.onChangeTotal();
    }
  }

  // Générer une liste de 24 mois à partir de la date de début
  generateAvailablePeriods() {
    this.availablePeriods = [];
    
    if (this.f.date.value && this.f.financeur.value === 'AGENCE') {
      const startDate = new Date(this.f.date.value);
      
      // Générer 24 mois (2 ans) de périodes disponibles
      for (let i = 0; i < 24; i++) {
        let date = new Date(startDate);
        date.setMonth(date.getMonth() + i);
        const dateF = this.datePipe.transform(date, 'MMMM-yyyy');
        
        this.availablePeriods.push({
          index: i + 1,
          label: dateF,
          date: new Date(date),
          selected: false
        });
      }
      
      this.showPeriodSelection = true;
    }
  }

  // Basculer la sélection d'une période
  togglePeriod(index: number) {
    const nbMoisRequis = this.f.mois.value || 0;
    const nbMoisSelectionnes = this.availablePeriods.filter(p => p.selected).length;
    
    // Si on coche et qu'on a déjà le nombre requis, empêcher
    if (!this.availablePeriods[index].selected && nbMoisSelectionnes >= nbMoisRequis) {
      this.toast(
        `Vous ne pouvez sélectionner que ${nbMoisRequis} période(s)`,
        'Limite atteinte',
        'warning'
      );
      return;
    }
    
    this.availablePeriods[index].selected = !this.availablePeriods[index].selected;
    
    // Si on a sélectionné le bon nombre de mois, calculer
    const nouveauNbSelectionnes = this.availablePeriods.filter(p => p.selected).length;
    if (nouveauNbSelectionnes === nbMoisRequis) {
      this.calculateSelectedPeriods();
    } else {
      this.option.controls = [];
      this.isHidden = false;
    }
  }

  // Sélectionner automatiquement les N premiers mois
  selectFirstPeriods() {
    const nbMois = this.f.mois.value || 0;
    
    // Réinitialiser toutes les sélections
    this.availablePeriods.forEach(p => p.selected = false);
    
    // Sélectionner les N premiers
    for (let i = 0; i < nbMois && i < this.availablePeriods.length; i++) {
      this.availablePeriods[i].selected = true;
    }
    
    this.calculateSelectedPeriods();
  }

  // Désélectionner toutes les périodes
  clearAllPeriods() {
    this.availablePeriods.forEach(period => period.selected = false);
    this.option.controls = [];
    this.isHidden = false;
  }

  // Calculer l'amortissement pour les périodes sélectionnées
  calculateSelectedPeriods() {
    this.option.controls = [];
    const selectedPeriods = this.availablePeriods
      .filter(p => p.selected)
      .sort((a, b) => a.index - b.index); // Trier par ordre chronologique
    
    const nbMoisRequis = this.f.mois.value || 0;
    
    if (selectedPeriods.length === 0) {
      this.isHidden = false;
      return;
    }
    
    if (selectedPeriods.length !== nbMoisRequis) {
      this.toast(
        `Veuillez sélectionner exactement ${nbMoisRequis} période(s). Actuellement: ${selectedPeriods.length}`,
        'Sélection incomplète',
        'info'
      );
      this.isHidden = false;
      return;
    }

    const montantA = (this.construction ? this.construction.budget : 0) - this.f.montantP.value;
    this.f.montantA.setValue(montantA > 0 ? montantA : 0);
    
    const capital = this.f.montantA.value;
    const taux = this.f.interet.value / 100;
    let capitalF = 0;
    let annuiteC = 0;
    
    // Gérer le cas où taux = 0
    const totalMois = nbMoisRequis;
    const mensuSansTaux = taux === 0 ? Math.round(capital / totalMois) : 0;
    
    let previousCapital = capital;
    
    selectedPeriods.forEach((period, idx) => {
      const dateF = period.label;

      const capitalD = idx === 0 ? capital : previousCapital;
      const interet = Math.round(capitalD * taux);
      
      let mensu;
      if (taux === 0) {
        mensu = mensuSansTaux;
      } else {
        mensu = idx === 0 ? Math.round(interet / (1 - Math.pow((1 + taux), (-totalMois)))) : annuiteC;
      }
      
      annuiteC = mensu;
      const amort = Math.round(mensu - interet);
      capitalF = idx === selectedPeriods.length - 1 ? 0 : capitalD - amort;
      previousCapital = capitalF;
      
      this.option.push(
        this.formBuild.group({
          uuid: [null],
          id: [null],
          periode: [{value: dateF, disabled: true}, [Validators.required]],
          capital: [{value: capitalD, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          interet: [{value: interet, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          ammortissement: [{value: amort, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          mensualite: [{value: mensu, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          valeur: [{value: capitalF, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
        })
      );
    });
    
    this.isHidden = true;
  }

  onChangeTotal() {
    if (this.f.financeur.value === 'PROPRIETAIRE') {
      this.f.montantP.setValue(this.construction?.budget);
      this.f.montantA.setValue(0);
      this.f.mois.setValue(0);
      this.f.interet.setValue(0);
      this.availablePeriods = [];
      this.option.controls = [];
      this.showPeriodSelection = false;
      this.isHidden = false;
    } else {
      this.f.montantA.setValue(this.construction?.budget >= 0 && this.f.montantP.value >= 0 ? this.construction?.budget - this.f.montantP.value : 0);
    }
    
    if (this.f.mois.value > 0 && this.f.financeur.value === 'AGENCE' && this.f.date.value) {
      // Générer la liste de tous les mois disponibles
      this.generateAvailablePeriods();
      // Ne pas calculer automatiquement, attendre la sélection de l'utilisateur
      this.isHidden = false;
    } else {
      this.option.controls = [];
      this.availablePeriods = [];
      this.showPeriodSelection = false;
      this.isHidden = false;
    }
  }

  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.fundingService.add(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (data?.uuid) {
            this.emitter.emit({action: 'FUNDING_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'FUNDING_ADD', payload: res?.data});
          }
        }
      });
    } else { 
      return; 
    }
  }

  onConfirme() {
    const nbMoisRequis = this.f.mois.value || 0;
    const nbMoisSelectionnes = this.availablePeriods.filter(p => p.selected).length;
    
    if (this.f.financeur.value === 'AGENCE' && nbMoisRequis > 0 && nbMoisSelectionnes !== nbMoisRequis) {
      this.toast(
        `Veuillez sélectionner exactement ${nbMoisRequis} période(s) avant d'enregistrer`,
        'Sélection requise',
        'error'
      );
      return;
    }
    
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

  onClose() {
    this.form.reset();
    this.modal.close('ferme');
  }

  toast(msg, title, type) {
    if (type == 'info') {
      this.toastr.info(msg, title);
    } else if (type == 'success') {
      this.toastr.success(msg, title);
    } else if (type == 'warning') {
      this.toastr.warning(msg, title);
    } else if (type == 'error') {
      this.toastr.error(msg, title);
    }
  }

  timelapse(dateD, dateF): string {
    return DateHelperService.getTimeLapse(dateD, dateF, false, 'dmy');
  }

  get f() {
    return this.form.controls;
  }

  get option() {
    return this.form.get('options') as FormArray;
  }
  
  get selectedPeriodsCount(): number {
    return this.availablePeriods.filter(p => p.selected).length;
  }
}