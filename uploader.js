/* eslint-disable */

//http://cloudinary.com/blog/direct_upload_made_easy_from_browser_or_mobile_app_to_the_cloud#face_detection_based_thumbnail

$(document).ready(function() {
  $.cloudinary.config({ cloud_name: 'db9ciclox', api_key: '728469243654512', upload_preset: 'wrpb3vol' });
  $('.upload_form').append($.cloudinary.unsigned_upload_tag("wrpb3vol", { cloud_name: 'db9ciclox' }));

  var _timeStart;
  var _totalFiles = 0;
  var _totalSize = 0;

  $('.upload_form input').unsigned_cloudinary_upload("wrpb3vol", { cloud_name: 'db9ciclox', tags: 'browser_uploads' }, { multiple: true })
    .bind('cloudinarydone', function(e, data) {

      console.log(data.files[0].name);

      var fileSize = Math.round(data.files[0].size / 1000) / 1000;
      _totalFiles++;
      _totalSize += fileSize;
      $(".text").html("Status: DONE!");
      $(".log").append("<div>Uploaded: " + data.files[0].name + " (" + fileSize + "MB)</div>");
      $(".total").html("Total: " + _totalFiles + " files (" + Math.round(_totalSize * 1000) / 1000 + "MB)");

    }).bind('cloudinaryprogress', function(e, data) {
      $(".text").html("Status: UPLOADING...");
    });

});

/* eslint-enable */
