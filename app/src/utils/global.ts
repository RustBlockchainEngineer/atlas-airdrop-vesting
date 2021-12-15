import * as anchor from "@project-serum/anchor";
import { initializeAccount } from '@project-serum/serum/lib/token-instructions'

import { AtlasVesting } from "./vesting-types";
import idl from "./vesting-idl.json";
import { AccountLayout } from "@solana/spl-token";
import { SystemProgram } from "@solana/web3.js";

export const GLOBAL_STATE_TAG = "golbal-state-seed";
export const VESTING_TAG = "vesting-seed";

export const VESTING_PROGRAM_ID = new anchor.web3.PublicKey(
  "zbXkRdxNFX4zuJK3EbEJGzKwwbVwxD9guAkXvbWiFF2"
);
export const TOKEN_PROGRAM_ID = new anchor.web3.PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
export const RENT_SYSVAR_ID = new anchor.web3.PublicKey(
  "SysvarRent111111111111111111111111111111111"
);
export const CLOCK_SYSVAR_ID = new anchor.web3.PublicKey(
  "SysvarC1ock11111111111111111111111111111111"
);
export const SYSTEM_PROGRAM_ID = new anchor.web3.PublicKey(
  "11111111111111111111111111111111"
);


export const VESTING_TOKEN_MINT = new anchor.web3.PublicKey(
  "9yoc8eSWhCXV4ddcGoRLkSUToFgSDRbJ98hvXs516D1y"
);
export const VESTING_TOKEN_DECIMALS = 9;

export function getProgram(
  connection: anchor.web3.Connection,
  wallet: anchor.Wallet,
  programId: anchor.web3.PublicKey
) {
  const provider = new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions()
  );
  return new anchor.Program(
    idl as any,
    programId,
    provider
  ) as anchor.Program<AtlasVesting>;
}


export async function checkWalletATA(
  connection: anchor.web3.Connection,
  walletPubkey: anchor.web3.PublicKey,
  mint: string
) {
  let parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    walletPubkey,
    {
      programId: TOKEN_PROGRAM_ID
    },
    'confirmed'
  )
  let result: any = null
  parsedTokenAccounts.value.forEach(async (tokenAccountInfo) => {
    const tokenAccountPubkey = tokenAccountInfo.pubkey
    const parsedInfo = tokenAccountInfo.account.data.parsed.info
    const mintAddress = parsedInfo.mint
    if (mintAddress === mint) {
      result = tokenAccountPubkey
    }
  })
  return result
}
export async function createTokenAccountIfNotExist(
  connection: anchor.web3.Connection,
  account: string | undefined | null,
  owner: anchor.web3.PublicKey,
  mintAddress: string,
  lamports: number | null,

  instructions: anchor.web3.TransactionInstruction[],
  signer: Array<anchor.web3.Keypair>
) {
  let publicKey

  if (account) {
    publicKey = new anchor.web3.PublicKey(account)
  } else {
    publicKey = await createProgramAccountIfNotExist(
      connection,
      account,
      owner,
      TOKEN_PROGRAM_ID,
      lamports,
      AccountLayout,
      instructions,
      signer
    )

    instructions.push(
      initializeAccount({
        account: publicKey,
        mint: new anchor.web3.PublicKey(mintAddress),
        owner
      })
    )
  }

  return publicKey
}

export async function createProgramAccountIfNotExist(
  connection: anchor.web3.Connection,
  account: string | undefined | null,
  owner: anchor.web3.PublicKey,
  programId: anchor.web3.PublicKey,
  lamports: number | null,
  layout: any,

  instructions: anchor.web3.TransactionInstruction[],
  signer: Array<anchor.web3.Keypair>
) {
  let publicKey

  if (account) {
    publicKey = new anchor.web3.PublicKey(account)
  } else {
    const newAccount = new anchor.web3.Keypair()
    publicKey = newAccount.publicKey

    instructions.push(
      SystemProgram.createAccount({
        fromPubkey: owner,
        newAccountPubkey: publicKey,
        lamports: lamports ?? (await connection.getMinimumBalanceForRentExemption(layout.span)),
        space: layout.span,
        programId
      })
    )

    signer.push(newAccount)
  }

  return publicKey
}
