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
    this.ldapContractService.mint("http://tokenid", "http://assetid", 45.45, "0x01110b38B176Ff1E208b0566a3bBaEc37954f5CA").then((asset) => {
      console.log('Asset=', asset);
    });
  }
}
