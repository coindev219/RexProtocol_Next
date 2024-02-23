// SPDX-License-Identifier: MIT
pragma solidity =0.8.15;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "github.com/provable-things/ethereum-api/provableAPI.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

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

contract Deposit_Vault_V2 is Ownable, usingProvable {
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
    mapping(address => uint256) public margin_requirement;
    mapping(address => address) public last_borrowed;
    mapping(address => address[10]) public borrowed_tokens;
    mapping(string => bool) public QueryApproval;

    enum OrderStatus {
        UNFILLED,
        FILLED,
        PROCESSING
    }
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
    event TradeExecuted(uint256 blocktimestamp);
    event OutOfGasFunds(uint256 blocktimestamp);

    function SubmitOrder(
        string memory queryParam,
        address taker_token,
        address maker_token,
        address[] memory takers,
        address[] memory makers,
        uint256[] memory taker_amounts,
        uint256[] memory maker_amounts,
        string memory _id
    ) public returns (bool) {
        require(
            takers.length == taker_amounts.length,
            "uneven buyer amounts and buyer addresses"
        );
        require(
            makers.length == maker_amounts.length,
            "uneven seller amounts and seller addresses"
        );

        QueryApproval[queryParam] = false;
        
        ProcessTrade(
            queryParam,
            taker_token,
            maker_token,
            takers,
            makers,
            taker_amounts,
            maker_amounts,
            _id
        );
        return QueryApproval[queryParam];
    }

    function ProcessTrade(
        string memory queryParam,
        address taker_token,
        address maker_token,
        address[] memory takers,
        address[] memory makers,
        uint256[] memory taker_amounts,
        uint256[] memory maker_amounts,
        string memory _id
    ) internal {
        if (provable_getPrice("URL") > address(this).balance) {
            emit ProvableQueryCalled(
                "Please ensure that your wallet have sufficient funds to pay for the query"
            );
            emit OutOfGasFunds(block.timestamp);
        } else {
            OrderDetails[queryParam].taker_token = taker_token;
            OrderDetails[queryParam].maker_token = maker_token;
            OrderDetails[queryParam].maker_amounts = maker_amounts;
            OrderDetails[queryParam].taker_amounts = taker_amounts;
            OrderDetails[queryParam].takers = takers;
            OrderDetails[queryParam].makers = makers;
            OrderDetails[queryParam].order_status = OrderStatus.PROCESSING;
            OrderDetails[queryParam]._id = _id;
            string memory apiUrl = string(
                abi.encodePacked(apiEndpoint, queryParam, ").status")
            );
            bytes32 queryId = provable_query("URL", apiUrl);
            queryParamMap[queryId] = queryParam;
            emit ProvableQueryCalled("Query sent, please wait");
        }
    }

    function __callback(bytes32 myid, string memory result) public {
        require(
            msg.sender == provable_cbAddress(),
            "Only the provable callback address can call this function"
        );
        if (equal(result, "1")) {
            address[2] memory pair;
            pair[0] = OrderDetails[queryParamMap[myid]].taker_token;
            pair[1] = OrderDetails[queryParamMap[myid]].maker_token;
            TransferBalances(
                pair,
                OrderDetails[queryParamMap[myid]].takers,
                OrderDetails[queryParamMap[myid]].makers,
                OrderDetails[queryParamMap[myid]].taker_amounts,
                OrderDetails[queryParamMap[myid]].maker_amounts,
                OrderDetails[queryParamMap[myid]]._id
            );
        } else {
            QueryApproval[queryParamMap[myid]] = false;
        }
        emit ValueUpdated(result);
    }

    function TransferBalances(
        address[2] memory pair,
        address[] memory takers,
        address[] memory makers,
        uint256[] memory taker_amounts,
        uint256[] memory maker_amounts,
        string memory queryParam
    ) internal returns (bool) {
        require(
            OrderDetails[queryParam].order_status == OrderStatus.UNFILLED ||
                OrderDetails[queryParam].order_status == OrderStatus.PROCESSING,
            "this orderid has been filled"
        );
        IERC20 taker_token = IERC20(pair[0]);
        IERC20 maker_token = IERC20(pair[1]);
        for (uint256 i = 0; i < takers.length; i++) {
            token_deposit_info[takers[i]][taker_token] = token_deposit_info[
                takers[i]
            ][taker_token].sub(taker_amounts[i]);
            token_deposit_info[takers[i]][maker_token] = token_deposit_info[
                takers[i]
            ][maker_token].add(maker_amounts[i]);
        }
        for (uint256 i = 0; i < makers.length; i++) {
            token_deposit_info[makers[i]][maker_token] = token_deposit_info[
                makers[i]
            ][maker_token].sub(maker_amounts[i]);
            token_deposit_info[makers[i]][taker_token] = token_deposit_info[
                makers[i]
            ][taker_token].add(taker_amounts[i]);
        }
        OrderDetails[queryParam].order_status = OrderStatus.FILLED;
        QueryApproval[queryParam] = true;
        emit TradeExecuted(block.timestamp);
        return true;
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

    function deposit_token(address token, uint256 amount)
        external
        returns (bool)
    {
        IERC20 ERC20Token = IERC20(token);
        token_deposit_info[msg.sender][ERC20Token] = token_deposit_info[
            msg.sender
        ][ERC20Token].add(amount);
        ERC20Token.transferFrom(msg.sender, address(this), amount);
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
        ERC20Token.transferFrom(address(this), msg.sender, amount);
        token_deposit_info[msg.sender][ERC20Token] = token_deposit_info[
            msg.sender
        ][ERC20Token].sub(amount);
        return true;
    }

    function ApproveForWithdraw(
        address token,
        address user,
        uint256 amount
    ) public {
        IERC20 ERC20Token = IERC20(token);
        ERC20Token.approve(user, amount);
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


