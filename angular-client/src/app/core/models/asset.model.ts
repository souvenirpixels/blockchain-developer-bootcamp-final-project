export enum PhotoSizeEnum {
    THUMBNAIL = 1,
    SMALL = 2,
    MEDIUM = 3
}

export enum AssetStatusEnum {
    NONE = '',
    PENDING = 'Pending',
    MINED = 'Mined',
    ERROR = 'Error'
}

export enum LicenceStatusEnum {
    NONE = '',
    PENDING = 'Pending',
    LICENCED = 'Licenced',
    ERROR = 'Error'
}

export class Asset {
    id?: number;
    tokenURI: string;
    assetURI: string;
    price: number;
    owner: string;
    errorMessage: string;
    name: string;
    description: string;
    external_url: string;
    private image: string;
    private sizes: any;
    animation_url: string;
    ldap_metadata_version: string;
    keywords: string;
    creation_date: Date;
    asset_type: string;
    pixel_height: number;
    pixel_width: number;
    usage: string;
    number_of_people: number;
    status: AssetStatusEnum;
    licenceStatus: LicenceStatusEnum;

    private createURL(a: string) {
        let imageURI = a;
        let retVal: string = '';
        let validPrefixes = ["http", "https", "ipfs", "ar"];
        
        // TODO: Should show error if invalid URL, this was working but then had issues, fix later
        //if (!validPrefixes.some(v => imageURI.substr(0, imageURI.indexOf('://')).includes(v))) {
        //    throw new Error('Invalid imageURI prefix ' + imageURI);
        //} else 
        if (imageURI.substr(0, imageURI.indexOf('://')) === 'ipfs') {
            retVal = 'https://dweb.link/ipfs/' + imageURI.split('://')[1];;
        } else if (imageURI.substr(0, imageURI.indexOf('://')) === 'http' || imageURI.substr(0, imageURI.indexOf('://')) === 'https') {
            retVal = imageURI;
        }

        return retVal;
    }

    getPhotoSrc(size: PhotoSizeEnum): string {
        // TODO: Implement the photoSizeEnum properly
        if (!this.image) {
            throw new Error('Image URL not available.');
        }
        console.log('sending', this.image);
        return this.createURL(this.image);
    }
    getAssetSrc(): string {
        return this.createURL(this.assetURI);
    }

    setTokenURIData(tokenURIData: any) {
        this.name = tokenURIData.name;
        this.description  = tokenURIData.description;
        this.external_url = tokenURIData.external_url;
        this.image = tokenURIData.image;
        this.sizes = tokenURIData.sizes;
        this.animation_url = tokenURIData.animation_url;
        this.ldap_metadata_version = tokenURIData.ldap_metadata_version;
        this.keywords = tokenURIData.keywords;
        this.creation_date = tokenURIData.creation_date;
        this.asset_type = tokenURIData.asset_type;
        this.pixel_height = tokenURIData.pixel_height;
        this.pixel_width = tokenURIData.pixel_width;
        this.usage = tokenURIData.usage;
        this.number_of_people = tokenURIData.number_of_people;
    }

    constructor(tokenURI: string, assetURI: string, price: number, owner?: string, id?: number){
        this.tokenURI = tokenURI;
        this.assetURI = assetURI;
        this.price = price;
        if (owner) {
            this.owner = owner;
        }
        if (id) {
            this.id = id;
        }
    }
}