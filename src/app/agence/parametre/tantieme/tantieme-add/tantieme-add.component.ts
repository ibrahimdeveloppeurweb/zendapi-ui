import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { OwnerService } from '@service/owner/owner.service';
import { SyndicService } from '@service/syndic/syndic.service';
import { TantiemeService } from '@service/syndic/tantieme.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-tantieme-add',
  templateUrl: './tantieme-add.component.html',
  styleUrls: ['./tantieme-add.component.scss']
})
export class TantiemeAddComponent implements OnInit {

  title: string = '';
  form: FormGroup;
  edit: boolean = false;
  submit: boolean = false;
  currentSyndic: any;
  required = Globals.required;
  tantieme : any
  syndics: any[] = []
  owners: any[] = []
  reserveRow = [
    {label: 'NON', value: "NON"},
    {label: 'OUI', value: "OUI"}
  ]

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private ownerService: OwnerService,
    private syndicService: SyndicService,
    private tantiemeservice: TantiemeService,
  ) {
    this.edit = this.tantiemeservice.edit;
    this.tantieme = this.tantiemeservice.getTantieme();
    this.title = (!this.edit) ? 'Ajouter un type de millième' : 'Modifier le type de millième: ';
    this.newForm();
  }

  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      libelle: [null],
      reserve: ["NON"],
    });
  }

  editForm() {
    if (this.edit) {
      const data = {...this.tantiemeservice.getTantieme()};
      this.form.patchValue(data);
    }
  }

  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const data = this.form.value;
      this.tantiemeservice.add(data).subscribe(
        res => {
          if (res.status === 'success') {
            this.modal.close('TANTIEME');
            if (this.form.value.uuid) {
              this.emitter.emit({ action: 'TANTIEME_UPDATED', payload: res.data });
            } else {
              this.emitter.emit({ action: 'TANTIEME_ADD', payload: res.data });
            }
          }
          this.emitter.stopLoading();
        },
        error => { });
    } else {
      return;
    }
  }

  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }

  get f() { return this.form.controls; }
  get tantiemes() { return this.form.get('tantiemes') as FormArray; }

}
