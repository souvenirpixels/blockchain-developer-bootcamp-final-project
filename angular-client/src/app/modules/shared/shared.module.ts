import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetCardComponent } from './asset-card/asset-card.component';



@NgModule({
  declarations: [
    AssetCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AssetCardComponent
  ]
})
export class SharedModule { }
