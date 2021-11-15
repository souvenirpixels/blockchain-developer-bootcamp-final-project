import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/core/services/assets.service';
import { Asset } from 'src/app/core/models/asset.model';

@Component({
  selector: 'app-my-nfts-main',
  templateUrl: './my-nfts-main.component.html',
  styleUrls: ['./my-nfts-main.component.scss']
})
export class MyNftsMainComponent implements OnInit {
  myAssets: Asset[] = [];
  loading: boolean = false;
  private subscription: any;

  constructor(private assetsService: AssetsService, private ref: ChangeDetectorRef) { }

  // TODO: Later, right now if you change accounts, there is no loading symbol, can't do it because don't via init, 
  // however, could change init to return a subscription to a "loading" event, then subscribe and have it show or hide the loading
  // whenever the user changes the connected user, for later.
  ngOnInit(): void {
      this.loading = true;
      this.assetsService.init().then((resp) => {
        console.log('Getting new assets');
        this.subscription = this.assetsService.getMyAssets().subscribe((resp: Asset[]) => {
          console.log('my NFTs main got new assets', resp);
          this.myAssets = [...resp]; // Clone the myAssets array
          this.loading = false;
          this.ref.detectChanges();
        });
      });
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  onBurnClick(asset: Asset) {
    console.log('Clicked burn', asset);
  }

  onTransferClick(asset: Asset) {
    console.log('Clicked transfer', asset);
  }

}
