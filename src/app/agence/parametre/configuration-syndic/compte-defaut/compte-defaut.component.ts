import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompteDefautService } from '@service/configuration/compte-defaut.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-compte-defaut',
  templateUrl: './compte-defaut.component.html',
  styleUrls: ['./compte-defaut.component.scss']
})
export class CompteDefautComponent implements OnInit {

  form: FormGroup;
  dtOptions: any = {};
  submit = false
  currentSyndic: any
  currentFournisseur: any
  currentSalarie: any
  currentProduitVendu: any
  currentProduitVenduExport: any
  currentProduitAchete: any
  currentProduitAcheteImport: any
  currentServiceVendu: any
  currentServiceVenduExport: any
  currentServiceAchat: any
  currentServiceAcheteImport: any
  currentTvaSurAchat: any
  currentTvaSurVente: any
  currentPaiementTva: any
  currentVirementInterne: any
  currentComptabilisationDon: any
  currentCapital: any
  currentInteret: any
  currentAssurance: any
  currentOperation: any

  defaultClientAccount: any
  defaultProviderAccount: any
  defaultTiersAccount: any
  
  userSession = Globals.user

  constructor(
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private compteDefautService: CompteDefautService
  ) {
    this.compteDefautService.getList(this.userSession.agencyKey).subscribe((res) => {
      console.log(res)
      if (res) {
        this.setDefaultAccounts(res)
      }
    })
    this.newForm()
   }

  ngOnInit(): void {
  }

  setDefaultAccounts(accounts) {
    if (accounts && accounts.length > 0) {
      accounts.forEach((account: any) => {
        if(account.accountValue === 'SYNDIC'){
          if (account.account) {
            this.currentSyndic = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'FOURNISSEUR'){
          if (account.account) {
            this.currentFournisseur = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'SALARIE'){
          if (account.account) {
            this.currentSalarie = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'PRODUIT_VENDU'){
          if (account.account) {
            this.currentProduitVendu = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'PRODUIT_VENDU_EXPORTE'){
          if (account.account) {
            this.currentProduitVenduExport = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'PRODUIT_ACHETE'){
          if (account.account) {
            this.currentProduitAchete = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'PRODUIT_ACHETE_IMPORTE'){
          if (account.account) {
            this.currentProduitAcheteImport = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'SERVICE_VENDU'){
          if (account.account) {
            this.currentServiceVendu = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'SERVICE_VENDU_EXPORTE'){
          if (account.account) {
            this.currentServiceVenduExport = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'SERVICE_ACHETE'){
          if (account.account) {
            this.currentServiceAchat = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'SERVICE_ACHETE_IMPORTE'){
          if (account.account) {
            this.currentServiceAcheteImport = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'TVA_ACHAT'){
          if (account.account) {
            this.currentTvaSurAchat = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'TVA_VENTE'){
          if (account.account) {
            this.currentTvaSurVente = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'PAIEMENT_TVA'){
          if (account.account) {
            this.currentPaiementTva = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'VIREMENT_INTERNE'){
          if (account.account) {
            this.currentVirementInterne = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'DONS'){
          if (account.account) {
            this.currentComptabilisationDon = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'CAPITAL'){
          if (account.account) {
            this.currentCapital = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'INTERET'){
          if (account.account) {
            this.currentInteret = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'ASSURANCE'){
          if (account.account) {
            this.currentAssurance = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
        if(account.accountValue === 'OPERATION_ATTENTE'){
          if (account.account) {
            this.currentOperation = {
              title: account.searchableTitle,
              detail: account.account.searchableTitle
            }
          }
        }
      })
    }
  }

  newForm(){
    this.form = this.formBuild.group({
      syndics: [null],
      fournisseurs: [null],
      salaries: [null],
      produitVendus: [null],
      produitVenduExport: [null],
      produitAchete: [null],
      produitAcheteImport: [null],
      serviceVendu: [null],
      serviceVenduExport: [null],
      serviceAchete: [null],
      serviceAcheteImport: [null],
      tvaSurAchat: [null],
      tvaSurVente: [null],
      paiementTva: [null],
      virementInterne: [null],
      comptablisationDon: [null],
      capital: [null],
      interet: [null],
      assurance: [null],
      operations: [null],
    })
  }

  setDefaultAccount(uuid, concern) {
    if (uuid && concern === 'CLIENT') {
      this.f.syndics.setValue(uuid)
    } else {
      this.f.syndics.setValue(null)
    }
    
    if (uuid && concern === 'FOURNISSEUR') {
      this.f.fournisseurs.setValue(uuid)
    } else {
      this.f.fournisseurs.setValue(null)
    }
    
    if (uuid && concern === 'TIERS') {
      this.f.salaries.setValue(uuid)
    } else {
      this.f.salaries.setValue(null)
    }
  }

  setSyndicUuid(uuid){
    if(uuid){
      this.f.syndics.setValue(uuid)
    }else{
      this.f.syndics.setValue(null)
    }
  }
  setcurrentFournisseur(uuid){
    if(uuid){
      this.f.fournisseurs.setValue(uuid)
    }else{
      this.f.fournisseurs.setValue(null)
    }
  }
  setcurrentSalarie(uuid){
    if(uuid){
      this.f.salaries.setValue(uuid)
    }else{
      this.f.salaries.setValue(null)
    }
  }
  setcurrentProduitVendu(uuid){
    if(uuid){
      this.f.produitVendus.setValue(uuid)
    }else{
      this.f.produitVendus.setValue(null)
    }
  }
  setcurrentProduitVenduExport(uuid){
    if(uuid){
      this.f.produitVenduExport.setValue(uuid)
    }else{
      this.f.produitVenduExport.setValue(null)
    }
  }
  setcurrentProduitAchete(uuid){
    if(uuid){
      this.f.produitAchete.setValue(uuid)
    }else{
      this.f.produitAchete.setValue(null)
    }
  }
  setcurrentProduitAcheteImport(uuid){
    if(uuid){
      this.f.produitAcheteImport.setValue(uuid)
    }else{
      this.f.produitAcheteImport.setValue(null)
    }
  }
  setcurrentServiceVendu(uuid){
    if(uuid){
      this.f.serviceVendu.setValue(uuid)
    }else{
      this.f.serviceVendu.setValue(null)
    }
  }
  setcurrentServiceVenduExport(uuid){
    if(uuid){
      this.f.serviceVenduExport.setValue(uuid)
    }else{
      this.f.serviceVenduExport.setValue(null)
    }
  }
  setcurrentServiceAchat(uuid){
    if(uuid){
      this.f.serviceAchete.setValue(uuid)
    }else{
      this.f.serviceAchete.setValue(null)
    }
  }
  setcurrentServiceAcheteImport(uuid){
    if(uuid){
      this.f.serviceAcheteImport.setValue(uuid)
    }else{
      this.f.serviceAcheteImport.setValue(null)
    }
  }
  setcurrentTvaSurAchat(uuid){
    if(uuid){
      this.f.tvaSurAchat.setValue(uuid)
    }else{
      this.f.tvaSurAchat.setValue(null)
    }
  }
  setcurrentTvaSurVente(uuid){
    if(uuid){
      this.f.tvaSurVente.setValue(uuid)
    }else{
      this.f.tvaSurVente.setValue(null)
    }
  }
  setcurrentPaiementTva(uuid){
    if(uuid){
      this.f.paiementTva.setValue(uuid)
    }else{
      this.f.paiementTva.setValue(null)
    }
  }
  setcurrentVirementInterne(uuid){
    if(uuid){
      this.f.virementInterne.setValue(uuid)
    }else{
      this.f.virementInterne.setValue(null)
    }
  }
  setcurrentComptabilisationDon(uuid){
    if(uuid){
      this.f.comptablisationDon.setValue(uuid)
    }else{
      this.f.comptablisationDon.setValue(null)
    }
  }
  setcurrentCapital(uuid){
    if(uuid){
      this.f.capital.setValue(uuid)
    }else{
      this.f.capital.setValue(null)
    }
  }
  setcurrentInteret(uuid){
    if(uuid){
      this.f.interet.setValue(uuid)
    }else{
      this.f.interet.setValue(null)
    }
  }
  setcurrentAssurance(uuid){
    if(uuid){
      this.f.assurance.setValue(uuid)
    }else{
      this.f.assurance.setValue(null)
    }
  }
  setcurrentOperation(uuid){
    if(uuid){
      this.f.operations.setValue(uuid)
    }else{
      this.f.operations.setValue(null)
    }
  }

  onSubmit(){
    this.submit = true
    if(this.form.valid){
      const data = this.form.getRawValue()
      console.log('data', data)
      this.compteDefautService.add(data).subscribe((res: any) => {
        if (res?.status === 'success') {
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'COMPTE_DEFAUT_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'COMPTE_DEFAUT_ADD', payload: res?.data});
          }
        }
        this.emitter.stopLoading();
      })
    }
  }

  get f(): any { return this.form.controls; }


}
