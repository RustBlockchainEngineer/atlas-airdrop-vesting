use anchor_lang::prelude::*;
use anchor_spl::token::{self,  Transfer, ID};

use crate::{
    instructions::*
};

pub fn process_deposit_vesting(ctx: Context<DepositVesting>, amount: u64, global_state_nonce:u8, vesting_nonce:u8, vesting_pool_nonce: u8) -> ProgramResult {
    
    // transfer from user to pool
    let cpi_accounts = Transfer {
        from: ctx.accounts.user_vesting_token.to_account_info().clone(),
        to: ctx.accounts.pool_vesting_token.to_account_info().clone(),
        authority: ctx.accounts.super_owner.to_account_info().clone(),
    };

    let cpi_program = ctx.accounts.token_program.to_account_info().clone();
    
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

    token::transfer(cpi_ctx, amount)?;

    ctx.accounts.vesting.vested_token_amount += amount;

    Ok(())
}
