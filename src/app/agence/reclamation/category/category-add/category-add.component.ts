import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '@model/category';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '@service/category/category.service';
import { EmitterService } from '@service/emitter/emitter.service';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnInit {

  ESCAPE_KEYCODE = 27;
  title?: string
  category?: Category
  form: FormGroup
  edit: boolean = false;
  submit: boolean = false

  constructor(
    private formBuild: FormBuilder,
    private categoryServcie: CategoryService,
    private emitter: EmitterService,
    public modal: NgbActiveModal){
    this.edit = this.categoryServcie.edit;
    this.category = this.categoryServcie.getCategory();
    this.edit = this.categoryServcie.edit
    this.newForm()
    this.title = (!this.edit) ? "Ajouter une cateogrie" : "Modifier une categorie "
  }

  ngOnInit(): void {
    this.editForm()
  }
  newForm() {
    this.form = this.formBuild.group({
      id:[null],
      uuid: [null],
      libelle: [null, [Validators.required]],
    });
  }
  editForm() {
    if (this.edit) {
      const data = {...this.categoryServcie.getCategory()};
      this.form.patchValue(data);
    }
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      this.categoryServcie.add(this.form.getRawValue()).subscribe(res => {
        if (res?.status === 'success') {
          this.modal.dismiss();
          this.modal.close('ferme');
          this.emitter.emit({ action: this.edit? 'CATEGORY_UPDATED' : 'CATEGORY_ADD', payload: res?.data });
        }
      }, error => { });
    } else {
      return;
    }
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === this.ESCAPE_KEYCODE) {
      this.onClose()
    }
  }
  onClose() {
    this.form.reset()
    this.modal.close('ferme');
  }
  onReset() {
    this.form.reset()
  }
  get f() { return this.form.controls; }
}
