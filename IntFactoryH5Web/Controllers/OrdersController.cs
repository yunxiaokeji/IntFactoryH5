using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using IntFactory.Sdk;
namespace IntFactoryH5Web.Controllers
{
     [IntFactoryH5Web.Common.UserAuthorize]
    public class OrdersController : BaseController
    {
        //
        // GET: /Order/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult List()
        {
            ViewBag.UserName = CurrentUser.name;
            return View();
        }

        #region
         [HttpPost]
        public JsonResult GetOrders(string filter)
        {
            var data = OrderBusiness.BaseBusiness.GetOrders(filter, CurrentUser.userID, CurrentUser.clientID);

            return new JsonResult
            {
                Data = data,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

         public JsonResult GetOrderTotalCount(int searchOrderType)
         {
             var data = OrderBusiness.BaseBusiness.GetOrderTotalCount(searchOrderType, CurrentUser.userID, CurrentUser.clientID);

             return new JsonResult
             {
                 Data = data,
                 JsonRequestBehavior = JsonRequestBehavior.AllowGet
             };
         }

        public JsonResult GetGoodsDocByOrderID(string orderID, int type, string taskID)
        {
            var list = OrderBusiness.BaseBusiness.GetGoodsDocByOrderID(orderID, type, taskID, CurrentUser.userID, CurrentUser.clientID);

            return new JsonResult
            {
                Data = list,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetOrderCosts(string orderid)
        {
            var list = OrderBusiness.BaseBusiness.GetOrderCosts(orderid, CurrentUser.userID, CurrentUser.clientID);

            return new JsonResult
            {
                Data = list,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        //获取工艺说明
        public JsonResult GetPlateMakings(string orderID)
        {
            var list = OrderBusiness.BaseBusiness.GetPlateMakings(orderID, CurrentUser.userID, CurrentUser.clientID);

            return new JsonResult
            {
                Data = list,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        //获取订单材料列表
        public JsonResult GetOrderDetailsByOrderID(string orderID)
        {
            var list = OrderBusiness.BaseBusiness.GetOrderDetailsByOrderID(orderID, CurrentUser.userID);

            return new JsonResult
            {
                Data = list,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetOrderGoods(string orderID)
        {
            var result = OrderBusiness.BaseBusiness.GetOrderGoods(orderID, CurrentUser.userID, CurrentUser.clientID);
            return new JsonResult
            {
                Data = result,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }


        public JsonResult CreateOrderGoodsDoc(string orderID, string taskID, int docType, int isOver,
                string details, string remark, string ownerID, string expressID = "", string expressCode = "")
        {
            string result = TaskBusiness.BaseBusiness.CreateOrderGoodsDoc(orderID, taskID, docType, isOver, details, remark, ownerID, CurrentUser.userID, CurrentUser.clientID, expressID, expressCode);
            return new JsonResult
            {
                Data = result,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        #endregion
    }
}
