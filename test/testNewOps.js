
const assert=require('chai').assert;
const waitUntil=require('wait-until');

//获取合约json对象
let test_new_ops_json=require("../build/contracts/TestNewOps");

//获取vns-web3js SDK,连接本地RPC服务端口
let Web3=require('vns-web3');
let web3= new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8585'));
let accounts=web3.vns.accounts;
console.log("accounts:\n",accounts);

let TestNewOps = web3.vns.contract(test_new_ops_json.abi);
let testNewOpsAddress=[];

let arr=[[2,4],[3,5],[4,6],[4,8],[5,8],[6,9],[11,21]];
let shlResultArr=[24,32,40,48,52,60,128];
let shrResultArr=[1,1,2,3,3,3,7];
let sarResultArr=[1,1,2,3,3,3,7];

describe("TestNewOps",() => {

    for(let i=0;i<arr.length;i++){
        //测试新部署的合约
        before("deploy_TestNewOps",async () => {
            TestNewOps.new(
                {
                    data:"0x"+test_new_ops_json.evm.bytecode.object,
                    from:accounts[0],
                    gas:4700000
                },
                (error, result)=>{
                    if (!error) {
                        if (typeof(result.address)!="undefined"){
                            testNewOpsAddress[i] = result.address;
                            console.log("testNewOpsAddress:", testNewOpsAddress[i]);
                        }
                    }
                    else {
                        console.log("testNewOpsCallBackError:", error);
                    }
                }
            );
        });

        it('testSHR', async () => {
            waitUntil()
                .interval(500)
                .times(1000)
                .condition(function() {
                    return (testNewOpsAddress[i]!==undefined)
                })
                .done(async function() {
                    // test
                    let testNewOpsInstance = TestNewOps.at(testNewOpsAddress[i]);
                    let res1 = await testNewOpsInstance.testSHR.call(arr[i]).toNumber();
                    console.log("SHR result",res1);

                    assert.equal(shrResultArr[i],res1);
                });

        });

        it('testSHL', async () => {
            waitUntil()
                .interval(500)
                .times(1000)
                .condition(function() {
                    return (testNewOpsAddress[i]!==undefined)
                })
                .done(async function() {
                    // test
                    let testNewOpsInstance = TestNewOps.at(testNewOpsAddress[i]);
                    let res2 = await testNewOpsInstance.testSHL.call(arr[i]).toNumber();
                    console.log("SHL result",res2);

                    assert.equal(shlResultArr[i],res2);
                });


        });

        it('testSAR', async () => {
            waitUntil()
                .interval(500)
                .times(1000)
                .condition(function() {
                    return (testNewOpsAddress[i]!==undefined)
                })
                .done(async function() {
                    // test
                    let testNewOpsInstance = TestNewOps.at(testNewOpsAddress[i]);
                    let res3 = await testNewOpsInstance.testSAR.call(arr[i]).toNumber();
                    console.log("SAR result",res3);

                    assert.equal(sarResultArr[i],res3);
                });
        });

    }

});
