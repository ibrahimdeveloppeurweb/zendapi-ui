import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateService } from '@service/update/update.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  @Input() data: any;
  @Input() type: string;
  @Input() selected: string;
  title: string = null;
  submit: boolean = false;
  form: FormGroup;

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private updateService: UpdateService
  ) {
  }

  ngOnInit() {
    this.title = "Mise à jour des données de " + this.data?.nom;
    this.newForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [this.data?.uuid, [Validators.required]],
      type: [this.type, [Validators.required]],
      telephone: [this.data?.telephone, [Validators.required]],
      email: [this.data?.email, [Validators.required]]
    });

  }
  setContact(event) {
    this.form.get('telephone').setValue(event ? event : this.selected);
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
      this.updateService.util(data).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
        }
      });
    } else { return; }
  }
  onReset() {
    this.selected = null;
    this.form.reset();
    this.setContact(this.selected);
    this.form.get('uuid').setValue(this.data?.uuid);
    this.form.get('type').setValue(this.type);
  }
  onClose() {
    this.modal.close('ferme');
  }
  get f() { return this.form.controls; }
}
