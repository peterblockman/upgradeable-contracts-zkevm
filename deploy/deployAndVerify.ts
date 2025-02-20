import { getWallet, verifyContract, verifyEnoughBalance } from "../utils";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { getImplementationAddress } from "@openzeppelin/upgrades-core";
import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);

  const contractArtifact = await deployer.loadArtifact("MyUpgradeableContract");

  const deploymentFee = await deployer.estimateDeployFee(contractArtifact, []);
  console.log(
    `Estimated deployment fee: ${ethers.formatEther(deploymentFee)} ETH`
  );
  await verifyEnoughBalance(wallet, deploymentFee);

  const myUpgradeableContract = await hre.zkUpgrades.deployProxy(
    getWallet(),
    contractArtifact,
    [42],
    { initializer: "initialize" }
  );

  await myUpgradeableContract.waitForDeployment();

  console.log(
    "myUpgradeableContract deployed to proxy: ",
    myUpgradeableContract.target
  );

  const proxyAddress = await myUpgradeableContract.getAddress();

  const implementationAddress = await getImplementationAddress(
    hre.ethers.provider,
    proxyAddress
  );

  console.log("Implementation address:", implementationAddress);

  // increase the number
  const tx = await myUpgradeableContract.increment();
  const receipt = await tx.wait();
  console.log("Transaction Hash: ", receipt.hash);

  // check the number
  const number = await myUpgradeableContract.number();
  console.log("Number: ", number);

  // verify the contract
  const constructorArgs = myUpgradeableContract.interface.encodeDeploy([]);
  console.log("Constructor Args: ", constructorArgs);

  const fullContractSource = `${contractArtifact.sourceName}:${contractArtifact.contractName}`;
  const verificationData = {
    address: implementationAddress,
    contract: fullContractSource,
    constructorArguments: constructorArgs,
    bytecode: contractArtifact.bytecode,
  };

  await verifyContract(verificationData);
}
