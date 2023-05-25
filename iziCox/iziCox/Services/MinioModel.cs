using Minio.DataModel;

namespace iziCox.Services
{

    public class GetObjectReply
    {
        public ObjectStat objectstat { get; set; }
        public byte[] data { get; set; }
    }

    public class PutObjectRequest
    {
        public string bucket { get; set; }
        public byte[] data { get; set; }
        public string fileName { get; set; }
    }

    public class MinioModel
    {
    }
    public enum UploadTypeList
    {
        avatar = 0,
        logo = 1,
        payment = 2,
        workflow = 3,

    }
    public class UploadRequest
    {
        public UploadTypeList type { get; set; }
        public byte[] data { get; set; }
    }
}
