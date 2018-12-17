using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers {

    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _datingRepo;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository datingRepo, IMapper mapper)
        {
            _datingRepo = datingRepo;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id){
            var user = await _datingRepo.GetUser(id);

            var userForDetailedDto = _mapper.Map<UserForDetailedDto>(user);
            return Ok(userForDetailedDto);
        }

        [HttpGet("")]
        public async Task<IActionResult> GetUsers() {
            var users = await _datingRepo.GetUsers();

            var usersForListDto = _mapper.Map<IEnumerable<UserForListDto>>(users);
            return Ok(usersForListDto);
        }
    }
}