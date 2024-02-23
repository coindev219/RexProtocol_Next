// SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "./Ioracle.sol";
//fetch from imported oracle contract 
//feth from imported  ideposit value

library SafeMath {
    function add(uint x, uint y) internal pure returns (uint z) {
        require((z = x + y) >= x, 'ds-math-add-overflow');
    }

    function sub(uint x, uint y) internal pure returns (uint z) {
        require((z = x - y) <= x, 'ds-math-sub-underflow');
    }

    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, 'ds-math-mul-overflow');
    }
}

// helper methods for interacting with ERC20 tokens and sending ETH that do not consistently return true/false
library TransferHelper {
    function safeApprove(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('approve(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: APPROVE_FAILED');
    }

    function safeTransfer(address token, address to, uint value) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FAILED');
    }

    function safeTransferFrom(address token, address from, address to, uint value) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'TransferHelper: TRANSFER_FROM_FAILED');
    }

    function safeTransferETH(address to, uint value) internal {
        (bool success,) = to.call{value:value}(new bytes(0));
        require(success, 'TransferHelper: ETH_TRANSFER_FAILED');
    }
}


contract Deposit_Vault is Ownable {

    using SafeMath for uint;
    //address private constant Oracle = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address private constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    IUniswapV2Router02 private router = IUniswapV2Router02(UNISWAP_V2_ROUTER);
 
    IOracle private oracle = IOracle(Oracle);

    IERC20 private ierc20;

    uint public feeDenominator;
    uint public feeNumerator;

    address public managerAddress;
    address public Exchange;
    address public Oracle;


    mapping(address => mapping(IERC20 => uint256)) public token_deposit_info;
    mapping(address => mapping(IERC20 => uint256)) public borrow_info;
    mapping(address => uint256) public total_borrowable_asset;
    mapping(address => uint) public margin_requirement;
    mapping(address => address) public last_borrowed;
    mapping(address => address[]) public borrowed_tokens;

    //address [] public borrowed_tokens



    modifier ensure(uint deadline) {
        require(deadline >= block.timestamp, 'EXPIRED');
        _;
    }
    modifier onlyManager() {
        require(msg.sender == managerAddress, "Message sender must be the contract's Manager.");
        _;
    }
    modifier onlyExchange() {
        require(msg.sender == Exchange, "Message sender must be the contract's Manager.");
        _;
    }
 

    constructor(address _exchange , address _oracle){
        setOracle(_oracle);
        setExchange(_exchange);

    }


    receive() external payable {
       // assert(msg.sender == WETH); // only accept ETH via fallback from the WETH contract
    }
 
/* _____________ 
|  _________  |
| | Getters | |
| |_________| |
|_____________|
*/

function GetTokenDepositInfo(address token, address user) public returns(uint256){
      IERC20 ERCToken = IERC20(token);
      return token_deposit_info[user][ERCToken] + borrow_info[user][ERCToken];
}

function GetPriceForToken(address token, address user) external returns(uint224){
    IUniswapV2Factory factory = IUniswapV2Factory(router.factory());
    address univ2pair = factory.getPair(token, router.WETH());
    (uint224 price, uint t) = oracle.getResult(univ2pair);
    return price;
}
/* _____________ 
|  _________  |
| | Setters | |
| |_________| |
|_____________|
*/

function setOracle(address oracle_address) public onlyOwner returns(bool) {
    Oracle = oracle_address;
    return true;
}
function setExchange(address exchange_address) public onlyOwner returns(bool) {
    Exchange = exchange_address;
    return true;
}

// set collaterilization ratio (if you set to 800 they need 80% collateral to borrowed funds
// ie they can borrow up to 80% of their depositted funds (500$ 400$ borrow) 
function SetCollateralizationRatio(address token, uint required_percentage) external onlyOwner returns(bool){
    margin_requirement[token] == required_percentage;
    return true;
}



/* 
 ______________ 
|  __________  |
| | Exchange | |
| |__________| |
|______________|
*/
function TransferBalances(address token1, address token2, address[] memory buyers, address[] memory sellers, uint256[] memory taker_amount, uint256[] memory maker_amount) external onlyExchange returns(bool) {
    IERC20 taker_token  = IERC20(token1);
    IERC20 maker_token  = IERC20(token2);
    require(buyers.length == taker_amount.length, "uneven buyer amounts and buyer addresses");
    require(sellers.length == maker_amount.length, "uneven seller amounts and seller addresses");
    for (uint256 i = 0; i < buyers.length; i++) 
{
       token_deposit_info[i][maker_token]  = token_deposit_info[i][maker_token].sub(maker_amount[i]);
       token_deposit_info[i][taker_token]  = token_deposit_info[i][maker_token].add(taker_amount[i]);
}
    for (uint256 i = 0; i < sellers.length; i++) 
{
       token_deposit_info[i][maker_token]  = token_deposit_info[i][maker_token].add(maker_amount[i]);
       token_deposit_info[i][taker_token]  = token_deposit_info[i][taker_token].sub(taker_amount[i]);
}
return true;
}


/* 
 _____________ 
|  _________  |
| | Deposit | |
| |_________| |
|_____________|
*/
function deposit_token(address token, uint256 amount) external returns(bool){
    IERC20 ERCToken = IERC20(token);
    ERCToken.approve(address(this), amount);
    TransferHelper.safeTransferFrom(token, msg.sender, address(this), amount);
    token_deposit_info[msg.sender][ERCToken] = token_deposit_info[msg.sender][ERCToken].add(amount);

    return true;
}

function Deposit_ETH(address token, uint256 amount) external returns(bool){
    IERC20 ERCToken = IERC20(token);
    require(token_deposit_info[msg.sender][ERCToken] >= amount, " you do not have a deposit of that size ");
    ERCToken.approve(msg.sender, amount);
    TransferHelper.safeTransferFrom(token, address(this), msg.sender, amount);
    token_deposit_info[msg.sender][ERCToken] = token_deposit_info[msg.sender][ERCToken].sub(amount);
    return true;
}



/* 
 ______________ 
|  __________  |
| | Withdraw | |
| |__________| |
|______________|
*/
function withdraw_token(address token, uint256 amount) external returns(bool){
    IERC20 ERC20Token = IERC20(token);
    require(token_deposit_info[msg.sender][ERC20Token] >= amount, " you do not have a deposit of that size ");
    ERC20Token.approve(msg.sender, amount);
      //check for borrowed funds
    require(borrow_info[msg.sender][ERC20Token] == 0, " You must repay Borrowed funds bfore Withdrawing this asset");
    TransferHelper.safeTransferFrom(token, address(this), msg.sender, amount);
    token_deposit_info[msg.sender][ERC20Token] = token_deposit_info[msg.sender][ERC20Token].sub(amount) ;
    return true;
}

function withdraw_ETH(address token, uint256 amount) external returns(bool){
    IERC20 ERCToken = IERC20(token);
    require(token_deposit_info[msg.sender][ERCToken] >= amount, " you do not have a deposit of that size ");
    ERCToken.approve(msg.sender, amount);
      //check for borrowed funds
    TransferHelper.safeTransferFrom(token, address(this), msg.sender, amount);
    token_deposit_info[msg.sender][ERCToken] = token_deposit_info[msg.sender][ERCToken].sub(amount);
    return true;
  }
/* 
 ______________ 
|  __________  |
| |  Borrow  | |
| |__________| |
|______________|
*/

function BorrowTokens(uint256 borrow_amount, address collateral_token, address borrow_token) external returns (bool){
    uint256 current_deposit  = GetTokenDepositInfo(collateral_token, msg.sender);
    require(current_deposit * margin_requirement[collateral_token] >= borrow_amount, " you can not borrow that much based on your deposits and the colateral ratio");
    require(total_borrowable_asset[borrow_token] > borrow_amount, "not enough borrowable assets");
    IERC20 IERC20_borrow_token = IERC20(borrow_token);
    borrow_info[msg.sender][IERC20_borrow_token] = borrow_info[msg.sender][IERC20_borrow_token].add(borrow_amount);
    last_borrowed[msg.sender] = borrow_token;

    // need to have a tacker that somehow tells the contract if they have outstanding loans
    // address
}


}
