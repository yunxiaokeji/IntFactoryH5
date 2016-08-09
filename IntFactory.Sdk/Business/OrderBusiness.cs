using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
namespace IntFactory.Sdk
{
    public class OrderBusiness
    {
        public static OrderBusiness BaseBusiness = new OrderBusiness();

        public string GetGoodsDocByOrderID(string orderID, int type, string taskID,string userID, string clientID)
        {
            var paras = new Dictionary<string, object>();
            paras.Add("orderID", orderID);
            paras.Add("type", type);
            paras.Add("taskID", taskID);
            paras.Add("userID", userID);
            paras.Add("clientID", clientID);

            return HttpRequest.RequestServer(ApiOption.GetGoodsDocByOrderID, paras);
        }

        public string GetOrderCosts(string orderID, string userID, string clientID)
        {
            var paras = new Dictionary<string, object>();
            paras.Add("orderID", orderID);
            paras.Add("userID", userID);
            paras.Add("clientID", clientID);

            return HttpRequest.RequestServer(ApiOption.GetOrderCosts, paras);
        }

        //获取工艺说明
        public string GetPlateMakings(string orderID, string userID, string clientID)
        {
            var paras = new Dictionary<string, object>();
            paras.Add("orderID", orderID);
            paras.Add("userID", userID);
            paras.Add("clientID", clientID);

            return HttpRequest.RequestServer(ApiOption.GetPlateMakings, paras);
        }
    }
}
