import os
import boto3
import pandas as pd
import io
from botocore import UNSIGNED
from botocore.config import Config
from pathlib import Path

# CONFIG
S3_BUCKET = "indian-supreme-court-judgments"
START_YEAR = 1990
END_YEAR = 2025
TARGET_DIR = Path("./data/sc_metadata")
TARGET_DIR.mkdir(parents=True, exist_ok=True)

def download_sc_metadata():
    print(f"🛰️ Connecting to S3 Bucket: {S3_BUCKET}...")
    s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
    
    total_cases = 0
    for year in range(START_YEAR, END_YEAR + 1):
        file_key = f"metadata/parquet/year={year}/metadata.parquet"
        
        try:
            print(f"📥 Fetching metadata parquet for {year}...")
            response = s3.get_object(Bucket=S3_BUCKET, Key=file_key)
            buffer = io.BytesIO(response['Body'].read())
            df = pd.read_parquet(buffer)
            
            # Create a "searchable" version for RAG (Markdown)
            searchable_file = TARGET_DIR / f"sc_{year}_searchable.md"
            with open(searchable_file, "w", encoding="utf-8") as f:
                f.write(f"# Supreme Court Judgments Index - {year}\n\n")
                
                for _, row in df.iterrows():
                    title = row.get('title', 'Unknown Case')
                    date = row.get('decision_date', 'N/A')
                    citation = row.get('citation', 'N/A')
                    case_id = row.get('case_id', 'N/A')
                    petitioner = row.get('petitioner', 'N/A')
                    respondent = row.get('respondent', 'N/A')
                    
                    # Construct search-friendly block
                    f.write(f"### {title}\n")
                    f.write(f"- **Date**: {date}\n")
                    f.write(f"- **Parties**: {petitioner} vs {respondent}\n")
                    f.write(f"- **Identification**: Case ID: {case_id} | Citation: {citation}\n")
                    f.write(f"- **Summary**: This is a Supreme Court of India judgment delivered on {date}. Use the Title or Case ID to request a full-text fetch if research depth is required.\n\n")
            
            count = len(df)
            total_cases += count
            print(f"   ✅ Saved {count} case headers for {year}.")
            
        except s3.exceptions.NoSuchKey:
            print(f"   ⚠️ No parquet found for {year}. Skipping.")
        except Exception as e:
            print(f"   ❌ Error fetching {year}: {str(e)}")

    print(f"\n✨ Phase 1 Complete! Indexed headers for {total_cases} cases.")
    print(f"📂 Searchable metadata saved to {TARGET_DIR}")

if __name__ == "__main__":
    download_sc_metadata()
