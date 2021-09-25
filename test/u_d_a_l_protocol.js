//const { assert } = require("console");

const BigNumber = web3.utils.BN;
const UDALProtocol = artifacts.require("UDALProtocol");

contract("UDALProtocol", function (accounts) {
  let assets = [{
    owner: accounts[0],
    metaDataURI: "https://www.test.com/metadata.json",
    assetURI: "https://www.test.com/photo.jpg",
    price: new BigNumber(web3.utils.toWei('2'))
  }];

  it("should create a new asset", async function () {
    const UDALInstance = await UDALProtocol.deployed();
    const retCreate = await UDALInstance.createAsset(assets[0].metaDataURI, assets[0].assetURI, assets[0].price, assets[0].owner, { from: accounts[0] });

    // Check the event was created with ID 0
    assert.equal(retCreate.logs[0].event, 'AssetCreated', 'Created event should fire');
    assert.equal(retCreate.logs[0].args[0].toNumber(), 0, 'Created event should have value of 0');
  });

  it("should retrive asset information", async function () {
    const UDALInstance = await UDALProtocol.deployed();
    const retAssetInfo = await UDALInstance.assetInfo.call(0);

    // Check values equal what was created
    assert.equal(retAssetInfo.owner, assets[0].owner, "Owner should be correct");
    assert.equal(retAssetInfo.metaDataURI, assets[0].metaDataURI, "metdataURI should be correct");

    let checkSame = assets[0].price.eq(retAssetInfo.price);
    assert.equal(checkSame, true, "price should be correct");
  });

  it("allow a licence to be purchased", async function () {
    const UDALInstance = await UDALProtocol.deployed();
    const retLicence = await UDALInstance.purchaseLicence(0, { from: accounts[1], value: web3.utils.toWei('2') });

    // Check the event was created with ID 0
    assert.equal(retLicence.logs[0].event, 'LicencePurchased', 'LicencePurchased event should fire');
    assert.equal(retLicence.logs[0].args[0], assets[0].assetURI, 'Event should return full size asset URI');
    
    const retLicenceId = await UDALInstance.getAssetURI.call(0, { from: accounts[1] });
    assert.equal(retLicenceId, assets[0].assetURI, 'getAssetURI should return full size asset URI');
  });
});

