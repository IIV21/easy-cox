namespace iziCox.Dto
{
    public class GenerateQrForCell
    {
        public int CellId { get; set; }
        public byte[] QrImage { get; set; }
        public string QrCode { get; set; }
    }
}
