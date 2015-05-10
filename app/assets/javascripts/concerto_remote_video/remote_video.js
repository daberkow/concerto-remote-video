var initializedRemoteVideoHandlers = false;
function initializeRemoteVideoHandlers() {
  if (!initializedRemoteVideoHandlers) {

    function getVideoPreview() {
      var preview_url = '/concerto-remote-video/preview';

      // Form video details
      var video_id = $('input#remote_video_config_video_id').val();
      var video_vendor = $('select#remote_video_config_video_vendor').val();
      var allow_flash = $('input#remote_video_config_allow_flash').val();
      var name = $('input#remote_video_name').val();
      var duration = $('input#remote_video_duration').val();

      // Loading icon
      $(preview_div).empty().html('<i class=\"ficon-spinner icon-spin\"></i> searching...');
      $('.remote-video-info').empty();
      // Video preview request
      $.ajax({
        type: 'POST',
        url: preview_url,
        data: { 
          video_id: video_id,
          video_vendor: video_vendor,
          allow_flash: allow_flash,
          name: name,
          duration: duration
        },
        success: function(data) {
          loadVideoInfo(data);
          loadVideoPreview(data);
        },
        error: function(e) {
          loadVideoPreview(undefined);
        }
      });
    }

    function loadVideoInfo(data) {
      var info_el = $('.remote-video-info');

      if (data['video_vendor'] == "HTTPVideo") {
        $(info_el).empty();
        return;
      }
      else if (data['video_vendor'] == "YouTube") {
        var description = '<p></p>'
      }
      else if (data['video_vendor'] == "Vimeo") {
        var description = '<p>' + data['description'] + '</p>';
      } 

      // Load video info 
      var info = '<img src="'+data['thumb_url']+'"/></h4><i>' + data['duration'] + ' secs</i><br/>' + description; 
      $(info_el).empty().html(info);
    }

    function loadVideoPreview(data) {
      var preview_el = $('#preview_div');
      if (data != undefined) {
        $(preview_div).empty().html(data['preview_code']);
      } else {
        $(preview_div).empty().html("<p>Unable to generate preview.</p>");
      }
    }

    function updateTooltip() {
      var vendor = $('select#remote_video_config_video_vendor').val();
      if (vendor == 'YouTube') {
        $('input#remote_video_config_video_id').attr("placeholder", "DGbqvYbPZBY");
        $('div#video_id_hint').html('Specify the video id or keywords');
      } else if (vendor == 'Vimeo') {
        $('input#remote_video_config_video_id').attr("placeholder", "4224811");
        $('div#video_id_hint').html('Specify the exact vimeo video id');
      } else if (vendor == 'HTTPVideo') {
        $('input#remote_video_config_video_id').attr("placeholder", "http://media.w3.org/2010/05/sintel/trailer.mp4");
        $('div#video_id_hint').html('Specify the url of the video');
      }
    }

    $('input#remote_video_config_video_id').on('blur', getVideoPreview);
    $('select#remote_video_config_video_vendor').on('change', getVideoPreview);
    $('select#remote_video_config_video_vendor').on('change', updateTooltip);

    initializedRemoteVideoHandlers = true;
  }
}

$(document).ready(initializeRemoteVideoHandlers);
$(document).on('page:change', initializeRemoteVideoHandlers);