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


        #region
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
        #endregion
    }
}
