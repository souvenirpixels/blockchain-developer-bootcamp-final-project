import { Component, OnInit } from '@angular/core';
import { LDAPContractService } from 'src/app/core/services/ldapcontract.service';

@Component({
  selector: 'app-mint-main',
  templateUrl: './mint-main.component.html',
  styleUrls: ['./mint-main.component.scss']
})
export class MintMainComponent implements OnInit {
  photoURL: string='ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j'; // Default for testing fix later
  metadataURL: string='http://localhost:4200/assets/morainelake.json'; // Default for testing fix later
  price: number;
  errorMessage: string;

  constructor(private ldapContractService: LDAPContractService) { }

  ngOnInit(): void { 
  }

  onMintClick() {
    this.errorMessage = '';
    let validPrefixes = ["http", "https", "ipfs", "ar"];

    // All fields required to mint an NFT
    if (!this.metadataURL || !this.photoURL || !this.price) {
      this.errorMessage =  "Metadata URL, photo URL and price all required to mint asset";
    } else if (this.price < 0) {
      this.errorMessage =  "Price must be greater than zero";
    
    // Check if start URLs start with "http", "https", "ipfs", or "ar"
    } else if (!validPrefixes.some(v => this.metadataURL.substr(0, this.metadataURL.indexOf('://')).includes(v)) || 
               !validPrefixes.some(v => this.photoURL.substr(0, this.photoURL.indexOf('://')).includes(v))) {
      this.errorMessage =  "Metadata URL and photoURL must start with: http://, https://, ipfs:// or ar://";
    } else {
      this.ldapContractService.mint(this.metadataURL, this.photoURL, this.price).then((asset) => {
        console.log('Asset=', asset);
      }).catch((e) => {
        console.log('Error=', e);
        if (e.message) {
          this.errorMessage = e.message;  
        } else {
          this.errorMessage = e;
        }
      });    
    }
  }
}
