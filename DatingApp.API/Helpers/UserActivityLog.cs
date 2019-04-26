using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;


namespace DatingApp.API.Helpers
{

    public class UserActivityLog : IAsyncActionFilter
    {

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {

            // get the context.
            var executionContext = await next();

            // get user id from claims or token.

            var userId = int.Parse(executionContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // get repository service.

            var repo = executionContext.HttpContext.RequestServices.GetService<IDatingRepository>();

            // fetch user from repository.

            var user = await repo.GetUser(userId);

            // update user lastActive date.
            user.LastActive = DateTime.Now;

            // save user lastActive data in db.

            await repo.SaveAll();

        }

    }
}