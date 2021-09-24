//const { assert } = require("console");

const UDALProtocol = artifacts.require("UDALProtocol");

contract("UDALProtocol", function (accounts) {
  it("should create a new asset", async function () {
    const UDALInstance = await UDALProtocol.deployed();
    const retCreate = await UDALInstance.create.call(accounts[1], "https://www.test.com/metadata.json", "https://www.test.com/photo.jpg", 5);
    console.log("Created ID is ", retCreate.toNumber());
    const retAssetInfo = await UDALInstance.assetInfo.call(0);
    let l = await UDALInstance.getLength.call();
    console.log("Owner", retAssetInfo.owner);
    console.log("metdataURI", retAssetInfo.metdataURI);
    console.log("price", retAssetInfo.price.toNumber());
  });
  it("should retrive asset information", async function () {
    /*const UDALInstance = await UDALProtocol.deployed();
    const retAssetInfo = await UDALInstance.assetInfo.call(0);
    console.log("Owner", retAssetInfo.owner);
    console.log("metdataURI", retAssetInfo.metdataURI);
    console.log("price", retAssetInfo.price.toNumber());*/
    
  });
});
