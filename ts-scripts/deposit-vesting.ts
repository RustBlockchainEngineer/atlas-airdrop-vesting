import * as anchor from "@project-serum/anchor";
import {
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
  VESTING_START_TIME,
  VESTING_END_TIME,
  checkWalletATA,
} from "./config";

export async function isVestingCreated() {
  let [vestingKey] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(VESTING_TAG), VESTING_DESTINATION_OWNER.toBuffer(), VESTING_TOKEN_MINT.toBuffer()],
      program.programId
    );
  const vesting = await program.account.vesting.fetchNullable(vestingKey);
  if(vesting){
    return true;
  }
  return false;
}
export async function createVesting() {
  console.log('creating ...')
  let [globalStateKey, globalStateKeyNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_STATE_TAG)],
      program.programId
    );
  let [vestingKey, vestingKeyNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(VESTING_TAG), VESTING_DESTINATION_OWNER.toBuffer(), VESTING_TOKEN_MINT.toBuffer()],
      program.programId
    );
  let [vestingPoolKey, vestingPoolKeyNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(VESTING_TAG), vestingKey.toBuffer()],
      program.programId
    );
  const tx = await program.rpc.createVesting(
    globalStateKeyNonce,
    vestingKeyNonce,
    vestingPoolKeyNonce,
    new anchor.BN(VESTING_START_TIME),
    new anchor.BN(VESTING_END_TIME),
    {
      accounts: {
        superOwner: wallet.publicKey,
        vesting: vestingKey,
        globalState: globalStateKey,
        destinationOwner: VESTING_DESTINATION_OWNER,
        mintVestingToken: VESTING_TOKEN_MINT,
        poolVestingToken: vestingPoolKey,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_SYSVAR_ID,
      },
    }
  );
  console.log(tx);
}

export async function depositVesting() {
  console.log('depositing ...')
  let [globalStateKey, globalStateKeyNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_STATE_TAG)],
      program.programId
    );
  let [vestingKey, vestingKeyNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(VESTING_TAG),
        VESTING_DESTINATION_OWNER.toBuffer(),
        VESTING_TOKEN_MINT.toBuffer(),
      ],
      program.programId
    );
  let [vestingPoolKey, vestingPoolKeyNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(VESTING_TAG), vestingKey.toBuffer()],
      program.programId
    );
  const depositTokenAccount = await checkWalletATA(program.provider.connection, program.provider.wallet.publicKey, VESTING_TOKEN_MINT.toBase58())
  if (depositTokenAccount === null) {
    console.log('user does not have any vesting token')
    return;
  }
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
        userVestingToken: depositTokenAccount,
        destinationOwner: VESTING_DESTINATION_OWNER,
        mintVestingToken: VESTING_TOKEN_MINT,
        systemProgram: SYSTEM_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: RENT_SYSVAR_ID,
      },
    }
  );
  console.log("txid = ", tx);
}

async function main() {
  if(!await isVestingCreated()){
    await createVesting();
  }
  await depositVesting();
}

console.log("Running client.");
main()
  .then(() => console.log("Success"))
  .catch((e) => console.error(e));
