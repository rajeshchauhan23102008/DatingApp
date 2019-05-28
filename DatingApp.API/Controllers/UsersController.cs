using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    [ServiceFilter(typeof(UserActivityLog))]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _datingRepo;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository datingRepo, IMapper mapper)
        {
            _datingRepo = datingRepo;
            _mapper = mapper;
        }

        [HttpPost("{id}/Like/{recepientid}")]
        public async Task<IActionResult> SendLike(int id, int recepientId)
        {
            // User is Authorize to do this operation.
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            // User already liked this RecepientUser.
            if (await _datingRepo.GetLike(id, recepientId) != null)
                return BadRequest("You have already like this user");

            // Recepient User exists or not.
            if (await _datingRepo.GetUser(recepientId) == null)
                return NotFound();

            // Add Like in Repository.
            var newLike = new Like
            {
                LikerId = id,
                LikeeId = recepientId
            };

            _datingRepo.Add<Like>(newLike);

            if (await _datingRepo.SaveAll())
                return Ok();

            return BadRequest("Failed to like this user");
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _datingRepo.GetUser(id);

            var userForDetailedDto = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userForDetailedDto);
        }

        [HttpGet("")]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            userParams.userId = userId;

            var user = await _datingRepo.GetUser(userId);

            if (String.IsNullOrWhiteSpace(userParams.gender))
            {
                userParams.gender = user.Gender == "male" ? "female" : "male";
            }

            //var users = await _datingRepo.GetUsers();
            var users = await _datingRepo.GetUsers(userParams);

            // Create Pagination Header.
            Response.AddPagination(users.PageNumber, users.PageSize, users.TotalPages, users.ItemCount);

            var usersForListDto = _mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersForListDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            //Get user detail from GerUser Repo based on userid.
            var userFromRepo = await _datingRepo.GetUser(id);

            //Map UpdateUserDto with User.
            _mapper.Map(userForUpdateDto, userFromRepo);

            //Save Changes & Return UpdateUser Result.
            if (await _datingRepo.SaveAll())
                return NoContent();

            throw new Exception($"user {id} updation failed!!!");
        }
    }
}