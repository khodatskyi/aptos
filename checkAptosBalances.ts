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

async function main() {
  const wallets = await getWallets();

  for (const wallet of wallets) {
    const ArrayAllTokensWithBalances = await getAllTokensWithBalances(wallet);
    // for(const coin of ArrayAllTokensWithBalances) {
    //   console.log(coin);

    // }

    console.log(`Wallet: ${wallet}`);
    console.log(`Tokens: ${JSON.stringify(ArrayAllTokensWithBalances)}`);
    console.log("-------------------------");
  }
}

main().catch(console.error);


getCoinsPrice();

async function getCoinsPrice() {
  const apiUrl = "https://api.coinlore.net/api/tickers/";
  const tokensPrice: { [key: string]: string } = {};

  try {
    const response = await axios.get(apiUrl);
    for (const token of response.data.data) {
      tokensPrice[token.symbol] = token.price_usd;
    }
    console.log(tokensPrice);

    return tokensPrice;
  } catch (error) {
    console.error("Error fetching coin prices:", error);
    return null;
  }
}
