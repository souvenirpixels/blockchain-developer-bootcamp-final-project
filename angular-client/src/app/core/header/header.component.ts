import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  connectedAccount: string;

  constructor(private web3Service: Web3Service) { }
  
  ngOnInit(): void {
    this.connectedAccount = '';
    this.web3Service.accountsObservable.subscribe(resp => {
      if (resp[0]) {
        this.connectedAccount = resp[0];
      } else {
        this.connectedAccount = '';
      } 
    });
  }

  onConnectClick() {
    this.web3Service.bootstrapWeb3();
  }
}
