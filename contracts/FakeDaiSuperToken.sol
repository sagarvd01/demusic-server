// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { ISuperToken, IERC20 } from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";
import { IFakeDAI } from "./IFakeDAI.sol";

// Deploy this contract on **Goerli Testnet** to begin experimenting
// Alternatively, use pre-deployed contract at 0x7c7A61e744be5abA305701359e44714EC7e71fc5 and this as an interface for interacting on Remix
contract WorkWithSuperTokens {

    ISuperToken public goerlifDAIx = ISuperToken(0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00);

    /// @dev Mints 10,000 fDAI to this contract and wraps (upgrades) it all into fDAIx
    ///      fDAI has a convenient public mint function so we can get as much as we need
    function gainfDAIx() external {

        // Get address of fDAI by getting underlying token address from DAIx token
        IFakeDAI fDAI = IFakeDAI( goerlifDAIx.getUnderlyingToken() );
        
        // Mint 10,000 fDAI
        fDAI.mint(address(this), 10000e18);

        // Approve fDAIx contract to spend fDAI
        fDAI.approve(address(goerlifDAIx), 20000e18);

        // Wrap the fDAI into fDAIx
        goerlifDAIx.upgrade(10000e18);

    }

    /// @dev Unwraps (downgrades) chosen amount of fDAIx into DAIx
    /// @param amount - quantity of fDAIx being downgraded
    function losefDAIx(uint256 amount) external {

        // Unwrap the fDAIx into fDAI
        goerlifDAIx.downgrade(amount);

    }

    /// @dev Show fDAI balance of this contract
    /// @return Balance of fDAI in this contract
    function getfDAIBalance() external view returns(uint256) {

        // Get address of fDAI by getting underlying token address from DAIx token
        IFakeDAI fDAI = IFakeDAI( goerlifDAIx.getUnderlyingToken() );

        return fDAI.balanceOf(address(this));

    }

    /// @dev Show fDAIx balance of this contract
    /// @return Balance of fDAIx in this contract
    function getfDAIxBalance() external view returns(uint256) {

        return goerlifDAIx.balanceOf(address(this));

    }

}