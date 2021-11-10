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

   // TODO: Have this return an observable of items that are being minted
   // TODO: Think I need to create an asset service, so it can  read the JSON and get the photo thumbnail to be read and show in progress
   mint(tokenURI: string, assetURI: string, price: number): Promise<Asset> {
    return new Promise((resolve, reject) => {
      if (this.connectedAccount) {
        console.log('Running Mint');
        this.ldapContractInstance.mint(tokenURI, assetURI, price*100, this.connectedAccount, {from: this.connectedAccount}).then((ret:any) => {
          console.log('ret', ret.logs[0].args);

          resolve(ret);
        }).catch((e:any) => {
          reject(e);
        });
      } else {
        reject('Please connect metamask to mint.');
      }
    });
   }
  
   search(): Observable <Asset[]> {
    this.ldapContractInstance.totalSupply().then((totalSupplyBN: BN) => {
      const totalSupply = totalSupplyBN.toNumber();
      console.log('totalSupply=', totalSupply);
      this.assetListCache = []; // Blank out cache so can be reloaded
      for (let t=1; t <= totalSupply; ++t) {
        var tBN = new BN(t);
        this.ldapContractInstance.assetInfo(tBN).then((a: any) => {
          let newAsset: Asset = new Asset(a.URI, '', a.price.toNumber() / 100, a.owner, t);
          
          this.http.get<Asset>(a.URI)
          .pipe(map(response => {
              newAsset.setTokenURIData(response);
              this.assetListCache.push(newAsset);
              this.assetListSubject.next(this.assetListCache);
          })).subscribe(
            data => { },
            error => {
              if (error.message) {
                newAsset.errorMessage = error.message;
              } else {
                newAsset.errorMessage = error;
              }
              this.assetListCache.push(newAsset);
              this.assetListSubject.next(this.assetListCache);
            }
          );  
        }); 
      }
    });
    return this.assetListSubject.asObservable();
   }
}
