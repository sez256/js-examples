import { useEffect, useState } from 'react';
import { connect, getSigningCosmWasmClient, WalletConnect } from '@sei-js/core';
import { coins } from '@cosmjs/amino';
import './styles.css';

function App() {
  const [count, setCount] = useState(0);
  const [wallet, setWallet] = useState<WalletConnect>();

  useEffect(() => {
    connect('keplr', 'pacific-1').then(setWallet);
  }, []);

  useEffect(() => {
    fetchCount().then(setCount);
  }, [wallet]);

  const fetchCount = async () => {
    if (!wallet) return;

    const client = await getSigningCosmWasmClient(
      'https://sei-rpc.polkachu.com/',
      wallet.offlineSigner
    );
    const response = await client.queryContractSmart(
      'sei12uzyf3gkeehdgzuqzhy6nk2039s7l2kre0sknj73c4ngy53klq4qpgpvz6',
      { get_count: {} }
    );
    return response.count;
  };

  const claimTokens = async () => {
    if (!wallet) return;

    const client = await getSigningCosmWasmClient(
      'https://sei-rpc.polkachu.com/',
      wallet.offlineSigner
    );

    const senderAddress = wallet.accounts[0].address;

    const msg = {
      claim: {},
    };

    const fee = {
      amount: coins(24000, 'usei'),
      gas: '200000',
    };

    const sendAmount = coins(1, 'usei');

    const response = await client.execute(
      senderAddress,
      'sei12uzyf3gkeehdgzuqzhy6nk2039s7l2kre0sknj73c4ngy53klq4qpgpvz6',
      msg,
      fee,
      sendAmount.toString() // Include the sendAmount here
    );

    // Updates the counter state again
    await fetchCount();
  };

  return (
    <div>
      <h1>Count is: {count}</h1>
      <button onClick={claimTokens}>Claim</button>
    </div>
  );
}

export default App;
