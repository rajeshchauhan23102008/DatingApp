using System.Collections.Generic;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        private readonly DataContext _dbContext;

        public Seed(DataContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void SeedUserData()
        {
            var usersdata = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<User>>(usersdata);

            //Insert Users into DB using EF DbContext.
            foreach (var user in users)
            {
                //Create User PasswordHash and PasswordSalt.
                byte[] passwordHash, passwordSalt;

                GeneratePasswordHash("password", out passwordHash, out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.Username = user.Username.Trim().ToLower();

                _dbContext.Users.Add(user);
            }

            _dbContext.SaveChanges();
        }

        private void GeneratePasswordHash(string password, out byte[] passwordHash,
                    out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}