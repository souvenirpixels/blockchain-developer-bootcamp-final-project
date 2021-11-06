export class Asset {
    id?: number;
    tokenURI: string;
    assetURI: string;
    price: number;
    owner: string;
    errorMessage: string;
    tokenURIData: any;
    setTokenURIData(tokenURIData: any) {

    }
    getImageURL(): string {
        let imageURI: string;
        let retVal: string = '';
        let validPrefixes = ["http", "https", "ipfs", "ar"];
        
        if (!this.tokenURIData) {
            throw new Error('tokenURIData does not exist');
        } else if (!this.tokenURIData.image) {
            throw new Error('tokenURIData.image does not exist');
        } else {
            imageURI = this.tokenURIData.image;
        }

        if (!validPrefixes.some(v => imageURI.substr(0, imageURI.indexOf('://')).includes(v))) {
            throw new Error('Invalid imageURI prefix');
        } else if (imageURI.substr(0, imageURI.indexOf('://')) === 'ipfs') {
            retVal = 'https://dweb.link/ipfs/QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j';
        }

        return retVal;
    }
    constructor(tokenURI: string, assetURI: string, price: number, owner: string, id?: number){
        this.tokenURI = tokenURI;
        this.assetURI = assetURI;
        this.price = price;
        this.owner = owner;
        if (id) {
            this.id = id;
        }
    }
}