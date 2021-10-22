import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from './services/web3.service';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent
  ],
  providers: [
    Web3Service
  ]
})
export class CoreModule { }
