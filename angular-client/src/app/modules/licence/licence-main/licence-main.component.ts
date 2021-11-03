import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from 'src/app/core/models/asset.model';
import { LDAPContractService } from 'src/app/core/services/ldapcontract.service';

@Component({
  selector: 'app-licence-main',
  templateUrl: './licence-main.component.html',
  styleUrls: ['./licence-main.component.scss']
})
export class LicenceMainComponent implements OnInit {
  assetList: Asset[];
  assetListString: String;

  constructor(private ldapContractService: LDAPContractService) { }

  ngOnInit(): void {
  }

  // TODO NEXT: FIX THE DISPLAY TO WORK PROPERLY

  onSearchClick() {
    this.ldapContractService.search().subscribe((response) =>{
      this.assetList = response;
      this.assetListString = JSON.stringify(this.assetList);
    })
  }
}
