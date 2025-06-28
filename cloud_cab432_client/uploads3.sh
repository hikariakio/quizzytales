#!/bin/bash

echo "📦 Uploading build/ to S3..."

BUCKET_NAME="yginnovatory.com"
S3_PATH="quizzytales"

aws s3 sync build/ s3://yginnovatory.com/quizzytales \
  --delete \
  --cache-control "max-age=31536000"


echo "✅ Done: https://$BUCKET_NAME.s3.amazonaws.com/$S3_PATH/index.html"
