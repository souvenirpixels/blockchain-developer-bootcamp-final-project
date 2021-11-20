import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyNftsMainComponent } from './my-nfts-main/my-nfts-main.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from '../shared/shared.module';
import { BurnModalComponent } from './burn-modal/burn-modal.component';
import { ModalModule } from 'angular-bootstrap-md';
import { TransferModalComponent } from './transfer-modal/transfer-modal.component';

@NgModule({
  declarations: [
    MyNftsMainComponent,
    BurnModalComponent,
    TransferModalComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    ModalModule.forRoot(),
  ]
})
export class MyNftsModule { }
