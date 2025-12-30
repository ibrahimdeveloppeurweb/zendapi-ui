import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from '@utilisateur/user/user-list/user-list.component';
import { UserShowComponent } from '@utilisateur/user/user-show/user-show.component';
import { PermissionListComponent } from '@utilisateur/permission/permission-list/permission-list.component';

const routes: Routes = [
  { path: "", component: UserListComponent },
  { path: "show/:id", component: UserShowComponent },
  { path: "permission", component: PermissionListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilisateurRoutingModule { }
