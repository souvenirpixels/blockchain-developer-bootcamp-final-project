const UDALProtocol = artifacts.require("UDALProtocol");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("UDALProtocol", function (/* accounts */) {
  it("should assert true", async function () {
    await UDALProtocol.deployed();
    return assert.isTrue(true);
  });
});
