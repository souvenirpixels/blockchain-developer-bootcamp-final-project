import { Web3Service } from './web3.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Asset, AssetStatusEnum } from '../models/asset.model';
import { LDAPContractService } from './ldapcontract.service';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  private assetStatusEnum = AssetStatusEnum;

  private pendingAssetsSubject: Subject<Asset[]> = new ReplaySubject<Asset[]>();
  private pendingAssetsCache: Asset[] = [];

  private myAssetsSubject: Subject<Asset[]> = new Subject<Asset[]>();
  private myAssetsCache: Asset[] = [];

  private connectedAccount: string;

  private getAccountSubscription: any;

  constructor(private ldapContractService: LDAPContractService, private http: HttpClient, private web3Service: Web3Service) {

  }

  // When the page reloads the account changes from undefined to logged in account
  // This then triggers reading from the blockchain.  However, this takes some time, but if done in the constructor then
  // not possible to do a loading sign via the UI. This init function is used to initalize and a spinny can be used in the UI
  async init(): Promise<any> {
    //return new Promise((resolve, reject) => {
      if (!this.getAccountSubscription) {
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
                const assets: Asset[] = await this.getAssetsPromise();
                this.myAssetsCache = assets;
                this.myAssetsSubject.next(this.myAssetsCache);
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
      //} else {
      //  resolve(true); // if not needd to initalize then just return true
      }  
      return this.web3Service.init();

    //});
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
          if (error.message) {
            reject(error.message);
          } else {
            reject(error.error);
          }
        }
      );  
    });    
  }

  private async getAssetsPromise() {
    let promises: Promise<Asset>[] = [];
    let balance = await this.ldapContractService.balanceOfConnectedAccount();
    for (let i=0; i < balance; ++i) {
      let tokenId = await this.ldapContractService.tokenOfConnectedAccountByIndex(i);
      let asset = await this.ldapContractService.assetInfo(tokenId);
      promises.push(this.readMetadata(asset));
    }

    return Promise.all(promises);
  }

  // Did it this way so only one next so all assets are shown at the same time
  // Otherwise there is a bit of a flickr when the load one at a time which doesn't look good in the UI
  getMyAssets(): Observable<Asset[]> {
    // If no assets in cache then get them
    if (this.myAssetsCache === []) {
      console.log('Getting new assets', this.myAssetsCache);
      this.getAssetsPromise().then((assets) => {
        console.log('Got new assets', assets);
        this.myAssetsCache = assets;
        this.myAssetsSubject.next(this.myAssetsCache);
      });
    }

    return this.myAssetsSubject.pipe(startWith(this.myAssetsCache));
  }

  getPendingAssets(): Observable<Asset[]> {
    return this.pendingAssetsSubject.asObservable();
  }

  mintAsset(tokenURI: string, assetURI: string, price: number): Promise<Asset> {
    return new Promise((resolve, reject) => {
      let asset = new Asset(tokenURI, assetURI, price*100);
      
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
        reject (e);
      })
    });
  }
}
