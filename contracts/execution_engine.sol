//fetch from imported oracle contract 
//feth from imported  ideposit value

// SPDX-License-Identifier: MIT
pragma solidity =0.8.16;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./ioracle.sol";
import "./ideposit_valut.sol";

interface IWETH {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
    function withdraw(uint) external;
}

contract Execution_engine is ERC20, Ownable {

    using SafeMath for uint;

    address private constant Oracle = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IOracle private oracle = IOracle(Oracle);
    address private constant Deposit_vault = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IDeposit_Vault private deposit_vault = IDeposit_Vault(Deposit_vault);
    IERC20 private ierc20;

    address public immutable override WETH;

    uint public feeDenominator;
    uint public feeNumerator;

    address public managerAddress;

    mapping(address => uint256) feeDeposits;


 
    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'UniswapV2Router: EXPIRED');
        _;
    }
    modifier onlyManager() {
        require(msg.sender == managerAddress, "Message sender must be the contract's Manager.");
        _;
    }

    constructor(uint _feeNumerator, uint _feeDenominator, address _manager) public {
        WETH = oracle.WETH();
        feeNumerator = _feeNumerator;
        OwnerIsActive = true;
        feeDenominator = _feeDenominator;
        UpdateManagerAddress(_manager);
    }

    receive() external payable {
        assert(msg.sender == WETH); // only accept ETH via fallback from the WETH contract
    }

/* 
 _____________ 
|  _________  |
| |  Fees   | |
| |_________| |
|_____________|
*/
function SetfeeDenominator(uint value) public onlyManager {
    require(value >= 100, "These limits have been put in place to make the maximum Fees charged on the exhange to be 5% or less, never any more");
    feeDenominator = value;
    }

function SetfeeNumerator(uint value) public onlyManager {
    require(value <= 5, "These limits have been put in place to make the maximum Fees charged on the exhange to be 5% or less, never any more" );
    feeNumerator = value;
    }


/* 
 _____________ 
|  _________  |
| |  Swap   | |
| |_________| |
|_____________|
*/
function _swap(address taker_token,address maker_token, address[] memory _takers, address[] memory _makers, uint256[] memory taker_amounts, uint256[] memory maker_amounts){
    for( i=0, i > _takers.length, i++){
    uint256 base_deposits = deposit_vault.fetch_deposit_for_token(base_token, i);
    require(base_deposits >= taker_amounts[i], "Not enoough deposits");
    uint fee_for_tx = feeNumerator.div(feeDenominator));
    uint taker_amounts_with_fee = taker_amounts.mul(fee_for_tx);
    
    }
    for( i=0, i > _makers.length, i++){
    uint256 maker_deposits  = deposit_vault.fetch_deposit_for_token(taker_token, i);
    require(maker_deposits >= maker_amounts[i], "Not enoough deposits"); 
    uint fee_for_tx = feeNumerator.div(feeDenominator));
    uint maker_amounts_with_fee = maker_amounts.mul(fee_for_tx);
    }

    deposit_vault.TransferBalances(taker_token, maker_token,_takers, _makers, taker_amounts_with_fee, maker_amounts_with_fee));
    
}

/* 
 ______________ 
|  __________  |
| | Withdraw | |
| |__________| |
|______________|
*/

function withdraw() public onlyOwner {
		// Transfer the remaining balance to the mananger
	(bool sent, ) = payable(owner()).call{ value: address(this).balance }("");
	require(sent, "Failed to withdraw Ether.");
}


function approveERC20(address spender, uint256 amount, IERC20 token) private returns (bool) {
        token.approve(spender, amount);
        return true;
} 

function withdrawTokens(IERC20 token) public onlyOwner {
        approveERC20(msg.sender, token.balanceOf(address(this)), token);
        token.transfer(msg.sender, token.balanceOf(address(this)));
}
    
}