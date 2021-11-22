import { ChangeDetectorRef, Component, OnInit } from '@angular/core';import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
;
import { Asset } from 'src/app/core/models/asset.model';
import { AssetsService } from 'src/app/core/services/assets.service';

@Component({
  selector: 'app-licence-main',
  templateUrl: './licence-main.component.html',
  styleUrls: ['./licence-main.component.scss']
})
export class LicenceMainComponent implements OnInit {
  allAssets: Asset[] = [];
  loading: boolean = false;
  private subscription: any;
  errorMessage: string;

  constructor(private assetsService: AssetsService, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loading = true;
    this.assetsService.init().then((resp) => {
    }).catch((e: any) => {
      console.warn('Error on all NFTs', e);
      this.errorMessage = e;
      this.loading = false;
    });
    
    this.subscription = this.assetsService.getAllAssets().subscribe((resp: Asset[]) => {
      this.errorMessage = ''; // Clear error messages

      this.allAssets = [...resp]; // Clone the myAssets array
      if (resp.length === 0) {
        this.errorMessage = 'No NFTs found.  You may need to connect your Metamask wallet.' 
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

  onBuyLicenceClick(asset: Asset) {
    this.assetsService.purchaseLicence(asset);
  }

}
