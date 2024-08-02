using KnowledgeSpace.BackendServer.Authorization;
using KnowledgeSpace.BackendServer.Constants;
using KnowledgeSpace.BackendServer.Data;
using KnowledgeSpace.BackendServer.Data.Entities;
using KnowledgeSpace.BackendServer.Helpers;
using KnowledgeSpace.ViewModels;
using KnowledgeSpace.ViewModels.Systems.Permissions;
using KnowledgeSpace.ViewModels.Systems.Roles;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace KnowledgeSpace.BackendServer.Controllers
{
    public class RolesController : BasesController
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ApplicationDbContext _context;

        public RolesController(RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            _roleManager = roleManager;
            _context = context;
        }

        [HttpGet]
        [ClaimRequirement(FunctionCode.SYSTEM_ROLE, CommandCode.VIEW)]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleManager.Roles.Select(i => new RoleVm() { Id = i.Id, Name = i.Name }).ToListAsync();

            return Ok(roles);
        }

        [HttpGet("filter")]
        [ClaimRequirement(FunctionCode.SYSTEM_ROLE, CommandCode.VIEW)]
        public async Task<IActionResult> GetRoles(string filter, int pageIndex, int pageSize)
        {
            var query = _roleManager.Roles;
            if (!string.IsNullOrEmpty(filter))
            {
                query = query.Where(x => x.Id.Contains(filter) || x.Name.Contains(filter));
            }
            var totalRecords = await query.CountAsync();
            var items = await query.Skip((pageIndex - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new RoleVm()
                {
                    Id = r.Id,
                    Name = r.Name
                })
                .ToListAsync();

            var pagination = new Pagination<RoleVm>
            {
                Items = items,
                TotalRecords = totalRecords,
            };
            return Ok(pagination);
        }

        [HttpGet("{id}")]
        [ClaimRequirement(FunctionCode.SYSTEM_ROLE, CommandCode.VIEW)]
        public async Task<IActionResult> GetById(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
                return NotFound(new ApiNotFoundResponse($"Cannot found role with id: {id}"));

            var roleVm = new RoleVm()
            {
                Id = role.Id,
                Name = role.Name,
            };
            return Ok(roleVm);
        }

        [HttpPut("{id}")]
        [ClaimRequirement(FunctionCode.SYSTEM_ROLE, CommandCode.UPDATE)]
        [ApiValidationFilter]
        public async Task<IActionResult> PutRole(string id, [FromBody] RoleCreateRequest roleVm)
        {
            if (id != roleVm.Id)
                return BadRequest(new ApiBadRequestResponse("Role id not match"));

            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
                return NotFound();

            role.Name = roleVm.Name;
            role.NormalizedName = roleVm.Name.ToUpper();

            var result = await _roleManager.UpdateAsync(role);

            if (result.Succeeded)
            {
                return NoContent();
            }
            return BadRequest(new ApiBadRequestResponse(result));
        }

        //URL: DELETE: http://localhost:5001/api/roles/{id}
        [HttpDelete("{id}")]
        [ClaimRequirement(FunctionCode.SYSTEM_ROLE, CommandCode.DELETE)]
        public async Task<IActionResult> DeleteRole(string id)
        {
            var role = await _roleManager.FindByIdAsync(id);
            if (role == null)
                return NotFound(new ApiNotFoundResponse($"Cannot found role with id: {id}"));

            var result = await _roleManager.DeleteAsync(role);

            if (result.Succeeded)
            {
                var rolevm = new RoleVm()
                {
                    Id = role.Id,
                    Name = role.Name
                };
                return Ok(rolevm);
            }
            return BadRequest(new ApiBadRequestResponse(result));
        }

        [HttpPost]
        [ClaimRequirement(FunctionCode.SYSTEM_ROLE, CommandCode.CREATE)]
        [ApiValidationFilter]
        public async Task<IActionResult> PostRole(RoleCreateRequest request)
        {
            var role = new IdentityRole()
            {
                Id = request.Id,
                Name = request.Name,
                NormalizedName = request.Name.ToUpper()
            };
            var result = await _roleManager.CreateAsync(role);
            if (result.Succeeded)
            {
                return CreatedAtAction(nameof(GetById), new { id = role.Id }, request);
            }
            else
            {
                return BadRequest(new ApiBadRequestResponse(result));
            }
        }

        [HttpGet("{roleId}/permissions")]
        [ClaimRequirement(FunctionCode.SYSTEM_ROLE, CommandCode.VIEW)]
        public async Task<IActionResult> GetPermissionByRoleId(string roleId)
        {
            var permissions = from p in _context.Permissions
                              join c in _context.Commands on p.CommandId equals c.Id
                              where p.RoleId == roleId
                              select new PermissionVm()
                              {
                                  RoleId = roleId,
                                  CommandId = p.CommandId,
                                  FunctionId = p.FunctionId,
                              };

            return Ok(await permissions.ToListAsync());
        }

        [HttpPut("{roleId}/permissions")]
        [ClaimRequirement(FunctionCode.SYSTEM_ROLE, CommandCode.UPDATE)]
        public async Task<IActionResult> PutPermissionByRoleId(string roleId, [FromBody] UpdatePermissionRequest request)
        {
            try
            {
                var newPermissions = new List<Permission>();
                foreach (var p in request.Permissions)
                {
                    newPermissions.Add(new Permission(p.FunctionId, roleId, p.CommandId));
                }

                var existingPermission = _context.Permissions.Where(i => i.RoleId == roleId);
                _context.Permissions.RemoveRange(existingPermission);
                var result = await _context.SaveChangesAsync();
                _context.Permissions.AddRange(newPermissions.Distinct(new MyPermissionComparer()));
                var result1 = await _context.SaveChangesAsync();
                if (result1 > 1)
                {
                    return NoContent();
                }
                return BadRequest(new ApiBadRequestResponse("Save permission failed"));
            }
            catch (Exception ex)
            {

                throw;
            }
            
        }
    }

    internal class MyPermissionComparer : IEqualityComparer<Permission>
    {
        // Items are equal if their ids are equal.
        public bool Equals(Permission x, Permission y)
        {
            // Check whether the compared objects reference the same data.
            if (Object.ReferenceEquals(x, y)) return true;

            // Check whether any of the compared objects is null.
            if (Object.ReferenceEquals(x, null) || Object.ReferenceEquals(y, null))
                return false;

            //Check whether the items properties are equal.
            return x.CommandId == y.CommandId && x.FunctionId == x.FunctionId && x.RoleId == x.RoleId;
        }

        // If Equals() returns true for a pair of objects
        // then GetHashCode() must return the same value for these objects.

        public int GetHashCode(Permission permission)
        {
            //Check whether the object is null
            if (Object.ReferenceEquals(permission, null)) return 0;

            //Get hash code for the ID field.
            int hashProductId = (permission.CommandId + permission.FunctionId + permission.RoleId).GetHashCode();

            return hashProductId;
        }
    }
}
