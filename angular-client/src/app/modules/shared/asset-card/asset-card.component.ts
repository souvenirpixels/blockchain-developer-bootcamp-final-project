import { Component, Input, OnInit } from '@angular/core';
import { Asset } from 'src/app/core/models/asset.model';

@Component({
  selector: 'app-asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss']
})
export class AssetCardComponent implements OnInit {
  @Input() asset: Asset;
  constructor() { }

  ngOnInit(): void {
  }

}
