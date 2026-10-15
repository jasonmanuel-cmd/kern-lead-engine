from dataclasses import dataclass, field, asdict
from datetime import date
from typing import Any

EVENT_TYPES = {"pre_foreclosure", "probate", "tax_delinquent", "lien"}

@dataclass
class Record:
    event_type: str
    source: str
    source_id: str
    recorded_date: str
    owner_name: str = ""
    property_address: str = ""
    city: str = ""
    state: str = "CA"
    postal_code: str = ""
    apn: str = ""
    case_number: str = ""
    document_type: str = ""
    amount: float | None = None
    mailing_address: str = ""
    raw: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self):
        if self.event_type not in EVENT_TYPES:
            raise ValueError(f"unknown event_type: {self.event_type}")
        if not self.source_id:
            raise ValueError("source_id is required")
        date.fromisoformat(self.recorded_date)

    def dict(self):
        return asdict(self)
