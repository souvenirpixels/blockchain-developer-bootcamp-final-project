import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicenceComponent } from './modules/licence/licence.component';
import { MintComponent } from './modules/mint/mint.component';
import { NftsComponent } from './modules/nfts/nfts.component';

const routes: Routes = [
  { path: '', component: MintComponent },
  { path: 'mint', component: MintComponent },
  { path: 'licence', component: LicenceComponent },
  { path: 'nfts', component: NftsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
