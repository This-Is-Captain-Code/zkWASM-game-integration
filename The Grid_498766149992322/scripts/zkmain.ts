import * as hz from 'horizon/core';
import { initializeZkWasm, generateProof, verifyProof, deployContract } from 'zkwasm-ts-sdk';

class zkmain extends hz.Component<typeof zkmain> {
  static propsDefinition = {};

  async start() {
    console.log("Initializing zkWasm environment...");

    // Initialize zkWasm setup
    const wasmModulePath = 'path/to/compiled/wasm/file.wasm'; // Replace with your WASM file path
    const zkWasmInstance = await initializeZkWasm(wasmModulePath);
    console.log("zkWasm instance initialized.");

    // Generate a proof
    console.log("Generating proof...");
    const input = { value: 42 }; // Example input
    const proof = await generateProof(zkWasmInstance, input);
    console.log("Proof generated:", proof);

    // Verify the proof
    console.log("Verifying proof...");
    const isVerified = await verifyProof(proof);
    if (isVerified) {
      console.log("Proof verified successfully.");
    } else {
      console.error("Proof verification failed.");
      return;
    }

    // Deploy verification contract
    console.log("Deploying verification contract...");
    const contractAddress = await deployContract(proof);
    console.log("Contract deployed at address:", contractAddress);

    console.log("zkWasm workflow completed successfully.");
  }
}

hz.Component.register(zkmain);
