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
  public accountsObservable = new ReplaySubject<string[]>();

  constructor() {
    this.connectWeb3(false);
  }

  public getAcccount(): Observable<string[]>  {
    return this.accountsObservable.asObservable();
  }

  public getDisplayAcccount(account: string): string  {
      const l: number = account.length;
      return account.substring(0, 6) + '...' + account.substring(l - 4, l); 
  }

  private connect() {
    this.web3 = new Web3(window.ethereum);

    this.web3.eth.getAccounts().then((accs: any) => {
      // Get the initial account balance so it can be displayed.
      if (accs.length === 0) {
        console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        this.accountsObservable.next(accs);
        this.accounts = accs;
      }
    });

    window.ethereum.on('accountsChanged', (accounts: any) => {
      this.accounts = accounts;
      this.accountsObservable.next(accounts);
      console.log('accounts changed', accounts);
    });
  }

  public connectWeb3(withPopup: boolean) {
    if (withPopup) {
      if (window.ethereum) {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(() => {
          this.connect();
        });
      } else {
        window.alert('Non-Ethereum browser detected. You Should consider using MetaMask!');
      }
    } else {
      if (window.ethereum) {
        this.connect();
      }
    }
  }

  public async artifactsToContract(artifacts: any): Promise<any> {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;
  }
}
