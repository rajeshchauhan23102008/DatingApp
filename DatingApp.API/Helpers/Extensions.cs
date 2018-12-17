using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            response.Headers.Add("Application-Error", message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
        }
        
        public static int CalculateAge(this DateTime DateOfBirth) {
            var age = DateTime.Today.Year - DateOfBirth.Year;

            //Below logic is required to check if user birthday is arrived or not in the present year.
            if(DateOfBirth.AddYears(age) > DateTime.Today)
                age--;
            
            return age;
        }
    }
}