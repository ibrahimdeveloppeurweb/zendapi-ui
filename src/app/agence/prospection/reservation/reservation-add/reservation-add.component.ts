import { Home } from './../../../../model/home';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { Building } from '@model/building';
import { House } from '@model/house';
import { Islet } from '@model/islet';
import { Lot } from '@model/lot';
import { Promotion } from '@model/promotion';
import { Subdivision } from '@model/subdivision';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { LotService } from '@service/lot/lot.service';
import { HomeService } from '@service/home/home.service';
import { HouseService } from '@service/house/house.service';
import { ProspectionService } from '@service/prospection/prospection.service';
import { ReservationService } from '@service/reservation/reservation.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DateHelperService } from '@theme/utils/date-helper.service';


@Component({
  selector: 'app-reservation-add',
  templateUrl: './reservation-add.component.html',
  styleUrls: ['./reservation-add.component.scss']
})
export class ReservationAddComponent implements OnInit {

  title = null;
  type = '';
  status = 'VENTE';
  edit: boolean = false;
  reservation: any;
  form: FormGroup;
  submit = false;
  required = Globals.required;
  publicUrl = environment.publicUrl;
  modes = [
    {label: 'Comptant', value: 'Comptant'},
    {label: 'Banque', value: 'Banque'},
    {label: 'PPP', value: 'PPP'},
    {label: 'Dépot à terme', value: 'Dépot à terme'}
  ]
  typeRow = [
    {label: 'Programme Immobilier', value: 'PROMOTION'},
    {label: 'Projet de Lotissement', value: 'LOTISSEMENT'},
    {label: 'MAISON EN VENTE', value: 'HOUSE'}
  ]
  offres = []
  prospect: any
  houseSelected: any
  prospectSelected: any
  promotionSelected: any
  subdivisionSelected: any

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private lotService: LotService,
    private homeService: HomeService,
    private emitter: EmitterService,
    private houseService: HouseService,
    public uploadService: UploaderService,
    private prospectService: ProspectionService,
    public reservationService: ReservationService
  ) {
    this.edit = this.reservationService.edit;
    this.status = this.reservationService.type;
    this.reservation = this.reservationService.getReservation();
    this.title = (!this.edit) ? 'Ajouter une pré-réservation' : 'Modifier la pré-réservation ' + this.reservation.nom;
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      parent: [null],
      prospect: [null, [Validators.required]],
      status: [this.status, [Validators.required]],
      date: [null, [Validators.required]],
      dateL: [null, [Validators.required]],
      mode: [null, [Validators.required]],
      type: [null, [Validators.required]],
      min: [0, [Validators.required]],
      max: [0, [Validators.required]],
      apport: [0, [Validators.required]],
      options: this.formBuild.array(this.itemOption()),
      folderUuid: [null],
      commentaire: [null],
      folders: this.formBuild.array([])
    })
  }
  editForm(){
    if (this.edit) {
      const data = {...this.reservationService.getReservation()};
      data.date = DateHelperService.fromJsonDate(data?.date);
      data.dateL = DateHelperService.fromJsonDate(data?.dateL);
      this.form.patchValue(data);

      if(data.type === "LOTISSEMENT"){
        this.setPromotionUuid(data.parentUuid)
      }
      if(data.type === "PROMOTION"){
        this.setPromotionUuid(data.parentUuid)
      }
      if(data.type === "HOUSE"){
        this.setPromotionUuid(data.parent.uuid)
      }
      data?.options.forEach((item) => {
        this.options.push(
          this.formBuild.group({
            uuid: [item.uuid],
            id: [item.id],
            choix: [item.choix, [Validators.required]],
            offre: [item.offreUuid, [Validators.required]],
          })
        );
      });
      this.prospect = data.prospect
      this.prospectSelected = data.prospect
      this.setProspectUuid(data.prospect.uuid)
    }
  }
  itemOption(): FormGroup[] {
    const arr: any[] = [];
    if (!this.edit) {
      for(let i = 0; i < 3; i++){
        var choix = "Choix " + (i + 1);
        arr.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            choix: [{value: choix, disabled: true}, [Validators.required]],
            offre: [null, [Validators.required]],
          })
        );
      }
    }
    return arr;
  }
  setProspectUuid(uuid) {
    if(uuid){
      this.f.prospect.setValue(uuid);
      this.loadProspect();
    } else {
      this.prospect = null;
      this.f.prospect.setValue(null);
    }
  }
  setPromotionUuid(uuid) {
    if(uuid){
      this.f.parent.setValue(uuid);
      this.loadOffres(uuid, 'PROMOTION');
    } else {
      this.f.parent.setValue(null);
    }
  }
  setSubdivisionUuid(uuid) {
    if(uuid){
      this.f.parent.setValue(uuid);
      this.loadOffres(uuid, 'LOTISSEMENT');
    } else {
      this.f.parent.setValue(null);
    }
  }
  loadProspect() {
    this.emitter.disallowLoading();
    this.prospectService.getSingle(this.f.prospect.value).subscribe((res: any) => {
      this.prospect = res;
    });
  }
  loadOffres(uuid, type) {
    if(type === 'LOTISSEMNT'){
      this.homeService.getList(uuid).subscribe((res: any) => {
        this.offres = res;
      });
    }
    if(type === 'LOTISSEMENT'){
      this.lotService.getList(uuid).subscribe((res: any) => {
        this.offres = res;
      });
    }
  }

  onAdd() {
    const optionGroup = this.formBuild.group({
      choix: ["choix "+ (this.options.length + 1), Validators.required],
      offre: ['', Validators.required]
    });
    this.options.push(optionGroup);
  }
  onDelete(i) {
    this.options.removeAt(i);
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

  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      const data = this.form.getRawValue();
      this.reservationService.add(data).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({ action: this.edit ? 'RESERVATION_UPDATED' : 'RESERVATION_ADD', payload: res?.data });
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      this.emitter.stopLoading();
      this.toast('Certaines informations obligatoires sont manquantes ou mal formatées', 'Formulaire invalide', 'warning');
      return;
    }
  }

  loadfile(data) {
    if (data && data !== null) {
      const file = data.todo.file
      this.file.push(
        this.formBuild.group({
          uniqId: [data.todo.uniqId, [Validators.required]],
          fileName: [file.name, [Validators.required]],
          fileSize: [file.size, [Validators.required]],
          fileType: [file.type, [Validators.required]],
          loaded: [data.todo.loaded, [Validators.required]],
          chunk: [data.chunk, [Validators.required]],
        })
      );
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

  itemAnnee(): FormGroup[] {
    const arr: any[] = [];
    for (let i = 0; i < 3; i++) {
      if (!this.edit) {
        arr.push(
          this.formBuild.group({
            uuid: [null],
            annee: [null],
            numerotation: [null],
            montant: [null],
            etat: [null],
            etatFinName: [null],
            bilanCompta: [null],
            bilanComptaName: [null]
          })
        )
      }
    }
    return arr
  }

  onClose() {
      this.form.reset()
      this.modal.close('ferme');
  }
  onReset() {
      this.form.reset()
  }


  get f(): any { return this.form.controls; }
  get file() { return this.form.get('files') as FormArray; }
  get folder() { return this.form.get('folders') as FormArray; }
  get options() { return this.form.get('options') as FormArray; }
}
