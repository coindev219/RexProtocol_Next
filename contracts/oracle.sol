// SPDX-License-Identifier: MIT
pragma solidity =0.8.15;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";

contract RexOracle is Ownable, RrpRequesterV0 {
    mapping(bytes32 => bool) public QueryApproval;

    mapping(bytes32 => bool) public incomingFulfillments;
    mapping(bytes32 => string) public fulfilledData;

    mapping(address => uint256) public PendingOrderBalance;

    /*
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
*/
    constructor(address airnodeRrpAddress) RrpRequesterV0(airnodeRrpAddress) {}

    function makeRequest(
        address airnode,
        bytes32 endpointId,
        address sponsor,
        address sponsorWallet,
        bytes calldata parameters
    ) public returns (bytes32) {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode, // airnode address
            endpointId, // endpointId
            sponsor, // sponsor's address
            sponsorWallet, // sponsorWallet
            address(this), // fulfillAddress
            this.fulfill.selector, // fulfillFunctionId
            parameters // encoded API parameters
        );
        incomingFulfillments[requestId] = true;
        return requestId;
    }

    /// The AirnodeRrpV0.sol protocol contract will callback here.
    function fulfill(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(incomingFulfillments[requestId], "No such request made");
        delete incomingFulfillments[requestId];
        string memory decodedData = abi.decode(data, (string));
        fulfilledData[requestId] = decodedData;
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
