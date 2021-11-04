# Universal Digital Asset Licensable NFT

Create a NFT that can be used by creatives who create stock photos, videos, templates or other digital assets to licence their creations without the need for a centralized agency.

## Issue
The stock asset industry is an oligopoly controlled by a small number of agencies like [Shutterstock](https://www.shutterstock.com/) and [Getty Images](https://www.gettyimages.com/).  These companies take a hefty commission to facilitate digital use license sales between creators and licensors of stock assets.  

## Solution
Licencing stock assets can be done more efficiently using blockchain technology.  This project will disintermediate existing stock agencies by using an NFT to sell digital use licenses directly from stock creators to buyers.

## Stock Asset Registration Workflow

Creators should be able to list assets for sale.

## Minting Licencable NFTs

To mint a licencable NFT the photographer must register the photo for sale.  Three data points are required to licence

### Token URI
The token URI contains all information about the photo for sale and is a JSON file in the format of the the [official ERC721 metadata standard](https://eips.ethereum.org/EIPS/eip-721#specification) with the [ERC1155 metadata suggestions](https://eips.ethereum.org/EIPS/eip-1155#metadata).  This format is supported by many NFT marketplaces including the popular [Opensea market](https://docs.opensea.io/docs/metadata-standards).

Here is an example of the base metadata
```
{
  "name": "Moraine Lake Sunrise",
  "description": "One of the most beautiful (and photographed) lakes in Canada, Moraine Lake.", 
  "external_url": "https://www.souvenirpixels.com/James-wheeler-portfolio/i-bwQmQXt/A", 
  "image": "https://photos.smugmug.com/Photo-blog/i-bwQmQXt/1/c77946e4/XL/2012-07-31%20051814%20-%20Moraine%20Lake%20Sunrise-XL.jpg", 
  "properties": [ ... ], 
}
```
Each of these primary properties will be used be used to display the image on stock licencing sites.
| Property Name | Notes |
| ------------- | ----------- |
| Name | This is the name of the asset, will often be used as a title and for SEO |
| Description | Will be shown accompanying the image |
| external_url | This is a link to a page where the photo can be licences.  Most marketplaces won't support licencable NFTs initially but many will provide this link buyers.  So, this should be a direct link to a photo that support licencable NFTs |
| Image | This is the image that will be displayed to the buyer.  This can be copywrited for the photographers protection if needed. |

In addition to these primary properties, it is strongly recommended that these optional properties are included in the "properties" section, for example:

```
  "name": "Moraine Lake Sunrise",
  "description": "One of the most beautiful (and photographed) lakes in Canada, Moraine Lake.", 
  "external_url": "https://www.souvenirpixels.com/James-wheeler-portfolio/i-bwQmQXt/A", 
  "image": "https://photos.smugmug.com/Photo-blog/i-bwQmQXt/1/c77946e4/XL/2012-07-31%20051814%20-%20Moraine%20Lake%20Sunrise-XL.jpg", 
  "properties": [ 
    {
      "Keywords": {
            "type": "string",
            "description": ""
      },
      "Category": {
            "type": "string",
            "description": ""
      },
      "Creation Date": {
            "type": "string",
            "description": ""
      },
      "Location City": {
            "type": "string",
            "description": ""
      },
      "Location State/Province": {
            "type": "string",
            "description": ""
      },
      "Location Country": {
            "type": "string",
            "description": ""
      },
      "Media Type": {
            "type": "string",
            "description": ""
      },
      "Number of People": {
            "type": "number",
            "description": ""
      },
      "People": {
            "type": "string",
            "description": ""
      },
      "People Genders": {
            "type": "string",
            "description": ""
      },
      "Pixel Height": {
            "type": "string",
            "description": ""
      },
      "Pixel Width": {
            "type": "string",
            "description": ""
      },
      "Usage": {
            "type": "string",
            "description": "Commercial"
      }
    }
   ], 
```

These properties will be used by search engines so including them in the proper format will increase your sales of licences.

| Property Name | Notes |
| ------------- | ----------- |
| Keywords |  |
| Category |  |
| Creation Date |  |
| Location City |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |
|  |  |




1. Creator uploads a asset file (photo, video, etc) to [IPFS](https://ipfs.io/).
2. Creator uploads a metadata JSON file to [IPFS](https://ipfs.io/).
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

## Getting Started
Requires [Truffle](https://github.com/trufflesuite/truffle) and [Ganache GUI](https://www.trufflesuite.com/ganache) installed. 

Then run the following commands
```
npm install
truffle compile
truffle migrate
truffle test
```