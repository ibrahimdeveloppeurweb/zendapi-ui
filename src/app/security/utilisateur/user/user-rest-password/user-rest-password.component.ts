import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@service/auth/auth.service';
import { ClipboardService } from 'ngx-clipboard';
import { User } from '@model/user';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { UserService } from '@service/user/user.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-user-rest-password',
  templateUrl: './user-rest-password.component.html',
  styleUrls: ['./user-rest-password.component.scss']
})
export class UserRestPasswordComponent implements OnInit {
  title: string = ""
  users: User[]
  form: FormGroup
  submit: boolean = false
  required = Globals.required
  password = 'password';
  selectedUser: any

  constructor(
    public modal: NgbActiveModal,
    private formBuild: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private clipboard: ClipboardService
  ) {
    this.title = "Reinitialiser  mot passe"
    this.userService.getList(null, null).subscribe((res: any) =>{
      this.users = res
      return this.users
    })
    this.newForm()
  }

  ngOnInit(): void {
  }

  newForm() {
    this.form = this.formBuild.group({
      user: [null, [Validators.required]],
      new: [null, [Validators.required]]
    });
  }
  setPassword(){
    const password = this.getRandomString(8)
    this.f.new.setValue(password)
    this.f.confirme.setValue(password)
  }
  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      const data = this.form.getRawValue();
        this.authService.restPassword(data).subscribe(res => {
          if (res?.status === 'success') {
            this.modal.close('ferme');
          }
        });
    } else { return; }
  }

  onTogglePassword() {
    this.clipboard.copyFromContent(this.f.new.value);
  }

  getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  setUserUuid(uuid) {
    if (uuid) {
      this.selectedUser = uuid,
      this.f.user.setValue(uuid)
    } else {
      this.f.user.setValue(uuid)
    }
  }

  get f() { return this.form.controls }
}
