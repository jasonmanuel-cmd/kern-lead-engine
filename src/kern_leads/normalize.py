import hashlib, re

_SUFFIXES = {"STREET":"ST", "AVENUE":"AVE", "ROAD":"RD", "DRIVE":"DR", "BOULEVARD":"BLVD", "LANE":"LN", "COURT":"CT", "PLACE":"PL", "HIGHWAY":"HWY"}

def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", (value or "").strip()).upper()

def normalize_apn(value: str) -> str:
    return re.sub(r"\D", "", value or "")

def normalize_address(value: str) -> str:
    text = re.sub(r"[^A-Z0-9 ]", " ", clean_text(value))
    parts = [_SUFFIXES.get(p, p) for p in text.split()]
    return " ".join(parts)

def person_key(value: str) -> str:
    text = clean_text(value)
    text = re.sub(r"\b(TRUST|TRUSTEE|REVOCABLE|LIVING|ESTATE OF|ET AL)\b", "", text)
    return re.sub(r"[^A-Z0-9]", "", text)

def property_key(apn: str, address: str, city: str = "") -> str:
    apn_key = normalize_apn(apn)
    basis = f"APN:{apn_key}" if apn_key else f"ADDR:{normalize_address(address)}|{clean_text(city)}"
    return hashlib.sha256(basis.encode()).hexdigest()[:24]
