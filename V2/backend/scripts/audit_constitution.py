import os

DIR = "./source-documents/constitution"
files = os.listdir(DIR)

articles_found = set()
schedules_found = set()
parts_found = set()

for f in files:
    if not f.endswith(".md"): continue
    
    # Simple check on filename as it contains the slug
    # Or better, read the content to find the URL which has 'article-123'
    try:
        with open(os.path.join(DIR, f), 'r') as file:
            content = file.read()
            # source_url: https://www.constitutionofindia.net/articles/article-1-...
            if "source_url: " in content:
                url_line = [line for line in content.split('\n') if "source_url: " in line][0]
                url = url_line.split("source_url: ")[1].strip()
                
                if "/articles/article-" in url:
                    # extract number
                    part = url.split("article-")[1].split("-")[0]
                    # Handle 21A, etc.
                    articles_found.add(part)
                elif "/schedules/schedule-" in url:
                    part = url.split("schedule-")[1].split("-")[0]
                    schedules_found.add(part)
                elif "/parts/part-" in url:
                    parts_found.add(url.split("part-")[1].replace("/", ""))
    except:
        pass

print(f"✅ Found {len(articles_found)} unique Articles.")
print(f"✅ Found {len(schedules_found)} Schedules.")
print(f"✅ Found {len(parts_found)} Parts.")

# Check for gaps in 1-395
missing = []
for i in range(1, 396):
    if str(i) not in articles_found:
        # Check if it's a repealed one or just missing
        missing.append(i)

if len(missing) > 300:
    print("❌ MAJOR GAP: Missing over 300 articles.")
elif len(missing) > 0:
    print(f"⚠️ Missing {len(missing)} articles: {missing[:10]}...")
else:
    print("✨ Full numeric coverage 1-395!")

# Metadata check
print(f"Total Files: {len(files)}")
