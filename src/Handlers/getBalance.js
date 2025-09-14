  import { JsonRpcProvider, formatUnits } from "ethers";

export async function getBalance(address) {
  // Connect to the Irys testnet
if (!address) {
    console.error("Cannot fetch balance for null address.");
    return; 
}
try {
const provider = new JsonRpcProvider("https://testnet-rpc.irys.xyz/v1/execution-rpc");
const balance = await provider.getBalance(address);
 // in wei (mIRYS)

let irysBalance = formatUnits(balance,18);
let bal = Number(irysBalance).toFixed(1)
return bal;

} catch (error) {
  console.log(error)
}

};



