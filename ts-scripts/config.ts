
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { AtlasVesting } from '../target/types/atlas_vesting';


anchor.setProvider(anchor.Provider.env());
export const program = anchor.workspace.AtlasVesting as Program<AtlasVesting>;
export const wallet = program.provider.wallet;

export const GLOBAL_STATE_TAG = "golbal-state-seed";
export const VESTING_TAG = "vesting-seed";

export const TOKEN_PROGRAM_ID = new anchor.web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
export const RENT_SYSVAR_ID = new anchor.web3.PublicKey('SysvarRent111111111111111111111111111111111');
export const CLOCK_SYSVAR_ID = new anchor.web3.PublicKey('SysvarC1ock11111111111111111111111111111111');
export const SYSTEM_PROGRAM_ID = new anchor.web3.PublicKey('11111111111111111111111111111111');

export const VESTING_DESTINATION_OWNER = new anchor.web3.PublicKey('GwvdQHPp91gC3d6uVMVxSpRw1qSCP5TNBAti9agVgRx5');//-- dest owner here --
export const VESTING_TOKEN_MINT = new anchor.web3.PublicKey('9yoc8eSWhCXV4ddcGoRLkSUToFgSDRbJ98hvXs516D1y');//-- TOKEN MINT ADDRESS here --
export const VESTING_TOKEN_DECIMAL = 9;

const currentTime = Date.now() / 1000;
export const VESTING_START_TIME = currentTime+30;
export const VESTING_END_TIME = VESTING_START_TIME + 7200;
export const UPDATED_VESTING_END_TIME = VESTING_END_TIME + 700;

export const DEPOSIT_AMOUNT = new anchor.BN(7 * Math.pow(1000, VESTING_TOKEN_DECIMAL));
export const DEPOSIT_TOKEN_ACCOUNT = new anchor.web3.PublicKey('5rjEtA6Gvo5MkbDKRS7RNsSVm3m9aC1Nhhvo7hEE1pX4');//-- vesting token account here --

export const WITHDRAW_AMOUNT = new anchor.BN(1 * Math.pow(100, VESTING_TOKEN_DECIMAL));
export const WITHDRAW_TOKEN_ACCOUNT = new anchor.web3.PublicKey('5rjEtA6Gvo5MkbDKRS7RNsSVm3m9aC1Nhhvo7hEE1pX4');//-- vesting token account here --