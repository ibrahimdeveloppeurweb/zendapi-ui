import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SousFamille } from '@model/sous-famille';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { FamilleService } from '@service/famille/famille.service';
import { SousFamilleService } from '@service/sousFamille/sous-famille.service';
import { Globals } from '@theme/utils/globals';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-sous-famille-add',
  templateUrl: './sous-famille-add.component.html',
  styleUrls: ['./sous-famille-add.component.scss']
})
export class SousFamilleAddComponent implements OnInit {
  type: string = ""
  title: string = ""
  familleSelected: any
  edit: boolean = false
  sousFamille: SousFamille
  form: FormGroup
  submit: boolean = false
  required = Globals.required;
  formSearch: any;
  codification: any;

  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrService,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private sousFamilleService: SousFamilleService,
    private familleService: FamilleService
  ) {
    this.edit = this.sousFamilleService.edit
    this.sousFamille = this.sousFamilleService.getSousFamille()
    this.title = (!this.edit) ? "Ajouter une sous famille de ressource" : "Modifier la sous famille de ressource "+this.sousFamille.libelle
    this.newForm()
  }

  ngOnInit(): void {
    this.editForm()
  }

  newForm() {
    this.form =  this.formBuild.group({
      uuid: [null],
      id: [null],
      famille: [null, [Validators.required]],
      libelle: [null, [Validators.required]],
      code: [null, [Validators.required]],
    })
  }
  editForm() {
    if (this.edit) {
      const data = { ...this.sousFamilleService.getSousFamille() }
      this.familleSelected= {
        title: data.famille?.libelle ? data.famille.libelle : null,
        detail: data.famille?.libelle ? data.famille.libelle : null,
      }
    
      this.form.patchValue(data)  
      this.f.famille.setValue(data?.famille ? data?.famille?.uuid : null);
      this.f.code.setValue(data?.codification);
      
    }
  }

  onInputChange(): void {
    this.form.get('code').reset();
    const input = this.form.get('libelle').value;
    const preCode = this.codification + input.toUpperCase().substr(0, 3);

    this.form.get('code').setValue(preCode)

  }
  
  onInputChangePostCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.f.code.setValue(this.f.preCode.value+input.value.toUpperCase())
  }

  setFamilleUuid(uuid){
    if(uuid){
      this.f.famille.setValue(uuid)
      this.loadFamille(uuid)
    }else{
      this.f.famille.setValue(null)
      this.familleSelected = null
      this.form.get('code').reset();
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const form = this.form.value;
      this.sousFamilleService.add(form).subscribe(
        res => {
          if (res?.status === 'success') {
            this.modal.dismiss();
            this.modal.close('ferme');
            this.emitter.emit({action: this.edit ? 'SOUS_UPDATED' : 'SOUS_ADD', payload: res?.data});
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

  loadFamille(uuid){
    if(uuid){
      this.familleService.getSingle(uuid).subscribe((res: any)=> {
        this.codification = res?.codification+"-";
        this.f.code.setValue(this.codification);
        } , error => {}
      );
      this.form.get('libelle').reset();
    }
  }
  onClose(){
    this.form.reset()
    this.modal.close('ferme');
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
  get f() { return this.form.controls }
}
