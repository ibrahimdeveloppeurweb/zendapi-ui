import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Owner } from '@model/owner';
import { OwnerService } from '@service/owner/owner.service';
import { WalletService } from '@service/wallet/wallet.service';
import { WithdrallService } from '@service/wallet/withdrawll.service';
import { HouseService } from '@service/house/house.service';
import { Globals } from '@theme/utils/globals';
import { EmitterService } from '@service/emitter/emitter.service';

export interface ITransaction {
  uuid?: string;
  id?: string;
  date?: string;
  dateO?: string;
  libelle?: string;
  debit?: number;
  credit?: number;
  soldeNew?: number;
  soldeNewParent?: number;
  // Extended for computed
  runningBalance?: number;
}

export interface IHouse {
  uuid: string;
  nom: string;
  // add other fields as needed
}

@Component({
  selector: 'app-owner-releve',
  templateUrl: './owner-releve.component.html',
  styleUrls: ['./owner-releve.component.scss']
})
export class OwnerReleveComponent implements OnInit {
  title: string = 'Tirer le relevé de compte du propriétaire';
  owner: Owner | null = null;
  form: FormGroup;
  options: ITransaction[] = [];
  houses: IHouse[] = [];
  house: IHouse | null = null;
  userSession = Globals.user;
  global = { country: Globals.country, device: Globals.device };

  // Optional: for future backend initial balance integration
  // initialBalanceBeforePeriod: number = 0;

  constructor(
    public modal: NgbActiveModal,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private ownerService: OwnerService,
    private houseService: HouseService,
    private walletService: WalletService,
    private withdrawllService: WithdrallService,
    private emitter: EmitterService
  ) {
    this.owner = this.ownerService.getOwner();
    this.newForm();
    if (this.owner) {
      this.f.owner.setValue(this.owner.uuid);
      this.loadHouses();
    }
  }

  ngOnInit(): void {
    // Ensure DataTable options are set (if used)
    this.dtOptions = { ...Globals.dataTable, paging: true, pageLength: 10 };
  }

  newForm(): void {
    this.form = this.formBuilder.group({
      uuid: [null],
      id: [null],
      house: [null], // will be null or string (uuid)
      owner: [null, [Validators.required]],
      dateD: [null, [Validators.required]],
      dateF: [null, [Validators.required]],
    });
  }

  // Getter for form controls (DRY & type-safe)
  get f() { return this.form.controls; }

  loadHouses(): void {
    if (!this.f.owner.value) return;

    this.houses = [];
    this.houseService.getList(this.f.owner.value).subscribe({
      next: (res: any) => {
        this.houses = Array.isArray(res) ? res : [];
      },
      error: (err) => {
        this.toast('Erreur lors du chargement des biens', 'Erreur', 'error');
        console.error('House load error:', err);
      }
    });
  }

  selectHouse(uuid: string | null): void {
    this.f.house.setValue(uuid);
    if (uuid) {
      this.house = this.houses.find(h => h.uuid === uuid) || null;
    } else {
      this.house = null;
    }
  }

  onLoadData(): void {
    if (this.form.invalid) {
      this.toast('Veuillez sélectionner une période valide', 'Données manquantes', 'warning');
      return;
    }

    const payload = this.form.value;
    // Validate dates
    if (new Date(payload.dateF) < new Date(payload.dateD)) {
      this.toast('La date de fin doit être postérieure à la date de début', 'Période invalide', 'warning');
      return;
    }

    this.walletService.getItems(payload).subscribe({
      next: (res: any) => {
        if (res && Array.isArray(res.data)) {
          this.options = res.data;
        } else {
          this.options = [];
          this.toast('Aucune transaction trouvée pour cette période', 'Info', 'info');
        }
      },
      error: (err) => {
        this.toast('Erreur lors du chargement des transactions', 'Erreur', 'error');
        console.error('Wallet items error:', err);
      }
    });
  }

  /**
   * Compute running balance based ONLY on displayed transactions (in period),
   * sorted chronologically.
   * Starts from 0 (or initialBalanceBeforePeriod if implemented).
   */
  get transactionsWithRunningBalance(): ITransaction[] {
    if (!this.options || this.options.length === 0) return [];

    let balance = 0;
    // If backend provides initial balance before dateD, use:
    // balance = this.initialBalanceBeforePeriod || 0;

    return this.options
      .slice()
      .sort((a, b) => {
        const dateA = new Date(a.dateO || a.date).getTime();
        const dateB = new Date(b.dateO || b.date).getTime();
        return dateA - dateB;
      })
      .map(item => {
        const credit = Number(item.credit) || 0;
        const debit = Number(item.debit) || 0;
        balance = balance + credit - debit; // credit adds, debit subtracts
        return {
          ...item,
          runningBalance: balance
        };
      });
  }

  print(): void {
    if (this.options.length === 0) {
      this.toast('Aucune donnée à imprimer', 'Attention', 'warning');
      return;
    }

    this.withdrawllService.getReleve(
      null,
      this.userSession?.agencyKey,
      this.userSession?.uuid,
      this.f.owner.value,
      this.f.dateD.value,
      this.f.dateF.value,
      this.f.house.value
    );
  }

  onClose(): void {
    this.form.reset();
    this.options = [];
    this.houses = [];
    this.house = null;
    this.modal.close('ferme');
  }

  toast(msg: string, title: string, type: 'info' | 'success' | 'warning' | 'error'): void {
    switch (type) {
      case 'info': this.toastr.info(msg, title); break;
      case 'success': this.toastr.success(msg, title); break;
      case 'warning': this.toastr.warning(msg, title); break;
      case 'error': this.toastr.error(msg, title); break;
    }
  }

  // For DataTable (if still used, though table is static now)
  dtOptions: any = {};
}