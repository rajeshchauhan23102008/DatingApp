using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{

    [Authorize]
    [ApiController]
    [Route("api/users/{userid}/photos")]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _userDatingRepo;
        private readonly IOptions<CloudinarySettings> _cloudinarySettings;
        private readonly IMapper _mapper;
        private readonly Cloudinary _cloudinary;

        public PhotosController(IDatingRepository userDatingRepo, IOptions<CloudinarySettings> cloudinarySettings, IMapper mapper)
        {
            _userDatingRepo = userDatingRepo;
            _cloudinarySettings = cloudinarySettings;
            _mapper = mapper;

            //setup cloudinary API config values like api key, secret and cloudname.
            Account account = new Account(
                _cloudinarySettings.Value.CloudName,
                _cloudinarySettings.Value.ApiKey,
                _cloudinarySettings.Value.ApiSecret);

            _cloudinary = new Cloudinary(account);

        }

        [HttpGet("{id}",Name="GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id){
            /* 
            Route user(RouteAtCreated) to HTTPGet Controller to send the Uploaded Phota details along with HTTP Location Header details that points to the PhotoURL on Cloudinary Server.

              - Create new HTTPGET method that fetch newly Uploaded photo details from DB based on PhotoID property.
              - Send PhotoDto to user from HTTPGET Method.
              - Redirect User from HTTPPOST(PhotoUpload) method to HTTPGET(Get Photo) method. This needed 3 inputs: HTTPGET RouteName, RouteValue(in this case it is PhotoURL) and RouteObject(PhotoDTO).

             */

            //Fetch Photo detail from DB based on photoId.
            var photo = await _userDatingRepo.GetPhoto(id);

            //Map Photo Entity Model to PhotoDto Model.
            var photoForReturnDto = _mapper.Map<PhotoForReturnDto>(photo);

            return Ok(photoForReturnDto);

        }

        [HttpPost]
        public async Task<IActionResult> UploadUserPhoto(int userid, [FromForm]PhotoForCreationDto photoForCreationDto)
        {

            // Hell lot of work need to be done in this API Method. :(

            //Validation Check: Identify the userid passed in URL route matches with the userid stored in Token.
            if (userid != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            //Fetch user data from DB.
            var userForRepo = await _userDatingRepo.GetUser(userid);

            /* 
            Upload Photo to Cloudinary.

                - read photo file sent by user(via Dto class) into memorystream.
                - setup cloudinanry input values like file, api config values.
                - setup cloudinary input with tranformation values like photo width, height, crop, gravity(for facedetection).
                - call cloudinary imageUpload method to upload image.
                - receive response from cloudinary in the response variable.
                - use responseVariable to get required values like PhotoURL, publicId and do rest of work for this controller.
             */


            // read photo file sent by user(via Dto class) into memorystream.

            var file = photoForCreationDto.File;

            if (file == null || file.Length == 0)
                return BadRequest();

            var uploadResult = new ImageUploadResult();

            using (var stream = file.OpenReadStream())
            {
                // setup cloudinanry input values like file, api config values.
                // setup cloudinary input with tranformation values like photo width, height, crop, gravity(for facedetection).


                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(file.Name, stream),
                    Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                };

                // - call cloudinary imageUpload method to upload image.
                // - receive response from cloudinary in the response variable.

                uploadResult = _cloudinary.Upload(uploadParams);

            }

            if (uploadResult.Length <= 0)
                return StatusCode(Convert.ToInt16(HttpStatusCode.InternalServerError));


            /*
            Save Photo Data in DB.

               - build PhotoDto with the response from CloudinaryService.
               - build entity model from PhotoDto.
               - save data in DB.
             */

            // build PhotoDto with the response from CloudinaryService.

            photoForCreationDto.DateAdded = DateTime.Now;
            photoForCreationDto.PublicId = uploadResult.PublicId;
            photoForCreationDto.Url = uploadResult.Uri.ToString();
            
            // build entity model from PhotoDto.
            var photoForRepo = _mapper.Map<Photo>(photoForCreationDto);

            //Set the uplaoded photo as the main photo if user has no main photos.
            if (!userForRepo.Photos.Any(p => p.IsMain))
                photoForRepo.IsMain = true;

            // save data in DB.

            userForRepo.Photos.Add(photoForRepo);

            if (await _userDatingRepo.SaveAll())
            {
                var photoForReturnDto = _mapper.Map<PhotoForReturnDto>(photoForRepo);

                return CreatedAtRoute("GetPhoto", new { id = photoForRepo.Id }, photoForReturnDto);
            }

            return BadRequest("Something went wrong, Photo Upload failed!!!");

            /* 
            Route user(RouteAtCreated) to HTTPGet Controller to send the Uploaded Phota details along with HTTP Location Header details that points to the PhotoURL on Cloudinary Server.

              - Create new HTTPGET method that fetch newly Uploaded photo details from DB based on PhotoID property.
              - Send PhotoDto to user from HTTPGET Method.
              - Redirect User from HTTPPOST(PhotoUpload) method to HTTPGET(Get Photo) method. This needed 3 inputs: HTTPGET RouteName, RouteValue(in this case it is PhotoURL) and RouteObject(PhotoDTO).

             */

        }




    }
}