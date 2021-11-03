import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MintMainComponent } from './mint-main/mint-main.component';

@NgModule({
  declarations: [
    MintMainComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class MintModule { }
