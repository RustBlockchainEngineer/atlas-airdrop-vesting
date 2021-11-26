use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount,Mint};

use crate::{
    states::*,
    constant::*,
};

#[derive(Accounts)]
#[instruction(global_state_nonce:u8)]
pub struct CreateGlobalState <'info>{
    pub super_owner:  Signer<'info>,

    #[account(
    init,
    seeds = [GLOBAL_STATE_TAG],
    bump = global_state_nonce,
    payer = super_owner,
    )]
    pub global_state:ProgramAccount<'info, GlobalState>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(global_state_nonce:u8, vesting_nonce: u8, vesting_pool_nonce: u8, start_time: u64, end_time: u64)]
pub struct CreateVesting<'info> {
    #[account(
        constraint = super_owner.key() == global_state.super_owner
    )]
    pub super_owner:  Signer<'info>,

    #[account(
        init,
        seeds = [VESTING_TAG, destination_owner.key.as_ref(), mint_vesting_token.key().as_ref()],
        bump = vesting_nonce,
        payer = super_owner,
    )]
    pub vesting: ProgramAccount<'info, Vesting>,

    #[account(seeds = [GLOBAL_STATE_TAG],
        bump = global_state_nonce)]
    pub global_state: ProgramAccount<'info, GlobalState>,

    pub destination_owner: AccountInfo<'info>,

    pub mint_vesting_token: Account<'info, Mint>,
    #[account(
        init,
        token::mint = mint_vesting_token,
        token::authority = vesting,
        seeds = [VESTING_TAG, vesting.key().as_ref()],
        bump = vesting_pool_nonce,
        payer = super_owner,
    )]
    pub pool_vesting_token: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(global_state_nonce:u8, vesting_nonce: u8, start_time: u64, end_time: u64)]
pub struct UpdateVesting<'info> {
    #[account(
        constraint = super_owner.key() == global_state.super_owner
    )]
    pub super_owner:  Signer<'info>,

    #[account(mut,
        seeds = [VESTING_TAG, destination_owner.key.as_ref(), mint_vesting_token.key().as_ref()],
        bump = vesting_nonce,
    )]
    pub vesting: ProgramAccount<'info, Vesting>,

    #[account(seeds = [GLOBAL_STATE_TAG],
        bump = global_state_nonce)]
    pub global_state: ProgramAccount<'info, GlobalState>,

    pub destination_owner: AccountInfo<'info>,
    pub mint_vesting_token: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction( amount: u64, global_state_nonce:u8, vesting_nonce:u8, vesting_pool_nonce: u8)]
pub struct DepositVesting<'info> {
    #[account(
        constraint = super_owner.key() == global_state.super_owner
    )]
    pub super_owner:  Signer<'info>,

    #[account(mut,
        seeds = [VESTING_TAG, destination_owner.key().as_ref(), mint_vesting_token.key().as_ref()],
        bump = vesting_nonce,
    )]
    pub vesting: ProgramAccount<'info, Vesting>,

    #[account(seeds = [GLOBAL_STATE_TAG],
        bump = global_state_nonce)]
    pub global_state: ProgramAccount<'info, GlobalState>,
    #[account(mut,
        seeds = [VESTING_TAG, vesting.key().as_ref()],
        bump = vesting_pool_nonce,
        constraint = pool_vesting_token.owner == vesting.key()
    )]
    pub pool_vesting_token: Account<'info, TokenAccount>,
    #[account(mut,
        constraint = user_vesting_token.owner == super_owner.key(),
        constraint = user_vesting_token.mint == vesting.mint_vesting_token
    )]
    pub user_vesting_token: Account<'info, TokenAccount>,

    pub destination_owner: AccountInfo<'info>,
    pub mint_vesting_token: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction( amount: u64, global_state_nonce:u8, vesting_nonce:u8, vesting_pool_nonce: u8)]
pub struct WithdrawVesting<'info> {
    #[account(
        constraint = super_owner.key() == global_state.super_owner
    )]
    pub super_owner:  Signer<'info>,

    #[account(mut,
        seeds = [VESTING_TAG, destination_owner.key.as_ref(), mint_vesting_token.key().as_ref()],
        bump = vesting_nonce,
    )]
    pub vesting: ProgramAccount<'info, Vesting>,

    #[account(seeds = [GLOBAL_STATE_TAG],
        bump = global_state_nonce)]
    pub global_state: ProgramAccount<'info, GlobalState>,
    #[account(mut,
        seeds = [VESTING_TAG, vesting.key().as_ref()],
        bump = vesting_pool_nonce,
        constraint = pool_vesting_token.owner == vesting.key()
    )]
    pub pool_vesting_token: Account<'info, TokenAccount>,
    #[account(mut,
        constraint = user_vesting_token.owner == super_owner.key(),
        constraint = user_vesting_token.mint == vesting.mint_vesting_token
    )]
    pub user_vesting_token: Account<'info, TokenAccount>,

    pub destination_owner: AccountInfo<'info>,
    pub mint_vesting_token: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction( global_state_nonce:u8, vesting_nonce:u8, vesting_pool_nonce:u8)]
pub struct Claim<'info> {
    #[account(
        constraint = owner.key() == vesting.destination_owner
    )]
    pub owner:  Signer<'info>,

    #[account(mut,
        seeds = [VESTING_TAG, destination_owner.key().as_ref(), mint_vesting_token.key().as_ref()],
        bump = vesting_nonce,
    )]
    pub vesting: ProgramAccount<'info, Vesting>,

    #[account(seeds = [GLOBAL_STATE_TAG],
        bump = global_state_nonce)]
    pub global_state: ProgramAccount<'info, GlobalState>,

    #[account(mut,
        seeds = [VESTING_TAG, vesting.key().as_ref()],
        bump = vesting_pool_nonce,
        constraint = pool_vesting_token.owner == vesting.key()
    )]
    pub pool_vesting_token: Account<'info, TokenAccount>,

    #[account(mut,
        constraint = user_vesting_token.owner == owner.key(),
        constraint = user_vesting_token.mint == vesting.mint_vesting_token
    )]
    pub user_vesting_token: Account<'info, TokenAccount>,

    pub destination_owner: AccountInfo<'info>,
    pub mint_vesting_token: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub clock: Sysvar<'info, Clock>,
}
