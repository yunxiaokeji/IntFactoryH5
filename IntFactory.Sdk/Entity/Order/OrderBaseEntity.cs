using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IntFactory.Sdk
{
    public class OrderBaseEntity
    {
        public string orderID;

        /// <summary>
        /// 订单样图缩约图
        /// </summary>
        public string orderImage;

        /// <summary>
        /// 订单样图列表
        /// </summary>
        public string orderImages;

        /// <summary>
        /// 制版信息
        /// </summary>
        public string platemaking;

        /// <summary>
        /// 工艺说明
        /// </summary>
        public string plateRemark;

        /// <summary>
        /// 产品列表
        /// </summary>
        List<ProductBaseEntity> details;
    }
}
