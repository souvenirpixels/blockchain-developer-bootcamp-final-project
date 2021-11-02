import { Component, OnInit } from '@angular/core';
import { MDBModalRef } from 'angular-bootstrap-md';
import { Web3Service } from '../../services/web3.service';

@Component({
  selector: 'app-connected',
  templateUrl: './connected.component.html',
  styleUrls: ['./connected.component.scss']
})
export class ConnectedComponent implements OnInit {
  connectedAccount: string;

  constructor(public modalRef: MDBModalRef, private web3Service: Web3Service) { }

  ngOnInit(): void {
    this.web3Service.getDisplayAcccount().subscribe(resp => {
      if (resp && resp[0]) {
        this.connectedAccount = resp[0];
      } else {
        this.connectedAccount = '';
      } 
    });
  }
}
