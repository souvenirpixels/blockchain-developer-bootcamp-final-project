import { Component, OnInit } from '@angular/core';
import { Asset, AssetStatusEnum } from 'src/app/core/models/asset.model';
import { AssetsService } from 'src/app/core/services/assets.service';

@Component({
  selector: 'app-mint-main',
  templateUrl: './mint-main.component.html',
  styleUrls: ['./mint-main.component.scss']
})
export class MintMainComponent implements OnInit {
  photoURL: string; 
  metadataURL: string; 
  price: number;
  errorMessage: string;
  pendingAssetList: Asset[] = [];
  assetStatusEnum = AssetStatusEnum;
  buttonSpinny: boolean = false;

  constructor(private assetsService: AssetsService) { }

  ngOnInit(): void { 
    this.assetsService.init().then((resp) => {
      this.assetsService.getPendingAssets().subscribe((response: Asset[]) => {
        this.pendingAssetList = response;
      });
    })
  }

  onMintClick() {
    this.errorMessage = '';
    let validPrefixes = ["http", "https", "ipfs", "ar"];

    // All fields required to mint an NFT
    if (!this.metadataURL || !this.photoURL || !this.price) {
      this.errorMessage =  "Metadata URL, photo URL and price all required to mint asset";
    } else if (this.price < 0) {
      this.errorMessage =  "Price must be greater than zero";
    
    // Check if start URLs start with "http", "https", "ipfs", or "ar"
    } else if (!validPrefixes.some(v => this.metadataURL.substr(0, this.metadataURL.indexOf('://')).includes(v)) || 
               !validPrefixes.some(v => this.photoURL.substr(0, this.photoURL.indexOf('://')).includes(v))) {
      this.errorMessage =  "Metadata URL and photoURL must start with: http://, https://, ipfs:// or ar://";
    } else {
      this.assetsService.mintAsset(this.metadataURL, this.photoURL, this.price).then((asset) => {
        console.log('Asset=', asset);
      }).catch((e) => {
        if (e && e.message) {
          this.errorMessage = e.message;
        } else {
          this.errorMessage = e;
        }
      });    
    }
  }
}
