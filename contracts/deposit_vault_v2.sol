// SPDX-License-Identifier: MIT
pragma solidity =0.8.15;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "github.com/provable-things/ethereum-api/provableAPI.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

library SafeMath {
    function add(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x + y) >= x, "ds-math-add-overflow");
    }

    function sub(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x - y) <= x, "ds-math-sub-underflow");
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
}

// helper methods for interacting with ERC20 tokens and sending ETH that do not consistently return true/false
library TransferHelper {
    function safeApprove(
        address token,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('approve(address,uint256)')));
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(0x095ea7b3, to, value)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "TransferHelper: APPROVE_FAILED"
        );
    }

    function safeTransfer(
        address token,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('transfer(address,uint256)')));
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(0xa9059cbb, to, value)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "TransferHelper: TRANSFER_FAILED"
        );
    }

    function safeTransferFrom(
        address token,
        address from,
        address to,
        uint256 value
    ) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(0x23b872dd, from, to, value)
        );
        require(
            success && (data.length == 0 || abi.decode(data, (bool))),
            "TransferHelper: TRANSFER_FROM_FAILED"
        );
    }

    function safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}(new bytes(0));
        require(success, "TransferHelper: ETH_TRANSFER_FAILED");
    }
}

contract Deposit_Vault_v1 is Ownable, usingProvable {
    using SafeMath for uint256;
    using Strings for string;
    IERC20 private ierc20;

    uint256 public feeDenominator;
    uint256 public feeNumerator;
    string public apiEndpoint =
        "json(https://fierce-anchorage-27299.herokuapp.com/checkorder?queryParam=";
    mapping(bytes32 => string) public queryParamMap;
    mapping(string => string) public OrderConfirmationStatus;
    mapping(string => Order) public OrderDetails;

    mapping(address => mapping(IERC20 => uint256)) public token_deposit_info;
    mapping(address => mapping(IERC20 => uint256)) public borrow_info;
    mapping(address => uint256) public total_borrowable_asset;
    mapping(address => uint256) public margin_requirement; // init 20% liq ratio
    mapping(address => address) public last_borrowed;
    mapping(address => address[10]) public borrowed_tokens;

    enum OrderStatus {UNFILLED,FILLED}

    struct Order {
        OrderStatus order_status;
        address taker_token;
        address maker_token;
        address[] takers;
        address[] makers;
        uint256[] taker_amounts;
        uint256[] maker_amounts;
        string _id;
    }

    // events
    event ValueUpdated(string result);
    event ProvableQueryCalled(string description);

    // call this function to access web services
    function ProcessTrade(string memory queryParam, Order memory order) public {
        // only the owner can invoke this function
        if (provable_getPrice("URL") > address(this).balance) {
            emit ProvableQueryCalled(
                "Please ensure that your wallet have sufficient funds to pay for the query"
            );
        } else {
            string memory apiUrl = string(
                abi.encodePacked(apiEndpoint, queryParam, ").status")
            );
            emit ProvableQueryCalled("Query sent, please wait");
            bytes32 queryId = provable_query("URL", apiUrl);
            queryParamMap[queryId] = queryParam;
            OrderDetails[queryParam].taker_token = order.taker_token;
            OrderDetails[queryParam].maker_token = order.maker_token;
            OrderDetails[queryParam].maker_amounts = order.maker_amounts;
            OrderDetails[queryParam].taker_amounts = order.taker_amounts;
            OrderDetails[queryParam].takers = order.takers;
            OrderDetails[queryParam].makers = order.makers;
            OrderDetails[queryParam].order_status = OrderStatus.UNFILLED;
        }
    }

    function __callback(bytes32 myid, string memory result) internal {
        require(msg.sender == provable_cbAddress());
        //require(OrderDetails[queryParam].order_status == OrderStatus.UNFILLED, "this order has been filled");
        string memory queryParam = queryParamMap[myid];
        if (equal(result, "1")) {
            TransferBalances(OrderDetails[queryParam], queryParam);
        }else{
        return;
        }
        emit ValueUpdated(result);
    }

    function GetTokenDepositInfo(address token, address user)
        public
        view
        returns (uint256)
    {
        IERC20 ERCToken = IERC20(token);
        return token_deposit_info[user][ERCToken] + borrow_info[user][ERCToken];
    }

    function equal(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return
            bytes(a).length == bytes(b).length &&
            keccak256(bytes(a)) == keccak256(bytes(b));
    }

    function TransferBalances(Order memory order, string memory queryParam) internal returns (bool) {
        require(OrderDetails[queryParam].order_status == OrderStatus.UNFILLED, "this order has been filled");
        IERC20 taker_token = IERC20(order.taker_token);
        IERC20 maker_token = IERC20(order.maker_token);
        require(
            order.takers.length == order.taker_amounts.length,
            "uneven buyer amounts and buyer addresses"
        );
        require(
            order.makers.length == order.maker_amounts.length,
            "uneven seller amounts and seller addresses"
        );
        for (uint256 i = 0; i < order.takers.length; i++) {
            token_deposit_info[order.takers[i]][
                taker_token
            ] = token_deposit_info[order.takers[i]][taker_token].sub(
                order.taker_amounts[i]
            );
            token_deposit_info[order.takers[i]][
                maker_token
            ] = token_deposit_info[order.takers[i]][maker_token].add(
                order.maker_amounts[i]
            );
        }
        for (uint256 i = 0; i < order.makers.length; i++) {
            token_deposit_info[order.makers[i]][
                maker_token
            ] = token_deposit_info[order.makers[i]][maker_token].sub(
                order.maker_amounts[i]
            );
            token_deposit_info[order.makers[i]][
                taker_token
            ] = token_deposit_info[order.makers[i]][taker_token].add(
                order.taker_amounts[i]
            );
        }
        OrderDetails[queryParam].order_status = OrderStatus.FILLED;
        return true;
    }

    function deposit_token(address token, uint256 amount)
        external
        returns (bool)
    {
        IERC20 ERC20Token = IERC20(token);
        ERC20Token.approve(address(this), amount);
        token_deposit_info[msg.sender][ERC20Token] = token_deposit_info[
            msg.sender
        ][ERC20Token].add(amount);
        TransferHelper.safeTransferFrom(
            token,
            msg.sender,
            address(this),
            amount
        );
        return true;
    }

    function Deposit_ETH(address token, uint256 amount)
        external
        payable
        returns (bool)
    {
        //WETH.deposit(msg.value)
        IERC20 ERC20Token = IERC20(token);
        require(
            token_deposit_info[msg.sender][ERC20Token] >= amount,
            " you do not have a deposit of that size "
        );
        ERC20Token.approve(msg.sender, amount);
        TransferHelper.safeTransferFrom(
            token,
            address(this),
            msg.sender,
            amount
        );
        token_deposit_info[msg.sender][ERC20Token] = token_deposit_info[
            msg.sender
        ][ERC20Token].sub(amount);
        return true;
    }

    function withdraw_token(address token, uint256 amount)
        external
        returns (bool)
    {
        IERC20 ERC20Token = IERC20(token);
        require(
            token_deposit_info[msg.sender][ERC20Token] >= amount,
            " you do not have a deposit of that size "
        );
        ERC20Token.approve(msg.sender, amount);
        //check for borrowed funds
        require(
            borrow_info[msg.sender][ERC20Token] == 0,
            " You must repay Borrowed funds bfore Withdrawing this asset"
        );
        TransferHelper.safeTransferFrom(
            token,
            address(this),
            msg.sender,
            amount
        );
        token_deposit_info[msg.sender][ERC20Token] = token_deposit_info[
            msg.sender
        ][ERC20Token].sub(amount);
        return true;
    }

    function withdraw_ETH(address token, uint256 amount)
        external
        returns (bool)
    {
        IERC20 ERCToken = IERC20(token);
        require(
            token_deposit_info[msg.sender][ERCToken] >= amount,
            " you do not have a deposit of that size "
        );
        ERCToken.approve(msg.sender, amount);
        //check for borrowed funds
        TransferHelper.safeTransferFrom(
            token,
            address(this),
            msg.sender,
            amount
        );
        token_deposit_info[msg.sender][ERCToken] = token_deposit_info[
            msg.sender
        ][ERCToken].sub(amount);
        return true;
    }

    receive() external payable {}

    function refund() public {
        require(msg.sender == owner(), " only the owner can call this");
        payable(msg.sender).transfer(address(this).balance);
    }

    function selfDestruct() public {
        require(msg.sender == owner(), " only the owner can call this");
        selfdestruct(payable(owner()));
    }
}
