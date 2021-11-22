// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UDALProtocol is ERC721("Universal Digital Asset Licencing NFT", "UDALNFT"), ERC721Enumerable, ERC721Burnable, ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _counter;

  struct AssetInfo {
      string assetURI;
      uint256 price;    // Price in wei
      uint256 purchasedLicenceCounter;
      mapping(address => bool) purchasedLicences;
  }

  mapping(uint256 => AssetInfo) private _assetInfo;

  event LicencePurchased(string assetURI, uint256 amount);

  /// @notice Registers an assete for sale in the contract
  /// @dev tokenURI and assetURI should have prefix http, https, ipfs or ar.  For example, use ar://MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4 
  ///      instead of https://arweave.net/MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4.  Emits Created with ID of asset when completed.
  /// @param _tokenURI URI of the json file containing the metadata in JSON format.  Should conform to the ERC721 Metadata JSON Schema
  /// @param _assetURI URI of the full size file the licence would be purchased for.
  /// @param price To purchase a licence
  /// @param owner The address of the copyright owner
  function mint (string calldata _tokenURI, string calldata _assetURI, uint256 price, address payable owner) external {
    _counter.increment();
    uint256 newTokenId = _counter.current();
    AssetInfo storage newAssetInfo = _assetInfo[newTokenId];
    newAssetInfo.assetURI = _assetURI;
    newAssetInfo.price = price;
    _safeMint(owner, newTokenId);
    _setTokenURI (newTokenId, _tokenURI);
  }

  /// @notice The stored information for a given asset
  /// @dev Throws if asset with ID is not valid
  /// @param tokenId Id of the asset
  /// @return URI of the asset
  /// @return owner of the asset
  /// @return price of the asset in wei
  function assetInfo (uint256 tokenId) external view returns (string memory URI, address owner, uint256 price) {
    require(_exists(tokenId), "assetInfo query for nonexistent tokenId");
    string memory uri = super.tokenURI(tokenId);
    return (uri, ownerOf(tokenId), _assetInfo[tokenId].price);
  } 

  /// @notice Creates a licence for caller and sends ETH to NFT owner
  /// @dev Throws if ETH sent with contract is less than price
  /// @param tokenId Id of the asset to purchase
  function purchaseLicence(uint256 tokenId) external payable {
      require(_exists(tokenId), "purchaseLicence query for nonexistent tokenId");
      require (msg.value >= _assetInfo[tokenId].price, "Not enough Eth to purchase");
      require (!_assetInfo[tokenId].purchasedLicences[msg.sender], "Licence already purchased");

      payable(ownerOf(tokenId)).transfer(msg.value);
      _assetInfo[tokenId].purchasedLicences[msg.sender] = true;
      emit LicencePurchased(_assetInfo[tokenId].assetURI, msg.value);
  }

  /// @notice Restricts access to users who have purchaed a licence
  /// @param tokenId Id of the asset requesting access to
  modifier hasLicence(uint256 tokenId) {
    require(_assetInfo[tokenId].purchasedLicences[msg.sender], "Has not been purchased");
    _;
  }

  /// @notice The metadata Uniform Resource Identifier (URI) for a given asset
  /// @dev Throws if asset with ID is not valid. Also throws if the caller hasn't purchased the asset ID.
  /// @param tokenId Id of the asset
  /// @return assetURI of the full size asset
  function assetURI(uint256 tokenId) hasLicence(tokenId) external view returns (string memory) {
    require(_exists(tokenId), "assetURI query for nonexistent tokenId");
    return _assetInfo[tokenId].assetURI;
  }

  // @notice Conforms to the ERC721 metadata extension - https://eips.ethereum.org/EIPS/eip-721
  function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  // The ERC721.sol, and ERC721Enumerable.sol openzeppelin contracts, both include _beforeTokenTransfer so we need to override
  function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, amount);
  }

  // The ERC721.sol, and ERC721Enumerable.sol openzeppelin contracts, both includesupportsInterface so we need to override
  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
  }

  // The ERC721.sol, and ERC721URIStorage.sol openzeppelin contracts, both include _burn so we need to override
  function _burn(uint256 tokenId) internal override (ERC721, ERC721URIStorage)  {
    super._burn(tokenId);
  }
}
