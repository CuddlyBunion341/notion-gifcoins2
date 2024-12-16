import cliProgress from 'cli-progress'
import colors from 'ansi-colors'
import type { ApiTransaction } from './types';

const API_URL = 'https://gifcoins.io/api/v1/transactions';
const API_KEY = process.env.API_KEY;

const b1 = new cliProgress.SingleBar({
  format: 'Fetching Gifcoins |' + colors.yellow('{bar}') + '| {percentage}% | {value}/{total} Transactions',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
})


export async function fetchTransactions() {
  let allTransactions = [];
  let hasMorePages = true;
  let page = 1;
  let isFirstRequest = true;

  while (hasMorePages) {
    const url = `${API_URL}?page=${page}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch transactions:', response.statusText);
      return [];
    }

    const data = await response.json();
    const transactions: ApiTransaction[] = data.transactions || [];
    allTransactions.push(...transactions);

    const { pages, count } = data.pagination;

    if (isFirstRequest) {
      b1.start(count, 0)
      isFirstRequest = false
    }

    b1.update(allTransactions.length)


    if (++page >= pages) {
      hasMorePages = false;
    }
  }

  b1.stop()

  return allTransactions;
}
