# Blockchain Developer Bootcamp Final Project

To facilitate the sale and purchase of digital stock photos without the need for a centralized agency.

## Issue
The stock photography industry is an oligopoly controlled by a small number of agencies like [Shutterstock](https://www.shutterstock.com/) and [Getty Images](https://www.gettyimages.com/).  These companies take a hefty commission to facilitate digital use license sales between stock photographers and licensors of stock photography.  

## Solution
Licencing stock photography can be done more efficiently using blockchain technology.  This project will disintermediate existing stock photography agencies by using smart contracts to sell digital use licenses directly from stock photographers to buyers.

## Stock Photographers (Photog) Registration Workflow

Stock photographers should be able to list a photo for sale.

### Workflow
1. Photog uploads a stock photo file to [IPFS](https://ipfs.io/).
2. Photog uploads a photo metadata JSON file to [IPFS](https://ipfs.io/).
3. Photog interacts with smart contract to register the photo for sale.  The photographer provides the following information:
    * Photo IPFSHash
    * Metadata IPFSHash
    * Purchase Price

```
/// @notice Registers a photo for sale in the contract
/// @dev metaDataURI and assetURI should have prefix http, https, ipfs or ar.  For example, use ar://MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4 
///      instead of https://arweave.net/MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4.  Emits Created with ID of asset when completed.
/// @param owner The address of the photo copyright owner
/// @param metaDataURI URI of the json file containing the metadata in JSON format.
/// @param assetURI URI of the full size photo the licence would be purchased for.
/// @param price To purchase a licence

function createAsset (address owner, string calldata metaDataURI, string calldata assetURI, uint256 price) external {

}
```

## License Purchase
Photography licencor should be able to purchase a licence to use the photo commercially

### Workflow
1. Licensor is able to view photo with metadata

```
/// @notice The stored information for a given photo
/// @dev Throws if photo with ID is not valid
/// @param id Id of the photo
/// @return owner, metadataURI and price

function assetInfo (uint256 id) external view returns (address owner, string memory metaDataURI, uint256 price) {

}
```

2. Licenser sends price to the smart contract
3. Price is distributed to the photog
4. Licensor receives proof of licence 
```
/// @notice Creates a licence for caller and sends ETH to photo copyright
/// @dev Throws if ETH sent with contract is less than price
/// @param owner Address of account that will own the licence
/// @param id Id of the photo to purchase
/// @return Id representing the licence number

function purchaseLicence(address owner, uint256 id) external payable returns (uint256) {
    // Creates a licence for caller and sends ETH to photo copyright owner
}
```
5. Licensor is able to download full size photo
```
/// @notice The metadata Uniform Resource Identifier (URI) for a given photo
/// @dev Throws if photo with ID is not valid. Also throws if the caller hasn't purchased the asset ID.
/// @param id Id of the photo
/// @return URI of the fill size photo

function assetURI (uint256 id) external view returns (string) {

}
```

## Future Roadmap
The following features may be added to project depending based on time available before due date.
1. Ability to search a collection of photos for sale based on photo metadata.
1. Ability to share revenue from a photo sale with different people at specific percentages.
1. Ability to accept different cryptocurrencies / tokens for purchase (for example: DAI, USDC, USDT)
1. Ability to flag photo as copyright infringement
1. Ability to check if assetURI is a valid file before purchase
1. Require an custom ERC20 token to be staked in order to register a photo for sale.  The stake would be slashed for copyright infringement and invalid assetURI.
1. Volume discounts for purchasing many photos via an ERC20 token.
1. More secure way to restrict asset to the assetURI