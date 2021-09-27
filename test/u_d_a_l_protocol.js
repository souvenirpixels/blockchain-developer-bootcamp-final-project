//const { assert } = require("console");

const BigNumber = web3.utils.BN;
const UDALProtocol = artifacts.require("UDALProtocol");

contract("UDALProtocol", function (accounts) {
  const assets = [{
    owner: accounts[1],
    tokenURI: "https://www.test.com/metadata.json",
    assetURI: "https://www.test.com/photo.jpg",
    price: new BigNumber(web3.utils.toWei('0.05'))
  }];
  const catchRevert = require("./exceptions.js").catchRevert;
  const NFTName = 'Universal Digital Asset Licencing NFT';
  const NFTSymbol = 'UDALNFT';
  const invalidTokenId = 9999999;
  

  describe("mint:", function() {
    it("should mint a new licencable NFT", async function () {
      const UDALInstance = await UDALProtocol.deployed();
      const retCreate = await UDALInstance.mint(assets[0].tokenURI, assets[0].assetURI, assets[0].price, assets[0].owner, { from: accounts[1] });
  
      // Check the event was created with ID 0
      assert.equal(retCreate.logs[0].event, 'Transfer', 'Transfer event should fire');
      assert.equal(retCreate.logs[0].args['tokenId'].toNumber(), 1, 'Initial ID should be 1');
      assert.equal(retCreate.logs[0].args['from'], 0x0000000000000000000000000000000000000000, 'Should come from 0x0 address');
      assert.equal(retCreate.logs[0].args['to'], accounts[1], 'Should be transfered to owner');
    });
  });
 
  describe("assetInfo:", function() {
    it("should retrive asset information", async function () {
      const UDALInstance = await UDALProtocol.deployed();
      const retAssetInfo = await UDALInstance.assetInfo.call(1);
  
      // Check values equal what was created
      assert.equal(retAssetInfo.owner, assets[0].owner, "Owner should be correct");
      assert.equal(assets[0].price.eq(retAssetInfo.price), true, "price should be correct");
    });
    it("should revert if tokenId is not valid", async function () {
      const UDALInstance = await UDALProtocol.deployed();
      await catchRevert(UDALInstance.assetInfo.call(invalidTokenId));
    });
  });

  describe("purchaseLicence:", function() {
    it("allow a licence to be purchased", async function () {
      const UDALInstance = await UDALProtocol.deployed();
      const retLicence = await UDALInstance.purchaseLicence(1, { from: accounts[5], value: assets[0].price });
  
      // Check the event was created with ID 0
      assert.equal(retLicence.logs[0].event, 'LicencePurchased', 'LicencePurchased event should fire');
      assert.equal(retLicence.logs[0].args[0], assets[0].assetURI, 'Event should return full size asset URI');      
    });
    it("should transfer the price to the new account", async function () {
      const UDALInstance = await UDALProtocol.deployed();
      const initialSellerBalance = new BigNumber(await web3.eth.getBalance(assets[0].owner));
      const initialBuyerBalance = new BigNumber(await web3.eth.getBalance(accounts[4]));
      const retPurchase = await UDALInstance.purchaseLicence(1, { from: accounts[4], value: assets[0].price });
      const postSaleSellerBalance = new BigNumber(await web3.eth.getBalance(assets[0].owner));
      const postSaleBuyerBalance = new BigNumber(await web3.eth.getBalance(accounts[4]));

      // Check the price was deposited in the sellers account
      const checkSellerBalance = postSaleSellerBalance.eq(initialSellerBalance.add(assets[0].price));
      assert.equal(checkSellerBalance, true, "price should be deposited into seller account");

      // Check buyers current balance + Price + Gas fees = previousbalance
      const gasUsed = new BigNumber(retPurchase.receipt.gasUsed);
      const totalGasPrice = (new BigNumber(await web3.eth.getGasPrice())).mul(gasUsed);
      const checkBuyerBalance = initialBuyerBalance.eq(postSaleBuyerBalance.add(assets[0].price).add(totalGasPrice));  
      assert.equal(checkBuyerBalance, true, "price should be withdrawn from buyer account")
    });  
    it("should revert if tokenId is not valid", async function () {
      const UDALInstance = await UDALProtocol.deployed();
      await catchRevert(UDALInstance.purchaseLicence(invalidTokenId, { from: accounts[5], value: assets[0].price }));
    });
    it("should revert if ETH sent is < price", async function () {
      const UDALInstance = await UDALProtocol.deployed();
      await catchRevert(UDALInstance.purchaseLicence(invalidTokenId, { from: accounts[5], value: assets[0].price - 1 }));
    });
    it("should revert purchasing account already purchased licence", async function () {
      const UDALInstance = await UDALProtocol.deployed();
      await catchRevert(UDALInstance.purchaseLicence(1, { from: accounts[5], value: assets[0].price }));
    });
  });

  describe("assetURI:", function() {
    it("should return assetURI if licence has been purchased", async function () {
      const UDALInstance = await UDALProtocol.deployed();
      assert.equal(await UDALInstance.assetURI.call(1, { from: accounts[5] }), assets[0].assetURI, 'assetURI should return full size asset URI');  
    });
    it("should revert if tokenId does not exist", async function () {
      const UDALInstance = await UDALProtocol.deployed();
      await catchRevert(UDALInstance.assetURI.call(invalidTokenId, { from: accounts[5], value: assets[0].price }));
    });
    it("should revert if caller has not purchased licence", async function () {
      const UDALInstance = await UDALProtocol.deployed();
      await catchRevert(UDALInstance.assetURI.call(1, { from: accounts[1], value: assets[0].price }));
    });

  });

  describe("ERC721Metadata:", function() {
    it("tokenURI should return metadata URI", async function() {
      const UDALInstance = await UDALProtocol.deployed();
      assert.equal(await UDALInstance.tokenURI.call(1, { from: accounts[6] }), assets[0].tokenURI, "tokenURI should be returned");
    });
    it("tokenURI should throws if `_tokenId` is not a valid NFT", async function() {
      const UDALInstance = await UDALProtocol.deployed();
      await catchRevert(UDALInstance.tokenURI.call(invalidTokenId, { from: accounts[6] }));
    });
    it("name should return the NFT name", async function() {
      const UDALInstance = await UDALProtocol.deployed();
      assert.equal(await UDALInstance.name.call({ from: accounts[6] }), NFTName, "name should be returned");
    });
    it("should return the NFT symbol", async function() {
      const UDALInstance = await UDALProtocol.deployed();
      assert.equal(await UDALInstance.symbol.call({ from: accounts[6] }), NFTSymbol, "symbol should be returned");
    });
  });
});

