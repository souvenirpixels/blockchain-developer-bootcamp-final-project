import { Component, Input, OnInit } from '@angular/core';
import { Asset, PhotoSizeEnum } from 'src/app/core/models/asset.model';

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss']
})
export class AssetCardComponent implements OnInit {
  @Input() asset: Asset;
  imageURL: string;
  errorMessage: string;
  photoSizeEnum = PhotoSizeEnum;
  
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
