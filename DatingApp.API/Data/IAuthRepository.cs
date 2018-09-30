using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IAuthRepository
    {
        User Register(User user, string password);

        Task<User> Login(string username, string password);

        Task<bool> IsUserNameExists(string username);
    }
}