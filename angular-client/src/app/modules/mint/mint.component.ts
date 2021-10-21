import { Component, OnInit } from '@angular/core';

import { Web3Service } from '../../core/services/web3.service';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit {

  constructor(private web3Service: Web3Service) { }

  ngOnInit(): void {
    console.log('Mint loaded');
  }

}
