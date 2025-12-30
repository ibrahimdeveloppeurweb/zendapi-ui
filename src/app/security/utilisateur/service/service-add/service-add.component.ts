import { DualListComponent } from 'angular-dual-listbox';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsEnums } from '@theme/enums/validators.enums';
import { UserService } from '@service/user/user.service';
import { ServiceService } from '@service/service/service.service';
import { User } from '@model/user';
import { Service } from '@model/service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import { EmitterService } from '@service/emitter/emitter.service';

@Component({
  selector: 'app-service-add',
  templateUrl: './service-add.component.html',
  styleUrls: ['./service-add.component.scss']
})
export class ServiceAddComponent implements OnInit {
  title: string = ""
  type: string = ""
  edit: boolean = false
  responsables: User[]
  responsable: User
  service: Service
  form: FormGroup
  submit: boolean = false
  required = Globals.required

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private userService: UserService,
    private serviceService: ServiceService
  ) {
    this.edit = this.serviceService.edit
    this.service = this.serviceService.getService()
    this.title = (!this.edit) ? "Ajouter un service" : "Modifier le service "+this.service?.nom
    this.userService.getList(null,null).subscribe((res) =>{
      this.responsables = res;
      return this.responsables
    })
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }
  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      responsable: [null, [Validators.required]],
      nom: [null, [Validators.required]],
      direction: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });
  }

  editForm() {
    if (this.edit) {
      const data = { ...this.serviceService.getService() }
      this.form.patchValue(data)
      this.f.responsable.setValue(data?.responsable?.uuid)
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const data = this.form.getRawValue();
        this.serviceService.add(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
            if (data?.uuid) {
              this.emitter.emit({action: 'SERVICE_UPDATED', payload: res?.data});
            } else {
              this.emitter.emit({action: 'SERVICE_ADD', payload: res?.data});
            }
          }
        });
    } else { return; }
  }
  get f() { return this.form.controls }
}
