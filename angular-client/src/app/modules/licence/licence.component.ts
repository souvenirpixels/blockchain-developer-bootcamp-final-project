import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Asset } from 'src/app/core/models/asset.model';
import { LDAPContractService } from 'src/app/core/services/ldapcontract.service';

@Component({
  selector: 'app-licence',
  templateUrl: './licence.component.html',
  styleUrls: ['./licence.component.scss']
})
export class LicenceComponent implements OnInit {
  assetList: Asset[];
  assetListString: String;

  constructor(private ldapContractService: LDAPContractService) { }

  ngOnInit(): void {
  }

  onSearchClick() {
    this.ldapContractService.search().subscribe((response) =>{
      this.assetList = response;
      this.assetListString = JSON.stringify(this.assetList);
    })
  }
}
