export class Asset {
    id?: number;
    tokenURI: string;
    assetURI: string;
    price: number;
    owner: string;
    constructor(tokenURI: string, assetURI: string, price: number, owner: string){
        this.tokenURI = tokenURI;
        this.assetURI = assetURI;
        this.price = price;
        this.owner = owner;
    }
}