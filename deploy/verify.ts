import { getWallet, verifyContract, verifyEnoughBalance } from "../utils";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);

  const contractArtifact = await deployer.loadArtifact("MyUpgradeableContract");
  const contract = await hre.ethers.getContractAt(
    contractArtifact.contractName,
    "0x5fa2262676C297Ff0F199B941e3E618A6a562B67"
  );
  const constructorArgs = contract.interface.encodeDeploy([]);
  const fullContractSource = `${contractArtifact.sourceName}:${contractArtifact.contractName}`;

  const verificationData = {
    address: contract.target as string,
    contract: fullContractSource,
    constructorArguments: constructorArgs,
    bytecode: contractArtifact.bytecode,
  };

  console.log(verificationData);

  const verificationRequestId = await verifyContract(verificationData);
  console.log("Verification Request ID: ", verificationRequestId);
}
