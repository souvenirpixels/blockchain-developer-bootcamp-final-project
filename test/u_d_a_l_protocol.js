//const { assert } = require("console");

const UDALProtocol = artifacts.require("UDALProtocol");

contract("UDALProtocol", function (accounts) {
  let assets = [{
    owner: accounts[0],
    metaDataURI: "https://www.test.com/metadata.json",
    assetURI: "https://www.test.com/photo.jpg",
    price: 5
  }]
  it("should create a new asset", async function () {
    const UDALInstance = await UDALProtocol.deployed();
    const retCreate = await UDALInstance.createAsset(assets[0].owner, assets[0].metaDataURI, assets[0].assetURI, assets[0].price, { from: accounts[0] });

    // Check the event was created with ID 0
    assert.equal(retCreate.logs[0].event, 'Created', 'Created event should fire')
    assert.equal(retCreate.logs[0].args[0].toNumber(), 0, 'Created event should have value of 0')

    let counter = (await UDALInstance.getCounter.call()).toNumber();
    assert.equal(counter, 1, 'Counter should be 1');
  });
  it("should retrive asset information", async function () {
    const UDALInstance = await UDALProtocol.deployed();
    const retAssetInfo = await UDALInstance.assetInfo.call(0);

    // Check values equal what was created
    assert.equal(retAssetInfo.owner, assets[0].owner, "Owner should be correct");
    assert.equal(retAssetInfo.metaDataURI, assets[0].metaDataURI, "metdataURI should be correct");
    assert.equal(retAssetInfo.price.toNumber(), assets[0].price, "price should be correct");
  });
});
