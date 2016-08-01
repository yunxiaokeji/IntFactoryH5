﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IntFactory.Sdk.Entity.Common
{
    public class Attachment
    {
        public string AttachmentID { get; set; }

        public int Type { get; set; }

        public long Size { get; set; }

        public string ServerUrl { get; set; }

        public string FilePath { get; set; }

        public string FileName { get; set; }

        public string OriginalName { get; set; }

        public string ThumbnailName { get; set; }



    }
}
