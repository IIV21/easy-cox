using IronBarCode;
using iziCox.Services;
using Microsoft.AspNetCore.Mvc;

namespace iziCox.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly MinioObject _minio;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, MinioObject minio)
        {
            _logger = logger;
            _minio = minio;
        }
        /*
                [HttpGet(Name = "GetWeatherForecast")]
                public async Task<IEnumerable<CellDatabase>> Get()
                {
                    var randomString = RandomStringService.GenerateRandomString();
                    var image = QRCodeWriter.CreateQrCode(randomString, 500, QRCodeWriter.QrErrorCorrectionLevel.Medium).SaveAsImage("qrCode.png");
                    try
                    {
                        var url = await _minio.PutObj(new PutObjectRequest { bucket = "office-check-in", fileName = "qrCode.png" });
                    }
                    catch (Exception ex)
                    {
                        Console.Write(ex.ToString());
                    }

                }*/
    }
}