use anchor_lang::prelude::*;

/// states
pub mod states;
///processor
pub mod processor;
/// error
pub mod error;
/// constant
pub mod constant;
/// instructions
pub mod instructions;
/// utils
pub mod utils;
use crate::{
    instructions::*,
    processor::*,
};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod atlas_vesting {
    use super::*;

    pub fn create_global_state(ctx: Context<CreateGlobalState>, global_state_nonce:u8) -> ProgramResult { 
        process_create_global_state(ctx, global_state_nonce) 
    }
    pub fn create_vesting(ctx: Context<CreateVesting>, global_state_nonce:u8, vesting_nonce: u8,vesting_pool_nonce: u8, start_time: u64, end_time: u64) -> ProgramResult { 
        process_create_vesting(ctx, global_state_nonce, vesting_nonce,vesting_pool_nonce, start_time, end_time)
    }
    pub fn update_vesting(ctx: Context<UpdateVesting>, global_state_nonce:u8, vesting_nonce: u8, start_time: u64, end_time: u64) -> ProgramResult { 
        process_update_vesting(ctx, global_state_nonce, vesting_nonce, start_time, end_time) 
    }
    pub fn deposit_vesting(ctx: Context<DepositVesting>, amount: u64, global_state_nonce:u8, vesting_nonce:u8, vesting_pool_nonce: u8) -> ProgramResult { 
        process_deposit_vesting(ctx, amount, global_state_nonce, vesting_nonce, vesting_pool_nonce) 
    }
    pub fn withdraw_vesting(ctx: Context<WithdrawVesting>, amount: u64, global_state_nonce:u8, vesting_nonce:u8, vesting_pool_nonce: u8) -> ProgramResult { 
        process_withdraw_vesting(ctx, amount, global_state_nonce, vesting_nonce, vesting_pool_nonce) 
    }
    pub fn claim(ctx: Context<Claim>, global_state_nonce:u8, vesting_nonce:u8, vesting_pool_nonce:u8) -> ProgramResult { 
        process_claim(ctx, global_state_nonce, vesting_nonce, vesting_pool_nonce) 
    }
}