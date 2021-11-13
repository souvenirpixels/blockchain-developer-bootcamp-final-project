import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyNftsMainComponent } from './my-nfts-main/my-nfts-main.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    MyNftsMainComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class MyNftsModule { }
