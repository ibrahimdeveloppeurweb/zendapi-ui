import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProcedureService } from '@service/procedure/procedure.service';
import { EmitterService } from '@service/emitter/emitter.service';

@Component({
  selector: 'app-procedure-item',
  templateUrl: './procedure-item.component.html',
  styleUrls: ['./procedure-item.component.scss']
})
export class ProcedureItemComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title?: string
  etape?: any
  form: FormGroup
  edit: boolean = false;
  submit: boolean = false

  constructor(
    private formBuild: FormBuilder,
    private etapeServcie: ProcedureService,
    private emitter: EmitterService,
    public modal: NgbActiveModal
  ){
    this.edit = this.etapeServcie.edit;
    this.etape = this.etapeServcie.getEtape();
    this.edit = this.etapeServcie.edit
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
      const data = {...this.etapeServcie.getProcedure()};
      this.form.patchValue(data);
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.etapeServcie.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
          this.emitter.emit({ action: this.edit? 'CATEGORY_UPDATED' : 'CATEGORY_ADD', payload: res?.data });
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
