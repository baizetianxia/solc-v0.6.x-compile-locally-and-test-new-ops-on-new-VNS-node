pragma solidity >=0.5.6 <0.7.0;

contract TestNewOps {

    function testSHR(uint[] memory _data) public pure returns (uint sum) {
        for (uint i = 0; i < _data.length; ++i) {
            assembly {
                sum := add(sum, shr(2,mload(add(add(_data, 0x20), mul(i, 0x20)))))
            }
        }
        return sum;
    }

    function testSHL(uint[] memory _data) public pure returns (uint sum2) {
        for (uint i = 0; i < _data.length; ++i) {
            assembly {
                sum2:= add(sum2, shl(2,mload(add(add(_data, 0x20), mul(i, 0x20)))))
            }
        }
        return sum2;
    }

    function testSAR(uint[] memory _data) public pure returns (uint sum3) {
        for (uint i = 0; i < _data.length; ++i) {
            assembly {
                sum3:= add(sum3, sar(2,mload(add(add(_data, 0x20), mul(i, 0x20)))))
            }
        }
        return sum3;
    }

    function testExtcodehash(address addr) public view returns (uint256 codehash) {
        assembly {
            codehash:=extcodehash(addr)
        }
    }

}
