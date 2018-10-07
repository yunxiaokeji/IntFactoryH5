using IntFactory.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IntFactoryH5Web.Controllers
{
    [IntFactoryH5Web.Common.UserAuthorize]
    public class CustomerController : BaseController
    {
        //
        // GET: /Customer/

        public ActionResult List()
        {
            ViewBag.UserName = CurrentUser.name;
            return View();
        }

        [HttpPost]
        public JsonResult GetCustomers(string filter)
        {
            var data = CustomerBusiness.BaseBusiness.GetCustomers(filter, CurrentUser.userID, CurrentUser.clientID);

            return new JsonResult
            {
                Data = data,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetCustomersByKeywords(string keywords)
        {
            var data = CustomerBusiness.BaseBusiness.GetCustomersByKeywords(keywords, CurrentUser.userID, CurrentUser.clientID);

            return new JsonResult
            {
                Data = data,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult GetCitys()
        {
            var data = CustomerBusiness.BaseBusiness.GetCitys(CurrentUser.userID, CurrentUser.clientID);

            return new JsonResult
            {
                Data = data,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        public JsonResult CreateCustomer(string entity)
        {
            var result = CustomerBusiness.BaseBusiness.CreateCustomer(entity, CurrentUser.userID, CurrentUser.clientID);

            return new JsonResult
            {
                Data = result,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

    }
}
