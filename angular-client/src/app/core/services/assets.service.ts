import { Web3Service } from './web3.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Asset, AssetStatusEnum, LicenceStatusEnum } from '../models/asset.model';
import { LDAPContractService } from './ldapcontract.service';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  public assetStatusEnum = AssetStatusEnum;
  public licenceStatusEnum = LicenceStatusEnum;;

  private pendingAssetsSubject: Subject<Asset[]> = new ReplaySubject<Asset[]>();
  private pendingAssetsCache: Asset[] = [];

  private myAssetsSubject: Subject<Asset[]> = new Subject<Asset[]>();
  private myAssetsCache: Asset[] = [];

  private allAssetsSubject: Subject<Asset[]> = new Subject<Asset[]>();
  private allAssetsCache: Asset[] = [];

  private connectedAccount: string;

  private getAccountSubscription: any;

  constructor(private ldapContractService: LDAPContractService, private http: HttpClient, private web3Service: Web3Service) {

  }

  // When the page reloads the account changes from undefined to logged in account
  // This then triggers reading from the blockchain.  However, this takes some time, but if done in the constructor then
  // not possible to do a loading sign via the UI. This init function is used to initalize and a spinny can be used in the UI
  async init(): Promise<any> {
      if (!this.getAccountSubscription) {
        console.log('trying to get account subsription');
        this.getAccountSubscription = this.web3Service.getAcccount();
        this.getAccountSubscription.subscribe(async (resp: any) => {
          try {
            if (resp && resp[0] && this.connectedAccount !== resp[0]) {
              this.connectedAccount = resp[0];
      
              // Clear out cache because new user
              if (this.pendingAssetsCache !== []) {
                this.pendingAssetsCache = [];
              }
      
              // Reload cache for new user
              if (this.myAssetsCache !== []) {
                this.myAssetsCache = await this.getAssetsPromise();;
                this.myAssetsSubject.next(this.myAssetsCache);
              }

              if (this.allAssetsCache !== []) {
                this.allAssetsCache = await this.getAllAssetsPromise();;
                this.allAssetsSubject.next(this.allAssetsCache);
              }
            } else {
              // This will happen if user disconnects metamask, clear the caches  
              this.connectedAccount = '';
              this.myAssetsCache = [];
              this.myAssetsSubject.next(this.myAssetsCache);
            } 
          } catch(e) {
            throw e;
          }
        });
      }  
      return this.web3Service.init();
  }

  private readMetadata(asset: Asset): Promise<Asset> {
    return new Promise((resolve, reject) => {
      this.http.get<Asset>(asset.tokenURI)
      .pipe(map(response => {
        asset.setTokenURIData(response);
        resolve(asset);
      })).subscribe(
        data => {  },
        error => {
          reject(new Error('Readmetadata http error'));
        }
      );  
    });    
  }

  // Did it this way so only one next so all assets are shown at the same time
  // Otherwise there is a bit of a flickr when the load one at a time which doesn't look good in the UI
  private async getAssetsPromise() {
    let promises: Promise<Asset>[] = [];
    let balance = await this.ldapContractService.balanceOfConnectedAccount();
    for (let i=0; i < balance; ++i) {
      let tokenId = await this.ldapContractService.tokenOfConnectedAccountByIndex(i);
      let asset = await this.ldapContractService.assetInfo(tokenId);
      promises.push(this.readMetadata(asset));
    }

    // This can be done with Promise.allSettled in future vesrions of Typscript
    // All these does is return only the non error promises
    const results = await Promise.all(promises.map(p => p.catch(e => e)));
    return results.filter(result => !(result instanceof Error));
  }

  getMyAssets(): Observable<Asset[]> {
    // If no assets in cache then get them
    if (this.myAssetsCache.length === 0) {
      this.getAssetsPromise().then((assets) => {
        this.myAssetsCache = assets;
        this.myAssetsSubject.next(this.myAssetsCache);
      }).catch((e) => {
        console.warn('Error getting assets', e);
      });
    }

    return this.myAssetsSubject.pipe(startWith(this.myAssetsCache));
  }

  private async getAllAssetsPromise() {
    let promises: Promise<Asset>[] = [];
    let totalSupply = await this.ldapContractService.totalSupply();
    
    for (let i=0; i < totalSupply; ++i) {
      let tokenId = await this.ldapContractService.tokenByIndex(i);
      let asset = await this.ldapContractService.assetInfo(tokenId);
      try {
        let assetURI = await this.ldapContractService.assetURI(tokenId);
        asset.licenceStatus = this.licenceStatusEnum.LICENCED;
        asset.assetURI = assetURI;
      } catch {
        // TODO: This is very hacky, future version will use an Enumerable ERC1155 token for licences so will be much easier to traverse ERC1155 contract
        console.log('Failed to get assetURI', asset);
      }
      
      promises.push(this.readMetadata(asset));
    }

    const results = await Promise.all(promises.map(p => p.catch(e => e)));
    return results.filter(result => !(result instanceof Error));
  }

  getAllAssets(): Observable<Asset[]> {
    // If no assets in cache then get them
    if (this.allAssetsCache.length === 0) {
      this.getAllAssetsPromise().then((assets) => {
        this.allAssetsCache = assets;
        this.allAssetsSubject.next(this.allAssetsCache);
      });
    }
    return this.allAssetsSubject.pipe(startWith(this.allAssetsCache));
  }

   purchaseLicence(asset: Asset): Promise<any> {
    return new Promise((resolve, reject) => {
      let tokenId = asset.id!;
      let index = this.allAssetsCache.map(function(e) { return e.id; }).indexOf(tokenId);

      if (index===-1) {
        reject('Unable to find tokenId');
      }
      this.allAssetsCache[index].errorMessage = '';
      this.allAssetsCache[index].licenceStatus = this.licenceStatusEnum.PENDING;
      this.allAssetsSubject.next(this.allAssetsCache);

      this.ldapContractService.purchaseLicence(tokenId, asset.price).then((resp) => {
        // Update the allNFTs list
        this.getAllAssetsPromise().then((assets) => {
          this.allAssetsCache = assets;
          this.allAssetsSubject.next(this.allAssetsCache);
        });        
        resolve(resp);
      }).catch((e) => {
        index = this.allAssetsCache.map(function(e) { return e.id; }).indexOf(tokenId); // could change if others burnedsince index read
        this.allAssetsCache[index].licenceStatus = this.licenceStatusEnum.ERROR
        if (e && e.message) {
          this.allAssetsCache[index].errorMessage = e.message;
        } else {
          this.allAssetsCache[index].errorMessage = e;
        }
        this.myAssetsSubject.next(this.allAssetsCache);
        reject(e);  
      });
  
    });
   }

  getPendingAssets(): Observable<Asset[]> {
    return this.pendingAssetsSubject.asObservable();
  }

  checkAddressValid(address: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.web3Service.checkValidAddress(address).then((validAddress) =>  {
          resolve(validAddress);
        }).catch((e) => {
          reject(e);
        });
      } catch (e) {
        reject (e);
      }
    });
    
  }

  transfer(tokenId: number, address:string): Promise<any> {
    return new Promise((resolve, reject) => {
      let index = this.myAssetsCache.map(function(e) { return e.id; }).indexOf(tokenId);

      if (index===-1) {
        reject('Unable to find tokenId');
      }
      this.myAssetsCache[index].errorMessage = '';
      this.myAssetsCache[index].status = this.assetStatusEnum.PENDING;
      this.myAssetsSubject.next(this.myAssetsCache);
      
      this.ldapContractService.transfer(tokenId, address).then((resp) => {
        index = this.myAssetsCache.map(function(e) { return e.id; }).indexOf(tokenId); // could change if others burnedsince index read
        this.myAssetsCache[index].status = this.assetStatusEnum.MINED;
        this.myAssetsCache.splice(index, 1);
        this.myAssetsSubject.next(this.myAssetsCache);
        resolve(resp);
      }).catch((e) => {
          index = this.myAssetsCache.map(function(e) { return e.id; }).indexOf(tokenId); // could change if others burnedsince index read
          this.myAssetsCache[index].status = this.assetStatusEnum.ERROR;
          if (e && e.message) {
            this.myAssetsCache[index].errorMessage = e.message;
          } else {
            this.myAssetsCache[index].errorMessage = e;
          }
          this.myAssetsSubject.next(this.myAssetsCache);
          reject(e);  
      })
    });
  }

  burn(tokenId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let index = this.myAssetsCache.map(function(e) { return e.id; }).indexOf(tokenId);
      if (index === -1) {
        this.myAssetsCache[index].status = this.assetStatusEnum.ERROR;
        this.myAssetsCache[index].errorMessage = 'Not found, unable to burn';
        this.myAssetsSubject.next(this.myAssetsCache);
      } else {
        this.myAssetsCache[index].errorMessage = '';
        this.myAssetsCache[index].status = this.assetStatusEnum.PENDING;
        this.myAssetsSubject.next(this.myAssetsCache);

        this.ldapContractService.burn(tokenId).then((resp) => {
          index = this.myAssetsCache.map(function(e) { return e.id; }).indexOf(tokenId); // could change if others burnedsince index read
          this.myAssetsCache[index].status = this.assetStatusEnum.MINED;
          this.myAssetsCache.splice(index, 1);
          this.myAssetsSubject.next(this.myAssetsCache);
          resolve(index);
        }).catch((e) => {
          index = this.myAssetsCache.map(function(e) { return e.id; }).indexOf(tokenId); // could change if others burnedsince index read
          this.myAssetsCache[index].status = this.assetStatusEnum.ERROR;
          if (e && e.message) {
            this.myAssetsCache[index].errorMessage = e.message;
          } else {
            this.myAssetsCache[index] = e;
          }
          this.myAssetsSubject.next(this.myAssetsCache);
          reject(e);
        });
      }
    });
  }

  mintAsset(tokenURI: string, assetURI: string, price: number): Promise<Asset> {
    return new Promise((resolve, reject) => {
      if (!this.connectedAccount) {
        reject('Please connect metamask account to mint.');
      }
      let asset = new Asset(tokenURI, assetURI, price);
      
      this.readMetadata(asset).then((resp) => {
        asset = resp;
        asset.status = this.assetStatusEnum.PENDING;
        let newLength = this.pendingAssetsCache.push(asset);
        this.pendingAssetsSubject.next(this.pendingAssetsCache);

        this.ldapContractService.mint(asset).then((asset) => {
          this.pendingAssetsCache[newLength-1].status = this.assetStatusEnum.MINED;
          this.pendingAssetsSubject.next(this.pendingAssetsCache);

          // Update the myNFTs list
          this.getAssetsPromise().then((assets) => {
            console.log('Got new assets from Mint', assets);
            this.myAssetsCache = assets;
            this.myAssetsSubject.next(this.myAssetsCache);
          });

          resolve(asset);
        }).catch((e) => {
          this.pendingAssetsCache[newLength-1].status = this.assetStatusEnum.ERROR;
          if (e.message) {
            this.pendingAssetsCache[newLength-1].errorMessage = e.message;
          } else { 
            this.pendingAssetsCache[newLength-1] = e;
          }
          
          this.pendingAssetsSubject.next(this.pendingAssetsCache);
          reject (e);
        });
      }).catch((e) => {
        console.log('Unable to mint', e);
        reject (e);
      })
    });
  }
}
