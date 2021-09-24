var UDALProtocol = artifacts.require("./UDALProtocol.sol");

module.exports = function(deployer) {
  deployer.deploy(UDALProtocol);
};