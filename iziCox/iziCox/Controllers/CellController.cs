using iziCox.Dto;
using iziCox.Services;
using Microsoft.AspNetCore.Mvc;

namespace iziCox.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CellController : ControllerBase
    {
        public CellController()
        {
        }

        [HttpGet("cellId")]
        public async Task<IActionResult> GetCells(int cellId)
        {
            //function to assign qr codes to cell
            if (cellId > 3 || cellId < 0)
            {
                return BadRequest("cellId must be 1,2, or 3");
            }
            //generate qr based on random string
            var randomString = RandomStringService.GenerateRandomString();



            var client = new HttpClient();

            var request = new HttpRequestMessage()
            {
                RequestUri = new Uri($"http://localhost:5001/create?data={randomString}"),
                Method = HttpMethod.Post,
            };
            var response = await client.SendAsync(request);

            var responseString = await response.Content.ReadAsStringAsync();

            // To read the response as json
            var cellByteArray = await response.Content.ReadAsByteArrayAsync();
            var currentDirectory = Directory.GetCurrentDirectory();
            var fileName = $"qrCode{cellId}.png";
            var path = Path.Join(currentDirectory, fileName);
            System.IO.File.WriteAllBytes(path, cellByteArray);


            //setting the cells qr code value
            CellDatabase.cells[cellId].QrCodeValue = randomString;
            CellDatabase.cells[cellId].HasObject = true;

            var cellData = new GenerateQrForCell() { CellId = cellId, QrImage = cellByteArray, QrCode = randomString };


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
