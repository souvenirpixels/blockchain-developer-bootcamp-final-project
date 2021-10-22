import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MintComponent } from './mint/mint.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    MintComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class ModulesModule { }
