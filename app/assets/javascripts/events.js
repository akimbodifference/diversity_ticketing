$(function() {
  $('.directUpload').find("input:file").each(function(i, elem) {
    var fileInput    = $(elem);
    var form         = $(fileInput.parents('form:first'));
    var submitButton = form.find('input[type="submit"]');
    var progressBar  = $("<div class='bar'></div>");
    var barContainer = $("<div class='progress'></div>").append(progressBar);
    fileInput.after(barContainer);
    fileInput.fileupload({
      fileInput:       fileInput,
      url:             form.data('url'),
      type:            'POST',
      autoUpload:       true,
      formData:         form.data('form-data'),
      paramName:        'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
      dataType:         'XML',  // S3 returns XML if success_action_status is set to 201
      replaceFileInput: false,
      progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        progressBar.css('width', progress + '%')
      },
      start: function (e) {
        submitButton.prop('disabled', true);

        progressBar.
          css('background', '#E7E8E9').
          css('display', 'block').
          css('width', '0%').
          text("Loading...");
      },
      done: function(e, data) {
        submitButton.prop('disabled', false);
        progressBar.text("Uploading done")
          .css('background', '#66be66')
          .addClass('image-flash');

        // extract key and generate URL from response
        var key   = $(data.jqXHR.responseXML).find("Key").text();
        var url   = '//' + form.data('host') + '/' + key;

        // update hidden field
        $("input[type=hidden][name = '"+fileInput.attr('name')+"']").val(url);
        $(".event-logo img").replaceWith('<img src='+url+'>');
      },
      fail: function(e, data) {
        submitButton.prop('disabled', false);
        console.log(e);
        console.table(data);
        progressBar.
          css("background", "#c43e3d").
          addClass("image-flash-error").
          text("Failed");
      },
      
      disableImageResize: false,
      imageMaxWidth: 800,
      imageMaxHeight: 800,
      imageCrop: false
    });
  });
});
