# Universal Digital Asset Licensable NFT

Create a NFT that can be used by creatives who create stock photos, videos, templates or other digital assets to licence their creations without the need for a centralized agency.

## Issue
The stock asset industry is an oligopoly controlled by a small number of agencies like [Shutterstock](https://www.shutterstock.com/) and [Getty Images](https://www.gettyimages.com/).  These companies take a hefty commission to facilitate digital use license sales between creators and licensors of stock assets.  

## Solution
Licencing stock assets can be done more efficiently using blockchain technology.  This project will disintermediate existing stock agencies by using an NFT to sell digital use licenses directly from stock creators to buyers.

## Getting Started

### Smart contracts
First setup a local ganache system with [Ganache GUI](https://www.trufflesuite.com/ganache) and install [Truffle](https://github.com/trufflesuite/truffle) globally.

Run the following commands to deploy contracts to local ganache instance and tests.
```
git clone https://github.com/souvenirpixels/blockchain-developer-bootcamp-final-project.git
cd blockchain-developer-bootcamp-final-project
npm install
truffle compile
truffle migrate
truffle test
```

### Angular UI
To run the angular UI locally (http://localhost:4200/), navigate to the angular-client directory then run the following commands.

```
npm install
ng serve -o
```

## Stock Asset Registration Workflow

Creators should be able to list assets for sale.

## Minting Licencable NFTs

To mint a licencable NFT the photographer must register the photo for sale.  Three data points are required to licence

### Mint Workflow

1. Creator uploads a asset file (photo, video, etc) to [IPFS](https://ipfs.io/).
2. Creator uploads a metadata JSON file to [IPFS](https://ipfs.io/).  The metadata JSON file must conform to the [UDAL Metadata JSON format](README_UDAL_METADATA_JSON.md).
3. Creator interacts with smart contract to register the photo for sale.  The Creator provides the following information:
    * IPFSHash
    * Metadata IPFSHash
    * Purchase Price

```
  /// @notice Registers an assete for sale in the contract
  /// @dev tokenURI and assetURI should have prefix http, https, ipfs or ar.  For example, use ar://MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4 
  ///      instead of https://arweave.net/MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4.  Emits Created with ID of asset when completed.
  /// @param _tokenURI URI of the json file containing the metadata in JSON format.  Should conform to the ERC721 Metadata JSON Schema
  /// @param _assetURI URI of the full size file the licence would be purchased for.
  /// @param price To purchase a licence
  /// @param owner The address of the copyright owner
  function mint (string calldata _tokenURI, string calldata _assetURI, uint256 price, address payable owner) external
```

## License Purchase
Licencor should be able to purchase a licence to use the file commercially

### Workflow
1. Licensor is able to view asset with metadata

```
  /// @notice The stored information for a given asset
  /// @dev Throws if asset with ID is not valid
  /// @param tokenId Id of the asset
  /// @return owner of the asset
  /// @return price of the asset in wei
  function assetInfo (uint256 tokenId) external view returns (address owner, uint256 price)
  
  // @notice Conforms to the ERC721 metadata extension - https://eips.ethereum.org/EIPS/eip-721
  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory)
```

2. Licenser sends price to the smart contract
3. Price is distributed to the creator
4. Licensor receives proof of licence 
```
  /// @notice Creates a licence for caller and sends ETH to NFT owner
  /// @dev Throws if ETH sent with contract is less than price
  /// @param tokenId Id of the asset to purchase
  function purchaseLicence(uint256 tokenId) external payable
```
5. Licensor is able to download full size file
```
  /// @notice The metadata Uniform Resource Identifier (URI) for a given asset
  /// @dev Throws if asset with ID is not valid. Also throws if the caller hasn't purchased the asset ID.
  /// @param tokenId Id of the asset
  /// @return assetURI of the fill size asset
  function assetURI(uint256 tokenId) external view returns (string memory)
```

## Future Roadmap
The following features may be added to project depending based on time available before due date.
1. Add a contractURI method to be used by [Opensea](https://docs.opensea.io/docs/contract-level-metadata)
```
    function contractURI() public view returns (string memory) {
        return "https://metadata-url.com/my-metadata";
    }
```
1. Decide on a standard for how metadata is stored that is compatible with the ERC721 Metadata JSON Schema standard
1. Circuit breaker to stop use of contract if bugs (Pauser), use access control to only allow those with access to pause.
1. Change the licence to be an ERC1155 NFT token
1. Ability to easily tell if a user has purchased a licence.
1. Ability to accept different cryptocurrencies / tokens for licence purchase (for example: DAI, USDC, USDT)
1. Ability to share revenue from a asset sale with different people at specific percentages.
1. Ability to search a collection of assets for sale based on asset metadata.
1. Require an custom ERC20 token to be staked in order to register a asset for sale.  The stake would be slashed for copyright infringement and invalid assetURI.
1. Ability to flag asset as copyright infringement
1. Ability to upgrade the contract
1. Ability to mint in batch
1. Volume discounts for purchasing many assets via an ERC20 token.
1. Ability to purchase different types of licences (standard vs extended, etc)
1. Ability to check if assetURI is a valid file before purchase