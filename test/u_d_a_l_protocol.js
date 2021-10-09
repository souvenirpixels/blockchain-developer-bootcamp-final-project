const UDALProtocol = artifacts.require("UDALProtocol");
const { BN, constants, expectEvent, expectRevert, balance } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

/* Test Accounts Usage
   accounts[0] - Deployed the contract and is contract owner
   accounts[1] - Mints assets[0] and assets[1] NFT
   accounts[2] - Used as caller that owns / buys nothing
   accounts[3] - Buys assets[0] licence
   accounts[4] - Buys assets[0] licence
   accounts[5] - Mints assets[1] NFT
   accounts[6] - Tests transfer of assets[2]
   accounts[7] - Granted approvals to transfer NFTs
   accounts[8] - Also Granted approvals to transfer NFTs
*/
contract("UDALProtocol", function (accounts) {
  const assets = [{
    owner: accounts[1],
    tokenURI: "https://www.test.com/metadata0.json",
    assetURI: "https://www.test.com/photo0.jpg",
    price: new BN(web3.utils.toWei('0.001'))
  },{
    owner: accounts[5],
    tokenURI: "https://www.test.com/metadata1.json",
    assetURI: "https://www.test.com/photo1.jpg",
    price: new BN(web3.utils.toWei('0.001'))    
  },{
    owner: accounts[1],
    tokenURI: "https://www.test.com/metadata2.json",
    assetURI: "https://www.test.com/photo2.jpg",
    price: new BN(web3.utils.toWei('0.001'))    
  },{
    owner: accounts[1],
    tokenURI: "https://www.test.com/metadata3.json",
    assetURI: "https://www.test.com/photo3.jpg",
    price: new BN(web3.utils.toWei('0.001'))    
  }];
  const NFTName = 'Universal Digital Asset Licencing NFT';
  const NFTSymbol = 'UDALNFT';
  const invalidTokenId = 9999999;
  let UDALInstance;
  
  beforeEach(async function() {
    UDALInstance = await UDALProtocol.deployed();
  });

  describe("mint", function() {
    it("should allow a user to mint a token for someone else", async function () {
      const retCreate = await UDALInstance.mint(assets[0].tokenURI, assets[0].assetURI, assets[0].price, accounts[2], { from: accounts[1] });
      assets[0].tokenId = retCreate.logs[0].args.tokenId; // Save the token ID for use in future tests
      expectEvent(retCreate, 'Transfer', { from: ZERO_ADDRESS, to: accounts[2], tokenId: assets[0].tokenId });
      await UDALInstance.burn(assets[0].tokenId, { from: accounts[2] });
    });

    it("should mint a new licencable NFT and emits transfer event when NFT is created (`from` == 0)", async function () {
      const retCreate = await UDALInstance.mint(assets[0].tokenURI, assets[0].assetURI, assets[0].price, assets[0].owner, { from: assets[0].owner });
      assets[0].tokenId = retCreate.logs[0].args.tokenId; // Save the token ID for use in future tests
      expectEvent(retCreate, 'Transfer', { from: ZERO_ADDRESS, to: assets[0].owner, tokenId: assets[0].tokenId });
    });

    it("shoud revert if price is negative", async function() {
      await expectRevert(UDALInstance.mint(assets[0].tokenURI, assets[0].assetURI, -1, assets[0].owner, { from: assets[0].owner }), 'value out-of-bounds');
    });

    it("shoud revert owner is zero address", async function() {
      await expectRevert(UDALInstance.mint(assets[0].tokenURI, assets[0].assetURI, assets[0].price, ZERO_ADDRESS, { from: assets[0].owner }), 'ERC721: mint to the zero address.');
    });
  });
 
  describe("assetInfo", function() {
    it("should retrive asset information", async function () {
      const retAssetInfo = await UDALInstance.assetInfo.call(assets[0].tokenId);
  
      // Check values equal what was created
      assert.equal(retAssetInfo.owner, assets[0].owner, "Owner should be correct");
      assert.equal(assets[0].price.eq(retAssetInfo.price), true, "price should be correct");
    });
    it("should revert if tokenId is not valid", async function () {
      await expectRevert(UDALInstance.assetInfo.call(99999), 'assetInfo query for nonexistent tokenId');
    });
  });

  describe("purchaseLicence", function() {
    it("allow a licence to be purchased", async function () {
      const retLicence = await UDALInstance.purchaseLicence(assets[0].tokenId, { from: accounts[4], value: assets[0].price });
      expectEvent(retLicence, 'LicencePurchased', { assetURI: assets[0].assetURI, amount: assets[0].price });
    });
    it("should transfer the price to the new account", async function () {
      const sellerTracker = await balance.tracker(assets[0].owner);
      const buyerTracker = await balance.tracker(accounts[3]);
     
      await UDALInstance.purchaseLicence(assets[0].tokenId, { from: accounts[3], value: assets[0].price });

      const sellerDelta = await sellerTracker.delta();
      const buyerDelta = await buyerTracker.deltaWithFees(); 
      const buyerDeltaWithoutFees = buyerDelta.delta.add(buyerDelta.fees);

      assert.equal(assets[0].price.eq(sellerDelta), true, 'price should be deposited into seller account');
      assert.equal(assets[0].price.eq(buyerDeltaWithoutFees.neg()), true, 'price should be withdrawn from buyer account');
    });  
    it("should revert if tokenId is not valid", async function () {
      await expectRevert(UDALInstance.purchaseLicence(invalidTokenId, { from: accounts[4], value: assets[0].price }), 
                         'purchaseLicence query for nonexistent tokenId');
    });
    it("should revert if ETH sent is < price", async function () {
      await expectRevert(UDALInstance.purchaseLicence(assets[0].tokenId, { from: accounts[8], value: assets[0].price.sub(new BN(1)) }), 
                         'Not enough Eth to purchase');
    });
    it("should revert purchasing account already purchased licence", async function () {
      await expectRevert(UDALInstance.purchaseLicence(assets[0].tokenId, { from: accounts[4], value: assets[0].price }),
                        'Licence already purchased');
    });
  });

  describe("assetURI", function() {
    it("should return assetURI if licence has been purchased", async function () {
      assert.equal(await UDALInstance.assetURI.call(assets[0].tokenId, { from: accounts[4] }), assets[0].assetURI, 'assetURI should return full size asset URI');  
    });
    it("should revert if tokenId does not exist", async function () {
      await expectRevert(UDALInstance.assetURI.call(invalidTokenId, { from: accounts[4], value: assets[0].price }), 'revert');
    });
    it("should revert if caller has not purchased licence", async function () {
      await expectRevert(UDALInstance.assetURI.call(assets[0].tokenId, { from: accounts[1], value: assets[0].price }), 'revert');
    });

  });

  describe("ERC721: Metadata", function() {
    it("tokenURI should return metadata URI", async function() {
      assert.equal(await UDALInstance.tokenURI.call(assets[0].tokenId, { from: accounts[2] }), assets[0].tokenURI, "tokenURI should be returned");
    });
    it("tokenURI should throws if `_tokenId` is not a valid NFT", async function() {
      await expectRevert(UDALInstance.tokenURI.call(invalidTokenId, { from: accounts[2] }), 'revert');
    });
    it("name should return the NFT name", async function() {
      assert.equal(await UDALInstance.name.call({ from: accounts[2] }), NFTName, "name should be returned");
    });
    it("should return the NFT symbol", async function() {
      assert.equal(await UDALInstance.symbol.call({ from: accounts[2] }), NFTSymbol, "symbol should be returned");
    });
  });
  describe("ERC721: balanceOf", function() {
    it("should return count of NFT's owner", async function() {
      assert.equal(await UDALInstance.balanceOf.call(assets[0].owner, { from: accounts[2] }), 1, "number of NFTs returned should be correct");
    });
    it("should return zero if no NFTs owned", async function() {
      assert.equal(await UDALInstance.balanceOf.call(accounts[2] , { from: accounts[2] }), 0, "number of NFTs returned should be correct");
    });
    it("should throw if zero address queried", async function() {
      await expectRevert(UDALInstance.balanceOf.call(ZERO_ADDRESS, { from: accounts[2] }), 'revert');
    });
  });
  describe("ERC721: ownerOf", function() {
    it("should return the correct NFT owner", async function() {
      assert.equal(await UDALInstance.ownerOf.call(assets[0].tokenId, { from: accounts[2] }), assets[0].owner, "Owner should be returned");
    });
    it("should throw if invalid Id", async function() {
      await expectRevert(UDALInstance.ownerOf.call(invalidTokenId, { from: accounts[2] }), 'revert');
    });
  });

  describe("ERC721: getApproved", function() {
    it("Returns zero address if no approver.", async function() {
      assert.equal(await UDALInstance.getApproved.call(assets[0].tokenId , { from: accounts[2] }), ZERO_ADDRESS, "Should return zero addrss if no approver");
    });
    it("Throws if `_tokenId` is not a valid NFT.", async function() {
      await expectRevert(UDALInstance.getApproved.call(invalidTokenId, { from: accounts[2] }), 'revert');
    });
    it("Get the approved address for a single NFT", async function() {
      await UDALInstance.approve(accounts[7], assets[0].tokenId, { from: assets[0].owner });
      assert.equal(await UDALInstance.getApproved.call(assets[0].tokenId , { from: accounts[2] }), accounts[7], "Should return approved account");
    });
  });

  describe("ERC721: approve", function() {
    it("zero address is no approver.", async function() {
      const retCreate = await UDALInstance.mint(assets[1].tokenURI, assets[1].assetURI, assets[1].price, assets[1].owner, { from: assets[1].owner });
      assets[1].tokenId = retCreate.logs[0].args.tokenId; // Save the token ID for use in future tests
      assert.equal(await UDALInstance.getApproved.call(assets[1].tokenId , { from: accounts[2] }), ZERO_ADDRESS, "Should return zero addrss if no approver");
    });
    it("set the first approver.", async function() {
      await UDALInstance.approve(accounts[7], assets[1].tokenId, { from: assets[1].owner });
      assert.equal(await UDALInstance.getApproved.call(assets[1].tokenId , { from: accounts[2] }), accounts[7], "Should return approved account");
    });
    it("change the approver.", async function() {
      await UDALInstance.approve(accounts[8], assets[1].tokenId, { from: assets[1].owner });
      assert.equal(await UDALInstance.getApproved.call(assets[1].tokenId , { from: accounts[2] }), accounts[8], "Should return approved account");      
    });
    it("emits Approval when the approved address for an NFT is changed.", async function() {
      const retApprove = await UDALInstance.approve(accounts[7], assets[1].tokenId, { from: assets[1].owner });
      expectEvent(retApprove, 'Approval', { owner: assets[1].owner, approved: accounts[7], tokenId: assets[1].tokenId });
    });
    it("emits Approval when the approved address for an NFT is reaffirmed.", async function() {
      const retApprove = await UDALInstance.approve(accounts[7], assets[1].tokenId, { from: assets[1].owner });
      expectEvent(retApprove, 'Approval', { owner: assets[1].owner, approved: accounts[7], tokenId: assets[1].tokenId });      
    });
    it("Throws unless `msg.sender` is the current NFT owner, or an authorized operator of the current owner.", async function() {
      await expectRevert(UDALInstance.approve(accounts[7], assets[1].tokenId, { from: accounts[0] }), 'revert');
    });
  });

  describe("ERC721: isApprovedForAll", function() {
    const operator = accounts[1];
    const owner = accounts[7];
    it("Returns true if `_operator` is an approved operator for `_owner`", async function() {
      await UDALInstance.setApprovalForAll(operator, true, { from: owner });
      assert.equal(await UDALInstance.isApprovedForAll.call(owner, operator , { from: accounts[2] }), true, "Should return true if operator is approved  for all");
      await UDALInstance.setApprovalForAll(operator, false, { from: owner }); // reset back after test
    });
    it("Returns false if `_operator` is an approved operator for `_owner`", async function() {
      assert.equal(await UDALInstance.isApprovedForAll.call(owner, operator , { from: accounts[2] }), false, "Should return true if operator is approved  for all");
    });
  });

  describe("ERC721: setApprovalForAll", function() {
    const operator1 = accounts[3];
    const operator2 = accounts[4];
    const owner = accounts[1];
    it("Enable approval for a third party (`operator`) to manage all of `msg.sender`'s assets", async function() {
      await UDALInstance.setApprovalForAll(operator1, true, { from: owner });
      assert.equal(await UDALInstance.isApprovedForAll.call(owner, operator1 , { from: accounts[2] }), true, "Should return true if operator is approved for all");
    });

    it("The contract MUST allow multiple operators per owner.", async function() {
      await UDALInstance.setApprovalForAll(operator2, true, { from: owner });
      assert.equal(await UDALInstance.isApprovedForAll.call(owner, operator2 , { from: accounts[2] }), true, "operator2 should be added");
      assert.equal(await UDALInstance.isApprovedForAll.call(owner, operator1 , { from: accounts[2] }), true, "operator1 should still be approved "); 
    });

    it("Disable approval for a third party (`operator`) to manage all of `msg.sender`'s assets", async function() {
      await UDALInstance.setApprovalForAll(operator1, false, { from: owner });
      await UDALInstance.setApprovalForAll(operator2, false, { from: owner });
      assert.equal(await UDALInstance.isApprovedForAll.call(owner, operator1 , { from: accounts[2] }), false, "Should return false if operator1 is not approved for all");      
      assert.equal(await UDALInstance.isApprovedForAll.call(owner, operator2 , { from: accounts[2] }), false, "Should return false if operator2 is not approved for all");      
    });

    it("emits ApprovalForAll when an operator is enabled or disabled for an owner", async function() {
      let retApprove4All = await UDALInstance.setApprovalForAll(operator1, true, { from: owner });
      expectEvent(retApprove4All, 'ApprovalForAll', { owner: owner, approved: operator1, approved: true });
      retApprove4All = await UDALInstance.setApprovalForAll(operator1, false, { from: owner });
      expectEvent(retApprove4All, 'ApprovalForAll', { owner: owner, approved: operator1, approved: false });
    });
  });

  describe("ERC721: transferFrom/safeTransferFrom", function() {
    it("transfers the ownership of an NFT if `msg.sender` is the current owner", async function() {
      // Mint a new NFT for these tests
      const retCreate = await UDALInstance.mint(assets[2].tokenURI, assets[2].assetURI, assets[2].price, assets[2].owner, { from: assets[2].owner });
      assets[2].tokenId = retCreate.logs[0].args.tokenId; // Save the token ID for use in future tests

      // Test safeTransferFrom
      await UDALInstance.safeTransferFrom(assets[2].owner, accounts[6], assets[2].tokenId, { from: assets[2].owner });
      assert.equal(await UDALInstance.ownerOf.call(assets[2].tokenId, { from: accounts[2] }), accounts[6], "safeTransferFrom should transfer to new owner");

      // Test transferFrom by transfering back
      await UDALInstance.transferFrom(accounts[6], assets[2].owner, assets[2].tokenId, { from: accounts[6] });
      assert.equal(await UDALInstance.ownerOf.call(assets[2].tokenId, { from: accounts[2] }), assets[2].owner, "transferFrom should transfer to new owner");
    });

    it("emits Transfer when ownership of any NFT changes by any mechanism.", async function() {
      // Test safeTransferFrom Event
      let retTransfer = await UDALInstance.safeTransferFrom(assets[2].owner, accounts[6], assets[2].tokenId, { from: assets[2].owner });
      expectEvent(retTransfer, 'Transfer', { from: assets[2].owner, to: accounts[6], tokenId: assets[2].tokenId });

      // Test transferFrom Event
      retTransfer = await UDALInstance.transferFrom(accounts[6], assets[2].owner, assets[2].tokenId, { from: accounts[6] });
      expectEvent(retTransfer, 'Transfer', { from: accounts[6], to: assets[2].owner, tokenId: assets[2].tokenId });
    });

    it("transfers the ownership of an NFT if `msg.sender` the approved address for this NFT", async function() {
      // Test safeTransferFrom
      await UDALInstance.approve(accounts[6], assets[2].tokenId, { from: assets[2].owner });
      await UDALInstance.safeTransferFrom(assets[2].owner, accounts[7], assets[2].tokenId, { from: accounts[6] });
      assert.equal(await UDALInstance.ownerOf.call(assets[2].tokenId, { from: accounts[2] }), accounts[7], "safeTransferFrom should transfer to new owner");

      // Test transferFrom
      await UDALInstance.approve(accounts[6], assets[2].tokenId, { from: accounts[7] });
      await UDALInstance.transferFrom(accounts[7], assets[2].owner, assets[2].tokenId, { from: accounts[6] });
      assert.equal(await UDALInstance.ownerOf.call(assets[2].tokenId, { from: accounts[2] }), assets[2].owner, "safeTransfer should transfer to new owner");
    });

    it("transfers the ownership of an NFT if `msg.sender` an authorized operator", async function() {
      // Test safeTransferFrom
      await UDALInstance.setApprovalForAll(accounts[6], assets[2].tokenId, { from: assets[2].owner });
      await UDALInstance.safeTransferFrom(assets[2].owner, accounts[7], assets[2].tokenId, { from: accounts[6] });
      assert.equal(await UDALInstance.ownerOf.call(assets[2].tokenId, { from: accounts[2] }), accounts[7], "safeTransferFrom should transfer to new owner");

      // Test transferFrom
      await UDALInstance.setApprovalForAll(accounts[6], assets[2].tokenId, { from: accounts[7] });
      await UDALInstance.transferFrom(accounts[7], assets[2].owner, assets[2].tokenId, { from: accounts[6] });
      assert.equal(await UDALInstance.ownerOf.call(assets[2].tokenId, { from: accounts[2] }), assets[2].owner, "safeTransfer should transfer to new owner");
    });

    it("At the time of any transfer, the approved address for that NFT (if any) is reset to none.", async function() {
      // Test safeTransferFrom
      await UDALInstance.approve(accounts[6], assets[2].tokenId, { from: assets[2].owner });
      await UDALInstance.safeTransferFrom(assets[2].owner, accounts[8], assets[2].tokenId, { from: assets[2].owner });
      assert.equal(await UDALInstance.getApproved.call(assets[2].tokenId, { from: accounts[2] }), ZERO_ADDRESS, "getApproved should be cleared after safeTransferFrom");
      await UDALInstance.safeTransferFrom(accounts[8], assets[2].owner, assets[2].tokenId, { from: accounts[8] }); // transfer back so can use simmilar code to test transferFrom

      // Test transferFrom
      await UDALInstance.approve(accounts[6], assets[2].tokenId, { from: assets[2].owner });
      await UDALInstance.transferFrom(assets[2].owner, accounts[8], assets[2].tokenId, { from: assets[2].owner });
      assert.equal(await UDALInstance.getApproved.call(assets[2].tokenId, { from: accounts[2] }), ZERO_ADDRESS, "getApproved should be cleared after safeTransferFrom");
      await UDALInstance.transferFrom(accounts[8], assets[2].owner, assets[2].tokenId, { from: accounts[8] });
    });

    it("Throws if `msg.sender` is not the current owner, an authorized operator, or the approved address for this NFT", async function() {
      await expectRevert(UDALInstance.safeTransferFrom(assets[2].owner, accounts[9], assets[2].tokenId, { from: accounts[9] }), 'ERC721: transfer caller is not owner nor approved');
      await expectRevert(UDALInstance.transferFrom(assets[2].owner, accounts[9], assets[2].tokenId, { from: accounts[9] }), 'ERC721: transfer caller is not owner nor approved');
    });

    it("Throws if `_from` is not the current owner", async function() {
      await expectRevert(UDALInstance.safeTransferFrom(accounts[8], accounts[9], assets[2].tokenId, { from: assets[2].owner }), 'ERC721: transfer of token that is not own');
      await expectRevert(UDALInstance.transferFrom(accounts[8], accounts[9], assets[2].tokenId, { from: assets[2].owner }), 'ERC721: transfer of token that is not own');      
    });

    it("Throws if `_to` is the zero address", async function() {
      await expectRevert(UDALInstance.safeTransferFrom(assets[2].owner, ZERO_ADDRESS, assets[2].tokenId, { from: assets[2].owner }), 'ERC721: transfer to the zero address');
      await expectRevert(UDALInstance.transferFrom(assets[2].owner, ZERO_ADDRESS, assets[2].tokenId, { from: assets[2].owner }), 'ERC721: transfer to the zero address');          
    });

    it("Throws if `_tokenId` is not a valid NFT", async function() {
      await expectRevert(UDALInstance.safeTransferFrom(assets[2].owner, ZERO_ADDRESS, invalidTokenId, { from: assets[2].owner }), 'ERC721: operator query for nonexistent token');
      await expectRevert(UDALInstance.transferFrom(assets[2].owner, ZERO_ADDRESS, invalidTokenId, { from: assets[2].owner }), 'ERC721: operator query for nonexistent token');
    });

    xit("When transfer is complete, this function checks if `_to` is a smart contract (code size > 0). If so, it calls `onERC721Received` on `_to`", async function() {
      // TODO: Wasn't able to figure out how to test a contract calling my contract .... 
    });

    xit("after calling onERC721Received throws if the return value is not `bytes4(keccak256(onERC721Received(address,address,uint256,bytes)))`", async function() {
      // TODO: Wasn't able to figure out how to test a contract calling my contract .... 
    });
  });

  describe("ERC165: supportsInterface", function() {
    it("return `true` if the contract implements `interfaceID`", async function() {
      assert.equal(await UDALInstance.supportsInterface.call('0x01ffc9a7', { from: accounts[2] }), true);
    }); 

    it("return `false` if the contract does not implement `interfaceID`", async function() {
      assert.equal(await UDALInstance.supportsInterface.call('0xffffffff', { from: accounts[2] }), false);
    }); 
  });

  describe("ERC721: Enumerable", function() {
    let totalSupply;
    it("totalSupply returns A count of valid NFTs tracked by this contract", async function() {
      totalSupply = (await UDALInstance.totalSupply.call({ from: accounts[2] })).toNumber();
      assert.equal(totalSupply, 3, 'Totalsupply should equal 3');
    });

    it("tokenByIndex returns the token identifier for the `_index`th NFT", async function() {
      for (let i = 0; i < totalSupply; ++i) {
        assert.equal((await UDALInstance.tokenByIndex.call(i, { from: accounts[2] })).eq(assets[i].tokenId), true, 'token Ids should equal');
      }
    });    

    it("tokenByIndex throws if `_index` >= `totalSupply()`", async function() {
      await expectRevert(UDALInstance.tokenByIndex.call(totalSupply + 1, { from: accounts[2] }), 'ERC721Enumerable: global index out of bounds');
    });
  });

  describe("ERC721: Burnable", function() {
    const assetId = 3;
    it("Token is irreversibly burned (destroyed).", async function() {
      const retCreate = await UDALInstance.mint(assets[assetId].tokenURI, assets[assetId].assetURI, assets[assetId].price, assets[assetId].owner, { from: assets[assetId].owner });
      assets[assetId].tokenId = retCreate.logs[0].args.tokenId; // Save the token ID for use in future tests
      await UDALInstance.burn(assets[assetId].tokenId, { from: assets[assetId].owner });
      await expectRevert(UDALInstance.ownerOf.call(assets[assetId].tokenId, { from: accounts[2] }), 'ERC721: owner query for nonexistent token');
    }); 

    it("burn caller must own tokenId or be an approved operator.", async function() {
      const retCreate = await UDALInstance.mint(assets[assetId].tokenURI, assets[assetId].assetURI, assets[assetId].price, assets[assetId].owner, { from: assets[assetId].owner });
      assets[assetId].tokenId = retCreate.logs[0].args.tokenId; // Save the token ID for use in future tests
      await expectRevert(UDALInstance.burn(assets[assetId].tokenId, { from: accounts[2] }), 'ERC721Burnable: caller is not owner nor approved.');      
    }); 

    it("Emits transfer event when NFT is destroyed (`to` == 0)", async function() {
      const retTransfer = await UDALInstance.burn(assets[assetId].tokenId, { from: assets[assetId].owner });
      expectEvent(retTransfer, 'Transfer', { from: assets[assetId].owner, to: ZERO_ADDRESS, tokenId: assets[assetId].tokenId });
    });

    it("Should not be possible to licence a burned asset", async function() {
      await expectRevert(UDALInstance.purchaseLicence(invalidTokenId, { from: accounts[4], value: assets[0].price }), 
                         'purchaseLicence query for nonexistent tokenId');
    });   
  });
});

