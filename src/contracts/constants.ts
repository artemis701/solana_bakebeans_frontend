import { PublicKey } from "@solana/web3.js";


export const GLOBAL_STATE_SEED = "GLOBAL_STATE_SEED";
export const VAULT_SEED = "VAULT_SEED";
export const USER_STATE_SEED = "USER_STATE_SEED";

// todo: for test, it is now one hour
// export const DAY_IN_MS = 3600 * 1000;
export const DAY_IN_MS = 3600 * 24 * 1000;
export const DAY_IN_SECS = 3600 * 24;
export const HOUR_IN_SECS = 3600;
// minimum amount to deposit
// should mul 10**decimals here to get real minimum
// tier starts from 0
export const DEPOSIT_MINIMUM_AMOUNT = 100;
export const DEFAULT_MAX_TIER = 2;

export const SOL_PER_BEAN = 1000;
export const MAX_DAILY_REWARDS_IN_SOL = 5_000_000_000;
export const MIN_BAKE = 0.01; // 0.01 SOL

export const NETWORK = "mainnet-beta"; // mainnet

export const PROGRAM_ID = new PublicKey(
  "CzBzTMfRhJViNwXC6fZTLHcfEDsn6xEM7dPjeCZ2HU1f"
);
export const DEV_ACCOUNT = new PublicKey(
  "2zyapP4GfVSLqynguzZSvFpj2M27PKHoXCHVxYiNqjMk"
);
export const CEO_ACCOUNT = new PublicKey(
  "61ZuXNtDC8LRV9xREgJv4rhQgU4woRN6BUWCCufppi8V"
);
export const MARKETING_ACCOUNT = new PublicKey(
  "9heqNgRDFnfTAwWH9WFQSCYSWaCkj4yfLV94482o1XsB"
);
export const GIVEAWAY_ACCOUNT = new PublicKey(
  "GSvAnWBEWFaMkuAksMi69w7FvZzRBXvorbh1nXseLgmu"
);

