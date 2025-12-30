import { User } from '@model/user';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { UserService } from '@service/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UploaderService } from '@service/uploader/uploader.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@service/auth/auth.service';
import { DataToken } from '@model/auth/auth.model';

@Component({
  selector: 'app-user-img',
  templateUrl: './user-img.component.html',
  styleUrls: ['./user-img.component.scss']
})
export class UserImgComponent implements OnInit {
  title: string = ""
  user: User
  form: FormGroup
  submit: boolean = false
  required = Globals.required
  selectedUser: any
  token: DataToken

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private userService: UserService,
    private auth: AuthService,
    public uploadService: UploaderService,
  ) {
    this.title = "Ajouter ma photo de profil"
    this.user = this.userService.getUser()
    this.newForm()
  }

  ngOnInit(): void {
    this.token = this.auth.getDataToken()
  }

  newForm() {
    this.form = this.formBuild.group({
      user: [this.user?.uuid, [Validators.required]],
      files: this.formBuild.array([]),
    });
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const data = this.form.getRawValue();
        this.userService.editImg(data).subscribe(res => {
          if (res?.status === 'success') {
            this.token.photo = res.data.photoSrc
            localStorage.setItem('token-zen-data', JSON.stringify(this.token));

            location.reload();
            this.modal.close('ferme');
          }
        });
    } else { return; }
  }
  loadfile(data) {
    if(data && data !== null){
      const file = data.todo.file
      this.file.push(
        this.formBuild.group({
          uniqId: [data.todo.uniqId, [Validators.required]],
          fileName: [file.name, [Validators.required]],
          fileSize: [file.size, [Validators.required]],
          fileType: [file.type, [Validators.required]],
          loaded: [data.todo.loaded, [Validators.required]],
          chunk: [data.chunk, [Validators.required]],
        })
      );
    }
  }
  upload(files): void {
    for (const file of files) {
      this.uploadService.upload(file);
    }
  }
  setParam(property, value): void {
    if (value) {
      if (this.form.value.hasOwnProperty(property)) {
        Object.assign(this.form.value, {[property]: value});
      }
      if (this.form.controls.hasOwnProperty(property)) {
        this.form.controls[property].setValue(value);
      }
    }
  }
  get f() { return this.form.controls }
  get file() { return this.form.get('files') as FormArray; }
}
