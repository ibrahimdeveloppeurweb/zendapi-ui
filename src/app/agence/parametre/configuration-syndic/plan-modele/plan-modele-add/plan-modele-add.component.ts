import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanModeleService } from '@service/configuration/plan-modele.service';
import { CountryService } from '@service/country/country.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
  selector: 'app-plan-modele-add',
  templateUrl: './plan-modele-add.component.html',
  styleUrls: ['./plan-modele-add.component.scss']
})
export class PlanModeleAddComponent implements OnInit {

  title: string = ''
  form: FormGroup;
  submit = false;
  visibleAjout = false
  visibleButton = true
  visibleTable = true
  dtOptions: any = {};
  country: any = []
  models: any[] = []
  currentSyndic: any
  edit: boolean = false;
  model: any
  agency =  Globals.user.agencyKey
  
  constructor(
    private formBuild: FormBuilder,
    private planModeleService: PlanModeleService,
    private countryService: CountryService,
    private emitter: EmitterService,
    public modal: NgbActiveModal,
  ) {
    this.edit = this.planModeleService.edit
    this.model = this.planModeleService.getPlanModel()
    this.title = (!this.edit) ? 'Ajouter un nouveau modèle de plan de compte' : 'Modifier le modèle de plan de compte ';
    this.countryService.getList().subscribe(res => {
      this.country = res
    })
    this.newForm()
   }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.editForm()
  }

  newForm(){
    this.form = this.formBuild.group({
      id: [null],
      uuid: [null],
      pays: [null, [Validators.required]],
      libelle: [null, [Validators.required]],
      modelP: [null],
      agency: [this.agency],
    })
  }

  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }

  editForm(){
    if (this.edit) {
      const data = {...this.planModeleService.getPlanModel()};
      console.log('data', data)
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

  onSubmit(){
    this.submit = true
    if(this.form.valid){
      const data = this.form.getRawValue()
      this.planModeleService.add(data).subscribe((res: any) => {
        if (res?.status === 'success') {
          this.modal.close('ferme');
          if (this.form.value.uuid) {
            this.emitter.emit({action: 'PLAN_MODEL_UPDATED', payload: res?.data});
          } else {
            this.emitter.emit({action: 'PLAN_MODEL_ADD', payload: res?.data});
          }
        }
        this.emitter.stopLoading();
      })    }
  }

  get f(): any { return this.form.controls; }

}
