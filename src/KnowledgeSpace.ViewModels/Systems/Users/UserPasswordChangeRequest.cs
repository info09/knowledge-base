﻿namespace KnowledgeSpace.ViewModels.Systems.Users
{
    public class UserPasswordChangeRequest
    {
        public string UserId { get; set; }

        public string CurrentPassword { get; set; }

        public string NewPassword { get; set; }
    }
}
