using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IntFactoryH5Web.Controllers
{
    public class BaseController : Controller
    {
        //
        // GET: /Base/

        public ActionResult Index()
        {
            return View();
        }
        public Dictionary<string, object> JsonDictionary = new Dictionary<string, object>();

    }
}
