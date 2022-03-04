import { useEffect, useState } from "react";
import "./App.css";
import lottery from "./lottery";
import web3 from "./web3";

function App() {
  const [manager, setManager] = useState();
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [value, setValue] = useState();
  const [message, setMessage] = useState();
  const [pickMessage, setPickMessage] = useState();

  const getManagerPlayersBalance = async () => {
    const returnManager = await lottery.methods.manager().call();
    const returnPlayers = await lottery.methods.getPlayers().call();
    const returnBalance = await web3.eth.getBalance(lottery.options.address);
    setManager(returnManager);
    setPlayers(returnPlayers);
    setBalance(returnBalance);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transcation...");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setMessage("You have been entered!");
  };

  const onClickPickWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setPickMessage("Waiting on transcation...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setPickMessage("A winner has been picked!");
  };

  useEffect(() => {
    getManagerPlayersBalance();
  }, []);

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}. There are currently&nbsp;
        {players.length} people enterted, competing to win&nbsp;
        {web3.utils.fromWei(balance.toString(), "ether")} ether
      </p>

      <hr />

      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ther to enter</label>
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        <button>Enter</button>
      </form>

      <hr />

      <h1>{message}</h1>

      <h4>Time to pick a winner?</h4>
      <button onClick={onClickPickWinner}>Pick Winner</button>

      <h1>{pickMessage}</h1>

    </div>
  );
}

export default App;
