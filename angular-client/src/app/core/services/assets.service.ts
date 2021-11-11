import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Asset } from '../models/asset.model';
import { LDAPContractService } from './ldapcontract.service';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  constructor(private ldapContractService: LDAPContractService, private http: HttpClient) { }

  private pendingAssetsSubject: Subject<Asset[]> = new Subject<Asset[]>();
  private pendingAssetsCache: Asset[] = [];

  getPendingAssets(): Observable<Asset[]> {
    return this.pendingAssetsSubject.asObservable();
  }

  private readMetadata(asset: Asset): Promise<Asset> {
    console.log('Reading Metadata');
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

  // TODO: Next should load the JSON into the asset before even minting, if URI not valid then don't mint.
  //       Should have a status that shows a spinny over the photo while being minted. Then should change once the block has been mined

  mintAsset(tokenURI: string, assetURI: string, price: number): Promise<Asset> {
    console.log('Minting Asset');
    return new Promise((resolve, reject) => {
      this.ldapContractService.mint(tokenURI, assetURI, price).then((asset) => {
        this.pendingAssetsCache.push(asset);
        this.pendingAssetsSubject.next(this.pendingAssetsCache);
        console.log('Asset Minted');
        resolve(asset);
      }).catch((e) => {
        reject (e);
      });     
    });
  }
}
