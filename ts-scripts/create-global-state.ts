import {
  GLOBAL_STATE_TAG,
  program,
  RENT_SYSVAR_ID,
  SYSTEM_PROGRAM_ID,
  wallet,
} from "./config";

export async function createGlobalState() {
  let [globalStateKey, globalStateKeyNonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(GLOBAL_STATE_TAG)],
      program.programId
    );
  try {
    await program.account.globalState.fetch(globalStateKey);
    console.log("already created");
    return;
  } catch (e) {}

  const tx = await program.rpc.createGlobalState(globalStateKeyNonce, {
    accounts: {
      superOwner: wallet.publicKey,
      globalState: globalStateKey,
      systemProgram: SYSTEM_PROGRAM_ID,
      rent: RENT_SYSVAR_ID,
    },
  });
  console.log("txid = ", tx);
}

async function main() {
  await createGlobalState();
}

console.log("Running client.");
main()
  .then(() => console.log("Success"))
  .catch((e) => console.error(e));
