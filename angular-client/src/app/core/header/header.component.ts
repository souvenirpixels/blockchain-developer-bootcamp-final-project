import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MDBModalRef, MDBModalService } from 'angular-bootstrap-md';
import { ConnectedComponent } from '../modals/connected/connected.component';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  connectedAccount: string;
  modalRef: MDBModalRef;

  constructor(private web3Service: Web3Service, private modalService: MDBModalService, private ref: ChangeDetectorRef) {
  }
  
  ngOnInit(): void {
    this.web3Service.getAcccount().subscribe(resp => {
      if (resp && resp[0]) {
        this.connectedAccount = this.web3Service.getDisplayAcccount(resp[0]);
      } else {
        this.connectedAccount = '';
      } 
      this.ref.detectChanges(); // This changes button after a change
    });
  }

  onConnectClickPopup() {
      let modalOptions = {
      backdrop: true,
      keyboard: true,
      focus: true,
      show: false,
      ignoreBackdropClick: true,
      class: 'modal-lg',
      containerClass: '',
      animated: true,
      data: { email: '' }
    }

    this.modalRef = this.modalService.show(ConnectedComponent, modalOptions);    
  }

  onConnectClickNotConnected() {
    this.web3Service.connectWeb3(true);
  }
}
