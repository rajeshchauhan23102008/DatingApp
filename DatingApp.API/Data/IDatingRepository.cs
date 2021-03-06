using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;

        Task<User> GetUser(int id);
        Task<PagedList<User>> GetUsers(UserParams userParams);

        Task<Photo> GetPhoto(int id);
        Task<bool> SaveAll();

        Task<Photo> GetUserMainPhoto(int userid);

        Task<Like> GetLike(int id, int recepientId);

        Task<Message> GetMessage(int id);

        Task <PagedList<Message>> GetMessages(MessageParams messageParams);
        Task <IEnumerable<Message>> GetUserMessageThread(int userId, int recipientId);

    }
}