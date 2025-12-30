import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LockComponent } from '@auth/lock/lock.component';
import { AuthLoginComponent } from '@auth/auth-login/auth-login.component';
import { ForgotPasswordComponent } from '@auth/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: "", component: AuthLoginComponent },
  { path: "session", component: LockComponent },
  { path: "password", component: ForgotPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
