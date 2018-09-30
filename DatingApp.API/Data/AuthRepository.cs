using System;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _dbcontext;

        public AuthRepository(DataContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<bool> IsUserNameExists(string username)
        {
            return await _dbcontext.Users.AnyAsync(u => u.Username == username);
        }

        public async Task<User> Login(string username, string password)
        {
            var user = await _dbcontext.Users
                            .FirstOrDefaultAsync(u => u.Username == username);

            var passwordHash = ComputePasswordHash(password, user.PasswordSalt);

            for (int i = 0; i < passwordHash.Length; i++)
            {
                if (passwordHash[i] != user.PasswordHash[i]) return null;
            }

            return user;
        }

        public User Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;

            GeneratePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _dbcontext.Users.Add(user);
            _dbcontext.SaveChanges();

            return user;
        }

        private void GeneratePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private byte[] ComputePasswordHash(string password, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                return hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}