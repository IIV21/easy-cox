using IronBarCode;
using iziCox.Dto;
using iziCox.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Security.Cryptography.X509Certificates;

namespace iziCox.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CellController : ControllerBase
    {
        private readonly MinioObject _minio;
        public CellController(MinioObject minio)
        {
            _minio = minio;
        }

        [HttpGet("cellId")]
        public async Task<IActionResult> GetCells(int cellId)
        {
            //function to assign qr codes to cell
            string url = "";
            var fileName = "qrCode" + cellId + ".png";
            if (cellId > 3 || cellId < 0)
            {
                return BadRequest("cellId must be 1,2, or 3");
            }
            //generate qr based on random string
            var randomString = RandomStringService.GenerateRandomString();
            var image = QRCodeWriter.CreateQrCode(randomString, 500, QRCodeWriter.QrErrorCorrectionLevel.Medium).SaveAsImage(fileName);
            try
            {
                url = await _minio.PutObj(new PutObjectRequest { bucket = "office-check-in", fileName = fileName });
            }
            catch (Exception ex)
            {
                Console.Write(ex.ToString());
            }
            var cellImage = await _minio.GetObject("office-check-in", url + ".png");
            var cellData = new GenerateQrForCell() { CellId = cellId, QrImage = cellImage.data, QrCode = randomString };

            //setting the cells qr code value
            CellDatabase.cells[cellId].QrCodeValue = randomString;
            CellDatabase.cells[cellId].HasObject = true;

            return Ok(cellData);
        }

        [HttpGet]
        public async Task<IActionResult> OpenCellByQrCodeScan()
        {
            var client = new HttpClient();

            using HttpResponseMessage response = await client.GetAsync(new Uri("http://localhost:5001/scan"));

            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync();

            var cell = CellDatabase.cells.FirstOrDefault(x => x.QrCodeValue == jsonResponse);
            if (cell is not null)
            {
                var cellResponse = new Cell() { CellId = cell.CellId, QrCodeValue = cell.QrCodeValue };
                cell.HasObject = false;
                cell.QrCodeValue = "";
                return Ok(cellResponse);
            }
            return BadRequest("Cell not found");
        }
        [HttpGet("code")]
        public async Task<IActionResult> OpenCellByCode(string code)
        {
            var cell = CellDatabase.cells.FirstOrDefault(x => x.QrCodeValue == code);
            if (cell is not null)
            {
                var cellResponse = new Cell() { CellId = cell.CellId, QrCodeValue = cell.QrCodeValue };
                cell.HasObject = false;
                cell.QrCodeValue = "";
                return Ok(cellResponse);
            }
            return BadRequest("Cell not found");
        }
        [HttpGet("cellId")]
        public async Task<IActionResult> CloseCellById(int cellId)
        {
            var cell = CellDatabase.cells.FirstOrDefault(x => x.CellId == cellId);
            if (cell is not null)
            {
                return Ok($"cell {cellId} closed");
            }
            return BadRequest("Cell not found");
        }

        [HttpGet]
        public async Task<IActionResult> GetCellStatuses()
        {
            return Ok(CellDatabase.cells.Select(x => x.HasObject));
        }
    }
}
