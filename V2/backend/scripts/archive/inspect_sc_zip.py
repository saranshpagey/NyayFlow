import boto3
import io
import zipfile
from botocore import UNSIGNED
from botocore.config import Config

S3_BUCKET = "indian-supreme-court-judgments"
KEY = "data/zip/year=2024/english.zip"

def list_zip_contents():
    print(f"🛰️ Inspecting zip: {KEY}...")
    s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
    response = s3.get_object(Bucket=S3_BUCKET, Key=KEY)
    
    # Read the whole thing into memory (it's 146MB, which is fine)
    zip_data = io.BytesIO(response['Body'].read())
    with zipfile.ZipFile(zip_data) as z:
        files = z.namelist()
        print(f"✅ Found {len(files)} files.")
        print("🔍 First 10 files:")
        for f in files[:10]:
            print(f"  - {f}")

if __name__ == "__main__":
    list_zip_contents()
