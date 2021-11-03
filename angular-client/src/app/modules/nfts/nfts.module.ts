import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { NftsMainComponent } from './nfts-main/nfts-main.component';

@NgModule({
  declarations: [
    NftsMainComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class NftsModule { }
