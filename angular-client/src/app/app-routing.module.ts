import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicenceMainComponent } from './modules/licence/licence-main/licence-main.component';
import { MintMainComponent } from './modules/mint/mint-main/mint-main.component';
import { NftsMainComponent } from './modules/nfts/nfts-main/nfts-main.component';

const routes: Routes = [
  { path: '', component: MintMainComponent },
  { path: 'mint', component: MintMainComponent },
  { path: 'licence', component: LicenceMainComponent },
  { path: 'nfts', component: NftsMainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
