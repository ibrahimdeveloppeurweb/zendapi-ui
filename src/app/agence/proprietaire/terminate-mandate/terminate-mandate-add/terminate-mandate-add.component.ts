import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { TerminateMandateService } from '@service/terminate-mandate/terminate-mandate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { TerminateMandate } from '@model/terminate-mandate';
import { Mandate } from '@model/mandate';
import { MandateService } from '@service/mandate/mandate.service';
import { Owner } from '@model/owner';

@Component({
  selector: 'terminate-mandate-add.component',
  templateUrl: './terminate-mandate-add.component.html',
  styleUrls: ['./terminate-mandate-add.component.scss']
})
export class TerminateMandateAddComponent implements OnInit {

  title: string = '';
  form: FormGroup;
  submit: boolean = false;
  edit: boolean = false;
  ownerSelected?: any;
  owner?: Owner;
  mandate: Mandate;
  mandates: Mandate[] = [];
  terminate: TerminateMandate;
  required = Globals.required;
  loading = false;
  global = { country: Globals.country, device: Globals.device }

  constructor(
    private formBuild: FormBuilder,
    public modal: NgbActiveModal,
    private emitter: EmitterService,
    private mandateService: MandateService,
    private terminateService: TerminateMandateService,
    public toastr: ToastrService
  ) {
    this.edit = this.terminateService.edit;
    this.terminate = this.terminateService.getTerminate();
    this.mandate = this.terminate?.mandate;
    this.title = (!this.edit) ? 'Ajouter une résiliation de mandat' : 'Modifier la résiliation du ' + this.terminate?.mandate?.libelle;
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }
  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: null,
      owner: [null],
      mandate: [null, [Validators.required]],
      date: [null, [Validators.required]],
    });
  }
  editForm(): void {
    if (this.edit) {
      const data = { ...this.terminateService.getTerminate() };
      data.date = DateHelperService.fromJsonDate(data.date);
      this.loadMandates(data?.mandate?.house?.owner?.uuid)
      this.form.patchValue(data);
      this.f.mandate.setValue(data?.mandate?.uuid);
      this.f.owner.setValue(data?.mandate?.house?.owner?.uuid);
      this.ownerSelected = {
        photoSrc: data?.owner?.photoSrc,
        title: data?.mandate?.house?.owner?.searchableTitle,
        detail: data?.mandate?.house?.owner?.searchableDetail
      };
    }
  }
  setOwnerUuid(uuid) {
    this.f.owner.setValue(uuid);
    this.loadMandates(uuid);
  }
  setMandateUuid(event) {
    let uuid = this.edit ? event : event.target.value
    if (uuid !== null) {
      this.mandate = this.mandates.find(item => { if (item.uuid === uuid) { return item; } });
      if (this.mandate) {
        this.f.mandate.setValue(uuid);
        this.owner = this.mandate.house.owner
      }
    }
  }
  loadMandates(uuid) {
    this.mandates = [];
    if (uuid) {
      this.loading = true;
      this.mandateService.getList(uuid, 'ACTIF').subscribe((res) => {
        this.loading = false;
        this.mandates = res;
      });
    } else {
      this.f.mandate.setValue(null);
    }
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      this.terminateService.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({ action: 'TERMINATE_UPDATED', payload: res?.data });
          } else {
            this.emitter.emit({ action: 'TERMINATE_ADD', payload: res?.data });
          }
        }
      }, error => { });
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
  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }
  toast(msg, title, type) {
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
}
