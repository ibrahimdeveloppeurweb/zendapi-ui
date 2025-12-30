import { ToastrService } from 'ngx-toastr';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenerationService } from '@service/generation/generation.service';

@Component({
  selector: 'app-notice-add',
  templateUrl: './notice-add.component.html',
  styleUrls: ['./notice-add.component.scss']
})
export class NoticeAddComponent implements OnInit {
  title: string = null;
  submit: boolean = false;
  form: FormGroup;
  required = Globals.required;
  moisTitle: string = 'Mois de génération';
  periodiciteRow: any[] = [
    { label: 'MENSUEL', value: 'MENSUEL'},
    { label: 'TRIMESTRIEL', value: 'TRIMESTRIEL'},
    { label: 'SEMESTRIEL', value: 'SEMESTRIEL'},
    { label: 'ANNUEL', value: 'ANNUEL'}
  ];

  constructor(
    public toastr: ToastrService,
    private modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private generationService: GenerationService
  ) {
    this.title = 'Génération des avis d\'écheance'
  }

  ngOnInit() {
    this.newForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      periodicite: ['MENSUEL', [Validators.required]],
      mois: [null, [Validators.required]],
    });
    this.form.get('periodicite').valueChanges.subscribe(res => {
      if(res === 'MENSUEL'){
        this.moisTitle = 'Mois de génération';
      } else if(res !== 'MENSUEL') {
        this.moisTitle = 'Mois à partir duquel la génération se fera';
      }
    });
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const data = this.form.getRawValue();
      this.generationService.notice(data).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
          }
          this.emitter.stopLoading();
        },
      error => { });
    } else {
      this.toast('Votre formualire n\'est pas valide.', 'Attention !', 'warning');
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
  onReset(){
    this.form.reset()
  }
  onClose(){ this.modal.close('ferme'); }
  get f(): any { return this.form.controls; }
}
