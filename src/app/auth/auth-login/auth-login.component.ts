import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '@service/auth/auth.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  password = 'password';
  slideIndex = 1;
  slideRow: any[] = [
    { position: 1, img: 2 },
    { position: 2, img: 3 },
    { position: 3, img: 5 }
  ]

  constructor(
    private formBuild: FormBuilder,
    private auth: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.loginForm();
  }

  ngAfterViewInit() {
    this.showSlides(this.slideIndex);
  }

  loginForm() {
    this.form = this.formBuild.group({
      username: [null, [Validators.required]],
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
  plusSlides(n: number) {
    this.showSlides(this.slideIndex += n);
  }
  currentSlide(n: number) {
    this.showSlides(this.slideIndex = n);
  }
  showSlides(n) {
    // let i;
    // let slides = document.getElementsByClassName("slide__auth") as HTMLCollectionOf<HTMLElement>;
    // let dots = document.getElementsByClassName("dot") as HTMLCollectionOf<HTMLElement>;
    // if (n > slides.length) { this.slideIndex = 1 }
    // if (n < 1) { this.slideIndex = slides.length }
    // for (i = 0; i < slides.length; i++) {
    //   slides[i].style.display = "none";
    // }
    // for (i = 0; i < dots.length; i++) {
    //   dots[i].className = dots[i].className.replace(" active", "");
    // }
    // slides[this.slideIndex-1].style.display = "block";
    // dots[this.slideIndex-1].className += " active";
  }
  onTogglePassword() {
    this.password = this.password === 'password' ? 'text' : 'password';
  }
  get f() { return this.form.controls; }
}
