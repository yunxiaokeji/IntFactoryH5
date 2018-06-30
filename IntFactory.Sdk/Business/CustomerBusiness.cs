﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
namespace IntFactory.Sdk
{
    public class CustomerBusiness
    {
        public static CustomerBusiness BaseBusiness = new CustomerBusiness();

        public string GetCustomers(string filter, string userID, string clientID)
        {
            var paras = new Dictionary<string, object>();
            paras.Add("filter", filter);
            paras.Add("userID", userID);
            paras.Add("clientID", clientID);

            return HttpRequest.RequestServer(ApiOption.GetCustomers, paras, RequestType.Post);
        }
    }
}
