import { Globals } from '@theme/utils/globals';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Folder } from '@model/folder';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FolderService } from '@service/folder/folder.service';
import { Customer } from '@model/customer';
import { CustomerService } from '@service/customer/customer.service';
import { HouseService } from '@service/house/house.service';
import { HomeService } from '@service/home/home.service';
import { IsletService } from '@service/islet/islet.service';
import { LotService } from '@service/lot/lot.service';
import { House } from '@model/house';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '@model/user';
import { UserService } from '@service/user/user.service';
import { UploaderService } from '@service/uploader/uploader.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Promotion } from '@model/promotion';
import { PromotionService } from '@service/promotion/promotion.service';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { Home } from '@model/home';

@Component({
  selector: 'app-folder-add',
  templateUrl: './folder-add.component.html',
  styleUrls: ['./folder-add.component.scss']
})
export class FolderAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title: string = ""
  edit: boolean = false
  folder: Folder
  houses: House[] = []
  homes: Home[] = []
  lots: any[] = []
  promotions: Promotion[] = [];
  lotissements: any[] = [];
  sousPromotions: Promotion[] = [];
  ilots: any[] = [];
  motifRow = [
    { label: "Acquisition auprès d'un propriétaire", value: 'PROPRIETAIRE' },
    { label: 'Projet de lotissement', value: 'LOT' },
    { label: 'Promotion immobilière', value: 'MAISON' },
  ]
  advanceRow = [
    { label: "Réservation", prc: 10 },
    { label: 'Fin de modalité', prc: 10 },
    { label: 'Gros oeuvre', prc: 40 },
    { label: 'Finition', prc: 30 },
    { label: 'Reception définitive', prc: 10 },
  ];
  booleanRow = [
    { label: 'NON', value: false },
    { label: 'OUI', value: true }
  ];
  form: FormGroup
  submit: boolean = false
  customers: Customer[]
  customer: Customer
  house: House;
  nbrMois: number = 0
  required = Globals.required
  totalRemise: number = 0;
  totalHt: number = 0;
  totalTtc: number = 0;
  totalTva: number = 0;
  total: number = 0;
  users: User[];
  customerSelected: any
  houseSelected: any
  homeSelected: any
  selectedIlot: any
  selectedLotissement: any
  lotSelected: any
  selectedPromotion: any
  selectedSousPromotion: any

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    public uploadService: UploaderService,
    private folderService: FolderService,
    private customerService: CustomerService,
    private houseService: HouseService,
    private lotService: LotService,
    private ilotService: IsletService,
    private homeService: HomeService,
    public userService: UserService,
    private emitter: EmitterService,
    public toastr: ToastrService,
    public promotionService: PromotionService,
    public subdivisionService: SubdivisionService
  ) {
    this.edit = this.folderService.edit;
    this.folder = this.folderService.getFolder();
    this.newForm();
    if (this.edit && this.folder.motif == "MAISON") {
      this.promotionService.getList().subscribe((res) => {
        this.promotions = res;
      })
    }
    if (this.edit && this.folder.motif == "LOT") {
      this.subdivisionService.getList().subscribe((res) => {
        this.lotissements = res;
      })
    }
    this.userService.getList('COMMERCIAL', null).subscribe(res => { this.users = res ? res : []; }, error => { });
  }

  ngOnInit(): void {
    this.editForm();
    this.title = !this.edit ? 'Ajouter un nouveau dossier' : 'Modifier le dossier du client ' + this.folder?.customer?.nom;
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      customer: [null, [Validators.required]],
      date: [null, [Validators.required]],
      motif: [{ value: 'PROPRIETAIRE', disabled: this.edit ? true : false }, [Validators.required]],
      charge: [null],
      folderUuid: [null],
      isSigned: [false, [Validators.required]],
      modalite: ['COMPTANT', [Validators.required]],
      montantFrais: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
      nbrMois: [0, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal)]],
      montantHt: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal)]],
      montantTva: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal)]],
      remise: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal)]],
      montantBien: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal)]],
      montantAvance: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
      optionHouses: this.formBuild.array(this.itemHouse()),
      optionFolders: this.formBuild.array(this.itemOption()),
      echeanceFolders: this.formBuild.array([]),
      avanceFolders: this.formBuild.array([]),
      folders: this.formBuild.array([]),
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.folderService.getFolder() }
      this.setCustomerUuid(data.customer?.uuid);
      this.customerSelected = {
        photoSrc: data.customer?.photoSrc,
        title: data.customer?.searchableTitle,
        detail: data.customer?.searchableDetail
      };
      data.charge = data?.charge?.uuid;
      data.customer = data?.customer?.uuid;
      data.date = DateHelperService.fromJsonDate(data?.date);
      data?.options.forEach((item) => {
        this.options.push(
          this.formBuild.group({
            uuid: [item.uuid],
            id: [item.id],
            libelle: [item.libelle, [Validators.required]],
            prix: [item.prix, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
            qte: [item.qte, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [item.tva, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
            remise: [item.remise, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
            total: [item.total, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
          }));
      });
      data?.houses.forEach((item) => {
        var house = null;
        var label = null;
        if (data.motif === 'PROPRIETAIRE') {
          house = item.house?.uuid
          label = item.house?.searchableDetail
        } else if (data.motif === 'LOT') {
          house = item.lot?.uuid
          label = item.lot?.searchableDetail
        } else if (data.motif === 'MAISON') {
          house = item.home?.uuid
          label = item.home?.searchableDetail
        }
        this.optionHouses.push(
          this.formBuild.group({
            uuid: [item.uuid],
            id: [item.id],
            house: [house, [Validators.required]],
            label: [{ value: label, disabled: true }],
            prix: [item.prix, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
            qte: [item.qte, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [item.tva, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
            remise: [item.remise, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
            total: [item.total, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
          })
        );
      });
      data?.echeances.forEach((item) => {
        this.echeanceFolders.push(
          this.formBuild.group({
            uuid: [item?.uuid],
            id: [item?.id],
            date: [DateHelperService.fromJsonDate(item?.date), [Validators.required]],
            montant: [item?.montant, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
            description: [item?.description],
          })
        );
      });
      data?.advances.forEach((item) => {
        this.avanceFolders.push(
          this.formBuild.group({
            uuid: [item?.uuid],
            id: [item?.id],
            libelle: [{ value: item?.libelle, disabled: true }, [Validators.required]],
            prc: [{ value: item?.prc, disabled: false }, [Validators.required]],
            montant: [{ value: item?.montant, disabled: true }, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
          })
        );
      });
      this.form.patchValue(data)
      this.f.folderUuid.setValue(data?.folder?.uuid)
      this.onCalcul()
    }
  }
  itemOption(): FormGroup[] {
    const arr: any[] = [];
    if (!this.edit) {
      for (let i = 1; i <= 3; i++) {
        var label = ""
        if (i === 1) { var label = "Frais de cession" } else if (i === 2) {
          var label = "Frais de dossier technique"
        } else if (i === 3) { var label = "Frais de compulsoire" }
        arr.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            libelle: [{ value: label, disabled: true }, [Validators.required]],
            prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
            qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
            tva: [0, [Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
            remise: [0, [Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
            total: [0, [Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]]
          })
        )
      }
    }
    return arr
  }
  itemHouse(): FormGroup[] {
    const arr: any[] = [];
    if (!this.edit) {
      arr.push(
        this.formBuild.group({
          uuid: [null],
          id: [null],
          house: [null, [Validators.required]],
          label: [{ value: null, disabled: true }],
          prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
          qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
          tva: [0, [Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
          remise: [0, [Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
          total: [0, [Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]]
        })
      )
    }
    return arr
  }
  setCustomerUuid(uuid) {
    if (uuid) {
      this.f.customer.setValue(uuid);
      this.loadCustomer(uuid)
    } else { this.customer = null }
  }
  setHouseUuid(uuid, row) {
    if (uuid) {
      row.controls.house.setValue(uuid);
      this.houseService.getSingle(uuid).subscribe(res => {
        if (res?.uuid) {
          if (res?.mandate) {
            row.controls.prix.setValue(res?.mandate?.valeur);
            this.onChangeTotalOption(row)
          } else {
            row.controls.house.setValue(null);
            row.controls.prix.setValue(0);
            this.toast("Ce bien ne fait l'objet d'aucun mandat de gestion le concernant.", "Bien sans mandat", "warning")
          }
        }
      }, error => { })
    } else {
      row.controls.prix.setValue(0);
      this.onChangeTotalOption(row)
    }
  }
  setLotUuid(item, row) {
    if (item) {
      var uuid = item.uuid;
      row.controls.house.setValue(uuid);
      this.lotService.getSingle(uuid).subscribe((res:any) => {
        if (res?.data) {
          row.controls.prix.setValue(res?.data?.montant);
          this.onChangeTotalOption(row)
        }
      }, error => { })
    } else {
      row.controls.prix.setValue(0);
      this.onChangeTotalOption(row)
    }
  }
  setHomeUuid(item, row) {
    if (item) {
      var uuid = item.uuid;
      row.controls.house.setValue(uuid);
      this.homeService.getSingle(uuid).subscribe(res => {
        if (res) {
          row.controls.prix.setValue(res?.montant);
          this.onChangeTotalOption(row)
        }
      }, error => { })
    } else {
      row.controls.prix.setValue(0);
      this.onChangeTotalOption(row)
    }
  }
  loadCustomer(uuid) {
    if (uuid) {
      this.customerService.getSingle(uuid).subscribe(res => {
        this.customer = res;
      }, error => { })
    }
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
      totalOptionTTC += elem.value.total;
    });
    this.optionHouses.controls.forEach(elem => {
      totalOptionRemise += elem.value.remise >= 0 ? elem.value.remise : 0;
      totalOptionHT += (elem.value.qte >= 1 && (elem.value.remise <= (elem.value.prix * elem.value.qte))) ? (elem.value.prix * elem.value.qte) - elem.value.remise : 0;
      totalOptionTVA += elem.value.tva >= 0 ? ((elem.value.prix * elem.value.qte) - elem.value.remise) * (elem.value.tva / 100) : 0;
      totalOptionTTC += elem.value.total;
      totalBien += elem.value.total;
    });
    this.totalRemise = totalOptionRemise > 0 ? totalOptionRemise : 0;
    this.totalHt = totalOptionHT >= 0 ? totalOptionHT : 0;
    this.totalTva = totalOptionTVA >= 0 ? totalOptionTVA : 0;
    this.totalTtc = (totalOptionTTC >= 0 && this.f.montantFrais.value >= 0) ? totalOptionTTC + this.f.montantFrais.value : 0;
    this.f.montant.setValue(this.totalTtc);
    this.f.montantHt.setValue(this.totalHt);
    this.f.montantTva.setValue(this.totalTva);
    this.f.remise.setValue(this.totalRemise);
    this.f.montantBien.setValue(totalBien);
  }
  onChangeTotal() {
    if (this.f.montantAvance.value > this.f.montant.value) {
      this.toast(
        "Le montant d'avance ne peut être supérieur au montant total.",
        'Attention !',
        'warning'
      );
      this.f.montantAvance.setValue(0);
      return
    }
    this.onCalcul()
    if (this.f.modalite.value === 'ECHEANCE') {
      this.addEcheanceFolder()
      this.avanceFolders.controls.length = 0;
    }
    if (this.f.modalite.value === 'AVANCEMENT') {
      this.f.nbrMois.setValue(0)
      this.echeanceFolders.controls.length = 0;
      this.addAvanceFolder()
    }
  }
  onChangeTotalOption(row) {
    var remise = row.value.remise >= 0 ? row.value.remise : 0;
    var totalHT = (row.value.qte >= 1 && (row.value.remise <= (row.value.prix * row.value.qte))) ? (row.value.prix * row.value.qte) - remise : 0;
    var totalTva = row.value.tva >= 0 ? totalHT * (row.value.tva / 100) : 0;
    var total = totalHT + totalTva;
    if (row.value.prix >= 0 && total >= 0) {
      row.controls.total.setValue(total);
      this.onChangeTotal()
    } else {
      row.controls.total.setValue(0);
      this.onChangeTotal()
    }
  }
  onChangeModalite() {
    if (this.form.value.modalite === 'COMPTANT') {
      this.f.nbrMois.setValue(0)
      this.echeanceFolders.controls.length = 0;
      this.avanceFolders.controls.length = 0;
    }
    this.onChangeTotal()
  }
  onChangeMotif(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue == "MAISON") {
      this.promotions = [];
      this.promotionService.getList().subscribe((res) => {
        this.promotions = res;
      })
    }
    if (selectedValue == "LOT") {
      this.lotissements = [];
      this.subdivisionService.getList().subscribe((res) => {
        this.lotissements = res;
      })
    }
  }
  onChangePromotion(event: any) {
    const selectedValue = event.uuid;
    this.promotionService.getList(selectedValue).subscribe((res) => {
      this.sousPromotions = [];
      this.sousPromotions = res;
    })
    this.homeService.getList(selectedValue).subscribe((res) => {
      this.homes = [];
      this.homes = res;
    })
  }
  onChangeLotissement(event: any) {
    const selectedValue = event.uuid;
    this.ilotService.getList(selectedValue).subscribe((res) => {
      this.ilots = [];
      this.ilots = res;
    })
  }
  onChangeSousPromotion(event: any) {
    const selectedValue = event.uuid;
    this.homes = [];
    this.homeService.getList(selectedValue).subscribe((res) => {
      this.homes = [];
      this.homes = res;
    })
  }
  onChangeIlot(event: any) {
    const selectedValue = event.uuid;
    this.lots = [];
    this.lotService.getList(null, selectedValue).subscribe((res) => {
      this.lots = [];
      this.lots = res;
    })
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const folder = this.form.getRawValue();
      this.folderService.add(folder).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'FOLDER_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'FOLDER_ADD', payload: res?.data });
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
  addOptionHouse() {
    return this.optionHouses.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        house: [null, [Validators.required]],
        label: [{ value: null, disabled: true }],
        prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
        qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
        tva: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
        remise: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
        total: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]]
      })
    );
    ;
  }
  addOption() {
    return this.options.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        libelle: [null, [Validators.required]],
        prix: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
        qte: [1, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(1)]],
        tva: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
        remise: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
        total: [0, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
      })
    );
  }
  addEcheanceFolder() {
    this.echeanceFolders.controls.length = 0;
    var nbr = (this.f.nbrMois.value >= 0) ? this.f.nbrMois.value : 0;
    if (this.echeanceFolders.controls.length < nbr && this.f.montant.value > 0) {
      for (let i = 0; i < nbr; i++) {
        const options = { year: 'numeric', month: 'long' };
        var dateNow = this.f.date.value ? new Date(this.f.date.value) : new Date();
        var date = DateHelperService.addMonths(dateNow, i + 1)
        var montant = Math.round((this.f.montant.value - this.f.montantAvance.value) / nbr)
        var text = this.f.modalite.value === "ECHEANCE" ? "Échéance du mois de " : "Avance du mois de "
        var label = text + date.toLocaleDateString('fr-FR', options)
        if (montant > 0) {
          this.echeanceFolders.controls.push(
            this.formBuild.group({
              uuid: [null],
              id: [null],
              date: [date.toISOString().slice(0, 10), [Validators.required]],
              montant: [montant, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
              description: [label],
            })
          );
        } else {
          this.echeanceFolders.controls.length = 0;
        }
      }
      return this.echeanceFolders;
    } else if (nbr === 0) {
      let i = this.echeanceFolders.controls.length - (nbr === 0 ? 1 : nbr);
      return this.echeanceFolders.removeAt(i);
    } else {
      return this.echeanceFolders.controls.splice(0, this.echeanceFolders.controls.length);
    }
  }
  addAvanceFolder() {
    this.avanceFolders.controls.length = 0;
    if (this.f.montant.value > 0) {
      this.advanceRow.forEach(item => {
        var montant = Math.round(((this.f.montant.value - this.f.montantAvance.value) * item?.prc) / 100)
        this.avanceFolders.controls.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            libelle: [{ value: item?.label, disabled: true }, [Validators.required]],
            prc: [{ value: item?.prc, disabled: false }, [Validators.required]],
            montant: [{ value: montant, disabled: true }, [Validators.required, Validators.pattern(ValidatorsEnums.decimal), Validators.min(0)]],
          })
        );
      });
    }
    return this.avanceFolders;
  }
  setPourcentage(row) {
    var prc = 0
    this.avanceFolders.controls.forEach(item => { prc = prc + item.get('prc').value });
    if (prc > 100) {
      this.toast(
        "Le pourcentage total de l'état d'avancement ne peut excéder les 100%.",
        'Attention !',
        'warning'
      );
      row.controls.prc.setValue(0);
    }
    var montant = Math.round(((this.f.montant.value - this.f.montantAvance.value) * row?.value?.prc) / 100)
    row.controls.montant.setValue(montant);
  }
  onDeleteOptions(row, i) {
    this.options.removeAt(i)
    return this.onChangeTotal();
  }
  onDeleteOptionHouse(row, i) {
    this.optionHouses.removeAt(i)
    return this.onChangeTotal();
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
  files(data) {
    if (data && data !== null) {
      data.forEach(item => {
        this.folderf.push(
          this.formBuild.group({
            uuid: [item?.uuid, [Validators.required]],
            name: [item?.name],
            path: [item?.path]
          })
        );
      });
    }
  }
  upload(files): void {
    for (const file of files) {
      this.uploadService.upload(file);
    }
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
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }
  onClose() {
    if (!this.edit && this.form.value.folderUuid) {
      var data = { uuid: this.form.value.folderUuid, path: 'dossier' }
      this.uploadService.getDelete(data).subscribe((res: any) => {
        if (res) {
          if (res?.status === 'success') {
            this.form.reset()
            this.modal.close('ferme');
          }
        }
        return res
      });
    } else {
      this.form.reset()
      this.modal.close('ferme');
    }
  }
  onReset() {
    if (this.form.value.folderUuid) {
      this.toast('Impossible de de vider le formulaire lorsque un upload a été éffectué', 'Une erreur a été rencontrée', 'warning');
    } else {
      this.form.reset()
    }
  }
  get f() { return this.form.controls; }
  get options() { return this.form.get('optionFolders') as FormArray; }
  get optionHouses() { return this.form.get('optionHouses') as FormArray; }
  get echeanceFolders() { return this.form.get('echeanceFolders') as FormArray; }
  get avanceFolders() { return this.form.get('avanceFolders') as FormArray; }
  get folderf() { return this.form.get('folders') as FormArray; }
}
