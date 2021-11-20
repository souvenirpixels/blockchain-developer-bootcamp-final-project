import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { AssetsService } from 'src/app/core/services/assets.service';

@Component({
  selector: 'app-transfer-modal',
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss']
})
export class TransferModalComponent implements OnInit {
  tokenId2Transfer: number;
  transferAddress: string;
  errorMessage: string;
  constructor(public modalRef: MDBModalRef, private assetsService: AssetsService) { }

  ngOnInit(): void {
  }

  handleTransferClick() {
    this.errorMessage = '';
    if  (!this.transferAddress) {
      this.errorMessage = 'Transfer address cannot be blank';
    } else {
      this.assetsService.checkAddressValid(this.transferAddress).then((validAddress) => {
        this.modalRef.hide();
        this.assetsService.transfer(this.tokenId2Transfer, validAddress).then((resp) => {
          // Do nothing, will be handled by the subscription
        }).catch((e) => {
          if (e && e.message) {
            this.errorMessage = e.message;
          } else {
            this.errorMessage = e;
          }
        });   
      }).catch((e) => {
        this.errorMessage = e;
      });
    }
  }
}
