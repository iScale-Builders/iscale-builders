# Scheduled Launch Updates

This document describes the daily job that updates launch statuses at 8:00 UTC.

## Behavior

- Projects start as `SCHEDULED` with a scheduled launch date.
- At 8:00 UTC on launch day, status changes to `ONGOING`.
- At 8:00 UTC the next day, status changes to `LAUNCHED`.

## Configuration

### 1. Add Environment Variables

Set these environment variables for the deployed app:

```
CRON_API_KEY=your_secret_key_here
APP_URL=https://iscalebuilders.com
```

- `CRON_API_KEY`: secret used to protect the cron endpoint.
- `APP_URL`: base URL for the app.

### 2. Configure The Scheduled Job

Create a scheduled job with:

- **Name**: `update-launches`
- **Command**: `/app/scripts/update-launches.sh`
- **Schedule**: `0 8 * * *`
- **Container**: app container

### 3. Make The Script Executable

Run this in the container:

```bash
chmod +x /app/scripts/update-launches.sh
```

## Manual Test

To test manually, send a GET request to:

`https://iscalebuilders.com/api/cron/update-launches`

Include the cron authorization header using the deployed `CRON_API_KEY` value.
Do not paste a real key into source-controlled docs, tickets, or screenshots.

## Logs

Check the scheduled job logs and application logs if the job fails.

## Troubleshooting

1. `CRON_API_KEY` and `APP_URL` are set.
2. `/app/scripts/update-launches.sh` is executable.
3. `/api/cron/update-launches` is reachable.
4. Application logs do not show database, auth, or network errors.
