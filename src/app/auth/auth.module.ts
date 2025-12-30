import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@theme/shared/shared.module';
import { AuthRoutingModule } from '@auth/auth-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthLoginComponent } from '@auth/auth-login/auth-login.component';
import { ForgotPasswordComponent } from '@auth/forgot-password/forgot-password.component';


@NgModule({
  declarations: [
    AuthLoginComponent,
    ForgotPasswordComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
