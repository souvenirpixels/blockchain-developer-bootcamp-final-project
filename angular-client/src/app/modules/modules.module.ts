import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MintModule } from 'src/app/modules/mint/mint.module';
import { LicenceModule } from './licence/licence.module';
import { NftsModule } from './nfts/nfts.module';


@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    CoreModule,
    MintModule,
    LicenceModule,
    NftsModule
  ]
})
export class ModulesModule { }
