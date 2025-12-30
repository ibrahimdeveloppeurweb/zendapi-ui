import { Component, HostListener, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { ProcedureService } from '@service/procedure/procedure.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-procedure-add',
  templateUrl: './procedure-add.component.html',
  styleUrls: ['./procedure-add.component.scss']
})
export class ProcedureAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title?: string
  procedure?: any
  form: FormGroup
  edit: boolean = false;
  submit: boolean = false
  categorySelected: any; 
  constructor(
    private formBuild: FormBuilder,
    private procedureServcie: ProcedureService,
    private emitter: EmitterService,
    public modal: NgbActiveModal
  ) { 
    this.edit = this.procedureServcie.edit;
    this.procedure = this.procedureServcie.getProcedure();
    this.edit = this.procedureServcie.edit
    this.newForm()
    this.title = (!this.edit) ? "Ajouter une procedure" : "Modifier une procedure "

  }

  ngOnInit(): void {
    this.editForm()
  }
  newForm() {
    this.form = this.formBuild.group({
      id:[null],
      uuid: [null],
      category: [null, [Validators.required]],
      etapes: this.formBuild.array([]),
    });
  }
  editForm() {
    if (this.edit) {
      const data = {...this.procedureServcie.getProcedure()};
      
      this.categorySelected ={
        title: data.category?.libelle ? data.category.libelle : null,
        detail: data.category?.libelle ? data.category.libelle : null,
      }

  
      this.form.patchValue(data);
      this.f.category.setValue(data.category.uuid)
      data.optionProcesses?.forEach((item) => {
        let selected = {
          title: item?.etape?.libelle ? item?.etape?.libelle : null,
          detail: item?.etape?.libelle ? item?.etape?.libelle : null,
        }
        this.etapes.push(
          this.formBuild.group({
            uuid: [null],
            id: [null],
            etape: [item?.etape?.uuid],
            selected: [selected]
          })
        );
      });
  

      
      
    }
  }
  setCategoryUuid(uuid){
    if(uuid){
      this.f.category.setValue(uuid)
    }else{
      this.f.category.setValue(null)
   
    }
  }
  setEtapeUuid(uuid, item){
    if(uuid){
      item.get('etape').setValue(uuid);
    }else{
      item.get('etape').setValue(null);
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.procedureServcie.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');  
          this.emitter.emit({ action: this.edit? 'PROCEDURE_UPDATED' : 'PROCEDURE_ADD', payload: res?.data });
        }
      }, error => { });
    } else {
      return;
    }
  }
  onAdd() {
    return this.etapes.push(
      this.formBuild.group({
        uuid: [null],
        id: [null],
        etape: [null, [Validators.required]],
      })
    );
  }
  onDelete(i: number) {
    this.etapes.removeAt(i);
  }
  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }
  onReset() {
    this.form.reset()
  }

  get f() { return this.form.controls; }
  get etapes() { return this.form.get('etapes') as FormArray; }
}
