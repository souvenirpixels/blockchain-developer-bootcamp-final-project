import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AssetsService } from 'src/app/core/services/assets.service';
import { Asset } from 'src/app/core/models/asset.model';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { BurnModalComponent } from '../burn-modal/burn-modal.component';
import { TransferModalComponent } from '../transfer-modal/transfer-modal.component';

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
  modalRef: MDBModalRef;

  constructor(private assetsService: AssetsService, private ref: ChangeDetectorRef, public modalService: MDBModalService) { }

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
    let modalOptions = {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: '',
      containerClass: '',
      animated: true,
      data: {
        tokenId2Burn: asset.id
      }
    }
    this.modalRef = this.modalService.show(BurnModalComponent, modalOptions); 
  }

  onTransferClick(asset: Asset) {
    let modalOptions = {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: '',
      containerClass: '',
      animated: true,
      data: {
        tokenId2Transfer: asset.id
      }
    }
    this.modalRef = this.modalService.show(TransferModalComponent, modalOptions); 
  }

}
