import { Component, OnInit } from '@angular/core';
import { LDAPContractService } from 'src/app/core/services/ldapcontract.service';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.scss']
})
export class MintComponent implements OnInit {
  photoURL: string;
  metadataURL: string;
  price: number;

  constructor(private ldapContractService: LDAPContractService) { }

  ngOnInit(): void { 
    //this.owner = ldap
  }

  onMintClick() {
    this.ldapContractService.mint(this.metadataURL, this.photoURL, this.price).then((asset) => {
      console.log('Asset=', asset);
    });
  }
}
