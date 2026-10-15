# Kern County Lead Engine

A working, local-first pipeline for turning **authorized Kern County public-record exports** into a ranked real-estate lead list. It ingests pre-foreclosure, probate, tax-delinquency, and lien records; normalizes addresses/APNs; deduplicates properties; assigns transparent intent scores; and exports CSV for a CRM or skip-tracing vendor.

> This is not Goliath's private source code. Protected county/court portals can change, use CAPTCHAs, and may prohibit automated access. This project deliberately does not bypass access controls. It gives us the durable part of the system plus adapters for exports and licensed feeds.

## What works now

- CSV importer with aliases for common Recorder, court, and tax-list columns
- Vendor JSON-feed adapter
- SQLite event history and idempotent imports (`source + source_id`)
- APN-first property matching, address fallback, and duplicate suppression
- 0–100 score with reason codes and recency/multiple-signal bonuses
- CRM-ready CSV export
- Vendor-neutral BatchData / PrimeTracers-style enrichment webhook adapter
- Fixture-driven tests; no paid API is required to test

## Quick start

```bash
python -m venv .venv
. .venv/bin/activate
pip install -e .

kern-leads --db data/kern.db import-csv tests/fixtures/kern_records.csv
kern-leads --db data/kern.db stats
kern-leads --db data/kern.db export --min-score 30 --out data/hot-leads.csv
```

Or without installing:

```bash
PYTHONPATH=src python -m kern_leads.cli --db data/kern.db import-csv tests/fixtures/kern_records.csv
```

## Canonical CSV

At minimum each row needs `event_type`, `recorded_date` (`YYYY-MM-DD`), and a stable `source_id`/document/case number. Use either APN/ATN or a property address.

```csv
event_type,document_number,recorded_date,owner_name,situs_address,city,zip,apn,case_number,amount
pre_foreclosure,NOD-2026-1001,2026-10-01,Jane Doe,123 Main St,Bakersfield,93301,001-020-03,,12500
```

Supported event types: `pre_foreclosure`, `probate`, `tax_delinquent`, `lien`. If a file contains one type and lacks that column, pass `--type probate`. Give every recurring feed a stable source name with `--source kern_probate`.

## Kern County source plan

1. **Recorder:** search/export Notices of Default, Lis Pendens and liens from the official Recorder index. Import daily using `--source kern_recorder`.
2. **Superior Court:** obtain a permitted probate docket export or licensed Tyler/Odyssey feed. Import using `--type probate --source kern_superior_court`.
3. **Treasurer–Tax Collector:** download the published “List of Properties Subject to the Tax Collector's Power to Sell,” convert its table to CSV, then import with `--type tax_delinquent --source kern_tax_collector`.
4. **Assessor/GIS:** acquire Kern's current roll/GIS data and join by normalized APN to add assessed value, owner mailing address and property characteristics.
5. **Skip trace only qualified leads:** export at a score threshold (for example 45) before sending to BatchData/PrimeTracers. This prevents paying to enrich weak records.

Official starting points:

- Tax-defaulted sales: https://www.kerncounty.com/services/property-land-and-taxes/property-tax-portal/tax-defaulted-property-sales
- Assessor GIS datasets: https://www.kerncounty.com/government/departments/assessor-recorder/property/mapping-gis/gis-data
- Recorder: https://recorderonline.co.kern.ca.us/
- Court portal: https://portal.kern.courts.ca.gov/

## Scoring

| Signal | Points |
|---|---:|
| Pre-foreclosure | 45 |
| Tax delinquent | 35 |
| Probate | 30 |
| Lien | 20 |
| Filed in last 30 days | +15 |
| Filed in last 90 days | +8 |
| Each additional signal | +10 (max +20) |

Scores cap at 100. Every exported lead includes human-readable reasons. We should tune weights against actual appointments/contracts, not intuition.

## Skip tracing

`WebhookEnricher` sends a conventional JSON payload and expects `phone`/`email` or `phones`/`emails`. Vendor APIs differ, so adapt the request/response only after obtaining the selected vendor's current API docs and credentials.

```bash
export SKIP_TRACE_URL='https://vendor.example/v1/lookup'
export SKIP_TRACE_API_KEY='...'
```

Never commit keys; `.env*` is ignored by the parent repo. Add DNC/consent/opt-out checks before dialing or texting. Public availability of a record does **not** automatically authorize every marketing use. Review the source terms, California privacy rules, TCPA, DNC, and county bulk-access restrictions with counsel.

## Production schedule

Run imports hourly/daily from cron, GitHub Actions with secrets, or a small VM. Keep downloaded raw files in immutable dated storage, use stable `--source` values, and back up the SQLite DB. For a multi-user deployment, port `SCHEMA` in `src/kern_leads/db.py` to Postgres/Supabase and put an authenticated API/dashboard in front of it.

## Tests

```bash
PYTHONPATH=src python -m unittest discover -s tests -v
```

## Next production connector

The core is ready. The remaining blocker is access, not parsing: choose the authorized Kern Recorder/court delivery method (manual CSV export, paid bulk account, or licensed vendor feed), save one redacted sample export, then map it into `CsvAdapter` or `JsonApiAdapter`. Do not build a brittle CAPTCHA bypass.
