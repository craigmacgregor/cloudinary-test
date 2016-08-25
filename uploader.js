/* eslint-disable */

//http://cloudinary.com/blog/direct_upload_made_easy_from_browser_or_mobile_app_to_the_cloud#face_detection_based_thumbnail

$(document).ready(function() {
  $.cloudinary.config({ cloud_name: 'db9ciclox', api_key: '728469243654512', upload_preset: 'wrpb3vol' });
  $('.upload_form').append($.cloudinary.unsigned_upload_tag("wrpb3vol", { cloud_name: 'db9ciclox' }));

  var _timeStart = 0;
  var _totalSize = 0;
  var _totalSent = 0;
  var _totalFinishedSending = 0;
  var _totalFailed = 0;
  var _totalReceived = 0;
  var _errors = [];

  $('.upload_form input').unsigned_cloudinary_upload("wrpb3vol", { cloud_name: 'db9ciclox', tags: 'browser_uploads' }, { multiple: true })
    .bind('fileuploadsend', function(e, data) {
      $('.initialise').removeClass('hidden');
      $('.log').removeClass('hidden');
      _totalSent++;
      if(!_timeStart) _timeStart = new Date().toString();
      $('.initialise .num-started').html(_totalSent);
    }).bind('fileuploadprogress', function(e, data) {
      $('.holding').addClass('hidden');
      $('.in-progress').removeClass('hidden');
      // console.log(data);
      var percentComplete = Math.round((data.loaded * 100.0) / data.total);
      var current = $(".in-progress div[data-file='" + data.files[0].name + "']");
      if (current.length === 0) {
        $(".in-progress").append('<div data-file="' + data.files[0].name + '"></div>');
        current = $(".in-progress div[data-file='" + data.files[0].name + "']");
      }
      if (percentComplete === 100) {
        if(!current.hasClass('hidden')){
          current.addClass('hidden');
          _totalFinishedSending++;
          $('.complete').removeClass('hidden');
          $('.complete .num-sent').html(_totalFinishedSending);
          var fileSize = Math.round(data.files[0].size / 1000) / 1000;
          $(".complete-items").append("<div>Uploaded: " + data.files[0].name + " (" + fileSize + "MB)</div>");
        }
      } else {
        current.html("Uploading: " + data.files[0].name + "... (" + percentComplete + "%)");
      }
    }).bind('fileuploadfail', function(e, data) {
      _totalFailed++;
      $('.failed').removeClass('hidden');
      $('.failed .num-failed').html(_totalFailed);
      var fileSize = Math.round(data.files[0].size / 1000) / 1000;

      var errorMessages = "";

      for (prop in data.messages) {
        if(data.messages.hasOwnProperty(prop)) {
          errorMessages += "<div class='error-text'>&nbsp;&nbsp;error: " + data.messages[prop] + "</div>";
        }
      }

      console.log('error data', data)
      console.log('error response', data.response())

      var response = data.response();

      _errors.push({
        fileName: data.files[0].name,
        fileSize: fileSize + " (MB)",
        bitrate: data.bitrate,
        status: data.textStatus,
        errorMessage: response.jqXHR.responseJSON.error.message,
        response: data.errorThrown,
        messages: data.messages,
      })

      $(".failed").append("<div>Failed: " + data.files[0].name + " (" + fileSize + "MB)</div>");
      $(".failed").append(errorMessages);

    }).bind('cloudinarydone', function(e, data) {
      console.log('cloudinarydone', data);
      $('.received').removeClass('hidden');
      if(data.files) {
        var fileSize = Math.round(data.files[0].size / 1000) / 1000;
        _totalReceived++;
        _totalSize += fileSize;
        // " files (" + Math.round(_totalSize * 1000) / 1000 + "MB)"
        $(".received").append("<div>Received: " + data.files[0].name + " (" + fileSize + "MB)</div>");
        $('.received .num-received').html(_totalReceived);

      }
    });

    $("a.download-log").on('click', function() {
      console.log("LOG");
      var now = new Date().toString();

      var logOutput = "Log Created: " + now + "\n";
      logOutput += "Upload Started: " + _timeStart + "\n";
      logOutput += "Total Dispatched: " + _totalSent + "\n";
      logOutput += "Total Finished Sending:" + _totalFinishedSending + "\n";
      logOutput += "Total Received by Cloudinary: " + _totalReceived + "\n";
      logOutput += "Total Failed: " + _totalFailed + "\n\n";
      logOutput += "Errors: \n";
      logOutput += "--------------------------------------------------------\n";

      for (var i = 0; i < _errors.length; i++) {
        logOutput += createBlock(_errors[i], 1);
        logOutput += "--------------------------------------------------------\n";
      }

      this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(logOutput);
    });

    function createBlock(obj, depth) {
      var returnData = "";
      for (prop in obj) {
        if(obj.hasOwnProperty(prop)) {
          if(typeof obj[prop] === 'object'){
            returnData += indent(depth);
            returnData += prop + ":\n";
            returnData += createBlock(obj[prop], depth + 1);
          } else {
            returnData += indent(depth);
            returnData += prop + ": " + obj[prop] + "\n";
          }
        }
      }
      return returnData;
    }

    function indent(depth) {
      var returnData = "";
      if (depth > 1) {
        for (var i = 0; i < depth; i++) {
          returnData += '-';
        }
        returnData += ' ';
      }
      return returnData;
    }

});

/* eslint-enable */
