﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace IntFactory.Sdk
{
    public class AppConfig
    {
        public static string ApiUrl = System.Configuration.ConfigurationManager.AppSettings["ApiUrl"] ?? "http://dev.intfactory.cn";
        public static string AppKey = "f64bd98d-dc45-4d3b-891d-7601f4ee71b4";
        public static string AppSecret = "ff6a2c17-2937-4a21-a7f1-ae74c4836315";
        public static string CallBackUrl = "http://gyl.movedbuy.com";
    }
}
