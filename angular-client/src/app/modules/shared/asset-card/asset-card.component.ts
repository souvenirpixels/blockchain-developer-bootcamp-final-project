import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Asset, AssetStatusEnum, LicenceStatusEnum, PhotoSizeEnum } from 'src/app/core/models/asset.model';

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
  @Input() showOwner: boolean = false;
  @Input() showPrice: boolean = false;
  @Input() showTokenURI: boolean = false;
  @Input() showBurnTransferButtons: boolean = false;
  @Input() showLicencingMessages: boolean = false;
  @Input() showDownloadButton: boolean = false;

  @Output() burnClick: EventEmitter<Asset> = new EventEmitter();
  @Output() transferClick: EventEmitter<Asset> = new EventEmitter();
  @Output() buyLicenceClick: EventEmitter<Asset> = new EventEmitter();
  @Output() downloadClick: EventEmitter<Asset> = new EventEmitter();


  imageURL: string;
  private photoSizeEnum = PhotoSizeEnum;
  assetStatusEnum = AssetStatusEnum;
  licenceStatusEnum = LicenceStatusEnum;
  
  constructor() { }

  ngOnInit(): void {
    try {
      console.log('getting image for', this.asset);
      this.imageURL = this.asset.getPhotoSrc(this.photoSizeEnum.MEDIUM);
    } catch (e) {
      console.log('Error getting photo src:', e);
      this.errorMessage = 'Invalid Image URL';
    }
  }
     
}
