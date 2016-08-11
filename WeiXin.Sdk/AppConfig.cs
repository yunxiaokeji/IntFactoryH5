using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace WeiXin.Sdk
{
    public class AppConfig
    {
        public static string WeiXinMPApiUrl = ConfigurationManager.AppSettings["WeiXinMPApiUrl"] ?? "https://api.weixin.qq.com";
        public static string WeiXinMPAppKey = ConfigurationManager.AppSettings["WeiXinMPAppKey"] ?? "wxa69a4127f24be469";
        public static string WeiXinMPAppSecret = ConfigurationManager.AppSettings["WeiXinMPAppSecret"] ?? "28e5342f879a312ff666f0e3b23f6a78";
        public static string WeiXinMPCallBackUrl = ConfigurationManager.AppSettings["WeiXinMPCallBackUrl"] ?? "localhost:9999/Home/WeiXinMPCallBack";
    }
}
