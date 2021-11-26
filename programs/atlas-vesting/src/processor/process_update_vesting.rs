use anchor_lang::prelude::*;

use crate::{
    instructions::*,
    utils::*
};

pub fn process_update_vesting(ctx: Context<UpdateVesting>, global_state_nonce:u8, vesting_nonce: u8, start_time: u64, end_time: u64) -> ProgramResult {
    ctx.accounts.vesting.destination_owner = *ctx.accounts.destination_owner.key;
    
    assert_vesting_time(start_time, end_time)?;

    ctx.accounts.vesting.start_time = start_time;
    ctx.accounts.vesting.end_time = end_time;
    Ok(())
}
