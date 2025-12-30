import * as moment from 'moment';
import { House } from '@model/house';
import { Owner } from '@model/owner';
import { Mandate } from '@model/mandate';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HouseService } from '@service/house/house.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { MandateService } from '@service/mandate/mandate.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';

interface ImpotPeriod {
  periode: string;
  dateDebut: moment.Moment;
  dateFin: moment.Moment;
  montant: number;
  nbMois: number;
}

interface AnneeImpot {
  annee: number;
  montantTotal: number;
  nbMoisTotal: number;
  periodes: ImpotPeriod[];
}

@Component({
  selector: 'app-mandate-add',
  templateUrl: './mandate-add.component.html',
  styleUrls: ['./mandate-add.component.scss']
})
export class MandateAddComponent implements OnInit {
  selectedTab = 0;
  title: string = '';
  form: FormGroup;
  submit: boolean = false;
  edit: boolean = false;
  mandate: Mandate;
  owners?: Owner[];
  isLoadingHouse = false;
  owner: Owner;
  ownerUuid?: null;
  houses?: House[];
  house: House;
  ownerSelected?: any;
  required = Globals.required;
  taxeRow = [
    { label: 'du propriétaire', value: 'PROPRIETAIRE' },
    { label: "de l'agence", value: 'AGENCE' }
  ];
  commissionRow = [
    { label: 'PAS DE TA SUR COMMISIION', value: 'NON' },
    { label: 'APRES TOUTES LES TAXES', value: 'TAXES' },
    { label: 'SUR LE TOTAL DES LOYERS', value: 'LOYERS' }
  ];
  verseRow = [
    { label: 'COMMISSION RETIRE AU PREMIER PAIEMENT', value: 'TOTALITE' },
    { label: 'COMMISSION RETIRE AU PRORATA DES PAIEMENTS', value: 'PRORATA' }
  ];
  booleanRow = [
    { label: 'NON', value: false },
    { label: 'OUI', value: true }
  ];
  periodiciteRow = [
    { label: 'MENSUEL', value: 'MENSUEL' },
    { label: 'TRIMESTRIEL', value: 'TRIMESTRIEL' },
    { label: 'SEMESTRIEL', value: 'SEMESTRIEL' },
    { label: 'ANNUEL', value: 'ANNUEL' }
  ]
  facturationRow = [
    { label: 'POURCENTAGE DE PAIEMENT', value: 'PRC' },
    { label: 'MONTANT FIXE', value: 'MTN' },
    { label: 'GARANTIE LOYER', value: 'GRT_LOYER' }
  ]
  tvaRow = [
    { label: 'DEDUIRE CHEZ AGENCE', value: 'AGENCE' },
    { label: 'DEDUIRE CHEZ PROPRIETAIRE', value: 'PROPRIETAIRE' }
  ];
  limiteRow: { label: string; value: number }[] = [];
  dayRow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  TAUX_IMPOT = 12;

  constructor(
    public modal: NgbActiveModal,
    private mandateService: MandateService,
    private houseService: HouseService,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
  ) {
    this.edit = this.mandateService.edit;
    this.mandate = this.mandateService.getMandate();
    this.dayRow.map((x) => { this.limiteRow.push({ label: "Le " + x + " du mois", value: x }) })

    this.title = (!this.edit) ? 'Ajouter un mandat' : 'Modifier le mandat ' + this.mandate.type;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      date: [null],
      dateP: [null],
      ownerUuid: [null],
      facturation: ['PRC'],
      periodicite: ['MENSUEL'],
      periodiciteR: ['MENSUEL'],
      limiteR: [0, [Validators.required]],
      taxeCommission: ["OUI"],
      house: [null, [Validators.required]],
      dateD: [null, [Validators.required]],
      dateF: [null, [Validators.required]],
      commission: [0, [Validators.required]],
      prcCommFoncier: [0],
      tacite: ["NON", [Validators.required]],
      isSigned: [false, [Validators.required]],
      type: ['LOCATION', [Validators.required]],
      charge: ['AGENCE', [Validators.required]],
      taxe: ['PROPRIETAIRE', [Validators.required]],
      tvaCommissionCharge: ['AGENCE', [Validators.required]],
      mensualites: this.formBuild.array([]),

      valeur: [0, [Validators.required]],
      intermediaire: [null],
      contactInter: [null],
      montantCom: [0],
      tva: ['AGENCE'],
      verseCom: ['PRORATA'],
      total: [0],
      limite: [0],
      montantGarantie: [null], // New field for Montant Garantie
      partCharge: [null], // Field to hold calculated Part Charge (read-only)

    });
    // Subscribe to facturation changes to handle field validation and visibility
    this.form.get('facturation')?.valueChanges.subscribe(val => {
      if (val == 'PRC') {
        this.form.get('commission')?.setValidators([Validators.required, Validators.min(0), Validators.max(100), Validators.pattern(ValidatorsEnums.number)]);
      } else {
        this.form.get('commission')?.setValidators([Validators.required, Validators.min(0), Validators.pattern(ValidatorsEnums.number)]);
      }

      // Handle Montant Garantie field visibility and validation based on billing type
      if (val === 'GRT_LOYER') {
        this.form.get('montantGarantie')?.setValidators([Validators.required, Validators.min(0), Validators.pattern(ValidatorsEnums.number)]);
      } else {
        this.form.get('montantGarantie')?.clearValidators();
        // Clear calculated part charge when not in GRT_LOYER mode
        this.form.get('partCharge')?.setValue(null);
      }
      this.form.get('montantGarantie')?.updateValueAndValidity();
    });

    // Subscribe to montantGarantie changes to recalculate part charge
    this.form.get('montantGarantie')?.valueChanges.subscribe(() => {
      if (this.f.facturation.value === 'GRT_LOYER') {
        this.calculatePartCharge();
      }
    });

    // Subscribe to commission changes to recalculate part charge
    this.form.get('commission')?.valueChanges.subscribe(() => {
      if (this.f.facturation.value === 'GRT_LOYER') {
        this.calculatePartCharge();
      }
    });
    this.form.get('type')?.valueChanges.subscribe(val => {
      this.setRequirements();
    });

    this.form.get('intermediaire')?.valueChanges.subscribe(val => {
      this.setIntermediaireContact();
    });
    this.form.get('taxeCommission')?.valueChanges.subscribe(val => {
      this.setTaxeCommission();
    });
    ;
    this.setRequirements();
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.mandateService.getMandate() };
      console.log(data);

      data.date = DateHelperService.fromJsonDate(data.date);
      data.dateD = DateHelperService.fromJsonDate(data.dateD);
      data.dateF = DateHelperService.fromJsonDate(data.dateF);
      this.setOwnerUuid(data?.house?.owner?.uuid);
      this.selectHouse(data?.house.uuid)
      this.house = data.house;
      this.ownerSelected = {
        photoSrc: data?.house?.owner?.photoSrc,
        title: data?.house?.owner?.searchableTitle,
        detail: data?.house?.owner?.searchableDetail
      };
      // If editing a GRT_LOYER mandate, calculate partCharge if not already present
      if (data.facturation === 'GRT_LOYER' && this.house && (data.partCharge === undefined || data.partCharge === null)) {
        const loyerNet = (this.house?.loyer || 0) - (this.house?.charge || 0);
        const montantGarantie = Number(data.montantGarantie) || 0;
        const commission = Number(data.commission) || 0;
        data.partCharge = loyerNet - montantGarantie - commission;
      }
      this.form.patchValue(data);
      this.f.house.setValue(data?.house?.uuid);

      // Update validation based on the selected billing type in edit mode
      const currentFacturation = this.f.facturation.value;
      if (currentFacturation === 'GRT_LOYER') {
        this.form.get('montantGarantie')?.setValidators([Validators.required, Validators.min(0), Validators.pattern(ValidatorsEnums.number)]);
      } else {
        this.form.get('montantGarantie')?.clearValidators();
      }
      this.form.get('montantGarantie')?.updateValueAndValidity();

      // Calculate Part Charge if in GRT_LOYER mode after form is patched
      setTimeout(() => {
        this.calculatePartCharge();
      }, 0);
    }
  }
  setOwnerUuid(uuid) {
    this.f.ownerUuid.setValue(uuid);
    if (!this.edit) {
      this.loadHouses();
    }
  }
  loadHouses() {
    this.isLoadingHouse = true;
    this.houses = [];
    this.f.commission.setValue(0)
    this.house = null;
    if (!this.f.ownerUuid.value || !this.form.get('type')?.value) {
      this.isLoadingHouse = false;
      return;
    }
    this.houseService.getList(this.f.ownerUuid.value, this.form.get('type')?.value).subscribe((res: any) => {
      this.isLoadingHouse = false;
      this.houses = res?.filter(res => { if (res?.mandate === null) { return res } });
      return this.houses;
    }, error => {
      this.isLoadingHouse = false;
    });
  }
  selectHouse(value) {
    if (!this.edit) {
      this.house = this.houses?.find(item => {
        if (item.uuid === value) {
          this.f.house.setValue(item.uuid);
          return item;
        }
      });
    }
    this.f.house.setValue(value);
    // Recalculate Part Charge when house changes
    this.calculatePartCharge();
  }
  setRequirements() {
    this.form.get('type')?.setValidators(Validators.required);
    this.form.get('house')?.setValidators(Validators.required);
    this.form.get('date')?.setValidators(Validators.required);
    this.form.get('dateD')?.setValidators(Validators.required);
    this.form.get('dateF')?.setValidators(Validators.required);
    this.form.get('commission')?.setValidators([Validators.required, Validators.pattern(ValidatorsEnums.number)]);
    this.clearConditionalRequirements();
    this.setTypeRequirements();
    this.updateValididties();
  }
  clearConditionalRequirements() {
    this.form.get('valeur')?.clearValidators();
    this.form.get('montantCom')?.clearValidators();
    this.form.get('taxe')?.clearValidators();
    this.form.get('taxeCommission')?.clearValidators();
    this.form.get('contactInter')?.clearValidators();
  }
  updateValididties() {
    this.form.controls.valeur.updateValueAndValidity();
    this.form.controls.montantCom.updateValueAndValidity();
    this.form.controls.taxe.updateValueAndValidity();
    this.form.controls.taxeCommission.updateValueAndValidity();
    this.form.controls.contactInter.updateValueAndValidity();
  }
  setTypeRequirements() {
    if (this.form.get('type')?.value === 'VENTE') {
      this.setVenteRequirements();
    }
    if (this.form.get('type')?.value === 'LOCATION') {
      this.setLocationRequirements();
    }
  }
  setVenteRequirements() {
    this.form.get('valeur')?.setValidators([Validators.required, Validators.pattern(ValidatorsEnums.number)]);
    this.form.get('montantCom')?.setValidators([Validators.required, Validators.pattern(ValidatorsEnums.number)]);
  }
  setLocationRequirements() {
    this.form.get('taxe')?.setValidators([Validators.required]);
    this.form.get('taxeCommission')?.setValidators([Validators.required]);
  }
  setIntermediaireContact() {
    if (this.form.get('intermediaire')?.value && this.form.get('intermediaire')?.value.trim() !== '') {
      this.form.get('contactInter')?.setValidators([Validators.required]);
    } else {
      this.form.get('contactInter')?.clearValidators();
    }
    this.form.controls.contactInter.updateValueAndValidity();
  }
  setTaxeCommission() {
    this.form.get('taxeCommission')?.valueChanges.subscribe(val => {
      if (val == 'OUI') {
        this.form.get('tvaCommissionCharge')?.setValidators([Validators.required]);
      } else {
        this.form.get('tvaCommissionCharge')?.clearValidators();
      }
    });

    this.form.controls.contactInter.updateValueAndValidity();
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      // Calculate partCharge before saving if billing type is GRT_LOYER
      const formData = { ...this.form.value };
      if (formData.facturation === 'GRT_LOYER' && this.house) {
        const loyerNet = (this.house?.loyer || 0) - (this.house?.charge || 0);
        const montantGarantie = Number(formData.montantGarantie) || 0;
        const commission = Number(formData.commission) || 0;
        formData.partCharge = loyerNet - montantGarantie - commission;
      }

      this.mandateService.add(formData).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({ action: this.edit ? 'MANDATE_UPDATED' : 'MANDATE_ADD', payload: res?.data });
          }
          this.emitter.stopLoading();
        },
        error => {
          this.toast(error.message, 'Une erreur a été rencontrée', error.status);
        }
      );
    } else {
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
  onChangeTotal(champ) {
    var total = 0;
    var montantT = 0;
    var commission = 0;
    if (champ === 'commission') {
      total = ((this.f.commission.value < 0 || this.f.commission.value > 100) && this.f.valeur.value >= 0) ? 0 :
        Math.round((this.f.commission.value / 100) * this.f.valeur.value);
      this.f.montantCom.setValue(total);
      this.f.total.setValue(total);
      return
    } else if (champ === 'montantCom' || champ === 'montantCom') {
      if (parseInt(this.f.montantCom.value) >= 0 && parseInt(this.f.valeur.value) >= 0) {
        if (parseFloat(this.f.valeur.value) > 0) {
          commission = this.round((this.f.montantCom.value * 100) / this.f.valeur.value, 2);
          montantT = Math.round(this.f.montantCom.value + this.f.valeur.value);
          this.f.total.setValue(montantT)
        }
      }
      return this.f.commission.setValue(commission);
    } else if (champ === 'valeur') {
      if (parseFloat(this.f.commission.value) >= 0 && parseFloat(this.f.valeur.value) >= 0) {
        try {
          const current = parseFloat(this.f.montantCom.value);
          const should = Math.round((parseFloat(this.f.valeur.value) * parseFloat(this.f.commission.value)) / 100);
          if (current === 0 && isFinite(should)) {
            this.f.montantCom.setValue(should);

          } else {
          }
        } catch (e) {
        }
      }
      if (parseFloat(this.f.montantCom.value) >= 0 && parseFloat(this.f.valeur.value) >= 0) {
        try {
          const montantCom = parseFloat(this.f.montantCom.value);
          const valeur = parseFloat(this.f.valeur.value);
          const should = (montantCom / valeur) * 100;
          this.f.commission.setValue(should);
          montantT = Math.round(montantCom + valeur);
          this.f.total.setValue(montantT);
        } catch (e) {
        }
      } else {
        this.f.commission.setValue(0);
        this.f.montantCom.setValue(0);
      }
    }
  }
  round(number: number, decimalPlaces: number) {
    const factorOfTen = Math.pow(10, decimalPlaces);
    return Math.round(number * factorOfTen) / factorOfTen;
  }
  onChangeOwner(event) {
    this.owner = this.owners?.find(item => {
      if (item.uuid == event) {
        return item;
      }
    });
  }
  isRequired(property): boolean {
    const control = this.form.get(property);
    if (control?.validator) {
      const validator = control.validator({} as AbstractControl);
      if (validator && validator.required) {
        return true;
      }
    }
    return false;
  }
  // obtenir le nombre de mois entre la date debut du mandat et la date de fin du mandat pour chaque annee
  calculateMensualite() {
    if (this.f.taxe.value === "AGENCE" && this.f.dateD.value && this.f.dateF.value) {
      var results = this.calculerImpotParAnnee(
        this.f.dateD.value,
        this.f.dateF.value,
        this.house?.loyer,
        this.f.periodicite.value
      )

      results.forEach(item => {
        let periodes = this.formBuild.array([]);
        item.periodes.forEach((x) => {
          periodes.push(
            this.formBuild.group({
              id: [null],
              uuid: [null],
              montant: [x?.montant],
              dateF: [x?.dateFin.format("YYYY-MM-DD")],
              dateD: [x?.dateDebut.format("YYYY-MM-DD")],
              periode: [x?.periode, [Validators.required]],
            })
          )
        })

        this.mensualites.push(
          this.formBuild.group({
            id: [null],
            uuid: [null],
            mois: [item?.nbMoisTotal],
            montant: [item?.montantTotal],
            annee: [item?.annee, [Validators.required]],
            periodes: periodes
          })
        )

      });

    } else {
      this.mensualites.clear()
      this.mensualites.controls = []
    }
  }

  calculerImpotParAnnee(
    dateDebut: Date | string,
    dateFin: Date | string,
    loyerNet: number,
    periodicite: 'MENSUEL' | 'TRIMESTRIEL' | 'SEMESTRIEL' | 'ANNUEL'
  ): AnneeImpot[] {
    // Calcul de toutes les périodes
    const toutesLesPeriodes = this.calculerImpot(dateDebut, dateFin, loyerNet, periodicite);

    // Groupement par année
    const periodesParAnnee = new Map<number, AnneeImpot>();

    toutesLesPeriodes.forEach(periode => {
      const annee = periode.dateDebut.year();

      if (!periodesParAnnee.has(annee)) {
        periodesParAnnee.set(annee, {
          annee,
          montantTotal: 0,
          nbMoisTotal: 0,
          periodes: []
        });
      }

      const anneeData = periodesParAnnee.get(annee)!;
      anneeData.periodes.push(periode);
      anneeData.montantTotal += periode.montant;
      anneeData.nbMoisTotal += periode.nbMois;
    });

    // Conversion en tableau et tri par année
    return Array.from(periodesParAnnee.values())
      .sort((a, b) => a.annee - b.annee);
  }
  calculerImpot(
    dateDebut: Date | string,
    dateFin: Date | string,
    loyerNet: number,
    periodicite: 'MENSUEL' | 'TRIMESTRIEL' | 'SEMESTRIEL' | 'ANNUEL'
  ): ImpotPeriod[] {
    const startDate = moment(dateDebut);
    const endDate = moment(dateFin);
    const periodes: ImpotPeriod[] = [];

    let currentDate = startDate.clone().startOf('month');
    const lastDate = endDate.clone().endOf('month');

    switch (periodicite) {
      case 'MENSUEL':
        while (currentDate.isSameOrBefore(lastDate)) {
          periodes.push({
            periode: currentDate.format('MMMM YYYY'),
            dateDebut: currentDate.clone().startOf('month'),
            dateFin: currentDate.clone().endOf('month'),
            montant: this.calculerMontantMensuel(loyerNet),
            nbMois: 1
          });
          currentDate.add(1, 'month');
        }
        break;

      case 'TRIMESTRIEL':
        while (currentDate.isSameOrBefore(lastDate)) {
          const trimestre = Math.ceil((currentDate.month() + 1) / 3);
          const debutTrimestre = currentDate.clone().startOf('quarter');
          const finTrimestre = moment.min(debutTrimestre.clone().endOf('quarter'), lastDate);

          const moisDansTrimestre = this.calculerNombreMois(
            moment.max(debutTrimestre, startDate),
            finTrimestre
          );

          if (moisDansTrimestre > 0) {
            periodes.push({
              periode: `Trimestre${trimestre}`,
              dateDebut: moment.max(debutTrimestre, startDate),
              dateFin: finTrimestre,
              montant: this.calculerMontantMensuel(loyerNet) * moisDansTrimestre,
              nbMois: moisDansTrimestre
            });
          }

          currentDate.add(3, 'months');
        }
        break;

      case 'SEMESTRIEL':
        while (currentDate.isSameOrBefore(lastDate)) {
          const semestre = currentDate.month() < 6 ? 1 : 2;
          const debutSemestre = currentDate.clone().startOf('year').add((semestre - 1) * 6, 'months');
          const finSemestre = moment.min(
            debutSemestre.clone().add(5, 'months').endOf('month'),
            lastDate
          );

          const moisDansSemestre = this.calculerNombreMois(
            moment.max(debutSemestre, startDate),
            finSemestre
          );

          if (moisDansSemestre > 0) {
            periodes.push({
              periode: `Semestre${semestre}`,
              dateDebut: moment.max(debutSemestre, startDate),
              dateFin: finSemestre,
              montant: this.calculerMontantMensuel(loyerNet) * moisDansSemestre,
              nbMois: moisDansSemestre
            });
          }

          currentDate.add(6, 'months');
        }
        break;
    }

    return periodes;
  }
  calculerMontantMensuel(loyerNet: number): number {
    return (loyerNet * this.TAUX_IMPOT) / 100;
  }
  calculerNombreMois(debut: moment.Moment, fin: moment.Moment): number {
    // Si le jour de début est après le 15 du mois, on ne compte pas ce mois
    const debutAjuste = debut.date() > 15 ? debut.clone().add(1, 'month').startOf('month') : debut.clone().startOf('month');

    // Si le jour de fin est avant le 15 du mois, on ne compte pas ce mois
    const finAjuste = fin.date() < 15 ? fin.clone().subtract(1, 'month').endOf('month') : fin.clone().endOf('month');

    // Calcul des mois entiers
    return Math.max(0, finAjuste.diff(debutAjuste, 'months') + 1);
  }

  onClose() {
    this.form.reset()
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
  /**
 * ✅ FINAL: Calcul de la Part Charge pour Garantie Loyer
 * Prend en compte l'impôt foncier si à la charge de l'agence
 */
  calculatePartCharge() {
    // Only calculate if billing type is GRT_LOYER
    if (this.f.facturation.value === 'GRT_LOYER' && this.house) {
      // ✅ Calculer le loyer THÉORIQUE total (toutes locatives)
      const loyerTheorique = this.house?.loyer;

      if (loyerTheorique === 0) {
        this.toast(
          'Impossible de calculer le loyer théorique de l\'immeuble.',
          'Erreur',
          'error'
        );
        this.f.partCharge.setValue(null);
        return;
      }

      const montantGarantie = Number(this.f.montantGarantie.value) || 0;
      const commission = Number(this.f.commission.value) || 0;

      // ✅ NOUVEAU: Calculer l'impôt foncier mensuel si à la charge de l'agence
      let impotFoncierMensuel = 0;
      if (this.f.taxe.value === 'AGENCE') {
        const TAUX_IMPOT = 12; // 12% du loyer brut annuel
        const impotFoncierAnnuel = (loyerTheorique * 12 * TAUX_IMPOT) / 100;
        impotFoncierMensuel = impotFoncierAnnuel / 12;

        console.log('💰 Calcul Impôt Foncier:');
        console.log(`   Loyer mensuel total: ${loyerTheorique.toLocaleString()}`);
        console.log(`   Loyer annuel: ${(loyerTheorique * 12).toLocaleString()}`);
        console.log(`   Impôt annuel (12%): ${impotFoncierAnnuel.toLocaleString()}`);
        console.log(`   Impôt mensuel: ${impotFoncierMensuel.toLocaleString()}`);
      }

      // ✅ Vérification: Montant Garanti + Commission + Impôt ne peut pas dépasser le loyer
      const totalChargesAgence = montantGarantie + commission + impotFoncierMensuel;
      if (totalChargesAgence > loyerTheorique) {
        this.toast(
          `Le Montant Garanti (${montantGarantie.toLocaleString()}) + Commission (${commission.toLocaleString()})` +
          (impotFoncierMensuel > 0 ? ` + Impôt Foncier (${impotFoncierMensuel.toLocaleString()})` : '') +
          ` = ${totalChargesAgence.toLocaleString()} dépasse le loyer mensuel total (${loyerTheorique.toLocaleString()}).`,
          'Configuration incorrecte',
          'error'
        );
        this.f.montantGarantie.setErrors({ tooHigh: true });
        this.f.partCharge.setValue(null);
        return;
      }

      // Calculate Part Charge: loyerTheorique - (montantGarantie + commission + impôt)
      const partCharge = loyerTheorique - (montantGarantie + commission + impotFoncierMensuel);

      // Validate that Part Charge is not negative
      if (partCharge < 0) {
        this.form.get('partCharge')?.setErrors({ negativePartCharge: true });
        this.toast(
          `La Part Charge ne peut pas être négative (${partCharge.toLocaleString()}). Réduisez le Montant Garanti ou la Commission.`,
          'Erreur de calcul',
          'error'
        );
      } else {
        // Clear errors
        const errors = this.form.get('partCharge')?.errors;
        if (errors && errors['negativePartCharge']) {
          delete errors['negativePartCharge'];
          if (Object.keys(errors).length === 0) {
            this.form.get('partCharge')?.setErrors(null);
          } else {
            this.form.get('partCharge')?.setErrors(errors);
          }
        }

        // Clear montantGarantie errors
        const mgErrors = this.f.montantGarantie.errors;
        if (mgErrors) {
          delete mgErrors['tooHigh'];
          if (Object.keys(mgErrors).length === 0) {
            this.f.montantGarantie.setErrors(null);
          }
        }
      }

      // Set the calculated value to partCharge field
      this.f.partCharge.setValue(partCharge);

      // Afficher un résumé du calcul
      console.log('=== CALCUL GARANTIE LOYER ===');
      console.log('Loyer théorique total:', loyerTheorique);
      console.log('Montant Garanti:', montantGarantie);
      console.log('Commission:', commission);
      console.log('Impôt Foncier Mensuel:', impotFoncierMensuel);
      console.log('Part Charge:', partCharge);
      console.log('=============================');

    } else {
      // Clear the calculated value and errors if not in GRT_LOYER mode
      this.f.partCharge.setValue(null);
      const errors = this.form.get('partCharge')?.errors;
      if (errors && errors['negativePartCharge']) {
        delete errors['negativePartCharge'];
        if (Object.keys(errors).length === 0) {
          this.form.get('partCharge')?.setErrors(null);
        } else {
          this.form.get('partCharge')?.setErrors(errors);
        }
      }
    }
  }

  

  /**
   * ✅ NOUVEAU: Calculer le montant garanti maximum recommandé
   */
  getMontantGarantiMaximum(): number {
    if (this.f.facturation.value !== 'GRT_LOYER' || !this.house) {
      return 0;
    }

    const loyerTheorique = this.house.loyer;
    const commission = Number(this.f.commission.value) || 0;

    // Calculer l'impôt si à la charge de l'agence
    let impotMensuel = 0;
    if (this.f.taxe.value === 'AGENCE') {
      const TAUX_IMPOT = 12;
      const impotAnnuel = (loyerTheorique * 12 * TAUX_IMPOT) / 100;
      impotMensuel = impotAnnuel / 12;
    }

    // Part Charge minimum recommandée: 10% du loyer
    const partChargeMin = loyerTheorique * 0.1;

    return Math.max(0, loyerTheorique - commission - impotMensuel - partChargeMin);
  }

  /**
   * ✅ BONUS: Afficher le nombre de locatives occupées/totales
   */
  getOccupancyInfo(): { occupied: number; total: number; rate: number } {
    if (!this.house || !this.house.rentals) {
      return { occupied: 0, total: 0, rate: 0 };
    }

    const total = this.house.rentals.length;
    const occupied = this.house.rentals.filter(rental => {
      const activeContract = rental.contracts?.find(contract =>
        contract.etat === 'ACTIF' || contract.etat === 'ACTIVE'
      );
      return !!activeContract;
    }).length;

    const rate = total > 0 ? (occupied / total) * 100 : 0;

    return { occupied, total, rate };
  }

  get f() { return this.form.controls; }
  get mensualites() { return this.form.get('mensualites') as FormArray; }
}
