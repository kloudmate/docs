---
title: Create a monitor
description: Set up a synthetic monitor in KloudMate to test uptime and API health on a schedule.
---

# Create a monitor

## Overview

This guide walks you through creating a synthetic monitor that checks a URL or API endpoint on a regular schedule.

## Prerequisites

- A KloudMate workspace
- A publicly reachable URL to monitor

## Steps

### 1. Go to Synthetic Monitoring

In the left navigation, select **Synthetic Monitoring** and click **Create monitor**.

### 2. Choose a monitor type

Select **HTTP check**, **API check**, or **SSL check**.

### 3. Set the target URL

Enter the URL you want to test.

### 4. Configure the check

For an HTTP check:

- **Expected status code** — for example, `200`
- **Response time threshold** — alert if the response takes longer than this value
- **Check string** — optional text that must appear in the response body

### 5. Choose check locations

Select one or more global locations from which KloudMate will run the check.

### 6. Set the schedule

Choose how frequently to run the check: every 1, 5, 10, or 30 minutes.

### 7. Assign alert channels

Select the channels to notify when the check fails.

### 8. Save the monitor

Click **Save**. The monitor starts running immediately.

## Troubleshooting

If the monitor always fails, confirm that the target URL is publicly reachable and not protected by IP allowlisting.

## Related

- [Monitor results](/synthetic-monitoring/monitor-results)
- [Synthetic monitoring overview](/synthetic-monitoring/overview)
- [Alert channels](/alerts/alert-channels)
