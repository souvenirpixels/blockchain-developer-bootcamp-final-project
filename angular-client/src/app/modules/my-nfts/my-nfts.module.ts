import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyNftsMainComponent } from './my-nfts-main/my-nfts-main.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MyNftsMainComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ]
})
export class MyNftsModule { }
