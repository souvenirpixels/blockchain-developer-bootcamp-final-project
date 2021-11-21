import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
import { Asset } from '../models/asset.model';
import BN from 'bn.js';

declare let require: any;
const LDAP_artifacts = require('../../contracts/UDALProtocol.json');

@Injectable({
  providedIn: 'root'
})
export class LDAPContractService {
  private ldapContractInstance: any;
  connectedAccount: string;

  constructor(private web3Service: Web3Service) { }

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
        this.ldapContractInstance.mint(asset.tokenURI, asset.assetURI, new BN(this.web3Service.toWei(asset.price.toString())), this.connectedAccount, {from: this.connectedAccount}).then((ret:any) => {
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

   async totalSupply(): Promise<number> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.ldapContractInstance.totalSupply().then((balanceBN: BN) => {
        resolve(balanceBN.toNumber());
      }).catch((e: any) => {
        reject(e);
      });
    });
  }

  async tokenByIndex(index: number): Promise<number> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.ldapContractInstance.tokenByIndex(index).then((tokenIdBN: BN) => {
        resolve(tokenIdBN.toNumber());
      }).catch((e: any) => {
        reject(e);
      });
    });
  }

  async purchaseLicence(tokenId: number, price: number) {
    await this.init();
    return new Promise((resolve, reject) => {
      const weiPrice = new BN(this.web3Service.toWei(price.toString()));
      this.ldapContractInstance.purchaseLicence(tokenId, {from: this.connectedAccount, value: weiPrice}).then((resp: any) => {
        resolve(resp);
      }).catch((e: any) => {
        reject(e);
      });
    });
  }

   async burn(tokenId: number): Promise<number> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.ldapContractInstance.burn(tokenId, {from: this.connectedAccount}).then((resp: any) => {
        resolve(resp);
      }).catch((e: any) => {
        reject(e);
      });
    });
   }

   async transfer(tokenId: number, address: string): Promise<number> {
    await this.init();
    return new Promise((resolve, reject) => {
        this.ldapContractInstance.safeTransferFrom(this.connectedAccount, address, tokenId, {from: this.connectedAccount}).then((resp: any) => {
          resolve(resp);
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
    await this.init();
    return new Promise((resolve, reject) => {
      this.ldapContractInstance.assetInfo(index).then((asset: any) => {
        const ethPrice: number = +this.web3Service.fromWei(asset.price.toString());
        let newAsset: Asset = new Asset(asset.URI, '', ethPrice, asset.owner, index);
        resolve(newAsset);
      }).catch((e: any) => {
        reject(e);
      });
    });
   }
}
