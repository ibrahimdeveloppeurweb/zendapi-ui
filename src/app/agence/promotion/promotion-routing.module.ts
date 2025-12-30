import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeShowComponent } from '@promotion/home/home-show/home-show.component';
import { WorksiteShowComponent } from './worksite/worksite-show/worksite-show.component';
import { BuildingShowComponent } from './building/building-show/building-show.component';
import { PromotionListComponent } from '@promotion/promotion/promotion-list/promotion-list.component';
import { PromotionShowComponent } from '@promotion/promotion/promotion-show/promotion-show.component';

const routes: Routes = [
  { path: '', component: PromotionListComponent },
  { path: "show/:id", component: PromotionShowComponent },
  { path: "show/souspromotion/:id", component: PromotionShowComponent },
  { path: "home/show/:id", component: HomeShowComponent },
  { path: "building/show/:id", component: BuildingShowComponent },
  { path: "worksite/show/:id", component: WorksiteShowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
