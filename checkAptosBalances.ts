import axios from "axios";
import fs from "fs-extra";

interface TokenWithBalance {
  coin: string;
  amount: string;
}

interface receivedInfoAboutToken {
  owner_address: string;
  coin_type_hash: string;
  coin_type: string;
  amount: string;
  last_transaction_version: number;
  last_transaction_timestamp: string;
  coin_name: string;
  coin_symbol: string;
  coin_decimals: number;
}
const aptosApiUrl = "https://public-api.aptoscan.com/v1/";
const walletsFilePath = "./wallets.txt";

async function getWallets(): Promise<string[]> {
  try {
    const walletData = await fs.readFile(walletsFilePath, "utf-8");
    return walletData
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  } catch (error) {
    console.error("Error reading wallets file:", error);
    return [];
  }
}

async function getAllTokensWithBalances(wallet: string): Promise<TokenWithBalance[]> {
  try {
    const response = await axios.get(`${aptosApiUrl}/accounts/${wallet}/coins`);

    const tokensWithBalances: TokenWithBalance[] = response.data.data.map(
      (token: receivedInfoAboutToken) => ({
        coin: token.coin_symbol,
        amount: formatNumberWithComma(
          Number(token.amount),
          token.coin_decimals
        ),
      })
    );

    return tokensWithBalances;
  } catch (error) {
    console.error(`Error fetching balance for wallet ${wallet}:`, error);
    return [];
  }
}

function formatNumberWithComma(amount: number, digits: number): string {
  const amountStr = amount.toString();
  const amountLength = amountStr.length;

  if (digits < 0) {
    throw new Error("Digits should be non-negative.");
  }

  if (digits >= amountLength) {
    return "0." + "0".repeat(digits - amountLength) + amountStr;
  } else {
    const pointIndex = amountLength - digits;
    return amountStr.slice(0, pointIndex) + "." + amountStr.slice(pointIndex);
  }
}

async function getCoinsPrice(): Promise<{ [key: string]: string; }> {
  const tokensPrice: { [key: string]: string } = {};
  const apiUrlPage1 = "https://api.coinlore.net/api/tickers/";
  const apiUrlPage2 = "https://api.coinlore.net/api/tickers/?start=100&limit=100";
  const apiUrlPage3 = "https://api.coinlore.net/api/tickers/?start=200&limit=100";

  try {
    console.log("Let's find out the price of tokens");

    const [response1, response2, response3] = await Promise.all([
      axios.get(apiUrlPage1),
      axios.get(apiUrlPage2),
      axios.get(apiUrlPage3),
    ]);

    const responses = [response1, response2, response3];
    for (const response of responses) {
      for (const token of response.data.data) {
        tokensPrice[token.symbol] = token.price_usd;
      }
    }
    return tokensPrice
  } catch (error) {
    console.error("Error fetching coin prices:", error);
    return tokensPrice
  }
}

async function main() {
  const [wallets, tokensPrice] = await Promise.all([getWallets(), getCoinsPrice()]);
  let totalBalance: number = 0;

  const allBalancesPromises = wallets.map(wallet => getAllTokensWithBalances(wallet));
  const allBalances = await Promise.all(allBalancesPromises);
  
  allBalances.forEach((ArrayWalletTokensWithBalances, index) => {
    const wallet = wallets[index];
    let walletTotal: number = 0;
    
    console.log(`Wallet ${index + 1}: ${wallet}`);
    console.log(`Tokens:`);

    ArrayWalletTokensWithBalances.forEach(coin => {
      const coinPrice = Number(tokensPrice[coin.coin]) || 0;
      const coinValue = coinPrice * Number(coin.amount);

      walletTotal += coinValue;

      console.log(`${coin.coin} - ${coin.amount} | $${coinValue.toFixed(2)}`);
    });

    totalBalance += walletTotal;

    console.log(`Total amount money on wallet ${index + 1}: $${walletTotal.toFixed(2)}`);
    console.log("-------------------------");
  });

  console.log(`Total amount money on ${wallets.length} wallets: $${totalBalance.toFixed(2)}`);
  console.log("-------------------------");
}

main().catch(console.error);