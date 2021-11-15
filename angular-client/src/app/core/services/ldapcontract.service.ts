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
  private ldapContractInstance: any;
  private assetListCache: Asset[] = [];
  private assetListSubject: Subject<Asset[]> = new ReplaySubject<Asset[]>();

  connectedAccount: string;

  constructor(private web3Service: Web3Service, private http: HttpClient) { }

   private initializationPromise: Promise<any>;

   private async doInit() {
    this.web3Service.getAcccount().subscribe(resp => {
      if (resp && resp[0]) {
        this.connectedAccount = resp[0];
      } else {
        this.connectedAccount = '';
      } 
    });
    let LDAPAbstraction = await this.web3Service.artifactsToContract(LDAP_artifacts);
    this.ldapContractInstance = await LDAPAbstraction.deployed();
   }

   // Used because constructor can't be async
   private async init() {
    // prevent concurrent calls firing initialization more than once
    if (!this.ldapContractInstance) {
      this.ldapContractInstance = this.doInit();
    }
    return this.ldapContractInstance;
   }

   async mint(asset: Asset): Promise<Asset> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (this.connectedAccount) {
        this.ldapContractInstance.mint(asset.tokenURI, asset.assetURI, asset.price*100, this.connectedAccount, {from: this.connectedAccount}).then((ret:any) => {
          asset.owner = this.connectedAccount;
          resolve(asset);
        }).catch((e:any) => {
          reject(e);
        });
      } else {
        reject('Please connect metamask to mint.');
      }
    });
   }
  
   async balanceOfConnectedAccount(): Promise<number> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.ldapContractInstance.balanceOf(this.connectedAccount).then((balanceBN: BN) => {
        resolve(balanceBN.toNumber());
      }).catch((e: any) => {
        reject(e);
      });
    });
   }

   async tokenOfConnectedAccountByIndex(index: number): Promise<number> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.ldapContractInstance.tokenOfOwnerByIndex(this.connectedAccount, index).then((tokenBN: BN) => {
        resolve(tokenBN.toNumber());
      }).catch((e: any) => {
        reject(e);
      });
    });
   }

   async assetInfo(index: number): Promise<Asset> {
     console.log('Getting asset info from blockchain');
    await this.init();
    return new Promise((resolve, reject) => {
      this.ldapContractInstance.assetInfo(index).then((asset: any) => {
        let newAsset: Asset = new Asset(asset.URI, '', asset.price.toNumber() / 100, asset.owner, index);
        resolve(newAsset);
      }).catch((e: any) => {
        reject(e);
      });
    });
   }

   search(): Observable <Asset[]> {
    this.init().then(() => {
      this.ldapContractInstance.totalSupply().then((totalSupplyBN: BN) => {
        const totalSupply = totalSupplyBN.toNumber();
  
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
    });
    return this.assetListSubject.asObservable();
   }
}
