// SPDX-License-Identifier: MIT
pragma solidity =0.8.15;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "IRexOracle.sol";

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

contract Deposit_Vault_V2 is Ownable, RrpRequesterV0 {
    using SafeMath for uint256;
    using Strings for string;
    IERC20 private ierc20;


    IRexOracle public rexOracle;

    uint256 public feeDenominator;
    uint256 public feeNumerator;
    mapping(bytes32 => string) public queryParamMap;
    mapping(string => string) public OrderConfirmationStatus;
    mapping(bytes32 => Order) public OrderDetails;

    mapping(address => mapping(IERC20 => uint256)) public token_deposit_info;
    mapping(address => mapping(IERC20 => uint256)) public borrow_info;
    mapping(address => uint256) public total_borrowable_asset;
    mapping(address => uint256) public margin_requirement;
    mapping(address => address) public last_borrowed;
    mapping(address => address[10]) public borrowed_tokens;
    mapping(bytes32 => bool) public QueryApproval;

    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => string) public fulfilledData;

    mapping(address => uint256) public PendingOrderBalance;



    address public airnode =
        address(0xbb9094538DfBB7949493D3E1E93832F36c3fBE8a);
    bytes32 public endpointId =
        bytes32(
            0xb8cf46307c8e950336529de8936fd0958ee5b80a6b19a9343e0da4a600f94e67
        );

    address public sponsorWallet =
        address(0xbFF470d6338BDacE445d32cCBd9eae8498F34E1E);

    address public sponsor =
        address(0xfC60F8E10454da428797F093dc8bE7c3D316e0fc);

    constructor(address _oracle) {
    rexOracle = IRexOracle(_oracle);
    }

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
    event ValueUpdated(string result);
    event QueryCalled(string description);
    event TradeExecuted(uint256 blocktimestamp);
    event OutOfGasFunds(uint256 blocktimestamp);
/*
    function makeRequest(
        address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet,
        bytes calldata parameters

    ) public returns(bytes32) {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,                        // airnode address
            endpointId,                     // endpointId
            sponsor,                        // sponsor's address
            sponsorWallet,                  // sponsorWallet
            address(this),                  // fulfillAddress
            this.fulfill.selector,          // fulfillFunctionId
            parameters                      // encoded API parameters
        );
        incomingFulfillments[requestId] = true;
        return requestId;
    }

    /// The AirnodeRrpV0.sol protocol contract will callback here.
    function fulfill(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp {
        require(incomingFulfillments[requestId], "No such request made");
        delete incomingFulfillments[requestId];
        string memory decodedData = abi.decode(data, (string));
        fulfilledData[requestId] = decodedData;
        if (equal(decodedData, "1")) {
            address[2] memory pair;
            QueryApproval[requestId] = true;
            pair[0] = OrderDetails[requestId].taker_token;
            pair[1] = OrderDetails[requestId].maker_token;
            TransferBalances(
                pair,
                OrderDetails[requestId].takers,
                OrderDetails[requestId].makers,
                OrderDetails[requestId].taker_amounts,
                OrderDetails[requestId].maker_amounts,
                requestId
            );
        } else {
            QueryApproval[requestId] = false;
        }
    }

*/



    function SubmitOrder(
        address taker_token,
        address maker_token,
        address[] memory takers,
        address[] memory makers,
        uint256[] memory taker_amounts,
        uint256[] memory maker_amounts,
        address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet,
        bytes calldata parameters
    ) public returns (bool) {
        require(
            takers.length == taker_amounts.length,
            "uneven buyer amounts and buyer addresses"
        );
        require(
            makers.length == maker_amounts.length,
            "uneven seller amounts and seller addresses"
        );

        address[2] memory pair = [taker_token, maker_token];
        address[][2] memory addresses = [takers,makers];
        ProcessTrade(
            airnode,
            endpointId,
            sponsor,
            sponsorWallet,
            parameters,
            pair,
            addresses,
            taker_amounts,
            maker_amounts
        );

        return true;
    }

    function ProcessTrade(
        address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet,
        bytes calldata parameters,
        address[2] memory pair,
        address[][2] memory addresses,
        uint256[] memory taker_amounts,
        uint256[] memory maker_amounts
    ) internal {
        address[] memory makers = addresses[0];
        address[] memory takers = addresses[1];

        for (uint256 i=0; i < makers.length; i++) {
            PendingOrderBalance[makers[i]] = maker_amounts[i];
        }
        for (uint256 i=0; i < takers.length; i++) {
            PendingOrderBalance[takers[i]] = taker_amounts[i];
        }
        bytes32 orderId = makeRequest(airnode, endpointId, sponsor, sponsorWallet, parameters);
        OrderDetails[orderId].taker_token = pair[0];
        OrderDetails[orderId].maker_token = pair[1];
        OrderDetails[orderId].maker_amounts = maker_amounts;
        OrderDetails[orderId].taker_amounts = taker_amounts;
        OrderDetails[orderId].takers = takers;
        OrderDetails[orderId].makers = makers;
        OrderDetails[orderId].order_status = OrderStatus.PROCESSING;
        emit QueryCalled("Query sent, please wait");
    }

    function TransferBalances(
        address[2] memory pair,
        address[] memory takers,
        address[] memory makers,
        uint256[] memory taker_amounts,
        uint256[] memory maker_amounts,
        bytes32 requestId
    ) internal returns (bool) {
        require(
            QueryApproval[requestId] == true,
            " you are not approved for this trade"
        );
        require(
            OrderDetails[requestId].order_status == OrderStatus.UNFILLED ||
                OrderDetails[requestId].order_status == OrderStatus.PROCESSING,
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
        for (uint256 i = 0; i < makers.length; i++) {
            PendingOrderBalance[makers[i]] = 0;
        }
        for (uint256 i = 0; i < takers.length; i++) {
            PendingOrderBalance[takers[i]] = 0;
        }
        OrderDetails[requestId].order_status = OrderStatus.FILLED;
        emit TradeExecuted(block.timestamp);
        return true;
    }

    function GetTokenDepositInfo(address token, address user)
        public
        view
        returns (uint256)
    {
        IERC20 ERCToken = IERC20(token);
        return token_deposit_info[user][ERCToken] + borrow_info[user][ERCToken] - PendingOrderBalance[user];
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

/*
    function __callback(bytes32 requestId, string memory result) public {
        require(
            msg.sender == provable_cbAddress(),
            "Only the provable callback address can call this function"
        );
        if (equal(result, "1")) {
            address[2] memory pair;
            pair[0] = OrderDetails[queryParamMap[requestId]].taker_token;
            pair[1] = OrderDetails[queryParamMap[requestId]].maker_token;
            TransferBalances(
                pair,
                OrderDetails[queryParamMap[requestId]].takers,
                OrderDetails[queryParamMap[requestId]].makers,
                OrderDetails[queryParamMap[requestId]].taker_amounts,
                OrderDetails[queryParamMap[requestId]].maker_amounts,
                OrderDetails[queryParamMap[requestId]]._id
            );
        } else {
            QueryApproval[queryParamMap[requestId]] = false;
        }
        emit ValueUpdated(result);
    }
*/
