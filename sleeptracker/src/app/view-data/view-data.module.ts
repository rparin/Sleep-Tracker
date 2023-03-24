import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewDataPageRoutingModule } from './view-data-routing.module';

import { ViewDataPage } from './view-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewDataPageRoutingModule
  ],
  declarations: [ViewDataPage]
})
export class ViewDataPageModule {}
