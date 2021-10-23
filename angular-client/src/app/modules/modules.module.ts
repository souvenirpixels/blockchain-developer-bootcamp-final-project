import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MintComponent } from './mint/mint.component';
import { CoreModule } from 'src/app/core/core.module';
import { LicenceComponent } from './licence/licence.component';
import { NftsComponent } from './nfts/nfts.component';

@NgModule({
  declarations: [
    MintComponent,
    LicenceComponent,
    NftsComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class ModulesModule { }
