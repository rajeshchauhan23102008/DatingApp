using System.Collections.Generic;
using DatingApp.API.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DatingApp.API.Helpers;

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

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            //var users = await _dbcontext.Users.Include(u => u.Photos).ToListAsync();
            var users = _dbcontext.Users.Include(u => u.Photos);

            var userPagedList = await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);

            return userPagedList;
        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _dbcontext.Photos.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Photo> GetUserMainPhoto(int userid)
        {
            return await _dbcontext.Photos.FirstOrDefaultAsync(p => p.UserId == userid && p.IsMain == true);
        }
        public async Task<bool> SaveAll()
        {
            return await _dbcontext.SaveChangesAsync() > 0;
        }
    }
}