import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MintMainComponent } from './mint-main/mint-main.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MintMainComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ]
})
export class MintModule { }
