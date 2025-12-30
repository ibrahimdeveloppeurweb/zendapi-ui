import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompteTvaService } from '@service/configuration/compte-tva.service';
import { CountryService } from '@service/country/country.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-compte-tva-add',
  templateUrl: './compte-tva-add.component.html',
  styleUrls: ['./compte-tva-add.component.scss']
})
export class CompteTvaAddComponent implements OnInit {

  title: string = '';
  form: FormGroup;
  visibleAjout = false
  visibleButton = true
  visibleTable = true
  dtOptions: any = {};
  submit = false
  taxe: any[] = []
  country: any[] = []
  currentSyndic: any
  edit: boolean = false;
  agency = Globals.user.agencyKey

  constructor(
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private compteTvaService: CompteTvaService,
    private countryService: CountryService,
    public modal: NgbActiveModal,
  ) {
    this.edit = this.compteTvaService.edit
    this.taxe = this.compteTvaService.getCompteTva()
    this.title = (!this.edit) ? 'Ajouter un nouveau compte taxe' : 'Modifier le compte taxe ';
    this.countryService.getList().subscribe((res :any) => {
      this.country = res
    })
    this.newForm()
   }

  ngOnInit(): void {
    this.editForm()
    this.dtOptions = Globals.dataTable;
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      pays: [null, [Validators.required]],
      taux: [null, [Validators.required]],
      libelle: [null, [Validators.required]],
      agency: [this.agency]
    })
  }
  
  editForm() {
    if (this.edit) {
      const data = {...this.compteTvaService.getCompteTva()};
      this.form.patchValue(data);
      data.pays = data.pays ? data.pays.uuid : null
      if(data.pays){
        this.countryService.getList().subscribe(res => {
          this.country = res
        })
      }
      this.form.patchValue(data);
      this.f.pays.setValue(data.pays)
    }
  }

  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }

  onSubmit(){
    this.submit = true
    if(this.form.valid){
      const data = this.form.getRawValue()
      this.compteTvaService.add(data).subscribe((res: any) => {
        if (res?.status === 'success') {
          // this.modal.dismiss();
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'TVA_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'TVA_ADD', payload: res?.data});
          }
        }
        this.emitter.stopLoading();
      })    
    }
  }

  get f(): any { return this.form.controls; }

}
