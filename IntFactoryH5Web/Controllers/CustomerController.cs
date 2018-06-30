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
    }
}
