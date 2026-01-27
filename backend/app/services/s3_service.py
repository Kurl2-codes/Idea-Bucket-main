import boto3
from botocore.exceptions import NoCredentialsError
from app.core.config import settings

class S3Service:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY,
            endpoint_url=settings.S3_ENDPOINT,
            region_name=settings.S3_REGION
        )
        self.bucket_name = settings.S3_BUCKET_NAME

    def upload_file(self, file_obj, object_name):
        try:
            self.s3_client.upload_fileobj(file_obj, self.bucket_name, object_name)
            return f"{settings.S3_ENDPOINT}/{self.bucket_name}/{object_name}"
        except NoCredentialsError:
            print("Credentials not available")
            return None
        except Exception as e:
            print(f"Error uploading file: {e}")
            return None
            
    def upload_base64_image(self, base64_string: str, object_name: str) -> str:
        if not self.s3_client:
            print("S3 Client not initialized, skipping upload.")
            return None
            
        try:
            import base64
            from io import BytesIO
            
            # Remove header if present
            if "base64," in base64_string:
                base64_string = base64_string.split("base64,")[1]
                
            file_data = base64.b64decode(base64_string)
            file_obj = BytesIO(file_data)
            
            self.s3_client.upload_fileobj(file_obj, self.bucket_name, object_name)
            
            # Return Proxy URL so frontend can load it even if bucket is private
            # API_URL usually 8000. 
            # We will create an endpoint /api/v1/images/{filename}
            return f"/api/v1/images/{object_name}"
        except Exception as e:
            print(f"Error uploading base64: {e}")
            return None

    def generate_presigned_url(self, object_name, expiration=3600):
        try:
            response = self.s3_client.generate_presigned_url('get_object',
                                                             Params={'Bucket': self.bucket_name,
                                                                     'Key': object_name},
                                                             ExpiresIn=expiration)
            return response
        except Exception as e:
            print(f"Error generating url: {e}")
            return None

    def download_file(self, object_name):
        try:
            from io import BytesIO
            file_obj = BytesIO()
            self.s3_client.download_fileobj(self.bucket_name, object_name, file_obj)
            file_obj.seek(0)
            return file_obj
        except Exception as e:
            print(f"Error downloading file: {e}")
            return None

s3_service = S3Service()
