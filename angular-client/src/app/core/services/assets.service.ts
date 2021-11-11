import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Asset, AssetStatusEnum } from '../models/asset.model';
import { LDAPContractService } from './ldapcontract.service';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  constructor(private ldapContractService: LDAPContractService, private http: HttpClient) { }

  private pendingAssetsSubject: Subject<Asset[]> = new Subject<Asset[]>();
  private pendingAssetsCache: Asset[] = [];

  private assetStatusEnum = AssetStatusEnum;

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

  // TODO: Update the UI to show the status' correctly

  mintAsset(tokenURI: string, assetURI: string, price: number): Promise<Asset> {
    console.log('Minting Asset');
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
          resolve(asset);
        }).catch((e) => {
          this.pendingAssetsCache[newLength-1].status = this.assetStatusEnum.ERROR;
          this.pendingAssetsSubject.next(this.pendingAssetsCache);
          reject (e);
        });
      }).catch((e) => {
        reject (e);
      })


    });
  }
}
