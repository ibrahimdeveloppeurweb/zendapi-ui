import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompteTvaService } from '@service/configuration/compte-tva.service';
import { PlanComptableService } from '@service/configuration/plan-comptable.service';
import { CountryService } from '@service/country/country.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-plan-comptable-add',
  templateUrl: './plan-comptable-add.component.html',
  styleUrls: ['./plan-comptable-add.component.scss']
})
export class PlanComptableAddComponent implements OnInit {

  title: string = '';
  form: FormGroup;
  visibleAjout = false
  visibleButton = true
  visibleTable = true
  dtOptions: any = {};
  submit = false
  comptes: any[] = []
  country: any[] = []
  currentSyndic: any
  currentModel: any
  edit: boolean = false;
  plans: any = []
  plan: any
  agency = Globals.user.agencyKey

  Pays = [
    {label: 'Côte d\'ivoire' , value: 'CIV'}
  ]

  currentClasseParent: any

  constructor(
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private planComptableService: PlanComptableService,
    private countryService: CountryService,
    public modal: NgbActiveModal,
  ) {
    this.edit = this.planComptableService.edit
    this.plan = this.planComptableService.getPlanComptable()
    this.title = (!this.edit) ? 'Ajouter un nouveau compte comptable' : 'Modifier le compte comptable ';
    this.planComptableService.getList().subscribe((res: any) => {
      this.plans = res
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
      numero: [null, [Validators.required]],
      libelle: [null, [Validators.required]],
      libelleCourt: [null],
      classeParent: [null],
      groupe: [null],
      model: [null],
      agency: [this.agency]
    })
  }

  editForm(){
    if (this.edit) {
      const data = {...this.planComptableService.getPlanComptable()};
      this.form.patchValue(data);
      this.currentModel = {
        title: data?.model?.searchableTitle,
        detail: data?.model?.searchableDetail
      };
      data.parentUuid = data.parentUuid ? data.parentUuid : null
      if(data.parentUuid){
        this.planComptableService.getList().subscribe((res: any) => {
          this.plans = res
        })
        
        this.planComptableService.getSingle(data.parentUuid).subscribe((res: any) => {
          console.log(res)
          if (res) {
            this.f.classeParent.setValue(res)
            this.currentClasseParent =  {
              title: res?.libelle,
              detail: res?.libelle
            };
          }
        })
      } else {
        this.f.classeParent.setValue(null)
        this.currentClasseParent = null
      }
    }
  }

  onClose(){
    this.form.reset()
    this.modal.close('ferme');
  }

  edite(item){
  }


  setModelUuid(uuid){
    if(uuid){
      this.f.model.setValue(uuid)
    }else{
      this.f.model.setValue(null)
    }
  }

  setClasseParentUuid(uuid) {
    if(uuid){
      this.f.classeParent.setValue(uuid)
    }else{
      this.f.classeParent.setValue(null)
    }
  }

  // setSyndicUuid(uuid){
  //   if(uuid){
  //     this.f.syndic.setValue(uuid)
  //   }else{
  //     this.f.syndic.setValue(null)
  //   }
  // }
  
  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: '<i class="fas fa-trash-alt"></i> Supprimer',
      confirmButtonColor: '#d33',
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.planComptableService.getDelete(item.uuid).subscribe((res: any) => {
          if (res.status === 'success') {
            const index = this.comptes.findIndex((x) => {
              return x.uuid === item.uuid;
            });
            if (index !== -1) {
              this.comptes.splice(index, 1);
            }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
          }
        });
      }
    });
  }

  onSubmit(){
    this.submit = true
    if(this.form.valid){
      const data = this.form.getRawValue()
      this.planComptableService.add(data).subscribe((res: any) => {
        if (res?.status === 'success') {
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
