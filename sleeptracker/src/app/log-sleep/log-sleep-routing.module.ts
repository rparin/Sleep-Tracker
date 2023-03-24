import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogSleepPage } from './log-sleep.page';

const routes: Routes = [
  {
    path: '',
    component: LogSleepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogSleepPageRoutingModule {}
