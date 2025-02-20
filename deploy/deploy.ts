import { getWallet } from "../utils";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);

  const contractArtifact = await deployer.loadArtifact("MyUpgradeableContract");

  const myUpgradeableContract = await hre.zkUpgrades.deployProxy(
    getWallet(),
    contractArtifact,
    [42],
    { initializer: "initialize" }
  );

  await myUpgradeableContract.waitForDeployment();

  console.log(
    "myUpgradeableContract deployed to: ",
    myUpgradeableContract.target
  );

  // increase the number
  const tx = await myUpgradeableContract.increment();
  const receipt = await tx.wait();
  console.log("Transaction Hash: ", receipt.hash);

  // check the number
  const number = await myUpgradeableContract.number();
  console.log("Number: ", number);
}
