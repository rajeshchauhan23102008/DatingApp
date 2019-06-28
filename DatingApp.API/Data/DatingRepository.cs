using System.Collections.Generic;
using DatingApp.API.Models;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DatingApp.API.Helpers;
using System;

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
            var users = _dbcontext.Users.Include(u => u.Photos).OrderByDescending(u => u.LastActive).AsQueryable();

            /* Implements filters */

            // exclude logged in user record.
            users = users.Where(u => u.Id != userParams.userId);

            // gender filtering.
            users = users.Where(u => u.Gender == userParams.gender);

            // likers filtering.
            if (userParams.likers)
            {
                var userLikers = await GetUserLikes(userParams.userId, true);
                users = users.Where(u => userLikers.Contains(u.Id));
                // users = users.Where(u => userLikers.Any(l => l == u.Id));
            }

            // likees filtering.
            if (userParams.likees)
            {
                var userLikees = await GetUserLikes(userParams.userId, false);
                users = users.Where(u => userLikees.Contains(u.Id));
                // users = users.Where(u => userLikees.Any(l => l == u.Id));
            }

            // Min and Max Age Filtering.
            if (userParams.minAge >= 18 && userParams.maxAge <= 99)
            {
                var minDOB = DateTime.Today.AddYears(-userParams.maxAge - 1);
                var maxDOB = DateTime.Today.AddYears(-userParams.minAge);

                users = users.Where(u => u.DateOfBirth >= minDOB && u.DateOfBirth <= maxDOB);
            }

            if (!String.IsNullOrWhiteSpace(userParams.orderBy))
            {
                switch (userParams.orderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            var userPagedList = await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);

            return userPagedList;
        }

        public async Task<Like> GetLike(int id, int recepientId)
        {
            return await _dbcontext.Likes
                .Where(l => l.LikerId == id && l.LikeeId == recepientId)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _dbcontext.Users
                .Include(u => u.Likers)
                .Include(u => u.Likees)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (likers)
                return user.Likees.Select(l => l.LikerId);
            else
                return user.Likers.Select(l => l.LikeeId);

        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _dbcontext.Photos.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Photo> GetUserMainPhoto(int userid)
        {
            return await _dbcontext.Photos.FirstOrDefaultAsync(p => p.UserId == userid && p.IsMain == true);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _dbcontext.Messages
                .Include(m => m.Sender).ThenInclude(u => u.Photos)
                .Include(m => m.Recipient).ThenInclude(u => u.Photos)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessages(MessageParams messageParams)
        {

            var messages = _dbcontext.Messages
                                .Where( m=> m.SenderDeleted == false || m.RecipientDeleted == false)
                                .Include(m => m.Sender).ThenInclude(u => u.Photos)
                                .Include(m => m.Recipient).ThenInclude(u => u.Photos)
                                .AsQueryable();

            switch (messageParams.MessageType)
            {
                case "inbox":
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && m.RecipientDeleted == false);
                    break;
                case "outbox":
                    messages = messages.Where(m => m.SenderId == messageParams.UserId && m.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(m => m.RecipientId == messageParams.UserId && m.RecipientDeleted == false && m.IsRead == false);
                    break;
            }

            messages = messages.OrderByDescending(m => m.MessageSent);

            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);

        }

        public async Task<IEnumerable<Message>> GetUserMessageThread(int userId, int recipientId)
        {

            return await _dbcontext.Messages
                            .Include(m => m.Sender).ThenInclude(u => u.Photos)
                            .Include(m => m.Recipient).ThenInclude(u => u.Photos)
                            .Where(m => m.SenderId == userId && m.RecipientId == recipientId && m.SenderDeleted == false
                                   || m.RecipientId == userId && m.SenderId == recipientId && m.RecipientDeleted == false)
                            .OrderByDescending(m => m.MessageSent)
                            .ToListAsync();

        }

        public async Task<bool> SaveAll()
        {
            return await _dbcontext.SaveChangesAsync() > 0;
        }
    }
}