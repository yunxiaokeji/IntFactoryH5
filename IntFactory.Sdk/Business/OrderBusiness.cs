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

        public string GetOrders(string filter, string userID, string clientID)
        {
            var paras = new Dictionary<string, object>();
            paras.Add("filter", filter);
            paras.Add("userID", userID);
            paras.Add("clientID", clientID);

            return HttpRequest.RequestServer(ApiOption.GetOrders, paras,RequestType.Post);
        }

        public string GetOrderTotalCount(int searchOrderType, string userID, string clientID)
        {
            var paras = new Dictionary<string, object>();
            paras.Add("searchOrderType", searchOrderType);
            paras.Add("userID", userID);
            paras.Add("clientID", clientID);

            return HttpRequest.RequestServer(ApiOption.GetOrderTotalCount, paras, RequestType.Get);
        }

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

        public string GetOrderGoods(string orderID,string userID,string clientID)
        {
            var paras = new Dictionary<string, object>();
            paras.Add("orderID", orderID);
            paras.Add("userID", userID);
            paras.Add("clientID", clientID);

            return HttpRequest.RequestServer(ApiOption.GetOrderGoods, paras);
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

        //获取订单材料列表
        public string GetOrderDetailsByOrderID(string orderID, string userID)
        {
            var paras = new Dictionary<string, object>();
            paras.Add("orderID", orderID);
            paras.Add("userID", userID);

            return HttpRequest.RequestServer(ApiOption.GetOrderDetailsByOrderID, paras);
        }
    }
}
