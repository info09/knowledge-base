using System.Collections.Generic;

namespace KnowledgeSpace.ViewModels.Systems.Permissions
{
    public class UpdatePermissionRequest
    {
        public List<PermissionVm> Permissions { get; set; } = new List<PermissionVm>();
    }
}
