// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract UDALProtocol {
  struct AssetInfo {
      address payable owner;              
      string metaDataURI;      
      string assetURI;
      uint256 price;    // Price in wei
      uint256 purchasedLicenceCounter;
      mapping(address => bool) purchasedLicences;
  }

  mapping(uint256 => AssetInfo) private _assetInfo;
  uint256 private counter;
  
  event AssetCreated(uint256 assetId);
  event LicencePurchased(string assetURI, uint256 amount);

  /// @notice Registers a photo for sale in the contract
  /// @dev metaDataURI and assetURI should have prefix http, https, ipfs or ar.  For example, use ar://MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4 
  ///      instead of https://arweave.net/MAVgEMO3qlqe-qHNVs00qgwwbCb6FY2k15vJP3gBLW4.  Emits Created with ID of asset when completed.
  /// @param metaDataURI URI of the json file containing the metadata in JSON format.
  /// @param assetURI URI of the full size photo the licence would be purchased for.
  /// @param price To purchase a licence
  /// @param owner The address of the photo copyright owner
  function createAsset (string calldata metaDataURI, string calldata assetURI, uint256 price, address payable owner) external {
    AssetInfo storage newAssetInfo = _assetInfo[counter];
    newAssetInfo.owner = owner;
    newAssetInfo.metaDataURI = metaDataURI;
    newAssetInfo.assetURI = assetURI;
    newAssetInfo.price = price;
    emit AssetCreated(counter);
    counter++;
  }

  /// @notice The stored information for a given photo
  /// @dev Throws if photo with ID is not valid
  /// @param assetId Id of the photo
  /// @return owner of the asset
  /// @return metaDataURI of the asset
  /// @return price of the asset in wei
  function assetInfo (uint256 assetId) external view returns (address owner, string memory metaDataURI, uint256 price) {
    require(assetId < counter, "Invalid Id provided.");
    return (_assetInfo[assetId].owner, _assetInfo[assetId].metaDataURI, _assetInfo[assetId].price);
  } 

  /// @notice Creates a licence for caller and sends ETH to photo copyright
  /// @dev Throws if ETH sent with contract is less than price
  /// @param assetId Id of the photo to purchase
  function purchaseLicence(uint256 assetId) external payable {
      require(assetId < counter, "Invalid Id provided.");
      require (msg.value >= _assetInfo[assetId].price, "Not enough Eth to purchase");
      require (!_assetInfo[assetId].purchasedLicences[msg.sender]);

      _assetInfo[assetId].owner.transfer(msg.value);
      _assetInfo[assetId].purchasedLicences[msg.sender] = true;
      emit LicencePurchased(_assetInfo[assetId].assetURI, msg.value);
  }

  /// @notice The metadata Uniform Resource Identifier (URI) for a given photo
  /// @dev Throws if photo with ID is not valid. Also throws if the caller hasn't purchased the asset ID.
  /// @param assetId Id of the photo
  /// @return metaDataURI URI of the fill size photo
  function getAssetURI(uint256 assetId) external view returns (string memory metaDataURI) {
    require(assetId < counter, "Invalid Id provided.");
    require(_assetInfo[assetId].purchasedLicences[msg.sender], "Sender has not purchased licence.");
    return _assetInfo[assetId].assetURI;
  }
}
