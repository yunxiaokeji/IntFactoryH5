using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IntFactory.Sdk
{
    public class TaskMember
    {
        public int AutoID { get; set; }

        public string MemberID { get; set; }

        public UserBase Member{ get; set; }

        public string TaskID { get; set; }

        public int Status { get; set; }

        public int PermissionType { get; set; }

        public string CreateUserID { get; set; }

        public DateTime CreateTime { get; set; }
    }
}
