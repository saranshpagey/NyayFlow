
import requests
from bs4 import BeautifulSoup

def debug_toc(url):
    print(f"Fetch: {url}")
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'}
    try:
        res = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {res.status_code}")
        soup = BeautifulSoup(res.content, 'html.parser')
        
        print(f"Title: {soup.title.string if soup.title else 'No Title'}")
        
        # Check if it's the full act text
        body_text = soup.body.get_text()[:500] if soup.body else "No Body"
        print(f"Body Start: {body_text}")
        
        if "Companies Act" in str(soup):
            print("✅ 'Companies Act' found in HTML")
        else:
            print("❌ 'Companies Act' NOT found")

        links = soup.find_all('a', href=True)
        print(f"Total links: {len(links)}")
        for i, a in enumerate(links[:20]):
            print(f"{i}: {a.text.strip()} -> {a['href']}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_toc("https://indiankanoon.org/doc/167683936/")
