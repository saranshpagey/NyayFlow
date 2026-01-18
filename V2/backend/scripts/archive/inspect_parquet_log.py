import boto3
import pandas as pd
import io
from botocore import UNSIGNED
from botocore.config import Config

S3_BUCKET = "indian-supreme-court-judgments"
KEY = "metadata/parquet/year=2024/metadata.parquet"

def inspect_parquet():
    s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
    response = s3.get_object(Bucket=S3_BUCKET, Key=KEY)
    buffer = io.BytesIO(response['Body'].read())
    df = pd.read_parquet(buffer)
    
    with open("parquet_schema.log", "w") as f:
        f.write("COLUMNS:\n")
        f.write(str(df.columns.tolist()) + "\n")
        f.write("\nSAMPLE:\n")
        f.write(str(df.iloc[0].to_dict()) + "\n")

if __name__ == "__main__":
    inspect_parquet()
