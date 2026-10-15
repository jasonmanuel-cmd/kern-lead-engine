import csv, hashlib, json
from pathlib import Path
from .base import Adapter
from ..models import Record

ALIASES = {
 "event_type": ("event_type", "signal", "record_type"), "source_id": ("source_id", "document_number", "case_number", "id"),
 "recorded_date": ("recorded_date", "filing_date", "date", "default_date"), "owner_name": ("owner_name", "party_name", "last_assessee", "debtor"),
 "property_address": ("property_address", "situs_address", "address"), "city": ("city", "city_area"), "postal_code": ("postal_code", "zip"),
 "apn": ("apn", "atn", "parcel_number"), "case_number": ("case_number",), "document_type": ("document_type", "class"),
 "amount": ("amount", "min_price", "lien_amount"), "mailing_address": ("mailing_address",),
}

def _get(row, field):
    lower = {k.strip().lower(): (v or "").strip() for k,v in row.items() if k}
    return next((lower[x] for x in ALIASES[field] if lower.get(x)), "")

class CsvAdapter(Adapter):
    def __init__(self, path: str, default_event_type: str = "", source: str = "kern_county_import"):
        self.path, self.default_event_type, self.source = Path(path), default_event_type, source
    def fetch(self):
        with self.path.open(encoding="utf-8-sig", newline="") as f:
            for row in csv.DictReader(f):
                raw_id = _get(row, "source_id") or hashlib.sha256(json.dumps(row, sort_keys=True).encode()).hexdigest()[:20]
                amount = _get(row, "amount").replace("$", "").replace(",", "")
                yield Record(event_type=_get(row,"event_type") or self.default_event_type, source=self.source,
                    source_id=raw_id, recorded_date=_get(row,"recorded_date"), owner_name=_get(row,"owner_name"),
                    property_address=_get(row,"property_address"), city=_get(row,"city"), postal_code=_get(row,"postal_code"),
                    apn=_get(row,"apn"), case_number=_get(row,"case_number"), document_type=_get(row,"document_type"),
                    amount=float(amount) if amount else None, mailing_address=_get(row,"mailing_address"), raw=row)
