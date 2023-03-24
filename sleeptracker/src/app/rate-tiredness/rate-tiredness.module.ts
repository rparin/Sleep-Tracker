import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RateTirednessPageRoutingModule } from './rate-tiredness-routing.module';

import { RateTirednessPage } from './rate-tiredness.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RateTirednessPageRoutingModule
  ],
  declarations: [RateTirednessPage]
})
export class RateTirednessPageModule {}
