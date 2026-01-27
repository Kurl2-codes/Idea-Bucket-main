import boto3
from app.core.config import settings
import os

# Initialize S3 client using project settings
s3 = boto3.client(
    "s3",
    endpoint_url=settings.S3_ENDPOINT,
    aws_access_key_id=settings.S3_ACCESS_KEY,
    aws_secret_access_key=settings.S3_SECRET_KEY,
    region_name=settings.S3_REGION
)

bucket_name = settings.S3_BUCKET_NAME

print(f"Checking bucket: {bucket_name} for 'ideas/' folder...")

try:
    response = s3.list_objects_v2(Bucket=bucket_name, Prefix="ideas/")
    
    if 'Contents' in response:
        print("\nFound the following files in 'ideas/':")
        for obj in response['Contents']:
            print(f" - {obj['Key']} (Size: {obj['Size']} bytes)")
    else:
        print("\nNo files found in 'ideas/' folder yet.")
        
except Exception as e:
    print(f"Error accessing S3: {e}")
