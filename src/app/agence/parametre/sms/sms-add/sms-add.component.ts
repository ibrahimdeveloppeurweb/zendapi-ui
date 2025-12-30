import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SmsService } from '@service/sms/sms.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-sms-add',
  templateUrl: './sms-add.component.html',
  styleUrls: ['./sms-add.component.scss']
})
export class SmsAddComponent implements OnInit {
  title: string = ""
  textAlert: string = ""
  form: FormGroup
  @Input() sms
  data: any
  edit: boolean = false
  submit: boolean = false
  validPaiement: boolean = false
  validContrat: boolean = false
  validTicket: boolean = false
  validReversement: boolean = false
  validAkwaba: boolean = false
  validFacture: boolean = false
  validAvis: boolean = false
  validAnniversaire: boolean = false
  required = {
    akwaba: "Expression Z_NOM, Z_MDP, Z_LOGIN non trouvée.",
    anniversaire: "Expression Z_NOM et Z_AGENCY non trouvée.",
    avis: "Expression Z_NOM, Z_TITRE, Z_MONTANT non trouvée.",
    paiement: "Expression Z_NOM, Z_TITRE, Z_MONTANT, Z_DATE, Z_RESTE non trouvée.",
    facture: "Expression Z_NOM, Z_TITRE, Z_DEPOSANT, Z_MONTANT, Z_RESTE, Z_DATE non trouvée.",
    ticket: "Expression Z_MOTIF, Z_DATE, Z_TICKET_ID, non trouvée.",
    contrat: "Expression Z_TITRE, Z_NOM, Z_LOCATIVE, Z_DEBUT_CONTRAT, Z_FIN_CONTRAT, Z_LOYERS, Z_FACTURE_ENTRE non trouvée.",
    reversement: "Expression Z_NOM, Z_MOIS, Z_RESTE non trouvée.",
  }

  constructor(
    private formBuild: FormBuilder,
    private smsService: SmsService,
    public toastr: ToastrService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.textAlert = "Veuillez ne pas transformer ou modifier les textes précedé de Z_."
    this.title = "PARAMETREZ LES MESSAGES DE L'AGENCE"
    this.newForm()
  }
  ngOnInit(): void {
    this.editForm()
  }
  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      reversement: [null],
      paiement: [null],
      contrat: [null],
      ticket: [null],
      akwaba: [null],
      facture: [null],
      avis: [null],
      anniversaire: [null],
    });
  }
  editForm() {
    this.form.patchValue({ ...this.sms })
  }
  editSms(edit) {
    this.edit = edit
    this.title = edit ? "MODIFIER LES MESSAGES DE L'AGENCE" : "PARAMETREZ LES MESSAGES DE L'AGENCE"
    if (!this.edit) {
      this.editForm()
    }
  }
  onSubmit() {
    if (this.onChecking() === false) {
      this.toast(
        'Veuillez remplir correctement les champs',
        'Attention !',
        'warning');
    } else {
      this.smsService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.title = "PARAMETREZ LES MESSAGES DE L'AGENCE"
          this.edit = false
        }
      },
        error => { });
    }
  }
  onChecking() {
    let etat = true
    if (this.f.akwaba.value
      && this.f.akwaba.value.includes("Z_NOM")
      && this.f.akwaba.value.includes("Z_MDP")
      && this.f.akwaba.value.includes("Z_LOGIN")) {
      this.validAkwaba = true
    } else {
      this.validAkwaba = false
      etat = false
    }
    if (this.f.anniversaire.value
      && this.f.anniversaire.value.includes("Z_NOM")
      && this.f.anniversaire.value.includes("Z_AGENCY")) {
      this.validAnniversaire = true
      etat = true
    } else {
      this.validAnniversaire = false
      etat = false
    }
    if (this.f.avis.value
      && this.f.avis.value.includes("Z_NOM")
      && this.f.avis.value.includes("Z_MONTANT")
      && this.f.avis.value.includes("Z_TITRE")) {
      this.validAvis = true
      etat = true
    } else {
      this.validAvis = false
      etat = false
    }
    if (this.f.contrat.value
      && this.f.contrat.value.includes("Z_TITRE")
      && this.f.contrat.value.includes("Z_NOM")
      && this.f.contrat.value.includes("Z_LOCATIVE")
      && this.f.contrat.value.includes("Z_DEBUT_CONTRAT")
      && this.f.contrat.value.includes("Z_FIN_CONTRAT")
      && this.f.contrat.value.includes("Z_FACTURE_ENTRE")
      && this.f.contrat.value.includes("Z_LOYERS")) {
      this.validContrat = true
      etat = true
    } else {
      this.validContrat = false
      etat = false
    }
    if (this.f.paiement.value
      && this.f.paiement.value.includes("Z_NOM")
      && this.f.paiement.value.includes("Z_TITRE")
      && this.f.paiement.value.includes("Z_MONTANT")
      && this.f.paiement.value.includes("Z_RESTE")
      && this.f.paiement.value.includes("Z_DATE")) {
      this.validPaiement = true
      etat = true
    } else {
      this.validPaiement = false
      etat = false
    }
    if (this.f.facture.value
      && this.f.facture.value.includes("Z_NOM")
      && this.f.facture.value.includes("Z_TITRE")
      && this.f.facture.value.includes("Z_DEPOSANT")
      && this.f.facture.value.includes("Z_MONTANT")
      && this.f.facture.value.includes("Z_RESTE")
      && this.f.facture.value.includes("Z_DATE")) {
      this.validFacture = true
      etat = true
    } else {
      this.validFacture = false
      etat = false
    }
    if (this.f.ticket.value
      && this.f.ticket.value.includes("Z_MOTIF")
      && this.f.ticket.value.includes("Z_DATE")
      && this.f.ticket.value.includes("Z_TICKET_ID")) {
      this.validTicket = true
      etat = true
    } else {
      this.validTicket = false
      etat = false
    }
    if (this.f.reversement.value
      && this.f.reversement.value.includes("Z_NOM")
      && this.f.reversement.value.includes("Z_RESTE")
      && this.f.reversement.value.includes("Z_MOIS")) {
      this.validReversement = true
      etat = true
    } else {
      this.validReversement = false
      etat = false
    }
    return etat;
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
  get f() { return this.form.controls }
}
