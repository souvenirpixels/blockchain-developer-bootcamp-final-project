import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Web3Service } from './services/web3.service';
import { HeaderComponent } from './header/header.component';
import { ButtonsModule,
         NavbarModule,
         IconsModule,
         WavesModule,
         InputsModule,
         CardsModule } from 'angular-bootstrap-md';
import { RouterModule } from '@angular/router';
import { LDAPContractService } from './services/ldapcontract.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HeaderComponent
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
    FormsModule
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
    FormsModule
  ],
  providers: [
    Web3Service,
    LDAPContractService
  ]
})
export class CoreModule { }
