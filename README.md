# notion-gifcoins2

A simple gifcoins2 notion integration.

## Requirements

- **Bun**: Bun is a fast JavaScript runtime like Node.js. It is required to run this project. To install Bun, visit the [Bun installation page](https://bun.sh/docs/install) and follow the instructions provided.

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/CuddlyBunion341/notion-gifcoins2.git
    cd notion-gifcoins2
    ```

2. Install dependencies using Bun:

    ```sh
    bun install
    ```

## Obtaining API Keys

### Gifcoins2 API Key

1. Go to your group settings [https://gifcoins.io/admin/groups/{GROUP_ID}]
2. Go to the Manage API Key section
3. Copy / regenerate the API Key from tehere

### Notion API Key

1. Go to the [Notion Integrations](https://www.notion.so/my-integrations) page.
2. Click on "New integration".
3. Fill in the required details and click "Submit".
4. Copy the integration token (API key) provided.

## Obtaining Notion Database ID

1. Open your Notion workspace in your browser.
2. Navigate to the page containing the database you want to use.
3. Open the database page in your browser.
4. In the URL, you will see a part that looks like this: `https://www.notion.so/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=********************************`.
5. The part before the `?v=` (`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`) is your Notion Database ID. Copy this ID.

## Connecting Notion Integration to Database

1. Create the Integration
    1. Go to the [Notion Integrations](https://www.notion.so/my-integrations) page.
    2. Create a new integration by setting a workspace and a name.
    3. Ensure the integration has `Read content`, `Update content`, and `Insert content` permissions.
    4. Copy the Internal Integration Secret to your `.env` file.

2. Connect the Database to the Integration
    1. Open the Notion database you want to use.
    2. Click on the **Share** button at the top-right corner of the page.
    3. In the **Invite** section, type the name of your integration and select it.
    4. Click **Invite** to share the database with your integration.

## Database Structure

Ensure your Notion database has the following structure:

- **ID**: `number`
- **Date**: `date`
- **Amount**: `number`
- **Spender**: `text`
- **message**: `text`

## Setting Environment Variables

Create a `.env` file in the root directory of the project and add the required environment variables. You can refer to the [.env.example](./.env.example) file for the required variables.

## Running the Project

To run the project, use the following command:

```sh
bun run index.ts
```

## Periodically Fetching Gifcoins

To periodically fetch gifcoins, you can set up a cron job that runs a bash script at regular intervals.

1. Create a bash script named `fetch_gifcoins.sh` in the root directory of the project:

    ```sh
    #!/bin/bash
    cd /path/to/notion-gifcoins2
    bun run index.ts
    ```

    Make sure to replace `/path/to/notion-gifcoins2` with the actual path to your project directory.

2. Make the script executable:

    ```sh
    chmod +x fetch_gifcoins.sh
    ```

3. Open your crontab file:

    ```sh
    crontab -e
    ```

4. Add the following line to run the script every hour (adjust the schedule as needed):

    ```sh
    0 * * * * /path/to/notion-gifcoins2/fetch_gifcoins.sh
    ```

    This will run the script at the beginning of every hour. Adjust the schedule as needed. You can use [crontab.guru](https://crontab.guru/) to help you with the cron schedule syntax.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
