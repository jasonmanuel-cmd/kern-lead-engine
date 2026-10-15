import tempfile,unittest
from datetime import date
from pathlib import Path
from kern_leads.adapters import CsvAdapter
from kern_leads.db import Database
from kern_leads.normalize import normalize_address,normalize_apn
from kern_leads.scoring import score

FIX=Path(__file__).parent/"fixtures/kern_records.csv"
class PipelineTest(unittest.TestCase):
 def test_normalize(self):
  self.assertEqual(normalize_address("123 Main Street."),"123 MAIN ST"); self.assertEqual(normalize_apn("001-020-03"),"00102003")
 def test_ingest_dedupe_score(self):
  with tempfile.TemporaryDirectory() as d:
   db=Database(Path(d)/"x.db"); records=list(CsvAdapter(str(FIX)).fetch())
   self.assertEqual(db.ingest(records),3); self.assertEqual(db.ingest(records),0)
   leads=db.leads(); self.assertEqual(len(leads),2); self.assertEqual(leads[0]["score"],100); self.assertEqual(leads[0]["apn"],"00102003")
if __name__=="__main__": unittest.main()
