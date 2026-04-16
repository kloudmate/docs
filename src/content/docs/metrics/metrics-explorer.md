---
title: Metrics explorer
description: Explore and query your metrics data using the KloudMate Metrics Explorer.
---

# Metrics explorer

## Overview

The Metrics Explorer provides an interactive interface to browse, query, and visualise metrics from all your connected data sources.

## Prerequisites

- At least one metrics source connected

## Steps

### 1. Open the Metrics Explorer

In the left navigation, select **Metrics**.

### 2. Select a metric

Use the search box to find a metric by name (for example, `cpu.utilization` or `aws.ec2.cpuutilization`).

### 3. Apply filters

Use the dimension filters to narrow down results by tags such as `service`, `region`, or `instance_id`.

### 4. Choose an aggregation

Select how to aggregate the data: **average**, **sum**, **min**, **max**, or **count**.

### 5. Adjust the time range

Use the time picker to select the period you want to analyse.

### 6. Save to dashboard

Click **Add to dashboard** to pin the chart to an existing or new dashboard.

## Troubleshooting

If a metric does not appear, verify that the source is connected and sending data for the selected time range.

## Related

- [Custom metrics](/metrics/custom-metrics)
- [Create a dashboard](/dashboards/create-dashboard)
- [Metrics overview](/metrics/overview)
