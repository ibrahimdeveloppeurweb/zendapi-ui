import { Subdivision } from '@model/subdivision';
import { SubdivisionService } from '@service/subdivision/subdivision.service';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { IsletService } from '@service/islet/islet.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '@theme/utils/globals';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Islet } from '@model/islet';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-islet-add',
  templateUrl: './islet-add.component.html',
  styleUrls: ['./islet-add.component.scss']
})
export class IsletAddComponent implements OnInit {
  title: string = ""
  edit: boolean = false
  islet: Islet
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
    private isletService: IsletService,
    private subdivisionService: SubdivisionService,
    private emitter: EmitterService
  ) {
    this.edit = this.isletService.edit
    this.islet = this.isletService.getIslet()
    this.title = (!this.edit) ? "Ajouter un ilot" : "Modifier l'ilot N°"+this.islet?.numero+" du lotissement "+this.islet?.subdivision?.nom;
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      subdivision: [null, [Validators.required]],
      numero: [null, [Validators.required]],
      montant: [null, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      espace: [false, [Validators.required]],
      superficie: [null, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      superficieL: [null, [Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
      nbrLot: [null, [Validators.required]],
      lots: this.formBuild.array([]),
    });
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.isletService.getIslet() }
      this.form.get('uuid').setValue(data.uuid);
      this.setCurrentSubdivision(data.subdivision);
      this.form.patchValue(data)
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
    }
  }
  loadSubdivision() {
    this.emitter.disallowLoading();
    this.subdivisionService.getSingle(this.f.subdivision.value).subscribe((res) => {
      this.subdivision = res
      if(!this.edit){
        this.f.numero.setValue(res?.nbrIlot + 1)
        this.onChangeLot()
      }
    });
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.isletService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.getRawValue().uuid) {
            this.emitter.emit({action: 'ISLET_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'ISLET_ADD', payload: res?.data});
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
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.onSubmit();
      }
    });
  }
  onChangeLot() {
    if(!this.edit){
      this.lot.controls.length = 0;
      var nbr = (this.f.nbrLot.value >= 0) ? this.f.nbrLot.value : 0;
      if (this.lot.controls.length < nbr) {
        for (let i = 0; i < nbr; i++) {
          var num = this.subdivision?.nbrLot + (i + 1);
          this.lot.push(
            this.formBuild.group({
              uuid: [null],
              id: [null],
              numero: [{value: num, disabled: true}, [Validators.required]],
              montant: [this.f.montant.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
              espace: [false, [Validators.required]],
              superficie: [this.f.superficieL.value, [Validators.required, Validators.pattern(ValidatorsEnums.number), Validators.min(0)]],
            })
          );
        }
        return this.lot;
      } else if (nbr === 0) {
        let i = this.lot.controls.length - (nbr === 0 ? 1 : nbr);
        return this.lot.removeAt(i);
      } else {
        return this.lot.controls.splice(0, this.lot.controls.length);
      }
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
  get f() { return this.form.controls; }
  get lot() { return this.form.get('lots') as FormArray; }

}
