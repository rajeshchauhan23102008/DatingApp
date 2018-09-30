using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserRegistrationDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(8, MinimumLength=5, ErrorMessage="Password length should be between 5 to 8 character!!!")]
        public string Password { get; set; }
    }
}