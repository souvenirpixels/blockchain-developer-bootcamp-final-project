import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/core/services/assets.service';
import { Asset } from 'src/app/core/models/asset.model';

@Component({
  selector: 'app-my-nfts-main',
  templateUrl: './my-nfts-main.component.html',
  styleUrls: ['./my-nfts-main.component.scss']
})
export class MyNftsMainComponent implements OnInit {
  myAssets: Asset[];

  constructor(private assetsService: AssetsService, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.assetsService.getMyAssets().subscribe((resp: Asset[]) => {
      console.log('Got my assets', resp);
      this.myAssets = resp;
      this.ref.detectChanges();
    });
  }

  onBurnClick(asset: Asset) {
    console.log('Clicked burn', asset);
  }

  onTransferClick(asset: Asset) {
    console.log('Clicked transfer', asset);
  }

}
