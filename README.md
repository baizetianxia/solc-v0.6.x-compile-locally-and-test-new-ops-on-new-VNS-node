
# solcjs-v0.6.x: Compiling ,deploying ,testing Smart Contracts Locally with JavaScript on new EVM(constantinople version)

### Prerequisites
* node v10
* npm v6

### Installing the dependencies
```shell script
npm install
```

### Using new opcodes in Smart Contracts through inline assembly, including `create2`,`extcodesize`,`shl`,`shr`,`sar`

we use `create2` and `extcodesize` in Factory.sol
```solidity

        assembly {
            addr := create2(0, add(code, 0x20), mload(code), salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
     
```

we use `shr`,`shl` and `sar` in TestNewOps.sol
```solidity
    assembly {
                sum := add(sum, shr(2,mload(add(add(_data, 0x20), mul(i, 0x20)))))
    }

    assembly {
                sum2:= add(sum2, shl(2,mload(add(add(_data, 0x20), mul(i, 0x20)))))
    }

    assembly {
                sum3:= add(sum3, sar(2,mload(add(add(_data, 0x20), mul(i, 0x20)))))
    }

    assembly {
                codehash:=extcodehash(addr)
    }
```

## Compile 
Create the `build/contracts` folder. The compiled sources will be written into the `build/contracts` folder as some JSON file.
```shell script
node compile.js
```

## Testing the Smart Contracts
Tests are included and are run using mocha & new VNS node using new EVM(constantinople version)
####test Factory.sol
```shell script
mocha factoryAndTester.js
```

     FactoryAndTester
        ✓ TesterInstance_testAdd1
        ✓ TesterInstance_testAdd2
        ✓ TesterInstance_testAdd1
        ...
        14 passing (156ms)
        
        factoryAddress: 0x129b24dbb6758f78b00804aa67727011dc54818f
        factoryAddress: 0x7dc111afa687a4c38306387919747c7f797d294f
        factoryAddress: 0xe680f4d27f614c2e4e703eeae436d27959e9291a
        ...
        
        FactoryDeployed01: { addr: '0xfc97ed39ababcc5050f386dacf8ba954db593c5c' }
        FactoryDeployed02: { addr: '0xb41af4ee71c376427d759895ec8338c196ff161b',
          salt: BigNumber { s: 1, e: 1, c: [ 12 ] } }
        testerAddress: 0x826f3a60e3085f29a0d821dbf58db1efef6fe994
        Tester-deploy0: 86852.285ms
        2 ' + ' 4 ' = ' 6
        2 ' + ' 4 ' = ' 6
        
        FactoryDeployed01: { addr: '0x8c06b7e04ed0e8df86ea6e82e7a0e25d866c26a7' }
        FactoryDeployed02: { addr: '0xcb0881e63810402a797c3ce38d4803cda93e1fdb',
          salt: BigNumber { s: 1, e: 1, c: [ 35 ] } }
        testerAddress: 0xa738cd85bba9d628231ace270dc200ff4dd20ce7
        Tester-deploy2: 75313.954ms
        4 ' + ' 6 ' = ' 10
        4 ' + ' 6 ' = ' 10
        ....

#### test TestNewOps.sol
```shell script
mocha testNewOps.js
```

      TestNewOps
         ✓ testSHR
         ✓ testSHL
         ✓ testSAR
         ...
         21 passing (164ms)
         
         testNewOpsAddress: 0xfce807a3733394b0400e81e7f6bb65f535024fa5
         SHR result 1
         SHL result 24
         SAR result 1
         testNewOpsAddress: 0xc2bd1c77dcfd58fd848c740477cd9cde7a9a41c3
         SHR result 1
         SHL result 32
         SAR result 1
         testNewOpsAddress: 0x3b34ad4e199deee018211a57449e939da4d4feb9
         SHR result 7
         SHL result 128
         SAR result 7
         ...
         
## License

MIT
