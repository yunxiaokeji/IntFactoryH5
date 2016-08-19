using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IntFactory.Sdk
{
    [Serializable]
    public class FilterTasks
    {
        /// <summary>
        /// 关键字
        /// </summary>
        public string keyWords = string.Empty;

        /// <summary>
        /// 1:我的任务；2：参与任务；-1：所有任务
        /// </summary>
        public int filtertype = 1;

        /// <summary>
        /// 负责人ID
        /// </summary>
        public string userID = string.Empty;

        /// <summary>
        /// 任务类型
        /// </summary>
        public int taskType = -1;

        /// <summary>
        /// 颜色标记 
        /// </summary>
        public int colorMark = -1;

        /// <summary>
        /// 任务进行状态
        /// </summary>
        public int finishStatus = -1;

        /// <summary>
        /// 任务创建起始时间
        /// </summary>
        public string beginDate = string.Empty;

        /// <summary>
        /// 任务创建的截止时间
        /// </summary>
        public string endDate = string.Empty;

        /// <summary>
        /// 订单类型
        /// </summary>
        public int orderType = -1;

        /// <summary>
        /// 排序列 0:创建时间；1：到期时间
        /// </summary>
        public int taskOrderColumn = 0;

        /// <summary>
        /// 是否升序 0：降序；1：升序
        /// </summary>
        public int isAsc = 0;

        /// <summary>
        /// 页数
        /// </summary>
        public int pageSize = 10;

        /// <summary>
        /// 页码
        /// </summary>
        public int pageIndex = 1;

    }
}