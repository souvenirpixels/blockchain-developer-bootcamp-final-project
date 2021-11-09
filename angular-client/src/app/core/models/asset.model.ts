export enum PhotoSizeEnum {
    THUMBNAIL = 1,
    SMALL = 2,
    MEDIUM = 3
}

export class Asset {
    id?: number;
    tokenURI: string;
    assetURI: string;
    price: number;
    owner: string;
    errorMessage: string;
    tokenURIData: any;
    name: string;
    description: string;
    external_url: string;
    private image: string;
    private sizes: any;
    animation_url: string;
    ldap_metadata_version: string;
    Keywords: string;
    creation_date: Date;
    asset_type: string;
    pixel_height: number;
    pixel_width: number;
    usage: string;
    number_of_people: number;

    getPhotoSrc(size: PhotoSizeEnum): string {
        return '';
    }

    setTokenURIData(tokenURIData: any) {

    }
    getImageURL(): string {
        let imageURI: string;
        let retVal: string = '';
        let validPrefixes = ["http", "https", "ipfs", "ar"];
        console.log('I am here');
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