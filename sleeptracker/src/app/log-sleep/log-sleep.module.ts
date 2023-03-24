import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogSleepPageRoutingModule } from './log-sleep-routing.module';

import { LogSleepPage } from './log-sleep.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogSleepPageRoutingModule
  ],
  declarations: [LogSleepPage]
})
export class LogSleepPageModule {}
