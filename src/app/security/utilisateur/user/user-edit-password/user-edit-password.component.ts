import { User } from '@model/user';
import { DOCUMENT } from '@angular/common';
import { Globals } from '@theme/utils/globals';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';
import { UserService } from '@service/user/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-edit-password',
  templateUrl: './user-edit-password.component.html',
  styleUrls: ['./user-edit-password.component.scss']
})
export class UserEditPasswordComponent implements OnInit {
  title: string = ""
  type: string = ""
  user: User
  userR: any
  form: FormGroup
  submit: boolean = false
  required = Globals.required
  passwordA = 'password';
  passwordN = 'password';
  passwordC = 'password';

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.type = this.userService.type
    this.title = "Modifier votre mot passe"
    this.userR = this.authService.getDataToken() ? this.authService.getDataToken() : null;
    this.newForm()
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      new: [null, [Validators.required]],
      actuel: [null, [Validators.required]],
      confirme: [null, [Validators.required]]
    });
  }

  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const data = this.form.getRawValue();
        this.authService.editPassword(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
            if (this.type === 'first') {
              this.authService.logout(this.userR?.uuid).subscribe(data => {
                if (data.code == 422) { return; }
                this.document.location.reload();
              }, error => { });
            }
          }
        });
    } else { return; }
  }

  onTogglePassword(row) {
    if (row === 'now') {
      this.passwordA = this.passwordA === 'password' ? 'text' : 'password';
    }
    if (row === 'new') {
      this.passwordN = this.passwordN === 'password' ? 'text' : 'password';
    }
    if (row === 'confirmate') {
      this.passwordC = this.passwordC === 'password' ? 'text' : 'password';
    }
  }
  get f() { return this.form.controls }
}
