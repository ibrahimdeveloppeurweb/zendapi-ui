
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmitterService } from '@service/emitter/emitter.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { FolderService } from '@service/folder/folder.service';
import { MutateService } from '@service/mutate/mutate.service';
import { HouseService } from '@service/house/house.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeService } from '@service/home/home.service';
import { LotService } from '@service/lot/lot.service';
import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import { Customer } from '@model/customer';
import { ToastrService } from 'ngx-toastr';
import { Mutate } from '@model/mutate';
import { Folder } from '@model/folder';
import { House } from '@model/house';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-mutate-add',
  templateUrl: './mutate-add.component.html',
  styleUrls: ['./mutate-add.component.scss']
})
export class MutateAddComponent implements OnInit {
  required = Globals.required
  submit: boolean = false
  folders: Folder[] = []
  edit: boolean = false
  customers: Customer[]
  houses: House[] = []
  mutate: Mutate
  title: string = ""
  folder: Folder
  form: FormGroup
  customer: Customer
  house: House;
  totalRemise: number = 0;
  totalHt: number = 0;
  totalTtc: number = 0;
  totalTva: number = 0;
  total: number = 0;
  customerSelected: any

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private folderService: FolderService,
    private houseService: HouseService,
    private lotService: LotService,
    private homeService: HomeService,
    public mutateService: MutateService,
    private emitter: EmitterService,
    public toastr: ToastrService,
  ){
    this.edit = this.mutateService.edit;
    this.mutate = this.mutateService.getMutate();
    this.title = !this.edit ? 'Ajouter un nouvelle mutation' : 'Modifier la mutation du dossier '+this.mutate?.folder?.code ;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      customer: [null, [Validators.required]],
      folder: [null, [Validators.required]],
      montant: [0, [Validators.required]],
      montantHt: [0, [Validators.required]],
      montantTva: [0, [Validators.required]],
      remise: [0, [Validators.required]],
      montantBien: [0,[Validators.required]],
      optionHouses: this.formBuild.array(this.itemHouse()),
      optionFolders: this.formBuild.array(this.itemOption()),
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.mutateService.getMutate() }
      this.setCustomerUuid(data?.folder?.customer?.uuid);
      this.folder = data?.folder
      this.customerSelected = {
        photoSrc: data?.folder?.customer?.photoSrc,
        title: data?.folder?.customer?.searchableTitle,
        detail: data?.folder?.customer?.searchableDetail
      };
      data?.folder?.options.forEach((item) => {
        this.options.push(
          this.formBuild.group({
            uuid: [{value: item.uuid, disabled: true}],
            id: [{value: item.id, disabled: true}],
            libelle: [{value: item.libelle, disabled: true}, [Validators.required]],
            prix: [{value: item.prix, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [{value: item.qte, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [{value: item.tva, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [{value: item.remise, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [{value: item.total, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
          }));
      });
      data?.options.forEach((item) => {

        this.optionHouses.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            houseUuid: [{value: item?.old?.uuid, disabled: true}],
            house: [{value: item?.old?.searchableDetail, disabled: true}],
            label: [{value: item.new?.searchableTitle, disabled: false}],
            newHouse: [item.new?.uuid, [Validators.required]],
            prix: [item?.prix, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            tva: [item?.tva, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [item?.remise, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [item?.total, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        );
      });
      this.form.patchValue(data)
      this.f.folder.setValue(data?.folder?.uuid)
      this.onCalcul()
    }
  }
  itemOption(): FormGroup[] {
    const arr: any[] = [];
    if (!this.edit) {
      this.folder?.options.forEach(el => {
        arr.push(
          this.formBuild.group({
            uuid: [el?.uuid],
            id: [el?.id],
            libelle: [{value: el?.libelle, disabled: true}, [Validators.required]],
            prix: [{value: el?.prix, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            qte: [{value: el?.qte, disabled: true}, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [{value: el?.tva, disabled: true}, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [{value: el?.remise, disabled: true}, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [{value: el?.total, disabled: true}, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        )
      });
    }
    return arr
  }
  itemHouse(): FormGroup[] {
    const arr: any[] = [];
    if (!this.edit) {
      this.folder?.houses.forEach(el => {
        var houseUuid = this.folder.motif === "PROPRIETAIRE" ? el?.house?.uuid : this.folder.motif === "LOT" ? el?.lot?.uuid : el?.home?.uuid
        arr.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            houseUuid: [houseUuid],
            house: [{value: el?.libelle, disabled: true}],
            label: [{value: null, disabled: true}],
            newHouse: [null],
            prix: [el?.prix, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            tva: [el?.tva, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            remise: [el?.remise, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            total: [el?.total, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]]
          })
        )
      });
    }
    return arr
  }
  setLotUuid(uuid, row) {
    if(uuid) {
      row.controls.newHouse.setValue(uuid);
      this.lotService.getSingle(uuid).subscribe(res => {
        if(res?.uuid){
          row.controls.prix.setValue(res?.montant);
          this.onChangeTotalOption(row)
        }
      }, error => {})
    } else {
      row.controls.prix.setValue(0);
      this.onChangeTotalOption(row)
    }
  }
  setHouseUuid(uuid, row) {
    if(uuid) {
      row.controls.newHouse.setValue(uuid);
      this.houseService.getSingle(uuid).subscribe(res => {
        if(res?.uuid){
          if(res?.mandate){
            row.controls.prix.setValue(res?.mandate?.valeur);
            this.onChangeTotalOption(row)
          } else {
            row.controls.house.setValue(null);
            row.controls.prix.setValue(0);
            this.toast("Ce bien ne fait l'objet d'aucun mandat de gestion le concernant.", "Bien sans mandat", "warning")
          }
        }
      }, error => {})
    } else {
      row.controls.prix.setValue(0);
      this.onChangeTotalOption(row)
    }
  }
  setHomeUuid(uuid, row) {
    if(uuid) {
      row.controls.newHouse.setValue(uuid);
      this.homeService.getSingle(uuid).subscribe(res => {
        if(res?.uuid){
          row.controls.prix.setValue(res?.montant);
          this.onChangeTotalOption(row)
        }
      }, error => {})
    } else {
      row.controls.prix.setValue(0);
      this.onChangeTotalOption(row)
    }
  }
  setCustomerUuid(uuid) {
    if (uuid) {
      this.f.customer.setValue(uuid);
      if (!this.edit) {
        this.loadFolders(uuid)
      }
    } else { this.customer = null }
  }
  loadFolders(uuid) {
    if(uuid) {
      this.folderService.getList(uuid, 'VALIDE').subscribe(res => {
        this.folders = res
      }, error => {})
    }
  }
  setFolder(value){
    if(!this.edit) {
      this.folder = this.folders.find(item => {
        if (item.uuid === value) {
          this.f.folder.setValue(value);
          return item;
        }
      });
    }
    this.options.controls = this.itemOption()
    this.optionHouses.controls = this.itemHouse()
    this.f.folder.setValue(value);
    this.onCalcul();
  }
  onCalcul() {
    let totalOptionRemise = 0;
    let totalOptionHT = 0;
    let totalOptionTVA = 0;
    let totalOptionTTC = 0;
    let totalBien = 0;
    this.options.controls.forEach(elem => {
      totalOptionRemise += elem.value.remise >= 0 ? elem.value.remise : 0;
      totalOptionHT += (elem.value.qte >= 1 && (elem.value.remise <= (elem.value.prix * elem.value.qte))) ? (elem.value.prix * elem.value.qte) - elem.value.remise : 0;
      totalOptionTVA += elem.value.tva >= 0 ? ((elem.value.prix * elem.value.qte) - elem.value.remise) * (elem.value.tva / 100) : 0;
      totalOptionTTC += elem.get('total').value;
    });
    this.optionHouses.controls.forEach(elem => {
      totalOptionRemise += elem.value.remise >= 0 ? elem.value.remise : 0;
      totalOptionHT += (elem.value.remise <= (elem.value.prix)) ? (elem.value.prix) - elem.value.remise : 0;
      totalOptionTVA += elem.value.tva >= 0 ? ((elem.value.prix) - elem.value.remise) * (elem.value.tva / 100) : 0;
      totalOptionTTC += elem.value.total;
      totalBien += elem.value.total;
    });
    this.totalRemise = totalOptionRemise > 0 ? totalOptionRemise : 0;
    this.totalHt = totalOptionHT >= 0 ? totalOptionHT : 0;
    this.totalTva = totalOptionTVA >= 0 ? totalOptionTVA : 0;
    this.totalTtc = (totalOptionTTC >= 0 && this.folder?.montantFrais >= 0) ? totalOptionTTC + this.folder?.montantFrais : 0;
    this.f.montant.setValue(this.totalTtc);
    this.f.montantHt.setValue(this.totalHt);
    this.f.montantTva.setValue(this.totalTva);
    this.f.remise.setValue(this.totalRemise);
    this.f.montantBien.setValue(totalBien);
  }
  onChangeTotal() {
    this.onCalcul()
  }
  onChangeTotalOption(row) {
    var remise = row.value.remise >= 0 ? row.value.remise : 0;
    var totalHT = row.value.remise <= (row.value.prix) ? (row.value.prix) - remise : 0;
    var totalTva = row.value.tva >= 0 ? totalHT * (row.value.tva / 100) : 0;
    var total = totalHT + totalTva;
    if(row.value.prix >= 0 && total >= 0){
      row.controls.total.setValue(total);
      this.onChangeTotal()
    } else {
      row.controls.total.setValue(0);
      this.onChangeTotal()
    }
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const mutate = this.form.getRawValue();
      this.mutateService.add(mutate).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'MUTATE_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'MUTATE_ADD', payload: res?.data});
          }
        }
      }, error => {
      });
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
  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }
  get f() { return this.form.controls; }
  get options() { return this.form.get('optionFolders') as FormArray; }
  get optionHouses() { return this.form.get('optionHouses') as FormArray; }
}
