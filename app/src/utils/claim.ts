import * as anchor from "@project-serum/anchor";
import { AccountLayout } from "@solana/spl-token";
import {
    checkWalletATA,
  CLOCK_SYSVAR_ID,
  createTokenAccountIfNotExist,
  getProgram,
  GLOBAL_STATE_TAG,
  RENT_SYSVAR_ID,
  SYSTEM_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  VESTING_PROGRAM_ID,
  VESTING_TAG,
  VESTING_TOKEN_MINT,
} from "./global";

export async function claimVesting(
  connection: anchor.web3.Connection,
  wallet: any
) {
  const program = getProgram(connection, wallet, VESTING_PROGRAM_ID);

  let [
    globalStateKey,
    globalStateKeyNonce,
  ] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(GLOBAL_STATE_TAG)],
    program.programId
  );
  let [
    vestingKey,
    vestingKeyNonce,
  ] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(VESTING_TAG),
      wallet.publicKey.toBuffer(),
      VESTING_TOKEN_MINT.toBuffer(),
    ],
    program.programId
  );
  let [
    vestingPoolKey,
    vestingPoolKeyNonce,
  ] = await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(VESTING_TAG), vestingKey.toBuffer()],
    program.programId
  );
  let vestingTokenATA = await checkWalletATA(
    connection,
    wallet.publicKey,
    VESTING_TOKEN_MINT.toBase58()
  )
  const signers = []
  const instructions = []

  if (vestingTokenATA === null) {
    let accountRentExempt = await connection.getMinimumBalanceForRentExemption(
      AccountLayout.span
      );
    vestingTokenATA = await createTokenAccountIfNotExist(
      connection,
      vestingTokenATA,
      wallet.publicKey,
      VESTING_TOKEN_MINT.toBase58(),
      accountRentExempt,
      instructions,
      signers
    )
  }
  try {
    const tx = await program.rpc.claim(
      globalStateKeyNonce,
      vestingKeyNonce,
      vestingPoolKeyNonce,
      {
        accounts: {
          owner: wallet.publicKey,
          vesting: vestingKey,
          globalState: globalStateKey,
          poolVestingToken: vestingPoolKey,
          userVestingToken: vestingTokenATA,
          destinationOwner: wallet.publicKey,
          mintVestingToken: VESTING_TOKEN_MINT,
          systemProgram: SYSTEM_PROGRAM_ID,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: RENT_SYSVAR_ID,
          clock: CLOCK_SYSVAR_ID,
        },
        signers,
        instructions,
      }
    );
    console.log("txid = ", tx);
  }
  catch(e){ console.log(" can't claim!")}
}


export async function getVesting(
  connection: anchor.web3.Connection,
  wallet: any
) {
  const program = getProgram(connection, wallet, VESTING_PROGRAM_ID);

  let [
    vestingKey,
  ] = await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(VESTING_TAG),
      wallet.publicKey.toBuffer(),
      VESTING_TOKEN_MINT.toBuffer(),
    ],
    program.programId
  );
  return await program.account.vesting.fetchNullable(vestingKey);
}