import json, urllib.request
from .base import Adapter
from ..models import Record

class JsonApiAdapter(Adapter):
    """Configurable adapter for licensed/vendor JSON feeds. Field map maps canonical names to JSON keys."""
    def __init__(self, url, event_type, source, field_map, headers=None):
        self.url, self.event_type, self.source, self.field_map = url, event_type, source, field_map
        self.headers = headers or {}
    def fetch(self):
        req = urllib.request.Request(self.url, headers=self.headers)
        with urllib.request.urlopen(req, timeout=60) as res:
            payload = json.load(res)
        rows = payload if isinstance(payload, list) else payload.get("results", payload.get("data", []))
        for row in rows:
            val = lambda k, default="": row.get(self.field_map.get(k, k), default)
            yield Record(event_type=self.event_type, source=self.source, source_id=str(val("source_id")),
                recorded_date=str(val("recorded_date"))[:10], owner_name=str(val("owner_name")),
                property_address=str(val("property_address")), city=str(val("city")), postal_code=str(val("postal_code")),
                apn=str(val("apn")), case_number=str(val("case_number")), document_type=str(val("document_type")), raw=row)
