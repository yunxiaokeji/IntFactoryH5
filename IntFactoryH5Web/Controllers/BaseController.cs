using IntFactory.Sdk;
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
        private UserBase _currentUser;
        public UserBase CurrentUser
        {
            set
            {
                _currentUser = value;
            }
            get 
            {
                if (Session["ClientManager"] != null)
                {
                    _currentUser = (UserBase)Session["ClientManager"];
                }

                return _currentUser;
            }
        }

        public Dictionary<string, object> JsonDictionary = new Dictionary<string, object>();

    }
}
