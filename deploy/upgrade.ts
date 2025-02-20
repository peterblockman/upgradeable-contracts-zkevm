import { getWallet } from "../utils";
import { Deployer } from "@matterlabs/hardhat-zksync";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// Replace with the address of the proxy contract you want to upgrade
const proxyAddress = "0xd7385ba726A7b72933E63FCb0Dfee8Bcae63478c";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();
  const deployer = new Deployer(hre, wallet);

  const contractV2Artifact = await deployer.loadArtifact(
    "MyUpgradeableContractV2"
  );
  const upgradedContract = await hre.zkUpgrades.upgradeProxy(
    deployer.zkWallet,
    proxyAddress,
    contractV2Artifact
  );
  console.log(
    "Successfully upgraded MyUpgradeableContract to MyUpgradeableContractV2"
  );

  upgradedContract.connect(deployer.zkWallet);

  console.log(
    "New contract initialized with value:",
    await upgradedContract.number()
  );

  // check the number
}
