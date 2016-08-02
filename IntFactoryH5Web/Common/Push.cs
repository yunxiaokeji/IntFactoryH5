using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace IntFactoryH5Web.Common
{
    public class Push
    {
            private string AppId;
            private string AppKey;
            private string UrlBase;
            public Push(string AppId, string AppKey, string UrlBase = "https://p.apicloud.com/api/push")
            {
                this.AppId = AppId;
                this.AppKey = AppKey;
                this.UrlBase = UrlBase;
            }
            private string X_APICloud_AppKey
            {
                get
                {
                    long amp = (long)(DateTime.Now - new DateTime(1970, 01, 01)).TotalMilliseconds;

                    String value = String.Format("{0}UZ{1}UZ{2}", AppId, AppKey, amp);

                    byte[] buffer = SHA1.Create().ComputeHash(Encoding.UTF8.GetBytes(value));

                    StringBuilder builder = new StringBuilder();

                    foreach (byte num in buffer)
                    {
                        builder.AppendFormat("{0:x2}", num);
                    }
                    return builder.ToString() + "." + amp;
                }
            }

            public string Message(string jsonStr)
            {
                var Url = UrlBase + "/message";
                byte[] Data = System.Text.Encoding.GetEncoding("UTF-8").GetBytes(jsonStr);
                return Ajax(Url, Data, "POST");
            }
            //public string Message(Object body)
            //{
            //    var obj = JToken.FromObject(body) as JObject;
            //    var Url = UrlBase + "/message";
            //    byte[] Data = System.Text.Encoding.GetEncoding("UTF-8").GetBytes(obj.ToString());
            //    return Ajax(Url, Data, "POST");
            //}
            private string Ajax(string url, byte[] data, string method)
            {
                try
                {
                    WebClient webClient = new WebClient();
                    webClient.Headers.Add("X-APICloud-AppId", AppId);
                    webClient.Headers.Add("X-APICloud-AppKey", X_APICloud_AppKey);
                    webClient.Headers.Add("Content-type", "application/json;charset=UTF-8");
                    string ResponseData;
                    if (data != null)
                    {
                        var responseData = webClient.UploadData(url, method, data);
                        ResponseData = System.Text.Encoding.GetEncoding("UTF-8").GetString(responseData);
                    }
                    else
                    {
                        ResponseData = webClient.DownloadString(url);
                    }

                    return ResponseData;
                }
                catch (WebException e)
                {
                    return "{ \"Error\":{ \"msg\": \"" + e.Message + "\"}}";
                }
            }
        }
}