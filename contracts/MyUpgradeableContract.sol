// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import from OpenZeppelin upgradeable libraries
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MyUpgradeableContract is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    // Example state variable
    uint256 public number;

    /// @dev Replaces constructor for upgradeable contracts.
    ///      "initializer" ensures it can only be called once.
    function initialize(uint256 _num) public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        number = _num;
    }

    /// @dev Required by UUPS to authorize upgrades.
    ///      Restrict to owner only.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /// @dev Example function: increments 'number'.
    function increment() external {
        number++;
    }

    function version() public pure virtual returns (string memory) {
        return "1.0.0";
    }
}
