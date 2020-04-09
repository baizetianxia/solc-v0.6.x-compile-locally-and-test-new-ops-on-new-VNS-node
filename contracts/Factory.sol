pragma solidity >=0.5.2 <0.7.0;

contract Factory {
    event Deployed01(address addr);
    function deployByCreate1(bytes memory code) public returns (address addr){
        assembly {
            addr := create(0,add(code,0x20), mload(code))
        //jumpi(invalidJumpLabel,iszero(extcodesize(addr)))
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        emit Deployed01(addr);
    }

    event Deployed02(address addr, uint256 salt);

    function deployByCreate2(bytes memory code, uint256 salt) public returns (address addr) {
        //address addr;
        assembly {
            addr := create2(0, add(code, 0x20), mload(code), salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        emit Deployed02(addr, salt);
    }

}

