using System.Collections.Generic;
using DatingApp.API.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _dbcontext;

        public DatingRepository(DataContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public void Add<T>(T entity) where T : class
        {
            _dbcontext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _dbcontext.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _dbcontext.Users
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _dbcontext.Users.Include(u => u.Photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _dbcontext.SaveChangesAsync() > 0;
        }
    }
}