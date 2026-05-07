import urllib.request
import json
url = "https://ninetynine99.co.kr/safetron/api/graph/search?q=%EC%82%BC%EC%84%B1"
req = urllib.request.Request(url)
try:
    with urllib.request.urlopen(req) as response:
        headers = response.info()
        body = response.read().decode('utf-8')
        print("Headers:\n", headers)
        print("Body preview:\n", body[:200])
except Exception as e:
    print("Error:", e)
