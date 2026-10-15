import json, sqlite3
from pathlib import Path
from .models import Record
from .normalize import property_key, normalize_apn, normalize_address
from .scoring import score

SCHEMA = """
CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY, source TEXT NOT NULL, source_id TEXT NOT NULL, event_type TEXT NOT NULL, recorded_date TEXT NOT NULL, property_key TEXT NOT NULL, owner_name TEXT, property_address TEXT, city TEXT, state TEXT, postal_code TEXT, apn TEXT, case_number TEXT, document_type TEXT, amount REAL, mailing_address TEXT, raw_json TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP, UNIQUE(source,source_id));
CREATE TABLE IF NOT EXISTS leads(property_key TEXT PRIMARY KEY, owner_name TEXT, property_address TEXT, city TEXT, state TEXT, postal_code TEXT, apn TEXT, score INTEGER NOT NULL, reasons_json TEXT NOT NULL, phone TEXT, email TEXT, enriched_at TEXT, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_events_property ON events(property_key); CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
"""
class Database:
 def __init__(self,path):
  Path(path).parent.mkdir(parents=True,exist_ok=True); self.conn=sqlite3.connect(path); self.conn.row_factory=sqlite3.Row; self.conn.executescript(SCHEMA)
 def ingest(self, records):
  added=0
  for r in records:
   key=property_key(r.apn,r.property_address,r.city)
   cur=self.conn.execute("""INSERT OR IGNORE INTO events(source,source_id,event_type,recorded_date,property_key,owner_name,property_address,city,state,postal_code,apn,case_number,document_type,amount,mailing_address,raw_json) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",(r.source,r.source_id,r.event_type,r.recorded_date,key,r.owner_name,normalize_address(r.property_address),r.city.upper(),r.state,r.postal_code,normalize_apn(r.apn),r.case_number,r.document_type,r.amount,r.mailing_address,json.dumps(r.raw)))
   added += cur.rowcount
  self.conn.commit(); self.rebuild_leads(); return added
 def rebuild_leads(self):
  keys=[x[0] for x in self.conn.execute("SELECT DISTINCT property_key FROM events")]
  for key in keys:
   rows=self.conn.execute("SELECT * FROM events WHERE property_key=? ORDER BY recorded_date DESC",(key,)).fetchall()
   records=[Record(event_type=x['event_type'],source=x['source'],source_id=x['source_id'],recorded_date=x['recorded_date'],owner_name=x['owner_name'] or '',property_address=x['property_address'] or '',city=x['city'] or '',state=x['state'] or 'CA',postal_code=x['postal_code'] or '',apn=x['apn'] or '',case_number=x['case_number'] or '',document_type=x['document_type'] or '',amount=x['amount'],mailing_address=x['mailing_address'] or '') for x in rows]
   points,reasons=score(records); r=records[0]
   self.conn.execute("""INSERT INTO leads(property_key,owner_name,property_address,city,state,postal_code,apn,score,reasons_json) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(property_key) DO UPDATE SET owner_name=excluded.owner_name,property_address=excluded.property_address,city=excluded.city,state=excluded.state,postal_code=excluded.postal_code,apn=excluded.apn,score=excluded.score,reasons_json=excluded.reasons_json,updated_at=CURRENT_TIMESTAMP""",(key,r.owner_name,r.property_address,r.city,r.state,r.postal_code,r.apn,points,json.dumps(reasons)))
  self.conn.commit()
 def leads(self,min_score=0): return self.conn.execute("SELECT * FROM leads WHERE score>=? ORDER BY score DESC, updated_at DESC",(min_score,)).fetchall()
