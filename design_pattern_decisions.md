## Inheritance and Interfaces
My contract extends the openzeppelen ERC721 contract with three ERC721 extensions and the counter utility.

### @openzeppelin/contracts/token/ERC721/ERC721.sol
Provides the base to make my contract an ERC721 compliant NFT

### @openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol
Allows the tokens to be looped through to create a list of the NFTs

### @openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol
Allows users to burn their NFTs

### @openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol
Allows for a standard NFT URI storage

### @openzeppelin/contracts/utils/Counters.sol
Used to implement the counter for the licences.

## Access Control Design Patterns
Most of the access control is provided by the openzeppelin contracts.  However, I implemented a hasLicence modifier to restrict access to the assetURI function to only wallets who have purchased a licence for the particular NFT.
