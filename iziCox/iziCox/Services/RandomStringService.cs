using System;

namespace iziCox.Services
{
    public static class RandomStringService
    {
        private static Random random = new Random();

        public static string GenerateRandomString()
        {
            {
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                return new string(Enumerable.Repeat(chars, 6)
                    .Select(s => s[random.Next(s.Length)]).ToArray());
            }
        }
    }
}
