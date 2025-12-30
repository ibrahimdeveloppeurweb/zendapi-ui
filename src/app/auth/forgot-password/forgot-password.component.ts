import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(
    public router: Router,
    private formBuild: FormBuilder,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm();
  }

  loginForm() {
    this.form = this.formBuild.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }
  onSubmit() {
    const credentials = {...this.form.value};
    this.loading = true;
    this.auth.forgot(credentials).subscribe(data => {
      this.loading = false;
      if (data.code == 200) {
        this.router.navigate(['/auth/login'])
        return;
      }
    }, error => {
      this.loading = false;
    });
  }
  get f() { return this.form.controls; }
}
