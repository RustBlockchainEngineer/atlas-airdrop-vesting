import * as anchor from "@project-serum/anchor";
import {
  checkWalletATA,
  GLOBAL_STATE_TAG,
  program,
  RENT_SYSVAR_ID,
  SYSTEM_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  VESTING_DESTINATION_OWNER,
  VESTING_TAG,
  VESTING_TOKEN_MINT,
  wallet,
  WITHDRAW_AMOUNT,
} from "./config";

export async function withdrawVesting() {
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
  const withdrawTokenAccount = await checkWalletATA(program.provider.connection, program.provider.wallet.publicKey, VESTING_TOKEN_MINT.toBase58())
  if (withdrawTokenAccount === null) {
    console.log('user does not have ata')
    return;
  }
  const tx = await program.rpc.withdrawVesting(
    WITHDRAW_AMOUNT,
    globalStateKeyNonce,
    vestingKeyNonce,
    vestingPoolKeyNonce,
    {
      accounts: {
        superOwner: wallet.publicKey,
        vesting: vestingKey,
        globalState: globalStateKey,
        poolVestingToken: vestingPoolKey,
        userVestingToken: withdrawTokenAccount,
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
  await withdrawVesting();
}

console.log("Running client.");
main()
  .then(() => console.log("Success"))
  .catch((e) => console.error(e));
