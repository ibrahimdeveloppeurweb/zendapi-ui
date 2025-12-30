import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EtapeTraitementService } from '@service/etapeTraitement/etapeTraitement.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { EtapeTraitement } from '@model/etapeTraitement';

@Component({
  selector: 'app-etape-add',
  templateUrl: './etape-add.component.html',
  styleUrls: ['./etape-add.component.scss']
})
export class EtapeAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title?: string
  etapeTraitement?: EtapeTraitement
  form: FormGroup
  edit: boolean = false;
  submit: boolean = false

  constructor(
    private formBuild: FormBuilder,
    private etapeTraitementService: EtapeTraitementService,
    private emitter: EmitterService,
    public modal: NgbActiveModal){
    this.edit = this.etapeTraitementService.edit;
    this.etapeTraitement = this.etapeTraitementService.getEtape();
    this.edit = this.etapeTraitementService.edit
    this.newForm()
    this.title = (!this.edit) ? "Ajouter une etape" : "Modifier une etape "
  }

  ngOnInit(): void {
    this.editForm()
  }
  newForm() {
    this.form = this.formBuild.group({
      id:[null],
      uuid: [null],
      libelle: [null, [Validators.required]],
    });
  }
  editForm() {
    if (this.edit) {
      const data = {...this.etapeTraitementService.getEtape()};
      this.form.patchValue(data);
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.etapeTraitementService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
          this.emitter.emit({ action: this.edit? 'ETAPE_UPDATED' : 'ETAPE_ADD', payload: res?.data });
        }
      }, error => { });
    } else {
      return;
    }
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }
  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }
  onReset() {
    this.form.reset()
  }
  get f() { return this.form.controls; }

}
