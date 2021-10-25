import { Component, OnInit } from '@angular/core';
import { LDAPContractService } from 'src/app/core/services/ldapcontract.service';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit {

  constructor(private ldapContractService: LDAPContractService) { }

  ngOnInit(): void { 
  }

  onMintClick() {
    this.ldapContractService.mint("http://tokenid", "http://assetid", 45.45, "0x807182EDeC7C3026f0C3E05bFFdc9C32f552A0cC").then((asset) => {
      console.log('Asset=', asset);
    });
  }
}
