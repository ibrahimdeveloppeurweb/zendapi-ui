import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@service/auth/auth.service';
import { EmitterService } from '@service/emitter/emitter.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';


import { environment } from '@env/environment';
import { WalletService } from '@service/wallet/wallet.service';



@Component({
  selector: 'app-wallet-upgrade',
  templateUrl: './wallet-upgrade.component.html',
  styleUrls: ['./wallet-upgrade.component.scss']
})
export class WalletUpgradeComponent implements OnInit {
  title = "Configuration du portefeuille de l'agence";
  form: FormGroup;
  publicUrl = environment.publicUrl;
  token: any

  constructor(
    private auth: AuthService,
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private walletService: WalletService
  ) {
    this.token = this.auth.getDataToken() ? this.auth.getDataToken() : null;
    this.newForm()
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      solde: [0],
      commission: [0],
      caution: [0],
      tva: [0],
      depense: [0],
      cie: [0],
      fraisA: [0],
      honoraire: [0],
      frais: [0],
      droit: [0],
      timbres: [0],
      autres: [0]
    })
  }

  onConfirme() {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet enregistrement',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this. onSubmit()
      }
    });
  }

  onSubmit(){
    const data = this.form.value
    this.walletService.create(data).subscribe(res => {
      if (res.code == 200) {
        const data = res.data
        this.token.isUpdate = data.currentUpdate.isUpdate
        localStorage.setItem('token-zen-data', JSON.stringify(this.token));
      }
    })
  }

  onClose() { this.modal.close('ferme'); }
  get f() { return this.form.controls; }
}
