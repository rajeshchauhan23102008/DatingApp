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

    [ServiceFilter(typeof(UserActivityLog))]
    [Route("api/users/{userId}/[controller]")]
    [Authorize]
    [ApiController]
    public class MessagesController : ControllerBase
    {

        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        // SendMessage.
        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageForCreationDto)
        {
            var sender = await _repo.GetUser(userId);
            if (sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            // Check recipient user exists or not.
            // var recipient = await _repo.GetUser(messageForCreationDto.RecipientId);
            // if (recipient == null)
            if (await _repo.GetUser(messageForCreationDto.RecipientId) == null)
                return BadRequest("Recipient User does not exists!!!");

            messageForCreationDto.SenderId = sender.Id;

            // Dto and Model Mapping.
            var message = _mapper.Map<Message>(messageForCreationDto);

            _repo.Add<Message>(message);

            if (await _repo.SaveAll())
            {
                var messageToReturnDto = _mapper.Map<MessageToReturnDto>(message);
                return CreatedAtRoute("GetMessage", new { messageId = message.Id }, messageToReturnDto);
            }

            return BadRequest("Unable to Send Message to Recipient!!!");
        }

        // GetMessage.
        [HttpGet("{messageId}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int messageId)
        {
            // var sender = await _repo.GetUser(userId);

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var message = await _repo.GetMessage(messageId);

            if (message == null)
                return NotFound();

            var messageToReturn = _mapper.Map<MessageToReturnDto>(message);

            return Ok(messageToReturn);
        }


        // GetMessages.
        [HttpGet]
        public async Task<IActionResult> GetMessages(int userId, [FromQuery]MessageParams messageParams)
        {

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            messageParams.UserId = userId;

            var pagedListMessage = await _repo.GetMessages(messageParams);

            Response.AddPagination(pagedListMessage.PageNumber, pagedListMessage.PageSize, pagedListMessage.TotalPages, pagedListMessage.ItemCount);

            var messagesToReturn = _mapper.Map<IEnumerable<MessageToReturnDto>>(pagedListMessage);

            return Ok(messagesToReturn);

        }


        // GetMessageThread.
        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetUserMessageThread(int userId, int recipientId)
        {

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messages = await _repo.GetUserMessageThread(userId, recipientId);

            var messagesForReturn = _mapper.Map<IEnumerable<MessageToReturnDto>>(messages);

            return Ok(messagesForReturn);
        }
    }
}