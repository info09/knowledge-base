using System.Linq;
using System.Security.Claims;

namespace KnowledgeSpace.BackendServer.Extensions
{
    public static class IdentityExtensions
    {
        public static string GetUserId(this ClaimsPrincipal principal)
        {
            var claim = ((ClaimsIdentity)principal.Identity)
                .Claims
                .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier);

            return claim == null ? null : claim.Value;
        }
    }
}
