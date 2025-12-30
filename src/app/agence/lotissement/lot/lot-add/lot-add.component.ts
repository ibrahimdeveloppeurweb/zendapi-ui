import { ToastrService } from 'ngx-toastr';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { IsletService } from '@service/islet/islet.service';
import { Subdivision } from '@model/subdivision';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { EmitterService } from '@service/emitter/emitter.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LotService } from '@service/lot/lot.service';
import { Globals } from '@theme/utils/globals';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Islet } from '@model/islet';
import { Lot } from '@model/lot';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-lot-add',
  templateUrl: './lot-add.component.html',
  styleUrls: ['./lot-add.component.scss']
})
export class LotAddComponent implements OnInit {
  title: string = ""
  edit: boolean = false
  lot: Lot
  islet: Islet
  islets: Islet[]
  subdivision: Subdivision
  form: FormGroup
  submit: boolean = false
  required = Globals.required
  subdivisionSelected?: any;
  espaceRow = [
    {label: "OUI", value: true},
    {label: "NON", value: false}
  ]

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private lotService: LotService,
    private isletService: IsletService,
    private subdivisionService: SubdivisionService,
    public toastr: ToastrService,
    private emitter: EmitterService
  ) {
    this.edit = this.lotService.edit
    this.lot = this.lotService.getLot()
    this.title = (!this.edit) ? "Ajouter un lot" : "Modifier le lot N°"+this.lot?.numero+" du lotissement "+this.lot?.islet?.subdivision?.nom;
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      subdivision: [null],
      islet: [null, [Validators.required]],
      numero: [null],
      montant: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      espace: [false, [Validators.required]],
      superficie: [0, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      nbrLot: [0, [Validators.required]],
      lots: this.formBuild.array([]),
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.lotService.getLot() }
      this.form.get('uuid').setValue(data.uuid);
      this.setCurrentSubdivision(data?.islet?.subdivision);
      this.form.patchValue(data)
      this.f.islet.setValue(data?.islet?.uuid)
    }
  }
  setCurrentSubdivision(subdivision){
    this.setSubdivisionUuid(subdivision?.uuid);
    this.subdivisionSelected = {
      photoSrc: subdivision?.photoSrc,
      title: subdivision?.searchableTitle,
      detail: subdivision?.searchableDetail
    };
  }
  setSubdivisionUuid(uuid) {
    if(uuid) {
      this.f.subdivision.setValue(uuid);
      this.loadSubdivision()
      this.loadIslet()
    }
  }
  loadSubdivision() {
    this.emitter.disallowLoading();
    this.subdivisionService.getSingle(this.f.subdivision.value).subscribe((res) => {
      this.subdivision = res
      if(!this.edit){
        this.onChangeLot()
      }
    });
  }
  loadIslet() {
    this.emitter.disallowLoading();
    this.isletService.getList(this.f.subdivision.value).subscribe((res) => {
      this.islets = res
      if(!this.edit){
        this.onChangeLot()
      }
    });
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.lotService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close();
          if (this.form.getRawValue().uuid) {
            this.emitter.emit({action: 'LOT_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'LOT_ADD', payload: res?.data});
          }
        }
      }, error => {});
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
      reverseButtons: true //ddddd
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.onSubmit();
      }
    });
  }
  onChangeLot() {
    if(!this.edit){
      this.lots.controls.length = 0;
      var nbr = (this.f.nbrLot.value >= 0) ? this.f.nbrLot.value : 0;
      if (this.lots.controls.length < nbr) {
        for (let i = 0; i < nbr; i++) {
          var num = this.subdivision?.nbrLot + (i + 1);
          this.lots.push(
            this.formBuild.group({
              uuid: [null],
              id: [null],
              numero: [{value: num, disabled: false}, [Validators.required]],
              montant: [this.f.montant.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
              espace: [this.f.espace.value, [Validators.required]],
              superficie: [this.f.superficie.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            })
          );
        }
        return this.lots;
      } else if (nbr === 0) {
        let i = this.lots.controls.length - (nbr === 0 ? 1 : nbr);
        return this.lots.removeAt(i);
      } else {
        return this.lots.controls.splice(0, this.lots.controls.length);
      }
    }
  }
  onChangeIslet(event) {
    this.islet = this.islets.find((item) => {
      if(item?.uuid === event){ return item }
    })
    if(this.islet?.espace === true) {
      this.toast(
        'L\'ilot que vous venez de sélectionner est un espace vert.',
        'ATTENTION.',
        'warning'
      );
      this.f.espace.setValue(true)
      this.f.espace.disable()
    } else {
      this.f.espace.setValue(false)
      this.f.espace.enable()
    }
  }
  onChangeEspace(item){
    if(item.get('espace').value === 'true'){
      item.get('montant').disable()
      item.get('superficie').disable()
    } else {
      item.get('montant').enable()
      item.get('superficie').enable()
    }
    item.get('montant').setValue(0)
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
  get f() { return this.form.controls; }
  get lots() { return this.form.get('lots') as FormArray; }

}
