import {
    DEPOSIT_TOKEN_ACCOUNT,
    GLOBAL_STATE_TAG,
    program,
    RENT_SYSVAR_ID,
    SYSTEM_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    DEPOSIT_AMOUNT,
    VESTING_DESTINATION_OWNER,
    VESTING_TAG,
    VESTING_TOKEN_MINT,
    wallet,
  } from "./config";
  
  export async function depositVesting() {
    let [globalStateKey, globalStateKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(GLOBAL_STATE_TAG)], program.programId);
    let [vestingKey, vestingKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(VESTING_TAG), wallet.publicKey.toBuffer()], program.programId);
    let [vestingPoolKey, vestingPoolKeyNonce] = await anchor.web3.PublicKey.findProgramAddress([Buffer.from(VESTING_TAG), vestingKey.toBuffer()], program.programId);
    const tx = await program.rpc.depositVesting(
      DEPOSIT_AMOUNT,
      globalStateKeyNonce,
      vestingKeyNonce,
      vestingPoolKeyNonce,
      {
      accounts: {
        superOwner: wallet.publicKey,
        vesting: vestingKey,
        globalState: globalStateKey,
        poolVestingToken: vestingPoolKey,
        userVestingToken: DEPOSIT_TOKEN_ACCOUNT,
        destinationOwner: VESTING_DESTINATION_OWNER,
        mintVestingToken: VESTING_TOKEN_MINT,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_SYSVAR_ID
      }
    });
    console.log('txid = ', tx);
  }
  
  async function main() {
    await depositVesting();
  }
  
  console.log("Running client.");
  main()
    .then(() => console.log("Success"))
    .catch((e) => console.error(e));
  