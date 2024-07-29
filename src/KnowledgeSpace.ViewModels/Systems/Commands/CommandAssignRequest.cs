namespace KnowledgeSpace.ViewModels.Systems.Commands
{
    public class CommandAssignRequest
    {
        public string[] CommandIds { get; set; }

        public bool AddToAllFunctions { get; set; }
    }
}
