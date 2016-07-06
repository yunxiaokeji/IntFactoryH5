using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace IntFactory.Sdk
{
    public class AttachmentEntity
    {
        public string AttachmentID { get; set; }

        public string Guid { get; set; }

        public int Type { get; set; }

        public long Size { get; set; }

        public string ServerUrl { get; set; }

        public string FilePath { get; set; }

        public string FileName { get; set; }

        public string OriginalName { get; set; }


    }
}
