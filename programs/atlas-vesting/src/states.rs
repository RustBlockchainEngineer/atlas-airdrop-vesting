use anchor_lang::prelude::*;

use crate::{
    constant::*,
    error::*
};

#[account]
#[derive(Default)]
pub struct GlobalState {
    pub super_owner: Pubkey,
}

#[account]
#[derive(Default)]
pub struct Vesting {
    pub nonce: u8, 
    pub destination_owner: Pubkey,
    pub mint_vesting_token: Pubkey,
    pub pool_vesting_token: Pubkey,
    pub start_time: u64,
    pub end_time: u64,
    pub last_time: u64,
}
impl Vesting {
    pub fn assert_valid_time(&self, cur_time: u64)->ProgramResult {
        if cur_time <= self.start_time || cur_time <= self.last_time {
            return Err(AtlasVestingError::NotAllowed.into())
        }
        Ok(())
    }
    pub fn pending_amount(&self, remained_amount: u64, cur_time: u64)->u64 {
        let mut pending_duration = 0;
        
        if cur_time > self.end_time {
            pending_duration = self.end_time - self.last_time;
        }
        else if cur_time > self.last_time {
            pending_duration = cur_time - self.last_time;
        }

        let mut remained_duration = 0;
        if self.last_time < self.end_time && self.last_time > self.start_time {
            remained_duration = self.end_time - self.last_time;
        }

        let pending = remained_amount * pending_duration / remained_duration;

        return pending;
    }
    pub fn update_last_time(&mut self, cur_time: u64) {
        if cur_time >= self.end_time {
            self.last_time = self.end_time;
        }
        else if cur_time > self.last_time {
            self.last_time = cur_time;
        }
    }
}