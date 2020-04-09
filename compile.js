
// imports & defines

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Functions

/**
 * Makes sure that the build folder is deleted, before every compilation
 * @returns {*} - Path where the compiled sources should be saved.
 */
function compilingPreperations() {
    const buildPath = path.resolve(__dirname, 'build/contracts');
    fs.removeSync(buildPath);
    return buildPath;
}

/**
 * Returns and Object describing what to compile and what need to be returned.
 */
function createConfiguration() {
    return {
        language: 'Solidity',
        sources: {
            'Tester.sol': {
                content: fs.readFileSync(path.resolve(__dirname, 'contracts', 'Tester.sol'), 'utf8')
            },
            'TestNewOps.sol': {
                content: fs.readFileSync(path.resolve(__dirname, 'contracts', 'TestNewOps.sol'), 'utf8')
            },/*
            'Adder.sol': {
                content: fs.readFileSync(path.resolve(__dirname, 'contracts', 'Adder.sol'), 'utf8')
            }*/
        },
        settings: {
            outputSelection: { // return everything
                '*': {
                    '*': ['*']
                }
            }
        }
    };
}

/**
 * Compiles the sources, defined in the config object with solc-js.
 * @returns {any} - Object with compiled sources and errors object.
 * @param inputConfig
 */
function compileSources(inputConfig) {
    try {
        //return JSON.parse(solc.compile(JSON.stringify(inputConfig)));
        return JSON.parse(solc.compile(JSON.stringify(inputConfig), { import: getImports }));
    } catch (e) {
        console.log(e);
    }
}

/**
 * Searches for dependencies in the Solidity files (import statements). All import Solidity files
 * need to be declared here.
 * @param dependency
 * @returns {*}
 */
function getImports(dependency) {
    console.log('Searching for dependency: ', dependency);
    switch (dependency) {
        case 'Adder.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname, 'contracts', 'Adder.sol'), 'utf8')};
        case 'Factory.sol':
            return {contents: fs.readFileSync(path.resolve(__dirname, 'contracts', 'Factory.sol'), 'utf8')};
        default:
            return {error: 'File not found'}
    }
}

/**
 * Shows when there were errors during compilation.
 * @param compiledSources
 */
function errorHandling(compiledSources) {
    if (!compiledSources) {
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n', 'NO OUTPUT');
    } else if (compiledSources.errors) { // something went wrong.
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n');
        compiledSources.errors.map(error => console.log(error.formattedMessage));
    }
}

/**
 * Writes the contracts from the compiled sources into JSON files, which you will later be able to
 * use in combination with web3.
 * @param compiled - Object containing the compiled contracts.
 * @param buildPath - Path of the build folder.
 */
function writeOutput(compiled, buildPath) {
    fs.ensureDirSync(buildPath);

    for (let contractFileName in compiled.contracts) {
        const contractName = contractFileName.replace('.sol', '');
        console.log('Writing: ', contractName + '.json');
        let jsonObjectTmp={"contractName":contractName};
        let contractObject=Object.assign(jsonObjectTmp,compiled.contracts[contractFileName][contractName]);
        fs.outputJsonSync(
            path.resolve(buildPath, contractName + '.json'),
            //compiled.contracts[contractFileName][contractName]
            contractObject
        );
    }
}

// Workflow

const buildPath = compilingPreperations();
const inputConfig = createConfiguration();
const compiled = compileSources(inputConfig);
errorHandling(compiled);
writeOutput(compiled, buildPath);
