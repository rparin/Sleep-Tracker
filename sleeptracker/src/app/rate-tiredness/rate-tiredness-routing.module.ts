import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RateTirednessPage } from './rate-tiredness.page';

const routes: Routes = [
  {
    path: '',
    component: RateTirednessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RateTirednessPageRoutingModule {}
