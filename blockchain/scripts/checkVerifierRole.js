// scripts/checkVerifierRole.js
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkVerifierRole() {
  try {
    const propertyTitleABIFile = fs.readFileSync(
      path.join(__dirname, '../abis/PropertyTitle.json'), 
      'utf-8'
    );
    const PropertyTitleABI = JSON.parse(propertyTitleABIFile);

    const provider = new ethers.JsonRpcProvider(
      process.env.GANACHE_URL || process.env.RPC_URL
    );

    const contract = new ethers.Contract(
      process.env.PROPERTYTITLE_ADDRESS,
      PropertyTitleABI.abi,
      provider
    );

    const addressToCheck = process.env.VERIFIER_WALLET_ADDRESS;
    
    console.log('Checking VERIFIER_ROLE for:', addressToCheck);
    console.log('Contract:', process.env.PROPERTYTITLE_ADDRESS);
    
    const VERIFIER_ROLE = await contract.VERIFIER_ROLE();
    console.log('VERIFIER_ROLE hash:', VERIFIER_ROLE);
    
    const hasRole = await contract.hasRole(VERIFIER_ROLE, addressToCheck);
    
    if (hasRole) {
      console.log('✅ Address HAS verifier role!');
    } else {
      console.log('❌ Address DOES NOT have verifier role!');
      console.log('\nTo grant the role, run:');
      console.log('node scripts/grantVerifierRole.js');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkVerifierRole(); 