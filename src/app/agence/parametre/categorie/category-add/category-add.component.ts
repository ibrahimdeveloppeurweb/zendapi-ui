import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { LoadCategoryService } from '@service/load-category/load-category.service';
import { LoadCategory } from '@model/load-category';
import { TantiemeService } from '@service/syndic/tantieme.service';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnInit {

  title: string = '';
  form: FormGroup;
  edit: boolean = false;
  submit: boolean = false;
  syndicSelected?: any;
  required = Globals.required;
  loadCategory: LoadCategory;
  selectedTantieme: string[] = [];
  categorys = []
  tantiemes = []
  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private emitter: EmitterService,
    private tantiemeService : TantiemeService,
    private loadCategoryService: LoadCategoryService,
  ) {
    this.edit = this.loadCategoryService.edit;
    this.loadCategory = this.loadCategoryService.getLoadCategory();
    this.title = (!this.edit) ? 'Créer une catégorie de charge' : 'Modifier la catégorie de charge ' + this.loadCategory.libelle;
    this.newForm();
  }

  ngOnInit() {
    this.editForm();
  }
  editForm() {
    if (this.edit) {
      const data = {...this.loadCategoryService.getLoadCategory()};
      this.form.patchValue(data);
    }
  }
  setSyndicUuid(uuid) {
    if(uuid){
      this.f.syndic.setValue(uuid);    
    } else {
      this.f.syndic.setValue(null);
    }
  }
  newForm() {
    this.form = this.formBuild.group({
      uuid: [null],
      id: [null],
      libelle: [null, [Validators.required]],
    });
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const form = this.form.value;
      this.loadCategoryService.add(form).subscribe(
        res => {
          if (res.status === 'success') {
            this.modal.close('new');
            if (this.form.value.uuid) {
              this.emitter.emit({action: 'CATEGORY_ADD', payload: res.data});
            } else {
              this.form.reset()
              this.emitter.emit({action: 'CATEGORY_ADD', payload: res.data});
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
}
