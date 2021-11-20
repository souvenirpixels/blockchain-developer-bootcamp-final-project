import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md'
import { AssetsService } from 'src/app/core/services/assets.service';

@Component({
  selector: 'app-burn-modal',
  templateUrl: './burn-modal.component.html',
  styleUrls: ['./burn-modal.component.scss']
})
export class BurnModalComponent implements OnInit {
  tokenId2Burn: number;

  constructor(public modalRef: MDBModalRef, private assetsService: AssetsService ) { }

  ngOnInit(): void {
  }

  handleDeleteClick() {
    this.assetsService.burn(this.tokenId2Burn);
    this.modalRef.hide();
  }
}
