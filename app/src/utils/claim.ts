import * as anchor from "@project-serum/anchor";
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import {
    checkWalletATA,
  CLOCK_SYSVAR_ID,
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

  if (vestingTokenATA == null) {
    const newUserVestingTokenAccount = anchor.web3.Keypair.generate()
    signers.push(newUserVestingTokenAccount)
    vestingTokenATA = newUserVestingTokenAccount.publicKey
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        VESTING_TOKEN_MINT,
        vestingTokenATA,
        wallet.publicKey,
        wallet.publicKey
      )
    )
  }

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
      instructions,
      signers
    }
  );
  console.log("txid = ", tx);
}
