import { Component, OnInit } from '@angular/core';
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

  constructor(private web3Service: Web3Service, private modalService: MDBModalService) {
  }
  
  ngOnInit(): void {
    this.web3Service.getDisplayAcccount().subscribe(resp => {
      if (resp && resp[0]) {
        this.connectedAccount = resp[0];
      } else {
        this.connectedAccount = '';
      } 
    });
  }

  onConnectClick() {
    this.web3Service.connectWeb3WithPopup();

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
}
