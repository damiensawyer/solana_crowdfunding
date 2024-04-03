use anchor_lang::prelude::*;
use solana_program::entrypoint_deprecated::ProgramResult;
declare_id!("G4qPXXjL3U2gYmAwEwzTkX1oKjwhPC14RuxZvjfSAPCU");

#[program]
pub mod crowdfunding {
    

    use super::*;

    pub fn create(ctx: Context<Create>, name:String, description:String) -> ProgramResult {
        let campaign = &mut ctx.accounts.campaign;
        campaign.name = name;
        campaign.description = description;
        campaign.ammount_donated = 0;
        //campaign.admin = *ctx.accounts.user.key;    
        Ok(())
    }
    
    pub fn withdraw(ctx:Context<Withdraw>, amount:u64) -> ProgramResult{
        let campaign = &mut ctx.accounts.campaign;
        let user = &mut ctx.accounts.user;

        if campaign.admin != *user.key{
            return Err(ProgramError::IncorrectProgramId);
        }
        
        let rent_balance = Rent::get()?.minimum_balance(campaign.to_account_info().data_len());
        if **campaign.to_account_info().lamports.borrow() - rent_balance < amount{
            return Err(ProgramError::InsufficientFunds);
        }

        **campaign.to_account_info().try_borrow_mut_lamports()? -= amount;
        **user.to_account_info().try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}


#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer=user, space=9000, seeds=[b"CAMPAIGN_DEMO".as_ref(), user.key().as_ref()], bump)] // makes it a program derived account?
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
 
}


#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    
 
}

#[account]
pub struct Campaign {
    admin:Pubkey,
    pub name: String, 
    pub description: String, 
    pub ammount_donated: u64 
    
}