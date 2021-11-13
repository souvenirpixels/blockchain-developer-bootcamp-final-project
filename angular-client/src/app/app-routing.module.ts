import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicenceMainComponent } from './modules/licence/licence-main/licence-main.component';
import { MintMainComponent } from './modules/mint/mint-main/mint-main.component';
import { MyLicencesMainComponent } from './modules/my-licences/my-licences-main/my-licences-main.component';
import { MyNftsMainComponent } from './modules/my-nfts/my-nfts-main/my-nfts-main.component';

const routes: Routes = [
  { path: '', component: MintMainComponent },
  { path: 'mint', component: MintMainComponent },
  { path: 'licence', component: LicenceMainComponent },
  { path: 'my-nfts', component: MyNftsMainComponent },
  { path: 'my-licences', component: MyLicencesMainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
