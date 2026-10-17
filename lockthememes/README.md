# Lock The Memes

Static site. Serve this directory over HTTP. This download can be hosted independently.

## Add a launch

Edit `launches.json`, adding one object per published launch. Deploy the site after updating the file. The browser sorts entries by `launchedAt`, newest first. Earlier entries remain in the ledger. Adding entries does not happen automatically from Telegram or the blockchain.

Required fields: `name` and `launchedAt` (ISO 8601 timestamp with an explicit timezone, such as `2026-10-24T18:00:00-04:00`). Use the actual launch timestamp, not an invented date. The current data file is empty because no tokens have been supplied.

Optional fields: `ticker`, `description`, `chain`, `address`, `provider`, `lockPercent`, `lockStart`, `unlock`, `cancellation`, `lockUrl`, `transactionUrl`, `tokenUrl`.

Use only real evidence URLs. A supplied `lockUrl` makes the entry appear under the lock-record filter. This is a team-published record, not an automated blockchain verification. Do not describe it as verified without implementing and testing actual verification. Release schedules and cancellation rights are displayed verbatim.

The first launch is scheduled for October 17, 2026 at 10:00 a.m. Eastern (America/New_York, EDT / UTC-4). No recurring cadence is promised. Blockchain, provider and lock duration are still unconfirmed. Telegram community: https://t.me/+epMtwPtzHLczN2Zh

## Preview on Ubuntu

Open a terminal inside the extracted lockthememes folder and run:

```bash
python3 -m http.server 8080
```

Open http://localhost:8080 in your browser. Press Ctrl+C to stop. Use HTTP rather than double-clicking index.html because the site loads JavaScript modules and JSON.

## Hosting

Upload all files together, with index.html at the web root. No build step or dependencies are required. Connect your domain through your chosen hosting provider.
