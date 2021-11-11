import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from './services/web3.service';
import { LDAPContractService } from './services/ldapcontract.service';
import { AssetsService } from './services/assets.service';
import { HeaderComponent } from './header/header.component';
import { ButtonsModule,
         NavbarModule,
         IconsModule,
         WavesModule,
         InputsModule,
         CardsModule,
         ModalModule,
         BadgeModule } from 'angular-bootstrap-md';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { ConnectedComponent } from './modals/connected/connected.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    HeaderComponent,
    ConnectedComponent
  ],
  imports: [
    CommonModule,
    ButtonsModule,
    NavbarModule,
    IconsModule,
    RouterModule,
    WavesModule.forRoot(),
    InputsModule,
    CardsModule,
    FormsModule,
    ModalModule.forRoot(),
    BadgeModule,
    HttpClientModule
  ],
  exports: [
    HeaderComponent,
    ButtonsModule,
    NavbarModule,
    IconsModule,
    RouterModule,
    WavesModule,
    InputsModule,
    CardsModule,
    FormsModule,
    ModalModule,
    BadgeModule
  ],
  providers: [
    Web3Service,
    LDAPContractService,
    AssetsService
  ]
})
export class CoreModule { }
