import * as anchor from "@project-serum/anchor";
import {BN} from "@project-serum/anchor";
import {
  PublicKey,
  Keypair,
  Connection,
  Transaction,
  clusterApiUrl,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionSignature,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import { BigNumber } from "bignumber.js";

import { WalletContextState } from "@solana/wallet-adapter-react";

import * as Constants from "./constants";
import { IDL } from "./idl";
import { showToast } from "./utils";
import { toast } from 'react-toastify';
import * as keys from "./keys";
import { WalletNotConnectedError, WalletSignMessageError } from "@solana/wallet-adapter-base";

const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/Cq753PAy-g_OfxQJ8MbRPY92RjsfgV_I", 'processed');
export const getProgram = (wallet: any) => {
  let provider = new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions()
  );
  const program = new anchor.Program(IDL, Constants.PROGRAM_ID, provider);
  return program;
};
export const getGlobalStateData = async (wallet: any) => {
  console.log("getGlobalStateData");
  const program = getProgram(wallet);
  const globalStateKey = await keys.getGlobalStateKey();
  const stateData = await program.account.globalState.fetchNullable(
    globalStateKey
  );
  if (stateData === null) return null;
  return stateData;
};

export const getWalletSolBalance = async (wallet: any): Promise<String> => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) return "0";
  let x = await connection.getBalance(wallet.publicKey);
  console.log('getWalletSolBalance x=', x);
  return new BigNumber(await connection.getBalance(wallet.publicKey)).div(
    LAMPORTS_PER_SOL
  ).toString();
};

export const getVaultSolBalance = async (): Promise<String> => {
  const vaultKey = await keys.getVaultKey();
  console.log("vault balance =", await connection.getBalance(vaultKey));
  return new BigNumber(await connection.getBalance(vaultKey)).div(
    LAMPORTS_PER_SOL
  ).toString();
};

export const getUserData = async (wallet: any): Promise<any> => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) return null;
  console.log("getUserData");
  const program = getProgram(wallet);
  
  const vaultKey = await keys.getVaultKey();
  const vaultBal = await connection.getBalance(vaultKey);

  let userStateKey = await keys.getUserStateKey(wallet.publicKey);
  
  const stateData = await program.account.userState.fetchNullable(
    userStateKey
  );
  if (stateData === null) return null;

  const globalStateKey = await keys.getGlobalStateKey();
  const globalData = await program.account.globalState.fetchNullable(
    globalStateKey
  );
  if (globalData === null) return null;
  let beanRewards = solRewards(stateData);
  console.log('bean rewardsxx =', beanRewards);
  console.log("bean rewards =", new BigNumber(beanRewards.toString()).div(
    LAMPORTS_PER_SOL
  ).toFixed(4));
  return {
    userData: stateData,
    refsCount: stateData.bonusEligibleReferrals.length,
    miners: stateData.beans.toString(),
    beanRewards: new BigNumber(beanRewards.toString()).div(
      LAMPORTS_PER_SOL
    ).toFixed(7)
  }
};

export const simTransaction = async (
  conn: Connection,
  tx: Transaction,
  feePayer: PublicKey
) => {
  tx.feePayer = feePayer;
  tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;
  return await conn.simulateTransaction(tx.compileMessage());
}

// solidity functions
const currentTime = () => Math.floor(Date.now() / 1000)
const currentTimeMs = () => Date.now()

const secondsSinceLastAction = (userData: any) => {
  let lastTimeStamp = userData.bakedAt;
  if (lastTimeStamp == 0) {
      lastTimeStamp = userData.ateAt;
  }

  if (lastTimeStamp == 0) {
      lastTimeStamp = userData.firstDepositTime;
  }

  return currentTime() -  lastTimeStamp;
}

const milliSecondsSinceLastAction = (userData: any) => {
  let lastTimeStamp = userData.bakedAt;
  if (lastTimeStamp == 0) {
      lastTimeStamp = userData.ateAt;
  }

  if (lastTimeStamp == 0) {
      lastTimeStamp = userData.firstDepositTime;
  }

  return currentTimeMs() -  lastTimeStamp * 1000;
}

const dailyReward = (userData: any) => {
  let referralsCount = userData.bonusEligibleReferrals.length;
  if (referralsCount < 10) return 30000;
  if (referralsCount < 25) return (35000);
  if (referralsCount < 50) return (40000);
  if (referralsCount < 100) return (45000);
  if (referralsCount < 150) return (50000);
  if (referralsCount < 250) return (55000);
  return 60000;
}

const calcBeansReward = (millSecondsPassed: number, dailyRewardFactor: number, userData: any) => {
  
  console.log("millSecondsPassed =", millSecondsPassed, dailyRewardFactor)

  let rewardsPerDay = userData.beans * dailyRewardFactor / 100;
  let rewardsPerMilliSecond = rewardsPerDay * 1000 / Constants.DAY_IN_MS;
  let beansRewarded = rewardsPerMilliSecond * millSecondsPassed / 10_000_000;
  return beansRewarded;
}

const solToBeans = (solLamports: number) => {
  return solLamports / Constants.SOL_PER_BEAN;
} 

const beansToSol = (beans: number) => {
  let solInLamports = beans * Constants.SOL_PER_BEAN;
  return solInLamports;
} 

const solRewards = (userData: any) => {
  let beans = rewardedBeans(userData);
  return beansToSol(beans);
}

export const toSolRewardAmount = (userData: any) => {
  let reward = new BigNumber(solRewards(userData).toString()).div(
    LAMPORTS_PER_SOL
  ).toFixed(7);
  console.log("reward =", reward);
  return reward;
}

const rewardedBeans = (userData: any) => {
  let millSecondsPassed = milliSecondsSinceLastAction(userData);
  let dailyRewardFactor = dailyReward(userData);
  let beansRewarded = calcBeansReward(
      millSecondsPassed,
      dailyRewardFactor,
      userData
  );

  if (beansRewarded >= solToBeans(Constants.MAX_DAILY_REWARDS_IN_SOL)) {
      return solToBeans(Constants.MAX_DAILY_REWARDS_IN_SOL);
  }
  return beansRewarded;
}

export const establishListeners = (wallet: WalletContextState, onBought: any, onAte: any) => {
  
  const program = getProgram(wallet);
  let boughtEventListener = program.addEventListener('EventBoughtBeans', onBought);
  let ateEventListener = program.addEventListener('EventAte', onAte);
  return [boughtEventListener, ateEventListener]
}

export const initialize = async (
  wallet: WalletContextState,
): Promise<string | null> => {
  if (wallet.publicKey === null) throw new WalletNotConnectedError();
  
  const program = getProgram(wallet);
  const tx = new Transaction().add(
    await program.methods
        .initialize(wallet.publicKey) // new_authority
        .accounts({
          authority: wallet.publicKey,
          globalState: await keys.getGlobalStateKey(),
          devAccount: Constants.DEV_ACCOUNT,
          marketingAccount: Constants.MARKETING_ACCOUNT,
          ceoAccount: Constants.CEO_ACCOUNT,
          giveawayAccount: Constants.GIVEAWAY_ACCOUNT,
          vault: await keys.getVaultKey(),
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY
        })
        .instruction()
  );
      
  let res = await simTransaction(connection, tx, wallet.publicKey);
  console.log("sim res =", res);

  return await send(connection, wallet, tx);
};

export const buyBeans = async (
  wallet: WalletContextState,
  referralKey: PublicKey,
  solAmount: number
): Promise<string | null> => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) 
  {
    throw new WalletNotConnectedError();
  }
  
  console.log("referralKey =", referralKey.toBase58());

  const program = getProgram(wallet);


  let globalStateKey = await keys.getGlobalStateKey();
  let globalData = await program.account.globalState.fetch(globalStateKey);
  let adminKey = globalData.authority;
  let userStateKey = await keys.getUserStateKey(wallet.publicKey);

  let referrer = referralKey;
  let refUserStateKey = await keys.getUserStateKey(referrer);
  let adminUserStateKey = await keys.getUserStateKey(adminKey);
  let userData = await program.account.userState.fetchNullable(userStateKey);
    let instructions = [];
    if (!userData) {
      instructions.push(
        await createUserStateInstruction(
          program,
          wallet.publicKey,
          wallet.publicKey,
          userStateKey
        )
      )
    } else {
      referrer = userData.upline;
      refUserStateKey = await keys.getUserStateKey(referrer);
    }
    
    let referrerUserStateKey = refUserStateKey;
    let refUserData = await program.account.userState.fetchNullable(refUserStateKey);
    if (!refUserData) {
      
      referrerUserStateKey = adminUserStateKey;
      referrer = adminKey;

      let adminUserData = await program.account.userState.fetchNullable(adminUserStateKey);
      if (!adminUserData) {
        instructions.push(
          await createUserStateInstruction(
            program,
            wallet.publicKey,
            adminKey,
            adminUserStateKey
          )
        )
      }
    }

  let vaultKey = await keys.getVaultKey();
  let buyIx = await program.methods
    .buyBeans(referrer, new anchor.BN(solAmount * LAMPORTS_PER_SOL))
    .accounts({
      user: wallet.publicKey,
      globalState: globalStateKey,
      devAccount: globalData.devAccount,
      ceoAccount: globalData.ceoAccount,
      marketingAccount: globalData.marketingAccount,
      vault: vaultKey,
      userState: userStateKey,
      refUserState: referrerUserStateKey,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    })
    .instruction();
  
  let hatchIx = await getBakeIx(program, wallet.publicKey, 0);
  let tx = new Transaction();
  if (instructions.length > 0) instructions.forEach(ix => tx.add(ix));
  tx.add(buyIx);
  tx.add(hatchIx);
  return await send(connection, wallet, tx);
};

export const getBakeIx = async (
  program: any,
  userKey: PublicKey,
  only_rebake: number
): Promise<TransactionInstruction> => {
  let ix = await program.methods
    .bakeBeans(only_rebake)
    .accounts({
      user: userKey,
      globalState: await keys.getGlobalStateKey(),
      vault: await keys.getVaultKey(),
      userState: await keys.getUserStateKey(userKey),
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    })
    .instruction()
  return ix;
};

export const bakeBeans = async (
  wallet: WalletContextState,
  userData: any
): Promise<string | null> => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) 
  {
    throw new WalletNotConnectedError();
  }

  const program = getProgram(wallet);
  const tx = new Transaction().add(
    await getBakeIx(program, wallet.publicKey, 1)
  );
  return await send(connection, wallet, tx);
};


export const eatBeans = async (
  wallet: WalletContextState,
): Promise<string | null> => {
  if (wallet.publicKey === null || wallet.publicKey === undefined) {
    throw new WalletNotConnectedError();
  }
  
  const program = getProgram(wallet);
  let globalStateKey = await keys.getGlobalStateKey();
  let globalData = await program.account.globalState.fetch(globalStateKey);
  let vaultKey = await keys.getVaultKey();
  const tx = new Transaction().add(
    await program.methods
      .eatBeans()
      .accounts({
        user: wallet.publicKey,
        globalState: globalStateKey,
        vault: vaultKey,
        
        devAccount: globalData.devAccount,
        ceoAccount: globalData.ceoAccount,
        marketingAccount: globalData.marketingAccount,
        giveawayAccount: globalData.giveawayAccount,
        
        userState: await keys.getUserStateKey(wallet.publicKey),
        systemProgram: SystemProgram.programId
      })
      .instruction()
  );
  return await send(connection, wallet, tx);
};

async function send(
  connection: Connection,
  wallet: WalletContextState,
  transaction: Transaction
) {
  
  const txHash = await sendTransaction(connection, wallet, transaction);
  console.log(txHash);
  if (txHash != null) {
    let confirming_id = showToast("Confirming Transaction ...", -1, 2);
    try {
      let res = await connection.confirmTransaction(txHash, 'processed');
      toast.dismiss(confirming_id);
      if (res.value.err) showToast("Transaction Failed", 2000, 1);
      else showToast("Transaction Confirmed", 2000);
    } catch {
      toast.dismiss(confirming_id);
      showToast("Transaction Failed", 2000, 1);
    }
  } else {
    showToast("Transaction Failed", 2000, 1);
  }
  return txHash;
}


export async function sendTransaction(
  connection: Connection,
  wallet: WalletContextState,
  transaction: Transaction
) {
  if (wallet.publicKey === null || wallet.signTransaction === undefined)
    return null;
  try {
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.feePayer = wallet.publicKey;
    let signedTransaction;
    try {
      signedTransaction = await wallet.signTransaction(transaction);
    } catch {
      throw new WalletSignMessageError();
    }
    
    const rawTransaction = signedTransaction.serialize();

    showToast("Sending Transaction ...", 500);
    // notify({
    //   message: "Transaction",
    //   description: "Sending Transaction ...",
    //   duration: 0.5,
    // });

    const txid: TransactionSignature = await connection.sendRawTransaction(
      rawTransaction,
      {
        skipPreflight: true,
        preflightCommitment: "processed",
      }
    );
    return txid;
  } catch (e) {
    console.log("tx e = ", e);
    return null;
  }
}

export const toSolAmount = (lamports: string) => {
  return new BigNumber(lamports).dividedBy(LAMPORTS_PER_SOL).toFixed(4)
}
export const createUserStateInstruction = async (
  program: any,
  payer: PublicKey,
  userKey: PublicKey,
  userStateKey: PublicKey
) => {
  return await program.methods
    .initUserState(userKey)
    .accounts({
      payer,
      userState: userStateKey,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .instruction();
};

export const shortenAddress = (address: String) => {
  let len = address.length;
  return address.slice(0, 4) + '...' + address.slice(len - 4, len);
  
}