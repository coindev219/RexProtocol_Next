// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;
interface IOracle {
    function getResult(address uniswapV2Pair) external returns (uint224 price, uint32 T);
    function getBlockTimestamp() external view returns (uint32);
}

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
}

interface IUniswapV2Router02 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);
}
interface IWETH {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
    function withdraw(uint) external;
}