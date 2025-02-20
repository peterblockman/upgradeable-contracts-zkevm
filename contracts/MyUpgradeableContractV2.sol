// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MyUpgradeableContract.sol";

contract MyUpgradeableContractV2 is MyUpgradeableContract {
    /// @dev New function in V2
    function decrement() external {
        number--;
    }

    function version() public pure override returns (string memory) {
        return "2.0.0";
    }
}
