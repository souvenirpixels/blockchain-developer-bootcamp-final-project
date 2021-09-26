# Universal Digital Asset Licensable NFT

Create a NFT that can be used by creatives who create stock photos, videos, templates or other digital assets to licence their creations without the need for a centralized agency.

## Issue
The stock asset industry is an oligopoly controlled by a small number of agencies like [Shutterstock](https://www.shutterstock.com/) and [Getty Images](https://www.gettyimages.com/).  These companies take a hefty commission to facilitate digital use license sales between creators and licensors of stock assets.  

## Solution
Licencing stock assets can be done more efficiently using blockchain technology.  This project will disintermediate existing stock agencies by using an NFT to sell digital use licenses directly from stock creators to buyers.

## Stock Asset Registration Workflow

Creators should be able to list assets for sale.

### Workflow
1. Creator uploads a asset file (photo, video, etc) to [IPFS](https://ipfs.io/).
2. Creator uploads a metadata JSON file to [IPFS](https://ipfs.io/).
3. Creator interacts with smart contract to register the photo for sale.  The Creator provides the following information:
    * IPFSHash
    * Metadata IPFSHash
    * Purchase Price

```
  /// @notice Registers an assete for sale in the contract
  /// @dev metaDataURI and assetURI should have prefix http, https, ipfs or ar.  For example, use ar://MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4 
  ///      instead of https://arweave.net/MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4.  Emits Created with ID of asset when completed.
  /// @param metaDataURI URI of the json file containing the metadata in JSON format.
  /// @param assetURI URI of the full size file the licence would be purchased for.
  /// @param price To purchase a licence
  /// @param owner The address of the copyright owner
  
  function createAsset (string calldata metaDataURI, string calldata assetURI, uint256 price, address payable owner) external {
```

## License Purchase
Licencor should be able to purchase a licence to use the file commercially

### Workflow
1. Licensor is able to view asset with metadata

```
  /// @notice The stored information for a given asset
  /// @dev Throws if asset with ID is not valid
  /// @param assetId Id of the asset
  /// @return owner of the asset
  /// @return metaDataURI of the asset
  /// @return price of the asset in wei

  function assetInfo (uint256 assetId) external view returns (address owner, string memory metaDataURI, uint256 price) {
```

2. Licenser sends price to the smart contract
3. Price is distributed to the creator
4. Licensor receives proof of licence 
```
  /// @notice Creates a licence for caller and sends ETH to NFT owner
  /// @dev Throws if ETH sent with contract is less than price
  /// @param assetId Id of the asset to purchase
  function purchaseLicence(uint256 assetId) external payable {
```
5. Licensor is able to download full size file
```
/// @notice The metadata Uniform Resource Identifier (URI) for a given asset
/// @dev Throws if asset with ID is not valid. Also throws if the caller hasn't purchased the asset ID.
/// @param id Id of the asset
/// @return URI of the fill size asset

function assetURI (uint256 id) external view returns (string) {

}
```

## Future Roadmap
The following features may be added to project depending based on time available before due date.
1. [In Progress] - Ability to sell as an NFT on marketplaces like Opensea
1. [In Progress] - Circuit breaker to stop use of contract if bugs
1. [In Progress] - Ability to stop the asset from being licenced (by burning)
1. Ability to accept different cryptocurrencies / tokens for licence purchase (for example: DAI, USDC, USDT)
1. Ability to share revenue from a asset sale with different people at specific percentages.
1. Ability to search a collection of assets for sale based on asset metadata.
1. Require an custom ERC20 token to be staked in order to register a asset for sale.  The stake would be slashed for copyright infringement and invalid assetURI.
1. Ability to flag asset as copyright infringement
1. Ability to upgrade the contract
1. Volume discounts for purchasing many assets via an ERC20 token.
1. Ability to check if assetURI is a valid file before purchase
1. More secure way to restrict asset to the assetURI

## Getting Started
Requires [Truffle](https://github.com/trufflesuite/truffle) and [Ganache GUI](https://www.trufflesuite.com/ganache) installed. 

Then run the following commands
```
npm install
truffle compile
truffle migrate
truffle test
```