import boto3
import pandas as pd
import io
from botocore import UNSIGNED
from botocore.config import Config

S3_BUCKET = "indian-supreme-court-judgments"
KEY = "metadata/parquet/year=2024/metadata.parquet"

def inspect_parquet():
    print(f"🛰️ Downloading {KEY} for inspection...")
    s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
    response = s3.get_object(Bucket=S3_BUCKET, Key=KEY)
    
    # Read into memory
    buffer = io.BytesIO(response['Body'].read())
    df = pd.read_parquet(buffer)
    
    print("\n✅ Columns found:")
    print(df.columns.tolist())
    
    print("\n✅ Sample Data (first row):")
    print(df.iloc[0].to_dict())

if __name__ == "__main__":
    inspect_parquet()
