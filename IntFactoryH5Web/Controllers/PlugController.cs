using Qiniu.RPC;
using Qiniu.RS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace IntFactoryH5Web.Controllers
{
    public class PlugController : Controller
    {
        //
        // GET: /Plug/

        public ActionResult Index()
        {
            return View();
        }
        protected Dictionary<string, object> JsonDictionary = new Dictionary<string, object>();

        public JsonResult GetToken()
        {
            //设置上传的空间
            String bucket = "zngc-intfactory";
            //普通上传,只需要设置上传的空间名就可以了,第二个参数可以设定token过期时间
            PutPolicy put = new PutPolicy(bucket, 3600);

            //调用Token()方法生成上传的Token
            string upToken = put.Token();
            JsonDictionary.Add("uptoken", upToken);

            return new JsonResult()
            {
                Data = JsonDictionary,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet
            };
        }

        //删除附件
        public int DeleteAttachment(string key)
        {
            String bucket = "zngc-intfactory";
            //实例化一个RSClient对象，用于操作BucketManager里面的方法
            RSClient client = new RSClient();
            CallRet ret = client.Delete(new EntryPath(bucket, key));

            return ret.OK ? 1 : 0;
        }
    }
}
