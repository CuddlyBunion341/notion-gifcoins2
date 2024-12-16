import cliProgress from 'cli-progress'
import colors from 'ansi-colors'

import { Client } from "@notionhq/client"
import { type ApiTransaction } from "./types";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

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

export async function addTransactions(transactions: ApiTransaction[]) {
  const b1 = new cliProgress.SingleBar({
    format: 'Updating Notion database records |' + colors.gray('{bar}') + '| {percentage}% | {value}/{total} Records updated',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  })

  b1.start(transactions.length, 0)

  transactions.forEach(async (transaction) => {
    b1.increment()
    await addTransaction(transaction)
  });

  b1.stop()
}

// Function to add transaction to Notion
export async function addTransaction(transaction: ApiTransaction) {
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

    const response = await notion.pages.create(notionPageData);
  } catch (error) {
    console.error('Error adding transaction:', error.message);
  }
}
