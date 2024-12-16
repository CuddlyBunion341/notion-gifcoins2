import { config } from 'dotenv';

config();

const API_URL = 'https://gifcoins.io/api/v1/transactions';
const API_KEY = process.env.API_KEY;  
const NAME_FILTER = process.env.FILTER_NAME;

async function fetchTransactions() {
    let allTransactions = [];
    let hasMorePages = true;
    let page = 1;

    while (hasMorePages) {
        const url = `${API_URL}?page=${page}`
        console.log(`Fetching transactions from ${url}...`)
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
        const transactions = data.transactions || [];
        allTransactions.push(...transactions);

        const pages = data.pagination.pages;

        if (++page >= pages) {
            hasMorePages = false;
        }
    }

    return allTransactions;
}

async function main() {
    const transactions = await fetchTransactions();
    console.log(`Fetched ${transactions.length} transactions.`);

    const filteredTransactions = transactions.filter(transaction =>
        transaction.spender.name === NAME_FILTER  || transaction.recipient.name === NAME_FILTER 
    );

    console.log('Filtered Transactions:', filteredTransactions);
}

main().catch(error => console.error('Error:', error));
