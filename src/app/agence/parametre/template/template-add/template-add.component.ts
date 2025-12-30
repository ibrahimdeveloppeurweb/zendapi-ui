import { SettingTemplate } from '@model/setting-template';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TemplateService } from '@service/template/template.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-template-add',
  templateUrl: './template-add.component.html',
  styleUrls: ['./template-add.component.scss']
})
export class TemplateAddComponent implements OnInit {
  title: string = ""
  form: FormGroup
  @Input() template
  data: any
  edit: boolean = false
  submit: boolean = false
  required = {
    novide: "Ce champ est requis.",
    nolettre: "Ce champ ne peut contenir de lettre.",
    nonumber: "Ce champ ne peut contenir de chiffre.",
    noemail: "Ce champ doit être au format E-mail.",
    min: "Ce mot est trop court.",
    max: "Ce mot est trop long."
  }

  constructor(
    private formBuild: FormBuilder,
    public modal: NgbActiveModal,
    private templateService: TemplateService,
    private toastr: ToastrService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
    this.edit = this.templateService.edit
    this.title = "TEMPLATE DE L'AGENCE"
    this.newForm()
  }
  ngOnInit(): void {
    this.editForm();
  }

  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      avis_echeance: [null],
      contrat: [null],
      facture: [null],
      mandat: [null],
    });
  }
  editForm() {
    this.form.patchValue({...this.template})
  }
  editGeneral(){
    this.edit = true
    this.title =  "MODIFICATION DU TEMPLATE DE L'AGENCE"
  }
  cancelTemplate(){
    this.edit = false
    this.title = "TEMPLATE DE L'AGENCE"
    this.editForm()
  }
  onSubmit() {
    const data = {...this.form.value}
    this.templateService.add(data).subscribe(res => {
      this.edit = false
      this.title = "TEMPLATE DE L'AGENCE"
    }, error => {});

    this.templateService.update(data).subscribe(res => {
      if(res) {
        this.modal.close();
        this.toastr.success("Template enregistré avec succès");
      }else{
        this.toastr.error("Impossible d'enregistrer avec succès");
      }
    }, error => {});
  }

}
