import json, os, urllib.request

class WebhookEnricher:
 """Vendor-neutral skip trace adapter. Set URL/key and map your vendor response in parse()."""
 def __init__(self,url=None,api_key=None):
  self.url=url or os.getenv("SKIP_TRACE_URL"); self.api_key=api_key or os.getenv("SKIP_TRACE_API_KEY")
 def enrich(self, lead):
  if not self.url or not self.api_key: raise RuntimeError("Set SKIP_TRACE_URL and SKIP_TRACE_API_KEY")
  body=json.dumps({"name":lead["owner_name"],"address":lead["property_address"],"city":lead["city"],"state":lead["state"],"zip":lead["postal_code"],"apn":lead["apn"]}).encode()
  req=urllib.request.Request(self.url,data=body,headers={"Authorization":f"Bearer {self.api_key}","Content-Type":"application/json"})
  with urllib.request.urlopen(req,timeout=30) as res: data=json.load(res)
  return {"phone": data.get("phone") or (data.get("phones") or [""])[0], "email": data.get("email") or (data.get("emails") or [""])[0]}
