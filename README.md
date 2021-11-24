# Universal Digital Asset Licensable NFT

Create a NFT that can be used by creatives who create stock photos, videos, templates or other digital assets to licence their creations without the need for a centralized agency.

## Deployed UI 

[https://consensys-bootcamp.netlify.app/](https://consensys-bootcamp.netlify.app/) < Best tested on Rinkeby

## Contract Address
Rinkeby Contract Address - [0x108b2d3beaa005bdc96812c06420ea5d3079f76a](https://rinkeby.etherscan.io/address/0x108b2d3beaa005bdc96812c06420ea5d3079f76a)

[View Rinkeby NFTs on Opensea](https://testnets.opensea.io/collection/universal-digital-asset-licencing-nft)


## Getting Started Running Locally

### Directory Structure
- angular-client - The Angular front end
- build - built contracts
- contracts - Smart contract solidity code
- migrations - Migration scripts
- test - Smart contract test cases

### Prerequisites
- Node.js >= v14
- npm >= 6.14
- [Truffle](https://github.com/trufflesuite/truffle) >= v5.4
- [Ganache CLI](https://www.trufflesuite.com/ganache) >= v6.12
- Git

### Getting started
Get a local version of the repo.
```
git clone https://github.com/souvenirpixels/blockchain-developer-bootcamp-final-project.git
```

### Smart contracts
Run the following commands to deploy contracts to local ganache instance and test.
```
cd blockchain-developer-bootcamp-final-project
npm install
truffle compile
truffle migrate
truffle test
```

### Testnet Deployment
To deploy to a testnet you will need to create a .env file in the root directory with the following variables
```
MNEMONIC="<ENTER YOUR MNEMONIC WITH SOME TEST ETH HERE>"
RINKEBY_INFURA_URL="https://rinkeby.infura.io/<YOURPROJECTENDPOINT>"
ROPSTEN_INFURA_URL="https://ropsten.infura.io/<YOURPROJECTENDPOINT>"
```
Then you can run one of the following commands:
```
truffle migrate --network rinkeby
truffle migrate --network ropsten
```

### Angular UI
To run the angular UI locally, navigate to the angular-client directory

```
cd angular-client
```

Then run the following commands to build and serve.
```
npm install
ng build
ng serve -o
```

Next make sure you have [Ganache CLI](https://www.trufflesuite.com/ganache) running with the following command
```
ganache-cli
```

Angular UI will be available on http://localhost:4200/, ensure your metamask is using the local ganache network at localhost:8545

## Screencast link

[Link to video walkthrough of the UI](https://drive.google.com/file/d/1idUrFucn_fQYyWOF27ektrhBzApCTaNG/view?usp=drivesdk)

### Minting NFTs
When minting NFTs, most of the data is stored off chain, to test, you will need links a to JSON files in the [UDAL Metadata JSON format](README_UDAL_METADATA_JSON.md) and a image file.  The Angular client contains example files that can be used locally to mint your NFts for testing.  Here are the URLs (assumes you are running Angular on the default http://localhost:4200/)

#### Test NFT Data #1
Photo URL - `ipfs://QmRAv59S1472S6r9zueNrDbf4qTqFYnhSCoocj7wnSXJ1j`

Metadata URL - `https://consensys-bootcamp.netlify.app/assets/morainelake.json`

#### Test NFT Data #2
Photo URL - `https://cdn.filestackcontent.com/resize=w:960/2pm1Hy8LTheFvZvzloUo`

Metadata URL - `https://consensys-bootcamp.netlify.app/assets/amazing-sea-stacks.json`

## Ethereum account for NFT certification
`0x3b6944228E738EB4ba1b245024556fAAbc722b3d`

## Project Description
The stock photography and footage industry is an oligopoly controlled by a small number of agencies like [Shutterstock](https://www.shutterstock.com/) and [Getty Images](https://www.gettyimages.com/).  These companies take a hefty commission to facilitate digital use license sales between creators and licensors of stock assets.  

Licencing stock assets can be done more efficiently using blockchain technology.  This project will disintermediate existing stock agencies by using an NFT to sell digital use licenses directly from stock creators to buyers.

## Stock Asset Registration Workflow

Creators should be able to list assets for sale.

## Minting Licencable NFTs

To mint a licencable NFT the photographer must register the photo for sale.  Three data points are required to licence

### Mint Workflow

1. Creator uploads a asset file (photo, video, etc) to [IPFS](https://ipfs.io/), [Arweave](https://www.arweave.org/) or Web 2.0 server.
2. Creator uploads a metadata JSON file to [IPFS](https://ipfs.io/), [Arweave](https://www.arweave.org/) or Web 2.0 server.  The metadata JSON file must conform to the [UDAL Metadata JSON format](README_UDAL_METADATA_JSON.md).
3. Creator interacts with smart contract to register the photo for sale.  The Creator provides the following information:
    * Token URI
    * Asset URI
    * Purchase Price

```
  /// @notice Registers an asset for sale in the contract
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
The following features will be added to the project but weren't available by the November 30th due date.
1. Circuit breaker to stop use of contract if bugs (Pauser), use access control to only allow those with access to pause.
1. Change the licence to be an ERC1155 NFT token.  This will allow the licences to be searched and listed more efficiently.
1. Add search feature for finding photos to purchase.  This will require a in indexing protocol like [the graph](https://thegraph.com/en/).
1. Ability to accept different cryptocurrencies / tokens for licence purchase (for example: DAI, USDC, USDT)
1. Ability to share revenue from a asset sale with different people at specific percentages.
1. Require an custom ERC20 token to be staked in order to register a asset for sale.  The stake would be slashed for copyright infringement and invalid assetURI.
1. Ability to flag asset as copyright infringement
1. Ability to upgrade the contract
1. Ability to mint in batch
1. Volume discounts for purchasing many assets via an ERC20 token.
1. Ability to purchase different types of licences (standard vs extended, etc)
1. Ability to check if assetURI is a valid file before purchase
1. Add a contractURI method to be used by [Opensea](https://docs.opensea.io/docs/contract-level-metadata)
```
    function contractURI() public view returns (string memory) {
        return "https://metadata-url.com/my-metadata";
    }
```