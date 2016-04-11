using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

using IntFactory.Sdk;
namespace UnitTestIntFactory
{
    [TestClass]
    public class UnitTestTask
    {
        string userID = "BC6802E9-285C-471C-8172-3867C87803E2";
        string agentID = "9F8AF979-8A3B-4E23-B19C-AB8702988466";

        [TestMethod]
        public void GetTasks()
        {
            var result= TaskBusiness.BaseBusiness.GetTasks(new FilterTasks(),userID, agentID);
            Assert.IsTrue(result.error_code==0);
        }
    }
}
