using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IntFactory.Sdk
{
    [Serializable]
    public class UserBase
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        public string userID;

        /// <summary>
        /// 
        /// </summary>
        public string clientID;

        /// <summary>
        /// 用户名称
        /// </summary>
        public string name;

        public string companyName;

        /// <summary>
        /// 用户头像
        /// </summary>
        public string avatar;
    }
}
