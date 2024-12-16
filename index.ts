import { config } from 'dotenv'
import { Client } from "@notionhq/client"
import cliProgress from 'cli-progress'
import colors from 'ansi-colors'

type ApiTransaction = {
  id: number
  message: string
  amount: number
  created_at: string
  spender: {
    id: number
    name: string
  }
  recipient: {
    id: number
    name: string
  }
}

config();

const API_URL = 'https://gifcoins.io/api/v1/transactions';
const API_KEY = process.env.API_KEY;
const NAME_FILTER = process.env.FILTER_NAME;

const b1 = new cliProgress.SingleBar({
  format: 'Fetching Gifcoins |' + colors.yellow('{bar}') + '| {percentage}% || {value}/{total} Transactions',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
})

async function fetchTransactions() {
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

async function main() {
  const transactions = await fetchTransactions();
  console.log(`Fetched ${transactions.length} transactions.`);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.recipient.name === NAME_FILTER
  );

  filteredTransactions.forEach(transaction => addTransaction(transaction))
}



function validateTransaction(transaction: ApiTransaction) {
  const { amount, spender, id, message } = transaction;
  const created_at = new Date(transaction.created_at)

  if (!created_at || !(created_at instanceof Date)) {
    throw new Error("Invalid date. Date is required and must be a valid date object.");
  }
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    throw new Error("Invalid amount. Amount is required and must be a positive number.");
  }
  if (!spender || typeof spender.name !== 'string') {
    throw new Error("Invalid spender. Spender is required and must be a string.");
  }
  if (!id || typeof id !== 'number') {
    throw new Error("Invalid id. ID is required and must be a number.");
  }
  if (!message || typeof message !== 'string') {
    throw new Error("Invalid message. Message is required and must be a string.");
  }
}

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Function to add transaction to Notion
async function addTransaction(transaction: ApiTransaction) {
  try {
    // Validate the transaction
    validateTransaction(transaction);

    // Prepare the data for Notion
    const notionPageData = {
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Date: {
          date: {
            start: new Date(transaction.created_at)
          },
        },
        Amount: {
          number: transaction.amount,
        },
        Spender: {
          rich_text: [
            {
              text: {
                content: transaction.spender.name,
              },
            },
          ],
        },
        ID: {
          number: transaction.id,
        },
        Message: {
          rich_text: [
            {
              text: {
                content: transaction.message,
              },
            },
          ],
        },
      },
    };

    // Create the page in Notion
    const response = await notion.pages.create(notionPageData);
    console.log('Transaction added:', response);
  } catch (error) {
    console.error('Error adding transaction:', error.message);
  }
}

main().catch(error => console.error('Error:', error));
