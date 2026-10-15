from datetime import date
from .models import Record

WEIGHTS = {"pre_foreclosure": 45, "tax_delinquent": 35, "probate": 30, "lien": 20}

def score(records: list[Record], today: date | None = None) -> tuple[int, list[str]]:
    today = today or date.today()
    kinds = {r.event_type for r in records}
    points, reasons = 0, []
    for kind in sorted(kinds):
        points += WEIGHTS[kind]
        reasons.append(f"{kind.replace('_', ' ')} (+{WEIGHTS[kind]})")
    dates = [date.fromisoformat(r.recorded_date) for r in records]
    age = (today - max(dates)).days
    if age <= 30:
        points += 15; reasons.append("fresh record <=30 days (+15)")
    elif age <= 90:
        points += 8; reasons.append("recent record <=90 days (+8)")
    if len(kinds) >= 2:
        bonus = min(20, 10 * (len(kinds) - 1))
        points += bonus; reasons.append(f"multiple distress signals (+{bonus})")
    return min(points, 100), reasons
