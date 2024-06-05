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
Wallet 1: 0x8f95cca3196e508f16de7b1d6b9a522addf9e6488a87b34b94a45414b5905ff8
Tokens:
USDC - 0.091120 | $0.09
APT - 1.05186283 | $9.71
FOMO - 10.000000 | $0.00
$APT - 1043.000000 | $0.00
Total amount money on wallet 1: $9.80
```

At the end, you should see

```
Total amount money on X wallets: $93.94
```


## Notes

- Make sure the `wallets.txt` file is in the root directory of your project.
- The script fetches data from the Aptos blockchain, so ensure you have an active internet connection while running the script.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


