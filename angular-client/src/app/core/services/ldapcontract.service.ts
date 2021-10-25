import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Asset } from '../models/asset.model';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import BN from 'bn.js';


declare let require: any;
const LDAP_artifacts = require('../../contracts/UDALProtocol.json');

@Injectable({
  providedIn: 'root'
})
export class LDAPContractService {
  ldapContractInstance: any;
  private assetListCache: Asset[] = [];
  private assetListSubject: Subject<Asset[]> = new ReplaySubject<Asset[]>();

  constructor(private web3Service: Web3Service) {
    this.web3Service.artifactsToContract(LDAP_artifacts).then((LDAPAbstraction) => {
      LDAPAbstraction.deployed().then((inst: any) => {
        this.ldapContractInstance = inst;
      });
    });
   }

   mint(tokenURI: string, assetURI: string, price: number, owner: string): Promise<Asset> {
    const trans = this.ldapContractInstance.mint(tokenURI, assetURI, price*100, owner, {from: "0x01110b38B176Ff1E208b0566a3bBaEc37954f5CA"});
    return trans;
    /*
      return this.ldapContractInstance.mint(tokenURI, assetURI, price, owner, (err: any, ev: any) => {
        return new Asset(tokenURI, assetURI, price, owner);
      });*/
   }
  
   search(): Observable <Asset[]> {
    let a = new Asset('URI', 'AssetURI', 100, 'Address');
    this.assetListCache.push(a);
    this.assetListSubject.next(this.assetListCache);
    this.ldapContractInstance.totalSupply().then((totalSupplyBN: BN) => {
      console.log('totalSupplyBN', totalSupplyBN);
      const totalSupply = totalSupplyBN.toNumber();
      for (let t=1; t < totalSupply; ++t) {
        var tBN = new BN(t);
        this.ldapContractInstance.assetInfo("1").then((a: any) => {
          console.log('t=', a);
        });
        
      }
      console.log('TotalSupply=', totalSupply);
    });
    
    return this.assetListSubject.asObservable();
   }
}
