/* eslint-disable react-hooks/exhaustive-deps */
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/system";

import {
  PublicKey,
} from "@solana/web3.js";

import { useLocation } from "react-router-dom";
import { useContractContext } from "../../providers/ContractProvider";
import { useWallet } from "@solana/wallet-adapter-react";
import PriceInput from "../../components/PriceInput";
import { useEffect, useState } from "react";
import { config } from "../../config";
import { toSolAmount, toSolRewardAmount, shortenAddress, buyBeans, eatBeans, bakeBeans, initialize, establishListeners } from "../../contracts/bean";

import { showToast } from "../../contracts/utils";
import {
  getWalletSolBalance,
  getVaultSolBalance,
  getUserData,
  getGlobalStateData
} from "../../contracts/bean"
import { MIN_BAKE } from "../../contracts/constants";

const CardWrapper = styled(Card)({
  background: "transparent",
  border: "3px solid #e3e3e3",
  boxShadow: "none !important",
  borderRadius: "8px !important",
  minHeight: "420px",
  height: "auto"
});

const ButtonContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    "> div": {
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

export default function BakeCard() {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  /*const { address, chainId } = useAuthContext();*/
  const { publicKey: address } = useWallet();
  const [bakeSOL, setBakeSOL] = useState(0);
  const [loading, setLoading] = useState(false);
  const query = useQuery();
  const wallet = useWallet();

  const [minersCount, setMinersCount] = useState("0");
  const [beanRewards, setBeanRewards] = useState("0");
  const [rewardsUpdated, setRewardsUpdated] = useState(false);

  const [walletSolBalance, setWalletSolBalance] = useState("0");
  const [contractSolBalance, setContractSolBalance] = useState("0");
  const [dataUpdate, setDataUpdate] = useState(false);
  const [adminKey, setAdminKey] = useState(null);

  const [userData, setUserData] = useState(null);

  const [globalState, setGlobalState] = useState(null);

  useEffect(() => {
    getWalletSolBalance(wallet).then(bal => {
      console.log("getWalletSolBalance bal=", bal);
      setWalletSolBalance(Math.floor(parseFloat(bal) * 100) / 100 + "");
    });
    getUserData(wallet).then(data => {
      if (data !== null) {
        console.log('userData =', data);
        setBeanRewards(Math.max(0, data.beanRewards));
        setMinersCount(data.miners);
        setUserData(data.userData);
      } else {
        setBeanRewards("0");
        setMinersCount("0");
      }
    });
    getGlobalStateData(wallet).then(data => {
      if (data != null) {
        setAdminKey(data.authority);
      }
      setGlobalState(data);
    })
  }, [wallet, dataUpdate]);

  const onBought = (event) => {
    if (wallet.publicKey) toggleDataUpdate();
    let solAmount = toSolAmount(event.solAmount);
    showToast(`User ${shortenAddress(event.userAddress.toBase58())} deposited ${solAmount} SOL`, 5000, 2);
    console.log("bought", event);
  }

  const onAte = (event) => {
    if (wallet.publicKey) toggleDataUpdate();
    let solAte = toSolAmount(event.solToEat);
    showToast(`User ${shortenAddress(event.userAddress.toBase58())} ate ${solAte} SOL`, 5000, 2);
    console.log("ate", event);
  }

  useEffect(() => {
    establishListeners(wallet, onBought, onAte);
  }, [wallet])

  useEffect(() => {
    getVaultSolBalance().then(bal => {
      setContractSolBalance(Math.floor(parseFloat(bal) * 100) / 100 + "");
    });
  }, [wallet, dataUpdate]);

  useEffect(() => {
    setTimeout(() => {
      if (wallet.publicKey) toggleDataUpdate();
    }, 50000);
  });

  useEffect(() => {
    setTimeout(() => {
      if (wallet.publicKey && userData) { 
        setBeanRewards(toSolRewardAmount(userData));
      }
      setRewardsUpdated(!rewardsUpdated);
    }, 100);
  }, [rewardsUpdated]);

  const toggleDataUpdate = () => {
    // give some delay to wait for tx confirmation
    setTimeout(() => setDataUpdate(!dataUpdate), 1000);
    console.log("toggleDataUpdate");
  }

  const onUpdateBakeSOL = (value) => {
    setBakeSOL(value);
  };
  const getRef = () => {
    const ref = query.get("ref");
    return ref;
  };
  
  const initializeProgram = async () => {
    
    setLoading(true);
    try {
      await initialize(wallet);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    toggleDataUpdate();
  };

  const bake = async () => {
    setLoading(true);

    let ref = getRef();
    console.log("bake: ref=", ref);
    if (ref === null) ref = wallet.publicKey;
    try {
      await buyBeans(wallet, new PublicKey(ref), bakeSOL);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    toggleDataUpdate();
  };

  const reBake = async () => {
    setLoading(true);

    let ref = getRef();

    if (ref === null) ref = wallet.publicKey;
    try {
      if (parseFloat(beanRewards) < MIN_BAKE) {
        showToast(`Rewards should be more than ${MIN_BAKE} sol to rebake`, 2000, 1);
      } else {
        await bakeBeans(wallet, new PublicKey(ref), 1);
      }
      
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    toggleDataUpdate();
    
  };

  const eatBeansClick = async () => {
    setLoading(true);

    try {
      await eatBeans(wallet);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
    toggleDataUpdate();
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} md={6}>
        <CardWrapper>
          {loading && <LinearProgress color="secondary"/>}
          <CardContent>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mt={3}
            >
              <Typography variant="body1" className="museo-font">Contract</Typography>
              <Typography variant="h5" className="museo-font">{contractSolBalance} SOL</Typography>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mt={3}
            >
              <Typography variant="body1" className="museo-font">Wallet</Typography>
              <Typography variant="h5" className="museo-font">{walletSolBalance} SOL</Typography>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mt={3}
            >
              <Typography variant="body1" className="museo-font">Your Rewards</Typography>
              <Typography variant="h5" className="museo-font">{minersCount} REWARDS</Typography>
            </Grid>

            <Box paddingTop={4} paddingBottom={2}>
              <Box marginTop={5}>
                <PriceInput
                  style={{}}
                  max={+walletSolBalance}
                  value={bakeSOL}
                  onChange={(value) => onUpdateBakeSOL(value)}
                />
              </Box>
              {
                globalState == null ? <Box marginTop={3} marginBottom={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={initializeProgram}
                      className="custom-button"
                    >
                      Init
                    </Button>
                  </Box>
                :
                  <Box marginTop={3} marginBottom={3} hidden>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={initializeProgram}
                      className="custom-button"
                    >
                      Init
                    </Button>
                  </Box>
              }

              <Box marginTop={2} marginBottom={0}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!address || +bakeSOL === 0 || loading}
                  onClick={bake}
                  className="custom-button"
                >
                  Invest
                </Button>
              </Box>
            </Box>
          </CardContent>
        </CardWrapper>
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        <CardWrapper>
          <CardContent>
          <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mt={3}
              style={{
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid black"
              }}
            >
              <Typography variant="body1" className="museo-font">Referral Count</Typography>
              <Typography variant="h5" className="museo-font">{userData?.refsCount ?? 0} REFERRALS</Typography>
            </Grid>

            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              mt={3}
              style={{
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid black"
              }}
              marginBottom={8}
            >
              <Typography variant="body1" fontWeight="bolder" className="museo-font">
                Your Rewards
              </Typography>
              <Typography variant="h5" fontWeight="bolder" className="museo-font">
                {beanRewards} SOL
              </Typography>
              
            </Grid>

              <Grid item marginTop={5}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={!address || loading}
                  onClick={reBake}
                  className="custom-button"
                >
                  Compound <span style={{fontSize: '14px'}}></span>
                </Button>
              </Grid>
              <Grid item marginTop={6} justifyContent="center">
                <Button
                  variant="contained"
                  disabled={!address || loading}
                  fullWidth
                  onClick={eatBeansClick}
                  className="quit-button"
                >
                  Cashout <span style={{fontSize: '14px'}}></span>
                </Button>
              </Grid>
          </CardContent>
        </CardWrapper>
      </Grid>
    </Grid>
  );
}
