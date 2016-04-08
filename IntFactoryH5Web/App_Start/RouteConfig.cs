using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace IntFactoryH5Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
<<<<<<< HEAD
                defaults: new { controller = "Task", action = "List", id = UrlParameter.Optional }
=======
                defaults: new { controller = "Task", action = "Detail", id = UrlParameter.Optional }
>>>>>>> 9e789c5914dfb1cdd1841c4c4baf5eaa730d0182
            );
        }
    }
}