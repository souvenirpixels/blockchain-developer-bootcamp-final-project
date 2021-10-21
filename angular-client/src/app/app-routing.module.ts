import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MintComponent } from './modules/mint/mint.component';

const routes: Routes = [
  { path: '', component: MintComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
