use anchor_lang::prelude::*;
use crate::{
    constant::*,
    error::*,
};
use std::convert::TryInto;
use std::convert::TryFrom;
use spl_math::{precise_number::PreciseNumber};

pub fn assert_vesting_time(start_time: u64, end_time: u64)-> ProgramResult{
    
    if end_time <= start_time {
        return Err(AtlasVestingError::NotAllowed.into())
    }
    Ok(())
}
