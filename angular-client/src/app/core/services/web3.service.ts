import {Injectable} from '@angular/core';
import {Observable, Subject, ReplaySubject, pipe } from 'rxjs';
import { map } from 'rxjs/operators'
declare let require: any;
const Web3 = require('web3');
const contract = require('@truffle/contract');

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class Web3Service {
  private web3: any;
  private accounts: string[];
  public ready = false;

  public accountsObservable = new ReplaySubject<string[]>();

  constructor() {
    window.addEventListener('load', (event: any) => {
      this.checkWeb3NoPopup();
    });
  }

  public getAcccount(): Observable<string[]>  {
    return this.accountsObservable.asObservable();
  }

  public getDisplayAcccount(): Observable<string[]>  {
    return this.accountsObservable.asObservable().pipe(
      map((s) => {
        for (let a=0; a < s.length; ++a) {
          const l: number = s[a].length;
          s[a] = s[a].substring(0, 6) + '...' + s[a].substring(l - 4, l); 
        }
        return s;
      })
    );
  }

  public connectWeb3WithPopup() {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.enable().then(() => {
        this.web3 = new Web3(window.ethereum);
      });
    } else {
      window.alert('Non-Ethereum browser detected. You Should consider using MetaMask!');
    }
    setInterval(() => this.refreshAccounts(), 100);
  }

  private checkWeb3NoPopup() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
    }
    setInterval(() => this.refreshAccounts(), 100);
  }

  public async artifactsToContract(artifacts: any): Promise<any> {
    if (!this.web3) {
      console.log('Waiting for web3');
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;
  }

  private async refreshAccounts() {
    const accs = await this.web3.eth.getAccounts();

    // Get the initial account balance so it can be displayed.
    if (accs.length === 0) {
      console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
      return;
    }

    if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
      this.accountsObservable.next(accs);
      this.accounts = accs;
    }

    this.ready = true;
  }
}
