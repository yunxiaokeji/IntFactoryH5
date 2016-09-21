
/*基础配置*/
seajs.config({
    base: "/modules/",
    paths: {
       
    },
    alias: {
        "jquery": "/Scripts/jquery-1.11.1.js",
        "global": "scripts/global.js",
        //HTML模板引擎
        "dot": "plug/doT.js",
    },
    map: [
        //可配置版本号
        ['.css', '.css?v=20160921'],
        ['.js', '.js?v=20160921']
    ]
});

seajs.config({
    alias: {
        //上传
        //"upload": "plug/upload/upload.js",
        "upload": "plug/qiniustorage/qiniu/qiniu.js"
    }
});



