import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Asset } from '../models/asset.model';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import BN from 'bn.js';
import { map } from 'rxjs/operators';


declare let require: any;
const LDAP_artifacts = require('../../contracts/UDALProtocol.json');

@Injectable({
  providedIn: 'root'
})
export class LDAPContractService {
  ldapContractInstance: any;
  private assetListCache: Asset[] = [];
  private assetListSubject: Subject<Asset[]> = new ReplaySubject<Asset[]>();
  connectedAccount: string;

  constructor(private web3Service: Web3Service, private http: HttpClient) {
    this.web3Service.artifactsToContract(LDAP_artifacts).then((LDAPAbstraction) => {
      LDAPAbstraction.deployed().then((inst: any) => {
        this.ldapContractInstance = inst;
      });
    });
    this.web3Service.getAcccount().subscribe(resp => {
      if (resp && resp[0]) {
        this.connectedAccount = resp[0];
      } else {
        this.connectedAccount = '';
      } 
    });
   }

   mint(tokenURI: string, assetURI: string, price: number): Promise<Asset> {
    if (this.connectedAccount) {
      const trans = this.ldapContractInstance.mint(tokenURI, assetURI, price*100, this.connectedAccount, {from: this.connectedAccount});
      return trans;  
    } else {
      throw new Error('Unabled to mint without connected web3 account');
    }
   }
  
   search(): Observable <Asset[]> {
    this.ldapContractInstance.totalSupply().then((totalSupplyBN: BN) => {
      const totalSupply = totalSupplyBN.toNumber();
      console.log('totalSupply=', totalSupply);
      this.assetListCache = []; // Blank out cache so can be reloaded
      for (let t=1; t <= totalSupply; ++t) {
        var tBN = new BN(t);
        this.ldapContractInstance.assetInfo(tBN).then((a: any) => {
          this.assetListCache.push(new Asset(a.URI, '', a.price.toNumber() / 100, a.owner, t));
          this.assetListSubject.next(this.assetListCache);
          this.http.get(a.URI)
          .pipe(map(response => {
              console.log('Response=', response);
          })).subscribe(
            data => console.log('success', data),
            error => console.log('oops', error)
          );  
        }); 
      }
    });
    return this.assetListSubject.asObservable();
   }
}
