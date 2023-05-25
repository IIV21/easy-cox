using iziCox.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minio.DataModel;
using Minio;
using System;

namespace iziCox.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MinioController : ControllerBase
    {

        private readonly ILogger<MinioController> _logger;
        private readonly MinioObject _minio;
        public MinioController(ILogger<MinioController> logger, MinioObject minio)
        {
            _logger = logger;
            _minio = minio;
        }
        [HttpGet]
        public async Task<ActionResult> Get(string objectname, UploadTypeList bucket)
        {
            var result = await _minio.GetObject(bucket.ToString(), objectname);
            return File(result.data, result.objectstat.ContentType);
        }
        [HttpPost]
        public async Task<ActionResult> Post(UploadRequest request)
        {
            var result = await _minio.PutObj(new Services.PutObjectRequest()
            {
                bucket = request.type.ToString(),
                data = request.data
            });
            return Ok(new { filename = result });
        }

    }
}
