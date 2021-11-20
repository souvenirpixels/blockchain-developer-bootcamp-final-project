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
  errorMessage: string;

  constructor(private assetsService: AssetsService, private ref: ChangeDetectorRef) { }

  // TODO: Later, right now if you change accounts, there is no loading symbol, can't do it because don't via init, 
  // however, could change init to return a subscription to a "loading" event, then subscribe and have it show or hide the loading
  // whenever the user changes the connected user, for later.
  ngOnInit(): void {
      this.loading = true;
      this.assetsService.init().then((resp) => {
      }).catch((e: any) => {
        console.warn('Error on my NFTs', e);
        this.errorMessage = e;
        this.loading = false;
      });
      
      this.subscription = this.assetsService.getMyAssets().subscribe((resp: Asset[]) => {
        this.errorMessage = ''; // Clear error messages

        this.myAssets = [...resp]; // Clone the myAssets array
        if (resp.length === 0) {
          this.errorMessage = 'No NFTs found for this wallet.' 
        }
        
        this.loading = false;
        this.ref.detectChanges();
      }, 
      (err) => {
        this.errorMessage = err; 
        this.loading = false;
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
