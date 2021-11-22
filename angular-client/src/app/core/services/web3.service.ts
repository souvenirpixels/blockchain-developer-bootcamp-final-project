import {Injectable} from '@angular/core';
import {Observable, ReplaySubject } from 'rxjs';
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

  constructor() { }

  async init(): Promise<any> {
    return this.connectWeb3(false);
  }

  public getAcccount(): Observable<string[]>  {
    return this.accountsObservable.asObservable();
  }

  public toWei(n: string): string {
    return this.web3.utils.toWei(n.toString());
  }

  public fromWei(n: string): string {
    return this.web3.utils.fromWei(n.toString());
  }

  // Returns a valid address or rejects
  public checkValidAddress(address: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const validAddress = this.web3.utils.toChecksumAddress(address)
        resolve(validAddress);
      } catch(e: any) { 
        reject('Invalid ethereum address');
      }
    });
  }

  public getDisplayAcccount(account: string): string  {
      const l: number = account.length;
      return account.substring(0, 6) + '...' + account.substring(l - 4, l); 
  }

  private connect(): Promise<any> {
    return new Promise((resolve, reject) => {
      window.ethereum.on('accountsChanged', (accounts: any) => {
        if (accounts.length === 0) {
          console.warn('Unable to read accounts, check metamask is connected.');
        }
        this.accounts = accounts;
        this.accountsObservable.next(accounts);
      });

      this.web3 = new Web3(window.ethereum);
      this.web3.eth.getAccounts().then((accs: any) => {
        // Get the initial account balance so it can be displayed.
        if (accs.length === 0) {
          console.warn('Unable to read accounts, check metamask is connected.');
          reject('Unable to read accounts, check metamask is connected.');
        } else if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
          this.accounts = accs;
          this.accountsObservable.next(this.accounts);
        }
        resolve(accs);
      });        
    });
  }

  public connectWeb3(withPopup: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      if (withPopup) {
        if (window.ethereum) {
          window.ethereum.request({ method: 'eth_requestAccounts' }).then(() => {
            this.connect().then((resp) => {
              resolve(resp);
            }).catch((e) => {
              reject(e);
            });
          }).catch((e: any) => {
              reject(e);
          });
        } else {
          // TODO: This should really be done at the component level
          window.alert('Non-Ethereum browser detected. You Should consider using MetaMask!');
          throw new Error('Non-Ethereum browser detected. You Should consider using MetaMask!');
        }
      } else {
        if (window.ethereum) {
          this.connect().then((resp) => {
            resolve(resp);
          }).catch((e) => {
            reject(e);
          });        }
      }
    });   

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
