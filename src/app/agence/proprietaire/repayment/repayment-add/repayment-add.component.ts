// repayment-add.component.ts - VERSION COMPLÈTE CORRIGÉE

import { House } from '@model/house';
import { Folder } from '@model/folder';
import { Spent } from '@model/spent';
import { Funding } from '@model/funding';
import { ToastrService } from 'ngx-toastr';
import { Repayment } from '@model/repayment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { SpentService } from '@service/spent/spent.service';
import { HouseService } from '@service/house/house.service';
import { OwnerService } from '@service/owner/owner.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { FolderService } from '@service/folder/folder.service';
import { InvoiceService } from '@service/invoice/invoice.service';
import { FundingService } from '@service/funding/funding.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { WithdrallService } from '@service/wallet/withdrawll.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RepaymentService } from '@service/repayment/repayment.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

interface MandateInfo {
  commission: number;
  taxeCommission: string;
  tvaCommissionCharge: string;
  taxe: string;
  charge: string;
  facturation: string;
  verseCom: string;
  montantGarantie?: number;
  montantGarantieGlobal?: number;
  partCharge?: number;
  periodicite?: string;
}

@Component({
  selector: 'app-repayment-add',
  templateUrl: './repayment-add.component.html',
  styleUrls: ['./repayment-add.component.scss']
})
export class RepaymentAddComponent implements OnInit {
  title = '';
  form: FormGroup;
  submit = false;
  edit = false;
  type = 'VENTE';
  ownerSelected?: any;
  customerSelected?: any;
  isLoadingFolder = false;
  isLoadingHouse = false;
  isLoadingData = false;
  repayment: Repayment;
  required = Globals.required;

  houses: House[] = [];
  folders: Folder[];
  folder: Folder;
  house: House;
  fundings: Funding[] = [];
  spents: Spent[] = [];

  montant = 0;
  montantV = 0;
  commission = 0;
  montantFunding = 0;
  montantSpent = 0;
  totalAverser = 0;
  totalOptionTVA = 0;
  totalOptionHT = 0;
  totalOptionTTC = 0;
  totalOptionRemise = 0;

  mandateInfo: MandateInfo | null = null;
  totalImpotsSelectionnes = 0;
  nombreImpotsSelectionnes = 0;
  hasImpotPeriodique = false;
  periodiciteImpot = '';

  typeRow = [
    { label: 'BIEN EN VENTE', value: 'VENTE' },
    { label: 'BIEN EN LOCATION', value: 'LOCATION' }
  ];
  filtreRow = [{ label: 'Date de loyer', value: 'LOYER' }];
  global = { country: Globals.country, device: Globals.device };

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private ownerService: OwnerService,
    private houseService: HouseService,
    private spentService: SpentService,
    private folderService: FolderService,
    private invoiceService: InvoiceService,
    private fundingService: FundingService,
    private repaymentService: RepaymentService,
    private withdrawllService: WithdrallService
  ) {
    this.edit = this.repaymentService.edit;
    this.type = this.repaymentService.type;
    this.repayment = this.repaymentService.getRepayment();
    this.title = !this.edit ? 'Ajouter un reversement' : `Modifier le reversement N°${this.repayment?.code}`;
    this.newForm();
  }

  ngOnInit(): void { this.editForm(); }

  // === UTILITAIRES ===
  private round(v: number): number { return Math.round((v || 0) * 100) / 100; }
  private safe(v: any, d = 0): number { return (v == null || isNaN(v) || !isFinite(v)) ? d : Number(v); }
  private positive(v: number): number { return Math.max(0, v); }

  // === FORMULAIRE ===
  newForm() {
    const defaults: any = {
      uuid: [null], selectAll: [false], selectAllImpots: [false], id: [null],
      owner: [null, [Validators.required]], type: [this.type, [Validators.required]],
      montant: [0], montantRemise: [0], montantFunding: [0], montantSpent: [0],
      montantTva: [0], montantHt: [0], options: this.formBuild.array([]),
      optionsFunding: this.formBuild.array([]), optionsSpent: this.formBuild.array([]),
      optionsImpots: this.formBuild.array([]), comment: [null]
    };

    if (this.type === 'VENTE') {
      Object.assign(defaults, {
        folder: [null, [Validators.required]], customer: [null, [Validators.required]],
        montantVerse: [0], prcCom: [0], montantPaye: [0], montantRCal: [0],
        montantImpot: [0], montantImpaye: [0], commission: [{ value: 0, disabled: true }]
      });
    }

    if (this.type === 'LOCATION') {
      Object.assign(defaults, {
        house: [null, [Validators.required]], dateD: [null, [Validators.required]],
        dateF: [null, [Validators.required]], typeFiltre: [null, [Validators.required]],
        tva: [0], impot: [0], verse: [0], prcImpot: [0], prcTva: [0],
        commission: [0], loyer: [0], optionsPayment: this.formBuild.array([])
      });
    }
    this.form = this.formBuild.group(defaults);
  }

  editForm() {
    if (!this.edit) return;
    const data = { ...this.repaymentService.getRepayment() };

    this.ownerSelected = { photoSrc: data.owner?.photoSrc, title: data.owner?.searchableTitle, detail: data.owner?.searchableDetail };
    this.customerSelected = { photoSrc: data.folder?.customer?.photoSrc, title: data.folder?.customer?.searchableTitle, detail: data.folder?.customer?.searchableDetail };

    if (data?.type === 'VENTE') {
      this.folder = data?.folder;
      this.montant = data?.aReverser;
      this.f.prcCom.setValue(data?.prcCom);
      this.f.owner.setValue(data?.owner.uuid);
      this.f.customer.setValue(data?.folder?.customer?.uuid);
      this.f.folder.setValue(data?.folder.uuid);
      this.f.commission.setValue(data?.commission);
      this.f.montantRCal.setValue(this.montant);
    }

    if (data?.type === 'LOCATION') {
      this.house = data?.house;
      this.f.house.setValue(data?.house?.uuid);
      this.f.typeFiltre.setValue(data?.filtre);

      data?.optionInvoiceRepayments?.forEach((item: any) => {
        this.optionsP.push(this.formBuild.group({
          uuid: [item?.uuid], checked: [true],
          locataire: [{ value: item?.invoice?.contract?.tenant?.searchableTitle, disabled: true }],
          locative: [{ value: item?.invoice?.contract?.rental?.libelle, disabled: true }],
          libelle: [{ value: item?.invoice?.libelle, disabled: true }],
          loyerBrut: [{ value: this.round(item?.loyer + (item?.invoice?.contract?.charge || 0)), disabled: true }],
          loyer: [{ value: this.round(item?.loyer), disabled: true }],
          commission: [{ value: this.round(item?.commission), disabled: true }],
          tvaCom: [{ value: this.round(item?.tva), disabled: true }],
          cautionDejaRverser: [{ value: this.round(item?.cautionDejaRverser), disabled: true }],
          caution: [{ value: this.round(item?.caution), disabled: true }],
          verse: [{ value: this.round(item?.verse), disabled: true }],
          montantNet: [{ value: this.round(item?.loyer), disabled: true }],
          montantAReverser: [{ value: this.round(item?.montant), disabled: true }],
          impot: [{ value: 0, disabled: true }]
        }));
      });

      data?.impotsFonciers?.forEach((item: any) => {
        this.optionsImpots.push(this.formBuild.group({
          type: ['IMPOT'], id: [item.id], uuid: [item.uuid], checked: [true],
          locataire: [{ value: null, disabled: true }],
          locative: [{ value: item?.house?.nom, disabled: true }],
          libelle: [{ value: item?.libelle, disabled: true }],
          periodicite: [{ value: item?.periodicite, disabled: true }],
          periode: [item?.periode],
          montant: [{ value: this.round(item?.montant), disabled: true }],
          prcImpot: [{ value: item?.prcImpot, disabled: true }]
        }));
        this.totalImpotsSelectionnes += this.safe(item?.montant);
        this.nombreImpotsSelectionnes++;
      });
    }

    this.f.montantHt.setValue(data?.montantHt);
    this.f.montantRemise.setValue(data?.montantRemise);
    this.f.montantTva.setValue(data?.montantTva);
    this.f.montantFunding.setValue(data?.montantFunding);
    this.f.montantSpent.setValue(data?.montantSpent);
    this.montantFunding = data?.montantFunding || 0;
    this.montantSpent = data?.montantSpent || 0;
    this.form.patchValue({ ...data, house: data.house?.uuid, owner: data.owner?.uuid });
    if (data?.dateF) this.f.dateF.setValue(DateHelperService.fromJsonDate(data?.dateF));
    if (data?.dateD) this.f.dateD.setValue(DateHelperService.fromJsonDate(data?.dateD));

    data?.optionFundings?.forEach((item: any) => {
      this.optionsF.push(this.formBuild.group({
        uuid: [item.uuid], checked: [true],
        periode: [{ value: item?.periode, disabled: true }],
        montant: [{ value: this.round(item?.mensualite), disabled: true }],
        libelle: [{ value: item?.libelle, disabled: true }]
      }));
    });

    data?.spents?.forEach((item: any) => {
      this.optionsS.push(this.formBuild.group({
        uuid: [item.uuid], checked: [true],
        periode: [{ value: item?.date, disabled: true }],
        montant: [{ value: this.round(item?.montant), disabled: true }],
        libelle: [{ value: item?.motif, disabled: true }]
      }));
    });

    data?.options?.forEach((item: any) => {
      this.options.push(this.formBuild.group({
        uuid: [item.uuid], id: [item.id], libelle: [item.libelle, [Validators.required]],
        prix: [item.prix, [Validators.required, Validators.min(0)]],
        qte: [item.qte, [Validators.required, Validators.min(1)]],
        tva: [item.tva], remise: [item.remise], total: [item.total]
      }));
    });

    this.totalAverser = data?.montantLoyer || 0;
    this.f.impot?.setValue(this.totalImpotsSelectionnes);
    this.onChangeTotalCalcul();
  }

  // === SÉLECTIONS ===
  setOwnerUuid(uuid: string) {
    if (uuid) {
      this.f.owner.setValue(uuid);
      this.ownerService.getSingle(uuid).subscribe();
      this.type === 'VENTE' ? this.loadFolders() : this.loadHouses();
    } else {
      this.type === 'VENTE' ? (this.folders = [], this.f.folder.setValue(null)) : (this.houses = [], this.f.house.setValue(null));
    }
  }

  setCustomerUuid(uuid: string) {
    uuid ? (this.f.customer.setValue(uuid), this.loadFolders()) : (this.folders = [], this.f.folder.setValue(null));
  }

  setFolderUuid(value: string) {
    if (!this.edit && this.folders) this.folder = this.folders.find(i => i.uuid === value);
    this.f.folder.setValue(value);
    this.onCalculVente();
  }

  setHouseUuid(value: string) {
    if (!this.edit && this.houses) this.house = this.houses.find(i => i.uuid === value);
    this.f.house.setValue(value);
  }

  // === CHARGEMENTS ===
  loadFolders() {
    this.folders = []; this.f.folder.setValue(null);
    if (!this.f.customer.value || !this.f.owner.value) return;
    this.isLoadingFolder = true;
    this.folderService.getList(this.f.customer.value, 'VALIDE', this.f.owner.value).subscribe({
      next: (res) => { this.isLoadingFolder = false; this.folders = res || []; },
      error: () => this.isLoadingFolder = false
    });
  }

  loadHouses() {
    this.houses = []; this.f.house.setValue(null);
    if (!this.f.owner.value) return;
    this.isLoadingHouse = true;
    this.houseService.getList(this.f.owner.value, 'LOCATION', 'OCCUPE', null).subscribe({
      next: (res) => { this.isLoadingHouse = false; this.houses = res || []; },
      error: () => this.isLoadingHouse = false
    });
  }

  loadFunding() {
    if (!this.f.owner.value || this.edit) return;
    this.fundingService.getList(null, this.f.owner.value).subscribe({
      next: (res) => { this.fundings = res || []; this.optionsF.controls = this.itemOptionFunding(); }
    });
  }

  loadSpent() {
    if (!this.f.owner.value || this.edit) return;
    this.withdrawllService.getList(this.f.owner.value, this.f.house?.value).subscribe({
      next: (res) => { this.spents = res || []; this.optionsS.controls = this.itemOptionSpent(); }
    });
  }

  itemOptionFunding(): FormGroup[] {
    const arr: FormGroup[] = [];
    this.fundings?.forEach((f: any) => f?.options?.forEach((i: any) => arr.push(this.formBuild.group({
      uuid: [i.uuid], checked: [{ value: false, disabled: i?.reverse === 'OUI' }],
      periode: [{ value: i?.periode, disabled: true }], montant: [{ value: this.round(i?.mensualite), disabled: true }],
      libelle: [{ value: 'Financement N° ' + f?.construction?.code, disabled: true }]
    }))));
    return arr;
  }

  itemOptionSpent(): FormGroup[] {
    return this.spents?.map((s: any) => this.formBuild.group({
      uuid: [s.uuid], checked: [{ value: false, disabled: s?.reverse === 'OUI' }],
      periode: [{ value: s?.date, disabled: true }], montant: [{ value: this.round(s?.montant), disabled: true }],
      libelle: [{ value: s?.libelle, disabled: true }]
    })) || [];
  }

  // === CHARGEMENT DONNÉES LOCATION ===
  onLoadData() {
    this.resetCalculations();
    if (this.edit) return;
    this.isLoadingData = true;
    this.invoiceService.getList(null, null, null, null, this.f.house.value, this.f.dateD.value, this.f.dateF.value, null, this.f.typeFiltre.value).subscribe({
      next: (res: any) => {
        this.isLoadingData = false;
        if (!res) return;
        const factures = res.factures ?? res, impots = res.impots ?? [];
        if (factures?.length && factures[0].mandate) this.mandateInfo = { ...factures[0].mandate };
        this.hasImpotPeriodique = impots.length > 0;
        if (this.hasImpotPeriodique && impots[0]?.periodicite) this.periodiciteImpot = impots[0].periodicite;
        this.optionsP.controls = this.createFactureFormGroups(factures);
        this.optionsImpots.controls = this.createImpotFormGroups(impots);
      },
      error: () => { this.isLoadingData = false; this.toast('Erreur chargement', 'Erreur', 'error'); }
    });
    this.loadFunding(); this.loadSpent();
  }

  private resetCalculations() {
    this.f.selectAll?.setValue(false); this.f.selectAllImpots?.setValue(false);
    this.optionsP?.clear(); this.optionsImpots?.clear();
    ['tva', 'loyer', 'verse', 'impot', 'commission', 'montant'].forEach(k => this.f[k]?.setValue(0));
    this.totalAverser = this.totalImpotsSelectionnes = this.nombreImpotsSelectionnes = 0;
    this.mandateInfo = null; this.hasImpotPeriodique = false; this.periodiciteImpot = '';
  }

  private createFactureFormGroups(factures: any[]): FormGroup[] {
    return factures?.map(i => {
      this.f.prcTva?.setValue(i?.prcTva || 18); this.f.prcImpot?.setValue(i?.prcImpot || 12);
      return this.formBuild.group({
        uuid: [i.facture], etat: [i.etat], checked: [false],
        locataire: [{ value: i?.locataire, disabled: true }], locative: [{ value: i?.locative, disabled: true }],
        libelle: [{ value: i?.libelle, disabled: true }], loyerBrut: [{ value: this.round(i?.loyerBrut), disabled: true }],
        loyer: [{ value: this.round(i?.loyer || i?.loyerNet), disabled: true }],
        commission: [{ value: this.round(i?.commission), disabled: true }],
        cautionDejaRverser: [{ value: this.round(i?.cautionDejaRverser), disabled: true }],
        caution: [{ value: this.round(i?.caution), disabled: true }], tvaCom: [{ value: this.round(i?.tvaCom), disabled: true }],
        verse: [{ value: this.round(i?.verse), disabled: true }], montantNet: [{ value: this.round(i?.loyer || i?.loyerNet), disabled: true }],
        montantAReverser: [{ value: this.round(i?.montantAReverser || i?.montant), disabled: true }],
        charge: [{ value: this.round(i?.charge), disabled: true }], impot: [{ value: 0, disabled: true }]
      });
    }) || [];
  }

  private createImpotFormGroups(impots: any[]): FormGroup[] {
    return impots?.map(i => this.formBuild.group({
      type: ['IMPOT'], id: [i.id], uuid: [i.uuid], factureOriginale: [i.factureOriginale], etat: [i.etat], checked: [false],
      locataire: [{ value: i.locataire, disabled: true }], locative: [{ value: i.locative, disabled: true }],
      libelle: [{ value: i.libelle, disabled: true }], periodicite: [{ value: i.periodicite, disabled: true }],
      periode: [i.periode], montant: [{ value: this.round(i.montant), disabled: true }], prcImpot: [{ value: i.prcImpot, disabled: true }],
      loyerAnnuelTotal: [i.loyerAnnuelTotal]
    })) || [];
  }

  // === SÉLECTIONS FACTURES/IMPÔTS ===
  onSelectAll($event: any) {
    this.optionsP.controls.forEach(i => i.get('checked')?.setValue($event.target.checked));
    this.recalculateTotals();
  }
  onSelect() { this.recalculateTotals(); }

  onSelectAllImpots($event: any) {
    let t = 0, c = 0;
    this.optionsImpots.controls.forEach(i => {
      if (!i.get('checked')?.disabled) { i.get('checked')?.setValue($event.target.checked); if ($event.target.checked) { t += this.safe(i.get('montant')?.value); c++; } }
    });
    this.totalImpotsSelectionnes = this.round(t); this.nombreImpotsSelectionnes = c;
    this.f.impot?.setValue(this.totalImpotsSelectionnes); this.onChangeTotalCalcul();
  }

  onSelectImpot() {
    let t = 0, c = 0;
    this.optionsImpots.controls.forEach(i => { if (i.get('checked')?.value) { t += this.safe(i.get('montant')?.value); c++; } });
    this.totalImpotsSelectionnes = this.round(t); this.nombreImpotsSelectionnes = c;
    this.f.impot?.setValue(this.totalImpotsSelectionnes); this.onChangeTotalCalcul();
  }

  private recalculateTotals() {
    let loyer = 0, comm = 0, tva = 0, verse = 0, aReverser = 0;
    this.optionsP.controls.forEach(i => { if (i.get('checked')?.value) { const r = (i as FormGroup).getRawValue(); loyer += this.safe(r.loyer); comm += this.safe(r.commission); tva += this.safe(r.tvaCom); verse += this.safe(r.verse); aReverser += this.safe(r.montantAReverser); } });
    this.f.loyer?.setValue(this.round(loyer)); this.f.commission?.setValue(this.round(comm));
    this.f.tva?.setValue(this.round(tva)); this.f.verse?.setValue(this.round(verse));
    this.totalAverser = this.round(aReverser); this.onChangeTotalCalcul();
  }

  onSelectFunding() { this.recalculateFundingTotal(); }
  onSelectAllFunding($event: any) { this.optionsF.controls.forEach(i => { if (!i.get('checked')?.disabled) i.get('checked')?.setValue($event.target.checked); }); this.recalculateFundingTotal(); }
  private recalculateFundingTotal() { let t = 0; this.optionsF.controls.forEach(i => { if (i.get('checked')?.value) t += this.safe(i.get('montant')?.value); }); this.montantFunding = this.round(t); this.f.montantFunding?.setValue(this.montantFunding); this.onChangeTotalCalcul(); }

  onSelectSpent() { this.recalculateSpentTotal(); }
  onSelectAllSpent($event: any) { this.optionsS.controls.forEach(i => { if (!i.get('checked')?.disabled) i.get('checked')?.setValue($event.target.checked); }); this.recalculateSpentTotal(); }
  private recalculateSpentTotal() { let t = 0; this.optionsS.controls.forEach(i => { if (i.get('checked')?.value) t += this.safe(i.get('montant')?.value); }); this.montantSpent = this.round(t); this.f.montantSpent?.setValue(this.montantSpent); this.onChangeTotalCalcul(); }

  // === OPTIONS SUPPLÉMENTS ===
  onAddOption() { this.options.push(this.formBuild.group({ uuid: [null], id: [null], libelle: [null, [Validators.required]], prix: [0, [Validators.required, Validators.min(0)]], qte: [1, [Validators.required, Validators.min(1)]], tva: [0], remise: [0], total: [0] })); }
  onDeleteOption(i: number) { this.options.removeAt(i); this.onChangeTotalCalcul(); }
  onChangeTotalOption(row: FormGroup) { const p = this.safe(row.get('prix')?.value), q = this.safe(row.get('qte')?.value, 1), r = this.safe(row.get('remise')?.value), t = this.safe(row.get('tva')?.value); const ht = p * q, tv = ((ht - r) * t) / 100; row.get('total')?.setValue(this.round((ht - r) + tv)); this.onChangeTotalCalcul(); }

  // === CALCUL TOTAL ===
  onChangeTotalCalcul() {
    this.totalOptionHT = this.totalOptionTVA = this.totalOptionTTC = this.totalOptionRemise = 0;
    this.options.controls.forEach(e => { const fg = e as FormGroup, p = this.safe(fg.get('prix')?.value), q = this.safe(fg.get('qte')?.value, 1), r = this.safe(fg.get('remise')?.value), t = this.safe(fg.get('tva')?.value); const ht = p * q, tv = ((ht - r) * t) / 100; this.totalOptionRemise += r; this.totalOptionHT += ht; this.totalOptionTVA += tv; this.totalOptionTTC += (ht - r) + tv; });
    [this.totalOptionRemise, this.totalOptionHT, this.totalOptionTVA, this.totalOptionTTC] = [this.totalOptionRemise, this.totalOptionHT, this.totalOptionTVA, this.totalOptionTTC].map(v => this.round(v));
    this.f.montantRemise?.setValue(this.totalOptionRemise); this.f.montantTva?.setValue(this.totalOptionTVA); this.f.montantHt?.setValue(this.totalOptionHT);
    let m = this.positive(this.totalAverser - this.totalOptionTTC - this.montantFunding - this.montantSpent - this.totalImpotsSelectionnes);
    this.f.montant?.setValue(this.round(m));
  }

  // === VENTE ===
  onCalculVente() {
    if (!this.folder) return;
    this.montantV = this.round(this.safe(this.folder?.montant) - this.safe(this.folder?.frais));
    if (!this.edit) { this.montant = this.safe(this.folder?.invoice?.montantNonReverse); if (!this.folder?.repayments?.length) this.montant = this.round(this.montant - this.safe(this.folder?.frais)); this.f.montantRCal?.setValue(this.montant); }
    if (this.folder?.houses?.length <= 1) { const h = this.folder?.houses[0]?.house; this.commission = h?.mandate?.verseCom === 'TOTALITE' ? this.safe(h?.mandate?.montantCom) : this.round((this.f.montantRCal?.value * this.safe(h?.mandate?.montantCom)) / this.safe(h?.mandate?.valeur, 1)); this.f.prcCom?.setValue(h?.mandate?.commission || 0); }
    else this.commission = this.round((this.safe(this.f.prcCom?.value) * this.f.montantRCal?.value) / 100);
    this.f.commission?.setValue(this.commission); this.f.montant?.setValue(this.round(this.positive(this.f.montantRCal?.value - this.commission)));
    this.loadFunding(); this.loadSpent();
  }

  // === VALIDATION & SOUMISSION ===
  private validateBeforeSubmit(): boolean {
    if (this.f.montant?.value < 0) { this.toast('Montant négatif interdit', 'Erreur', 'error'); return false; }
    if (this.type === 'LOCATION' && !this.edit) {
      if (!this.optionsP.controls.some(c => c.get('checked')?.value) && !this.optionsImpots.controls.some(c => c.get('checked')?.value)) { this.toast('Sélectionnez au moins une facture ou un impôt', 'Attention', 'warning'); return false; }
      if (new Date(this.f.dateD?.value) > new Date(this.f.dateF?.value)) { this.toast('Dates invalides', 'Erreur', 'error'); return false; }
    }
    return true;
  }

  async onConfirme() {
    if (!this.validateBeforeSubmit()) return;
    if (this.mandateInfo?.facturation === 'GRT_LOYER') { let enc = 0, gar = 0; this.optionsP.controls.forEach(i => { if (i.get('checked')?.value) { enc += this.safe(i.get('loyer')?.value); gar += this.safe(i.get('montantAReverser')?.value); } }); if (enc < gar) { const r = await Swal.fire({ title: '⚠️ Garantie Loyer', html: `<p>Encaissé: ${enc.toLocaleString()} ${this.global.device}</p><p>Garanti: ${gar.toLocaleString()} ${this.global.device}</p><p class="text-danger">Perte: ${(gar - enc).toLocaleString()} ${this.global.device}</p>`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Confirmer', cancelButtonText: 'Annuler', confirmButtonColor: '#d33' }); if (!r.isConfirmed) return; } }
    Swal.fire({ title: 'Confirmation', text: `Reversement de ${this.f.montant?.value?.toLocaleString()} ${this.global.device}. Confirmer ?`, icon: 'question', showCancelButton: true, confirmButtonText: 'Confirmer', cancelButtonText: 'Annuler', confirmButtonColor: '#1bc943' }).then(r => { if (r.isConfirmed) this.onSubmit(); });
  }

  onSubmit() {
    this.submit = true;
    if (this.form.invalid) { this.toast('Formulaire invalide', 'Erreur', 'warning'); return; }
    this.repaymentService.add(this.form.getRawValue()).subscribe({ next: (res: any) => { if (res?.status === 'success') { this.modal.close('ferme'); this.emitter.emit({ action: this.f.uuid?.value ? 'REPAYMENT_UPDATED' : 'REPAYMENT_ADD', payload: res?.data }); this.toast('Succès', 'Reversement enregistré', 'success'); } }, error: (e) => this.toast(e?.error?.msg || 'Erreur', 'Erreur', 'error') });
  }

  // === UTILITAIRES UI ===
  getPeriodiciteDescription(p: string): string { return { MENSUEL: 'Chaque mois', TRIMESTRIEL: 'Tous les 3 mois', SEMESTRIEL: 'Tous les 6 mois', ANNUEL: '1 fois/an' }[p] || 'N/A'; }
  toast(msg: string, title: string, type: 'success' | 'error' | 'warning' | 'info') { this.toastr[type](msg, title); }
  onClose() { this.form.reset(); this.modal.close('ferme'); }

  // === GETTERS ===
  get f() { return this.form.controls; }
  get options() { return this.form.get('options') as FormArray; }
  get optionsF() { return this.form.get('optionsFunding') as FormArray; }
  get optionsS() { return this.form.get('optionsSpent') as FormArray; }
  get optionsP() { return this.form.get('optionsPayment') as FormArray; }
  get optionsImpots() { return this.form.get('optionsImpots') as FormArray; }
}