import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OwnerCo } from '@model/owner-co';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { OwnerService } from '@service/owner/owner.service';
import { OwnerCoService } from '@service/owner-co/owner-co.service';
import { FundsPaymentService } from '@service/syndic/funds-payment.service';
import { FundsapealService } from '@service/syndic/fundsapeal.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { TreasuryService } from '@service/treasury/treasury.service';
import { Globals } from '@theme/utils/globals';


@Component({
  selector: 'app-funds-payment-add',
  templateUrl: './funds-payment-add.component.html',
  styleUrls: ['./funds-payment-add.component.scss']
})
export class FundsPaymentAddComponent implements OnInit {


  form: FormGroup
  edit: boolean
  title: string = ''
  currentSyndic: any
  fundsPayment: any
  fundsApeals: any[] = []
  fundsApealsImpayer: any[] = []
  fundsApeal: any
  fundsApealValue: boolean = false
  ownercos: OwnerCo[] =[]
  submit: boolean = false
  currentTreasury: any
  dtOptions: any = {}
  moyens = [
    {label: 'Espèces', value: 'ESPECES'},
    {label: 'Virement', value: 'VIREMENT'},
    {label: 'Chèque', value: 'CHEQUE'},
    {label: 'Autre', value: 'AUTRE'},
  ]
  reste: number = 0
  payer: number = 0
  totalPayer: number = 0
  totalImpayer: number = 0
  totalMontant: number = 0
  montantTotal: number = 0
  payerMontant: number = 0
  montantTotalApayer: number = 0

  treasuryList: any[] =[]
  syndicUuid: any;
  selectedOwner: any;
  selectedFundsApeals: any;

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private syndicService: SyndicService,
    public ownerCoService: OwnerCoService,
    private fundsApealsService: FundsapealService,
    private fundsPaymentService: FundsPaymentService,
    private treasuryService: TreasuryService
  ) {
    this.edit = this.fundsPaymentService.edit
    this.fundsPayment = this.fundsPaymentService.getFundsPayment()
    const code = this.fundsPayment ? this.fundsPayment?.code : null
    this.title = (!this.edit) ? 'Ajouter un nouveau règlement' : 'Modifier le règlement ' + code;
    this.newForm()
    let uuid = this.fundsPaymentService.fundsApeal
    let fundsApeal = this.fundsPaymentService.fundsApeal
    if(fundsApeal && fundsApeal.uuid !== null && fundsApeal.uuid !== '') {
      this.f.fundsApeal.setValue(fundsApeal.uuid)
      this.f.owner.setValue(fundsApeal.ownerCo.uuid)
      this.selectedOwner = fundsApeal.ownerCo.uuid;
      this.selectedFundsApeals = fundsApeal.uuid;
      this.onChange(fundsApeal.ownerCo.uuid)
      this.onChangeFundsApeal(fundsApeal.uuid);
    
    }
    if(this.fundsPaymentService.type === 'SYNDIC'){
      this.syndicUuid = this.fundsPaymentService.uuidSyndic;
      this.syndicService.getSingle(this.syndicUuid).subscribe((res: any) => {
        this.currentSyndic = {
          title: res.searchableTitle ? res.searchableTitle : null,
          detail: res.searchableDetail ? res.searchableDetail : null,
        }
        this.f.syndic.setValue(res.uuid)
        this.getownerSyndic(res.uuid)
      })
      this.getTreasuryList(this.syndicUuid);
    }
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      syndic: [null, [Validators.required]],
      owner: [null, [Validators.required]],
      fundsApeal: [null, [Validators.required]],
      treasury: [null, [Validators.required]],
      numOperation: [null],
      moyen: ['ESPECE', [Validators.required]],
      moyenAutre: [null],
      banque: [null],
      numero: [null],
      folderUuid: [null],
      date: [null, [Validators.required]],
      montant: [0, [Validators.required]],
      files: this.formBuild.array([]),
      folders: this.formBuild.array([]),
      impayes: this.formBuild.array([]),
    })
    this.form.get('moyen').valueChanges.subscribe(res => {
      this.form.get('banque').setValue('');
      this.form.get('numero').setValue('');
      if (res === 'VIREMENT' || res === 'CHEQUE') {
        this.form.get('banque').setValidators(Validators.required);
        this.form.get('numero').setValidators(Validators.required);
      } else {
        this.form.get('banque').clearValidators();
        this.form.get('numero').clearValidators();
      }
      this.form.get('banque').updateValueAndValidity();
      this.form.get('numero').updateValueAndValidity();
    })
    this.form.get('moyen').valueChanges.subscribe(res => {
      this.form.get('moyenAutre').setValue('');
      if (res === 'AUTRE') {
        this.form.get('moyenAutre').setValidators(Validators.required);
      } else {
        this.form.get('moyenAutre').clearValidators();
      }
      this.form.get('moyenAutre').updateValueAndValidity();
    })
  }

  editForm(){
    if (this.edit) {
      const data = { ...this.fundsPaymentService.getFundsPayment() };
      this.form.patchValue(data);
      this.f.folderUuid.setValue(data?.folder?.uuid);
    }
  }

  setSyndicUuid(uuid){
    if(uuid){
      this.f.syndic.setValue(uuid)
    }else{
      this.f.syndic.setValue(null)
    }
  }

  getownerSyndic(uuid){
    this.ownerCoService.getList(null, uuid).subscribe((res :any) => {
      if(res){
        return this.ownercos = res
      }
    })
  }

  getTreasuryList(uuid){
    this.treasuryService.getList(uuid).subscribe((res :any) => {
      if(res){
        return this.treasuryList = res
      }
    })
  }

  onChange(uuid){
    this.fundsApealValue = false
    this.f.fundsApeal.reset()
    this.fundsApealsService.getList(null, uuid).subscribe((res: any) => {
      if(res){
        let apeals = res;
        console.log("sssss", res);
        
        //apeals.sort((a,b) => a.id - b.id)
        let datasImpayer: any[] = []
        let datasReste: any[] = []
        let dataMontant: number = 0
        let dataMontantReste: number = 0
        let dataMontantPayer: number = 0
        let dataCours: number = 0
        apeals.forEach((item: any) => {
          if(item?.etat === 'IMPAYER' || item?.etat === 'EN COURS'){
            datasReste.push(item)
            dataCours += item?.reste
            datasImpayer.push(item)

            dataMontant += item?.montant
            dataMontantReste += item?.reste
            dataMontantPayer += item?.payer
          }
          if(item?.etat === 'IMPAYER'){
            datasImpayer.push(item)
          }
        })
        //this.getImpayes(datasImpayer)
        this.fundsApeals = datasReste
        console.log("dddd",  datasReste);
        
        this.fundsApealsImpayer = datasImpayer

        this.totalPayer = dataMontantPayer
        this.totalImpayer = dataMontantReste
        this.totalMontant = dataMontant
        this.montantTotal = this.totalImpayer + dataCours
      }
    })
  }

  onChangeFundsApeal(uuid){
    if(uuid){
      this.fundsApealsService.getSingle(uuid).subscribe((res: any) => {
        if(res){
          this.fundsApealValue = true
          this.payer = res?.payer
          this.reste = res?.reste
          return this.fundsApeal = res
        }
      })
    }
  }

  onChangeTreasury(uuid){
    if(uuid){
      this.f.treasury.setValue(uuid)
    }
  }

  getImpayes(data?: any) {
    data.forEach(element => {
    return this.impayes.push(
      this.formBuild.group({
        uuid: [element.uuid],
        libelle: [element.libelle],
        periode: [element.periode],
        etat: [element.etat],
        montantApayer: [0],
        montant: [element.montant],
        reste: [element.reste],
        payer: [element.payer],
        createdAt: [element.payer]
      })
    )
    })
  }

  getTotal(){
  }

  setTreasuryUuid(uuid){
    if(uuid){
      this.f.treasury.setValue(uuid)
    }else {
      this.f.treasury.setValue(uuid)
    }
  }

  onModelChange(montant: number){
      this.payerMontant = montant
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

  onSubmit() {
    this.submit = true
    if (this.form.valid) {
      const data = this.form.getRawValue()
      this.fundsPaymentService.add(data).subscribe((res: any) => {
        if (res?.status === 'success') {
          this.modal.close('PROVISION');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'PROVISION_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'PROVISION_ADD', payload: res?.data });
          }
        }
        this.emitter.stopLoading();
      })
    }
  }

  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
  get impayes() { return this.form.get('impayes') as FormArray; }

}
