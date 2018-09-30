using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;

        public AuthController(IAuthRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationDto userForRegisterDto)
        {
            // if (! ModelState.IsValid)
            //     return BadRequest(ModelState);

            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            // Check Username already exists or not.

            if( await _repo.IsUserNameExists(userForRegisterDto.Username))
                return BadRequest($"Username {userForRegisterDto.Username} Already Exists");

            // Map UI data to domain model.
            var userToCreate = new User{
                Username = userForRegisterDto.Username        
            };  

            // Call repository to Register User.
            var createdUser =_repo.Register(userToCreate, userForRegisterDto.Password);

            // Send Output.

            return Ok(createdUser);
        }
    }
}