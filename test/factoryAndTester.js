
const waitUntil=require('wait-until');
const assert=require('chai').assert;

//获取合约json对象
let factory_json = require("../build/contracts/Factory");
let adder_json = require("../build/contracts/Adder.json");
let tester_json = require("../build/contracts/Tester.json");

//获取vns-web3js SDK,连接本地RPC服务端口
let Web3=require('vns-web3');
let web3= new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8585'));
let accounts=web3.vns.accounts;
console.log("accounts:\n",accounts);

//获取合约对象
let Factory = web3.vns.contract(factory_json.abi);
let Tester = web3.vns.contract(tester_json.abi);

let factoryAddress=[];
let testerAddress=[] ;
let salt=[12,23,35,42,57,64,75];
let arr=[[2,4],[3,5],[4,6],[4,8],[5,8],[6,9],[11,21]];
let addResultArr=[6,8,10,12,13,15,32];

describe("FactoryAndTester",() => {

    for (let j=0;j<arr.length;j++){
        //测试新部署的合约
        before("deployFactoryAndTester",async () => {
            //deployFactoryAndTester
            Factory.new(
                {
                    data:"0x"+factory_json.evm.bytecode.object,
                    from:accounts[0],
                    gas:4700000
                },
                (error, result)=> {
                    if (!error) {
                        if (typeof (result.address) != "undefined") {
                            factoryAddress[j] = result.address;
                            console.log("factoryAddress:", factoryAddress[j]);
                            //deployTester(factoryAddress[i],salt[i])
                            console.time('Tester-deploy'+j);
                            Tester.new(
                                factoryAddress[j],
                                salt[j],
                                {
                                    data: "0x" + tester_json.evm.bytecode.object,
                                    from: accounts[0],
                                    gas: 4700000
                                },
                                //TesterCallBack
                                (error, result)=>{
                                if (!error) {
                                    if (typeof(result.address)!="undefined"){
                                        testerAddress[j] = result.address;
                                        console.log("testerAddress:", testerAddress[j]);
                                        console.timeEnd('Tester-deploy'+j);

                                    }
                                }
                                else {
                                    console.log("testerCallBackError:", error);
                                }
                            }
                            );

                            let factoryInstance = Factory.at(factoryAddress[j]);
                            let FactoryDeployed01 = factoryInstance.Deployed01({fromBlock: 4660, toBlock: 'latest'});
                            FactoryDeployed01.watch((error, event) => {
                                if (!error) {
                                    console.log("FactoryDeployed01:", event.args);
                                } else {
                                    console.log(error);
                                }
                            });

                            let FactoryDeployed02 = factoryInstance.Deployed02({fromBlock: 4660, toBlock: 'latest'});
                            FactoryDeployed02.watch((error, event) => {
                                if (!error) {
                                    console.log("FactoryDeployed02:", event.args);
                                } else {
                                    console.log(error);
                                }
                            });
                        }
                    } else {
                        console.log("factoryCallBackError:", error);
                    }
                }
            );

        });

        it('TesterInstance_testAdd1', () => {
            waitUntil()
                .interval(500)
                .times(1000)
                .condition(function() {
                    return (testerAddress[j]!==undefined)
                })
                .done(async function() {
                    // test Add1 contract'interface (Factory contract created Add1 contract)
                    let testerInstance = Tester.at(testerAddress[j]);
                    let res1 = await testerInstance.testAdd1.call(arr[j][0],arr[j][1]).toNumber();
                    console.log(arr[j][0],' + ',arr[j][1],' = ',res1);

                    assert.equal(addResultArr[j],res1);
                });

        });

        it('TesterInstance_testAdd2', () => {
            waitUntil()
                .interval(500)
                .times(1000)
                .condition(function() {
                    return (testerAddress[j]!==undefined)
                })
                .done(async function() {
                    // // test Add2 contract'interface (Factory contract created Add2 contract)
                    let testerInstance = Tester.at(testerAddress[j]);
                    let res2 = await testerInstance.testAdd2.call(arr[j][0],arr[j][1]).toNumber();
                    console.log(arr[j][0]," + ",arr[j][1]," = ",res2);

                    assert.equal(addResultArr[j],res2);
                });

        });
    }

});


