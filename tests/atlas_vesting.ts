import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { AtlasVesting } from '../target/types/atlas_vesting';
import {Token } from "@solana/spl-token";

const payer = anchor.web3.Keypair.generate();

const GLOBAL_STATE_TAG = "golbal-state-seed";
const VESTING_TAG = "vesting-seed";

const TOKEN_PROGRAM_ID = new anchor.web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const RENT_SYSVAR_ID = new anchor.web3.PublicKey('SysvarRent111111111111111111111111111111111');
const CLOCK_SYSVAR_ID = new anchor.web3.PublicKey('SysvarC1ock11111111111111111111111111111111');
const SYSTEM_PROGRAM_ID = new anchor.web3.PublicKey('11111111111111111111111111111111');

const MINIMUM_SOL_AMOUNT = 20;
describe('atlas_vesting', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.AtlasVesting as Program<AtlasVesting>;
  console.log('program id = ',program.programId.toBase58());
  const wallet = program.provider.wallet;
  const destinationOwner = anchor.web3.Keypair.generate();

  it('Create global state', async () => {
    while(await program.provider.connection.getBalance(payer.publicKey) < MINIMUM_SOL_AMOUNT){
      await program.provider.connection.requestAirdrop(payer.publicKey, 5 * 1000000000);
      await program.provider.connection.requestAirdrop(payer.publicKey, 5 * 1000000000);
  };
    let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(GLOBAL_STATE_TAG)], program.programId);
    try{
      await program.account.globalState.fetch(globalStateKey);
      return;
    }
    catch(e){}
    
    const tx = await program.rpc.createGlobalState(globalStateKeyNonce, {
      accounts: {
        superOwner: wallet.publicKey,
        globalState: globalStateKey,
        systemProgram: SYSTEM_PROGRAM_ID,
        rent: RENT_SYSVAR_ID
      }
    });
    console.log('txid = ', tx);
  });

  let vestingTokenMint: Token = null;
  
  const currentTime = Date.now() / 1000;
  const vestingStartTime = currentTime+30;
  const vestingEndTime = vestingStartTime + 600;
  const newVestingEndTime = vestingStartTime + 700;

  it('Create Vesting', async () => {
    vestingTokenMint = await Token.createMint(program.provider.connection, payer, wallet.publicKey, null, 9, program.programId);
    let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(GLOBAL_STATE_TAG)], program.programId);
    let [vestingKey, vestingKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(VESTING_TAG), wallet.publicKey.toBuffer()], program.programId);
    let [vestingPoolKey, vestingPoolKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(VESTING_TAG), vestingKey.toBuffer()], program.programId);
    const tx = await program.rpc.createVesting(
      globalStateKeyNonce,
      vestingKeyNonce,
      vestingPoolKeyNonce,
      new anchor.BN(vestingStartTime),
      new anchor.BN(vestingEndTime),
      {
      accounts: {
        superOwner: wallet.publicKey,
        vesting: vestingKey,
        globalState: globalStateKey,
        destinationOwner: destinationOwner.publicKey,
        mintVestingToken: vestingTokenMint.publicKey,
        poolVestingToken: vestingPoolKey,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_SYSVAR_ID
      }
    });
    console.log('txid = ', tx);
  });
  it('Update Vesting', async () => {
    let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(GLOBAL_STATE_TAG)], program.programId);
    let [vestingKey, vestingKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(VESTING_TAG), wallet.publicKey.toBuffer()], program.programId);
    const tx = await program.rpc.updateVesting(
      globalStateKeyNonce,
      vestingKeyNonce,
      new anchor.BN(vestingStartTime),
      new anchor.BN(newVestingEndTime),
      {
      accounts: {
        superOwner: wallet.publicKey,
        vesting: vestingKey,
        globalState: globalStateKey,
        destinationOwner: destinationOwner.publicKey,
        mintVestingToken: vestingTokenMint.publicKey,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_SYSVAR_ID
      }
    });
    console.log('txid = ', tx);
  });
  let userVestingToken: anchor.web3.PublicKey = null;
  const vestingAmount = new anchor.BN(10 * 1000000000);
  it('Deposit Vesting', async () => {
    userVestingToken = await vestingTokenMint.createAccount(wallet.publicKey);
    await vestingTokenMint.mintTo(userVestingToken, wallet as any, [], vestingAmount.toNumber());

    let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(GLOBAL_STATE_TAG)], program.programId);
    let [vestingKey, vestingKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(VESTING_TAG), wallet.publicKey.toBuffer()], program.programId);
    let [vestingPoolKey, vestingPoolKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(VESTING_TAG), vestingKey.toBuffer()], program.programId);
    const tx = await program.rpc.depositVesting(
      vestingAmount,
      globalStateKeyNonce,
      vestingKeyNonce,
      vestingPoolKeyNonce,
      {
      accounts: {
        superOwner: wallet.publicKey,
        vesting: vestingKey,
        globalState: globalStateKey,
        poolVestingToken: vestingPoolKey,
        userVestingToken: userVestingToken,
        destinationOwner: destinationOwner.publicKey,
        mintVestingToken: vestingTokenMint.publicKey,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_SYSVAR_ID
      }
    });
    console.log('txid = ', tx);
  });
  it('Withdraw Vesting', async () => {
    let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(GLOBAL_STATE_TAG)], program.programId);
    let [vestingKey, vestingKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(VESTING_TAG), wallet.publicKey.toBuffer()], program.programId);
    let [vestingPoolKey, vestingPoolKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(VESTING_TAG), vestingKey.toBuffer()], program.programId);
    const tx = await program.rpc.withdrawVesting(
      vestingAmount,
      globalStateKeyNonce,
      vestingKeyNonce,
      vestingPoolKeyNonce,
      {
      accounts: {
        superOwner: wallet.publicKey,
        vesting: vestingKey,
        globalState: globalStateKey,
        poolVestingToken: vestingPoolKey,
        userVestingToken: userVestingToken,
        destinationOwner: destinationOwner.publicKey,
        mintVestingToken: vestingTokenMint.publicKey,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_SYSVAR_ID
      }
    });
    console.log('txid = ', tx);
  });
  let destVestingToken: anchor.web3.PublicKey = null;
  it('Claim', async () => {
    destVestingToken = await vestingTokenMint.createAccount(wallet.publicKey);
    let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(GLOBAL_STATE_TAG)], program.programId);
    let [vestingKey, vestingKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(VESTING_TAG), wallet.publicKey.toBuffer()], program.programId);
    let [vestingPoolKey, vestingPoolKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(VESTING_TAG), vestingKey.toBuffer()], program.programId);
    const tx = await program.rpc.claim(
      globalStateKeyNonce,
      vestingKeyNonce,
      vestingPoolKeyNonce,
      {
      accounts: {
        owner: destinationOwner.publicKey,
        vesting: vestingKey,
        globalState: globalStateKey,
        poolVestingToken: vestingPoolKey,
        userVestingToken: destVestingToken,
        destinationOwner: destinationOwner.publicKey,
        mintVestingToken: vestingTokenMint.publicKey,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_SYSVAR_ID,
        clock: CLOCK_SYSVAR_ID
      },
      signers: [destinationOwner],
    });
    console.log('txid = ', tx);
  });

});
 