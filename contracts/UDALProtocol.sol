// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract UDALProtocol {
  struct AssetInfo {
      address owner;              
      string metaDataURI;      
      string assetURI;
      uint256 price;
  }

  mapping(uint256 => AssetInfo) private _assetInfo;
  uint256 private counter;
  event Created(uint256 id); 

  /// @notice Registers a photo for sale in the contract
  /// @dev metaDataURI and assetURI should have prefix http, https, ipfs or ar.  For example, use ar://MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4 
  ///      instead of https://arweave.net/MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4.  Emits Created with ID of asset when completed.
  /// @param owner The address of the photo copyright owner
  /// @param metaDataURI URI of the json file containing the metadata in JSON format.
  /// @param assetURI URI of the full size photo the licence would be purchased for.
  /// @param price To purchase a licence
  function createAsset (address owner, string calldata metaDataURI, string calldata assetURI, uint256 price) external {
    AssetInfo memory newAssetInfo = AssetInfo(owner, metaDataURI, assetURI, price);
    _assetInfo[counter] = newAssetInfo;
    emit Created(counter);
    counter++;
  }

  function getCounter() external view returns (uint256) {
    return counter;
  }

  /// @notice The stored information for a given photo
  /// @dev Throws if photo with ID is not valid
  /// @param id Id of the photo
  /// @return owner, metadataURI and price
  function assetInfo (uint256 id) external view returns (address owner, string memory metaDataURI, uint256 price) {
    require(id < counter, "Invalid Id provided to assetInfo.");
    return (_assetInfo[id].owner, _assetInfo[id].metaDataURI, _assetInfo[id].price);
  } 
}
