// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
interface IDeposit_Vault {

function fetch_deposit_for_token(address token, address user) external returns(uint256);
function fetch_price_for_token(address token, address user) external returns(uint256);
function setOracle(address oracle_address) external returns(bool);
function setExchange(address exchange_address) external  returns(bool);
function TransferBalances(address token1, address token2, address[] calldata buyers, address[] calldata sellers, uint256[] calldata taker_amount, uint256[] calldata maker_amount) external returns(bool);
function deposit_token(address token, uint256 amount) external returns(bool);
function Deposit_ETH(address token, uint256 amount) external returns(bool);
function withdraw_token(address token, uint256 amount) external returns(bool);
function withdraw_ETH(address token, uint256 amount) external returns(bool);

}