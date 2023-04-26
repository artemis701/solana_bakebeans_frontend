export type BakedBeans = {
  "version": "0.1.0",
  "name": "baked_beans",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "devAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketingAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ceoAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "giveawayAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "buyBeans",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "devAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ceoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "refUserState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "refUser",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "eatBeans",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "devAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ceoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "giveawayAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "bakeBeans",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "onlyRebaking",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initUserState",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "userKey",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "devAccount",
            "type": "publicKey"
          },
          {
            "name": "marketingAccount",
            "type": "publicKey"
          },
          {
            "name": "giveawayAccount",
            "type": "publicKey"
          },
          {
            "name": "ceoAccount",
            "type": "publicKey"
          },
          {
            "name": "totalBakers",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "totalDeposit",
            "type": "u64"
          },
          {
            "name": "totalPayout",
            "type": "u64"
          },
          {
            "name": "firstDepositTime",
            "type": "u64"
          },
          {
            "name": "ateAt",
            "type": "u64"
          },
          {
            "name": "bakedAt",
            "type": "u64"
          },
          {
            "name": "beans",
            "type": "u64"
          },
          {
            "name": "upline",
            "type": "publicKey"
          },
          {
            "name": "hasReferred",
            "type": "u8"
          },
          {
            "name": "referrals",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "bonusEligibleReferrals",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "EventBoughtBeans",
      "fields": [
        {
          "name": "userAddress",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "refAddress",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "solAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "beansFrom",
          "type": "u64",
          "index": false
        },
        {
          "name": "beansTo",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "EventBaked",
      "fields": [
        {
          "name": "userAddress",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "refAddress",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "beansFrom",
          "type": "u64",
          "index": false
        },
        {
          "name": "beansTo",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "EventAte",
      "fields": [
        {
          "name": "userAddress",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "solToEat",
          "type": "u64",
          "index": false
        },
        {
          "name": "beansBeforeFee",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotAllowedAuthority",
      "msg": "Not allowed authority"
    },
    {
      "code": 6001,
      "name": "InsufficientAmount",
      "msg": "Should be over minimum amount"
    },
    {
      "code": 6002,
      "name": "IncorrectUserState",
      "msg": "Incorrect User State"
    },
    {
      "code": 6003,
      "name": "IncorrectReferral",
      "msg": "Incorrect Referral Pubkey"
    },
    {
      "code": 6004,
      "name": "InsufficientDeposit",
      "msg": "Deposit doesn't meet the minimum requirements"
    },
    {
      "code": 6005,
      "name": "TotalDepositReached",
      "msg": "Max total deposit reached"
    },
    {
      "code": 6006,
      "name": "ZeroAddressDetected",
      "msg": "invalid address to initialise"
    },
    {
      "code": 6007,
      "name": "ReferrerShouldInvest",
      "msg": "Referrer should have invested"
    },
    {
      "code": 6008,
      "name": "WalletTvlReached",
      "msg": "Total wallet TVL reached"
    },
    {
      "code": 6009,
      "name": "InvalidAction",
      "msg": "InvalidAction"
    },
    {
      "code": 6010,
      "name": "UnderMinBake",
      "msg": "Rewards must be equal or higher than 0.01 BNB to bake"
    },
    {
      "code": 6011,
      "name": "MaxPayoutReached",
      "msg": "You have reached max payout"
    }
  ]
};

export const IDL: BakedBeans = {
  "version": "0.1.0",
  "name": "baked_beans",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "devAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketingAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "ceoAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "giveawayAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "buyBeans",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "devAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ceoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "refUserState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "refUser",
          "type": "publicKey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "eatBeans",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "devAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ceoAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "giveawayAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "bakeBeans",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "globalState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "onlyRebaking",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initUserState",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "userState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "userKey",
          "type": "publicKey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "globalState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isInitialized",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "vault",
            "type": "publicKey"
          },
          {
            "name": "devAccount",
            "type": "publicKey"
          },
          {
            "name": "marketingAccount",
            "type": "publicKey"
          },
          {
            "name": "giveawayAccount",
            "type": "publicKey"
          },
          {
            "name": "ceoAccount",
            "type": "publicKey"
          },
          {
            "name": "totalBakers",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "totalDeposit",
            "type": "u64"
          },
          {
            "name": "totalPayout",
            "type": "u64"
          },
          {
            "name": "firstDepositTime",
            "type": "u64"
          },
          {
            "name": "ateAt",
            "type": "u64"
          },
          {
            "name": "bakedAt",
            "type": "u64"
          },
          {
            "name": "beans",
            "type": "u64"
          },
          {
            "name": "upline",
            "type": "publicKey"
          },
          {
            "name": "hasReferred",
            "type": "u8"
          },
          {
            "name": "referrals",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "bonusEligibleReferrals",
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "EventBoughtBeans",
      "fields": [
        {
          "name": "userAddress",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "refAddress",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "solAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "beansFrom",
          "type": "u64",
          "index": false
        },
        {
          "name": "beansTo",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "EventBaked",
      "fields": [
        {
          "name": "userAddress",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "refAddress",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "beansFrom",
          "type": "u64",
          "index": false
        },
        {
          "name": "beansTo",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "EventAte",
      "fields": [
        {
          "name": "userAddress",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "solToEat",
          "type": "u64",
          "index": false
        },
        {
          "name": "beansBeforeFee",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotAllowedAuthority",
      "msg": "Not allowed authority"
    },
    {
      "code": 6001,
      "name": "InsufficientAmount",
      "msg": "Should be over minimum amount"
    },
    {
      "code": 6002,
      "name": "IncorrectUserState",
      "msg": "Incorrect User State"
    },
    {
      "code": 6003,
      "name": "IncorrectReferral",
      "msg": "Incorrect Referral Pubkey"
    },
    {
      "code": 6004,
      "name": "InsufficientDeposit",
      "msg": "Deposit doesn't meet the minimum requirements"
    },
    {
      "code": 6005,
      "name": "TotalDepositReached",
      "msg": "Max total deposit reached"
    },
    {
      "code": 6006,
      "name": "ZeroAddressDetected",
      "msg": "invalid address to initialise"
    },
    {
      "code": 6007,
      "name": "ReferrerShouldInvest",
      "msg": "Referrer should have invested"
    },
    {
      "code": 6008,
      "name": "WalletTvlReached",
      "msg": "Total wallet TVL reached"
    },
    {
      "code": 6009,
      "name": "InvalidAction",
      "msg": "InvalidAction"
    },
    {
      "code": 6010,
      "name": "UnderMinBake",
      "msg": "Rewards must be equal or higher than 0.01 BNB to bake"
    },
    {
      "code": 6011,
      "name": "MaxPayoutReached",
      "msg": "You have reached max payout"
    }
  ]
};
