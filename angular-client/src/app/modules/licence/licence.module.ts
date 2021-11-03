import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core/core.module';
import { LicenceMainComponent } from './licence-main/licence-main.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LicenceMainComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ]
})
export class LicenceModule { }
