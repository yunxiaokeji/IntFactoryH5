using IntFactory.Sdk;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IntFactoryH5Web.Controllers
{
    [IntFactoryH5Web.Common.UserAuthorize]
    public class PassportController : BaseController
    {
        //
        // GET: /Passport/

        public ActionResult Index()
        {
            ViewBag.UserName = CurrentUser.name;
            ViewBag.CompanyName = CurrentUser.companyName;
            return View();
        }

        public string GetPassportInfo() {
            return JsonConvert.SerializeObject((UserBase)Session["ClientManager"]);
        }
    }
}
