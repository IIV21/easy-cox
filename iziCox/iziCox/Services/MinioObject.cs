using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Minio;
using Minio.DataModel;
using System;

namespace iziCox.Services
{
    public class MinioObject
    {
        public static string endpoint = "localhost:9000";
        public static string accessKey = "1msuvB8k6jHC71T1";
        public static string secretKey = "LthSCAD9Q6JRl6F29SpJy52wyCOEu1x7";
        private MinioClient _minio;
        public MinioObject()
        {
            _minio = new MinioClient()
            .WithEndpoint(endpoint)
            .WithCredentials(accessKey,
            secretKey)
            .Build();
        }
        public async Task<string> PutObj(PutObjectRequest request)
        {
            var bucketName = "office-check-in";
            // Check Exists bucket
            bool found = await _minio.BucketExistsAsync(new BucketExistsArgs().WithBucket(bucketName));
            if (!found)
            {
                // if bucket not Exists,make bucket
                await _minio.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucketName));
            }
            var filename = Guid.NewGuid();
            // upload object
            var result = await _minio.PutObjectAsync(new PutObjectArgs()
            .WithBucket(bucketName).WithFileName(request.fileName).WithObject(filename.ToString() + ".png")
            .WithContentType("image/png")
            );
            return await Task.FromResult<string>(filename.ToString());
        }
        public async Task<GetObjectReply> GetObject(string bucket, string objectname)
        {
            bucket = "office-check-in";
            MemoryStream destination = new MemoryStream();
            // Check Exists object
            var objstatreply = await _minio.StatObjectAsync(new StatObjectArgs()
            .WithBucket(bucket)
            .WithObject(objectname)
            );
            if (objstatreply == null || objstatreply.DeleteMarker)
                throw new Exception("object not found or Deleted");
            // Get object
            var x = await _minio.GetObjectAsync(new GetObjectArgs()
            .WithBucket(bucket)
            .WithObject(objectname)
            .WithCallbackStream((stream) =>
            {
                stream.CopyTo(destination);
            }
            )
            );
            return await Task.FromResult<GetObjectReply>(new GetObjectReply()
            {
                data = destination.ToArray(),
                objectstat = objstatreply
            });
        }
    }
}
