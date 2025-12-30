import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';
import { AuthService } from '@service/auth/auth.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.scss']
})
export class LockComponent implements OnInit {
  form: FormGroup;
  loading = false;
  password = 'password';
  user: any = {}
  publicUrl = environment.publicUrl;

  constructor(
    private auth: AuthService,
    private formBuild: FormBuilder,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.user = this.auth.getDataLock();
  }

  ngOnInit() {
    this.loginForm();
  }

  loginForm() {
    this.form = this.formBuild.group({
      username: [this.user?.email, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(4)]]
    });
  }
  onSubmit() {
    const credentials = {...this.form.value};
    this.loading = true;
    this.auth.login(credentials).subscribe(data => {
      this.loading = false;
      if (data.code == 422) {
        return;
      }
      this.document.location.reload();
    }, error => {
      this.loading = false;
    });
  }
  onTogglePassword() {
    this.password = this.password === 'password' ? 'text' : 'password';
  }
  get f() { return this.form.controls; }
}
