import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyLicencesMainComponent } from './my-licences-main/my-licences-main.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    MyLicencesMainComponent
  ],
  imports: [
    CommonModule,
    CoreModule
  ]
})
export class MyLicencesModule { }
