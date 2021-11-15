import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { MintModule } from 'src/app/modules/mint/mint.module';
import { LicenceModule } from './licence/licence.module';
import { MyNftsModule } from './my-nfts/my-nfts.module';
import { MyLicencesModule } from './my-licences/my-licences.module';

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    CoreModule,
    MintModule,
    LicenceModule,
    MyNftsModule,
    MyLicencesModule
  ]
})
export class ModulesModule { }
