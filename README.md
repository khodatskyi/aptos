# Aptos Wallet Balance Checker

This script checks the balances of Aptos wallets provided in a `wallets.txt` file. 

## Prerequisites

Make sure you have Node.js and npm installed on your machine. You can download Node.js from [nodejs.org](https://nodejs.org/).

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/aptos-balance-checker.git
   cd aptos-balance-checker
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

## Usage

1. **Create a `wallets.txt` file in the root directory of the project.**

   Each line in this file should contain one Aptos wallet address. For example:

   ```
   0x8f95cca3196e508...
   0x7fd6eb5192154a6...
   0x46de23270de40e8...
   ```

2. **Run the script:**

   ```sh
   ts-node checkAptosBalances.ts
   ```

   This command will execute the script and print the balances of the wallets listed in the `wallets.txt` file.

## Example

After running the script, you should see output similar to this:

```
Wallet: 0x7fd6eb5192154a6...
Tokens: [{"coin":"Cake","amount":"0.06674855"},{"coin":"APT","amount":"1.04036996"},{"coin":"FOMO","amount":"10.000000"},{"coin":"tAPT","amount":"0.01814016"},{"coin":"$APT","amount":"1043.000000"}]
```

## Notes

- Make sure the `wallets.txt` file is in the root directory of your project.
- The script fetches data from the Aptos blockchain, so ensure you have an active internet connection while running the script.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


