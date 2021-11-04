import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetCardComponent } from './asset-card/asset-card.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    AssetCardComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ],
  exports: [
    AssetCardComponent
  ]
})
export class SharedModule { }
