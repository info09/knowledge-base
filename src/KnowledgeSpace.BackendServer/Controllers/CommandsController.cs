using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.ViewModels.Systems.Commands;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeSpace.BackendServer.Controllers
{
    public class CommandsController : BasesController
    {
        private readonly ApplicationDbContext _context;

        public CommandsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCommands()
        {
            var commands = _context.Commands;
            var commandVm = await commands.Select(i => new CommandVm()
            {
                Id = i.Id,
                Name = i.Name,
            }).ToListAsync();

            return Ok(commandVm);
        }
    }
}
