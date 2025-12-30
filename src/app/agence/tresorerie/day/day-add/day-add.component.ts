import { Day } from '@model/day';
import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { ActivatedRoute } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { DayService } from '@service/day/day.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreasuryService } from '@service/treasury/treasury.service';
import { DOCUMENT } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-day-add',
  templateUrl: './day-add.component.html',
  styleUrls: ['./day-add.component.scss']
})
export class DayAddComponent implements OnInit {
  title: string = ""
  form: FormGroup
  submit: boolean = false
  type: String = ''
  required = Globals.required;

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    public dayService: DayService,
    private route: ActivatedRoute,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    public treasuryService: TreasuryService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.type = this.dayService.type
    this.title = this.type === "CAISSE" ? "Ajouter une journée" : "Ajouter un rapprochement"
    this.newForm()
    this.f.treasury.setValue(this.dayService.treasury)
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      treasury: [null, Validators.required],
      montant: [null, Validators.required],
      date: [null, Validators.required],
    });
  }
  onSubmit() {
    this.submit = true;
    if (!this.form.invalid) {
      const data = this.form.getRawValue();
        this.dayService.add(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
            this.document.location.reload();
            if (data?.uuid) {
              this.emitter.emit({action: 'DAY_UPDATED', payload: res?.data});
            } else {
              this.emitter.emit({action: 'DAY_ADD', payload: res?.data});
              this.treasuryService.day = true
            }
          }
        });
    } else { return; }
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
  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }
  toast(msg, title, type) {
    if (type == 'info') {
      this.toastr.info(msg, title);
    } else if (type == 'success') {
      this.toastr.success(msg, title);
    } else if (type == 'warning') {
      this.toastr.warning(msg, title);
    } else if (type == 'error') {
      this.toastr.error(msg, title);
    }
  }
  get f() { return this.form.controls; }
}
