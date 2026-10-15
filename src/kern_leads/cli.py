import argparse,csv,json
from pathlib import Path
from .adapters import CsvAdapter
from .db import Database

def main():
 p=argparse.ArgumentParser(prog="kern-leads",description="Kern County public-record lead pipeline")
 p.add_argument("--db",default="data/kern-leads.db")
 sub=p.add_subparsers(dest="cmd",required=True)
 i=sub.add_parser("import-csv"); i.add_argument("file"); i.add_argument("--type",choices=["pre_foreclosure","probate","tax_delinquent","lien"]); i.add_argument("--source",default="kern_county_import")
 e=sub.add_parser("export"); e.add_argument("--out",default="data/leads.csv"); e.add_argument("--min-score",type=int,default=0)
 sub.add_parser("stats")
 args=p.parse_args(); db=Database(args.db)
 if args.cmd=="import-csv":
  try: n=db.ingest(CsvAdapter(args.file,args.type or "",args.source).fetch()); print(f"Imported {n} new events")
  except (ValueError,KeyError) as exc: p.error(str(exc))
 elif args.cmd=="export":
  rows=db.leads(args.min_score); Path(args.out).parent.mkdir(parents=True,exist_ok=True)
  fields=["property_key","owner_name","property_address","city","state","postal_code","apn","score","reasons","phone","email"]
  with open(args.out,"w",newline="",encoding="utf-8") as f:
   w=csv.DictWriter(f,fieldnames=fields); w.writeheader()
   for x in rows:
    d={k:x[k] for k in fields if k!="reasons"}; d["reasons"]="; ".join(json.loads(x["reasons_json"])); w.writerow(d)
  print(f"Exported {len(rows)} leads to {args.out}")
 else:
  events=db.conn.execute("SELECT event_type,count(*) n FROM events GROUP BY event_type").fetchall(); print(json.dumps({"events":{x[0]:x[1] for x in events},"leads":len(db.leads())},indent=2))
if __name__=="__main__": main()
