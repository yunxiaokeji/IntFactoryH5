define(function (require, exports, module) {

    var Upload = require("upload");

    function init() {
        var uploader = Upload.uploader({
            browse_button: 'btn-attachment',
            container: 'attachment-body',
            drop_element: 'attachment-body',
            file_path: "/Content/UploadFiles/Task/",
            picture_container: "pic-list",
            file_container: "doc-list",
            maxQuantity: 5,
            maxSize: 5,
            successItems: '.file li',
            image_view: "?imageView2/1/w/120/h/80",
            fileType: 1,
            init: {
            }
        });
    }

    module.exports={init:init};
});