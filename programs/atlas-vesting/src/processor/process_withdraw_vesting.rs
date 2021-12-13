use anchor_lang::prelude::*;
use anchor_spl::token::{self,  Transfer, TokenAccount,  ID};

use crate::{
    constant::*,
    instructions::*
};
 
pub fn process_withdraw_vesting(ctx: Context<WithdrawVesting>, amount: u64, global_state_nonce:u8, vesting_nonce:u8, vesting_pool_nonce: u8) -> ProgramResult {
    msg!("withdrawing ...");
    
    let mut _amount = amount;
    if amount > ctx.accounts.pool_vesting_token.amount {
        _amount = ctx.accounts.pool_vesting_token.amount;
    }
    
    // transfer from pool to user
    let cpi_accounts = Transfer {
        from: ctx.accounts.pool_vesting_token.to_account_info(),
        to: ctx.accounts.user_vesting_token.to_account_info(),
        authority: ctx.accounts.vesting.to_account_info(),
    };

    let cpi_program = ctx.accounts.token_program.to_account_info();

    let signer_seeds = &[
        VESTING_TAG, 
        ctx.accounts.vesting.destination_owner.as_ref(), 
        ctx.accounts.vesting.mint_vesting_token.as_ref(),
        &[vesting_nonce]
    ];
    let signer = &[&signer_seeds[..]];

    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    token::transfer(cpi_ctx, _amount)?;

    ctx.accounts.vesting.vested_token_amount -= _amount;

    Ok(())
}
