import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Asset, AssetStatusEnum, PhotoSizeEnum } from 'src/app/core/models/asset.model';

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss']
})
export class AssetCardComponent implements OnInit {
  @Input() asset: Asset;
  @Input() buyButton: boolean = true;
  @Input() errorMessage: string = '';
  @Input() showMiningMessages: boolean = false;
  @Input() showDetails: boolean = true;
  @Input() showSpinny: boolean = false;
  @Input() showTokenId: boolean = false;
  @Input() showPrice: boolean = false;
  @Input() showTokenURI: boolean = false;
  @Input() showBurnTransferButtons: boolean = false;

  @Output() burnClick: EventEmitter<Asset> = new EventEmitter();
  @Output() transferClick: EventEmitter<Asset> = new EventEmitter();
  @Output() buyLicenceClick: EventEmitter<Asset> = new EventEmitter();


  imageURL: string;
  private photoSizeEnum = PhotoSizeEnum;
  assetStatusEnum = AssetStatusEnum;
  
  constructor() { }

  ngOnInit(): void {
    try {
      this.imageURL = this.asset.getPhotoSrc(this.photoSizeEnum.MEDIUM);
    } catch (e) {
      console.log('Error getting photo src:', e);
      this.errorMessage = 'Invalid Image URL';
    }
  }

}
