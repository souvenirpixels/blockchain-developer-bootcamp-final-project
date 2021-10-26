import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  connectedAccount: string;

  constructor(private web3Service: Web3Service) {
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
  }
}
