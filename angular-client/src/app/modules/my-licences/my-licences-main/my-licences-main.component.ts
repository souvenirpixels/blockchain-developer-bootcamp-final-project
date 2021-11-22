import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { Asset } from 'src/app/core/models/asset.model';
import { AssetsService } from 'src/app/core/services/assets.service';

@Component({
  selector: 'app-my-licences-main',
  templateUrl: './my-licences-main.component.html',
  styleUrls: ['./my-licences-main.component.scss']
})
export class MyLicencesMainComponent implements OnInit {
  allAssets: Asset[] = [];
  loading: boolean = false;
  private subscription: any;
  errorMessage: string;

  constructor(private assetsService: AssetsService, private ref: ChangeDetectorRef, private http: HttpClient) { }

  ngOnInit(): void {
    this.loading = true;
    this.assetsService.init().then((resp) => {
    }).catch((e: any) => {
      console.warn('Error on all NFTs', e);
      this.errorMessage = e;
      this.loading = false;
    });
    
    this.subscription = this.assetsService.getAllAssets().pipe(
      map(assets => assets.filter(asset => asset.licenceStatus === this.assetsService.licenceStatusEnum.LICENCED)),
      filter(assets => assets && assets.length > 0)
    ).subscribe((resp: Asset[]) => {
      this.errorMessage = ''; // Clear error messages

      this.allAssets = [...resp]; // Clone the myAssets array
      if (resp.length === 0) {
        this.errorMessage = 'No NFTs found.' 
      }
      
      this.loading = false;
      this.ref.detectChanges();
    }, 
    (err) => {
      this.errorMessage = err; 
      this.loading = false;
    });
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}