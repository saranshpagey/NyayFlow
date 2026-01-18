import boto3
from botocore import UNSIGNED
from botocore.config import Config

S3_BUCKET = "indian-supreme-court-judgments"

def list_s3_root():
    s3 = boto3.client('s3', config=Config(signature_version=UNSIGNED))
    print(f"🔍 Listing root of bucket: {S3_BUCKET}")
    try:
        response = s3.list_objects_v2(Bucket=S3_BUCKET, MaxKeys=50)
        if 'Contents' in response:
            for obj in response['Contents']:
                print(f"  - {obj['Key']}")
        else:
            print("  ⚠️ No contents found or permission denied.")
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")

if __name__ == "__main__":
    list_s3_root()
