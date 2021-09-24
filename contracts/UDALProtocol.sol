// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract UDALProtocol {
  struct AssetInfo {
      address owner;              
      string metaDataURI;      
      string assetURI;
      uint256 price;
  }

  //AssetInfo[1] public _assetInfo;
  AssetInfo[] _assetInfo;
  uint test;

  constructor() public {
  }

  /// @notice Registers a photo for sale in the contract
  /// @dev metaDataURI and assetURI should have prefix http, https, ipfs or ar.  For example, use ar://MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4 instead of https://arweave.net/MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4.
  /// @param owner The address of the photo copyright owner
  /// @param metaDataURI URI of the json file containing the metadata in JSON format.
  /// @param assetURI URI of the full size photo the licence would be purchased for.
  /// @param price To purchase a licence
  /// @return The ID of the newly created asset.  This ID can be used to purchase a licence to the photo.
  function create (address owner, string calldata metaDataURI, string calldata assetURI, uint256 price) external returns (uint256) {
    //AssetInfo storage newAssetInfo = _assetInfo[0];
    //test = 1;
    /*uint l = _assetInfo.length + 1;*/
    //newAssetInfo.price =5;
    //newAssetInfo.owner = owner;
    
    /*newAssetInfo.owner = owner;
    newAssetInfo.metaDataURI = metaDataURI;
    newAssetInfo.assetURI = assetURI;
    newAssetInfo.price = price;
    _assetInfo.push(newAssetInfo);*/
    //AssetInfo memory a = AssetInfo(owner, "a", "a", 1);
    //AssetInfo memory ab = AssetInfo(owner, "a", "a", 1);
    // _assetInfo.push(AssetInfo(owner, "a", "a", 1));   // <<<<****** This is not saving to memory!!!!!!!!

    //AssetInfo storage o = _assetInfo[0];
    //o.owner = owner;
    require(_assetInfo[0].owner == owner, "Owner is correct.");
    return _assetInfo.length;
  }

  function getLength() external view returns (uint256) {
    return _assetInfo.length;
  }

  /// @notice The stored information for a given photo
  /// @dev Throws if photo with ID is not valid
  /// @param id Id of the photo
  /// @return owner, metadataURI and price
  function assetInfo (uint256 id) external view returns (address owner, string memory metdataURI, uint256 price) {
    require(id < _assetInfo.length, "Invalid Id provided to assetInfo.");

    //AssetInfo memory a = _assetInfo[0];
    address _owner = _assetInfo[0].owner;
    return (_owner, "ab", _assetInfo.length);
    //return _assetInfo[id];
  } 
}
