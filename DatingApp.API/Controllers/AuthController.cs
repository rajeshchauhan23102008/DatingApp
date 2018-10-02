using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;

        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _repo = repo;
            _config = config;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            var user = await _repo.Login(userLoginDto.Username.ToLower()
                                    ,userLoginDto.Password.ToLower());

            if(user != null)
            {
                //Generate and Send JWT Token to Client.        
                var claims = new[] {
                    new Claim(type: ClaimTypes.NameIdentifier, value:user.Id.ToString()),
                    new Claim(type:ClaimTypes.Name, value:user.Username)
                };

                var key = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token")
                    .Value));

                var creds = new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

                var tokenDescriptor = new SecurityTokenDescriptor{
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddDays(1),
                    SigningCredentials = creds
                };

                var tokenHandler = new JwtSecurityTokenHandler();

                var token = tokenHandler.CreateJwtSecurityToken(tokenDescriptor);

                return Ok(new {
                    token = tokenHandler.WriteToken(token)
                });
            }

            return Unauthorized();            
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

            return StatusCode(201);
        }
    }

   
}