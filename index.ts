import { config } from 'dotenv'
import { fetchTransactions } from './gifcoins';
import { addTransaction } from './notion';

config();

const NAME_FILTER = process.env.FILTER_NAME;

async function main() {
  const transactions = await fetchTransactions();
  console.log(`Fetched ${transactions.length} transactions.`);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.recipient.name === NAME_FILTER
  );

  filteredTransactions.forEach(transaction => addTransaction(transaction))
}

main().catch(error => console.error('Error:', error));
