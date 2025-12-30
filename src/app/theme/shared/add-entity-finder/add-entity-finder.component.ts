import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { EquipmentService } from '@service/equipment/equipment.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-entity-finder',
  templateUrl: './add-entity-finder.component.html',
  styleUrls: ['./add-entity-finder.component.scss']
})
export class AddEntityFinderComponent implements OnInit {

  title = null;
  type = '';
  edit: boolean = false;
  completed: boolean = false;
  transformation: boolean = false;
  prospection: any;
  form: FormGroup;
  submit = false;
  required = Globals.required;
  publicUrl = environment.publicUrl;


  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public uploadService: UploaderService,
    private equipmentService: EquipmentService
  ) {
    this.title = 'Faire un nouveau enregistrement'
    this.newForm();
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      libelle: [null, [Validators.required]],
      description: [null],
    })
  }
  onSubmit() {
    this.submit = true;
    this.emitter.loading();
    if (this.form.valid) {
      const data = this.form.getRawValue();
      this.equipmentService.add(data).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: this.edit ? 'EQUIPMENT_UPDATED' : 'EQUIPMENT_ADD', payload: res?.data});
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
  get f(): any { return this.form.controls; }
}
