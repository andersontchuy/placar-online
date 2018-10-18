$(function() {
  function updateListVideo(data) {
    const $video = $('#admin-videos-wrapper')
          .append($('<div />').addClass('video w-col w-col-3')
            .append($('<div / >').addClass('video-container')
              .append($('<div />').addClass('w-embed w-video')
                .css('padding-top', '56.17021276595745%')
                  .append($('<iframe />').addClass('embedly-embed')
                    .attr({
                      'src': `https://www.youtube.com/embed/${data.video}`,
                      'frameborder': '0',
                      'allowfullscreen': 'allowfullscreen'
        })))));
    return $video;
  }

  function updateListBid(data) {
   const $bid = $('#admin-bids-wrapper')
          .prepend($('<div />').addClass('move w-row')
            .append($('<div />').addClass('w-col w-col-3')
              .append($('<div />').addClass('when')
                .append($('<span />').addClass('time-minutes')
                  .text(`${data.time}'`))
                .append($('<br />'))
                .append(`${data.half} tempo`)))
            .append($('<div />').addClass('w-col w-col-9')
                .append($('<div />').addClass('div-block')
                  .append($('<div />')
                    .append($('<br />'))
                    .append(data.team)
                    .append($('<br />'))
                    .append(data.subject)
                    .append($('<br />'))
                    .append(data.description)
                  )
                .append($('<div />').addClass('time-marker'))
        )));
    return $bid;
  }

  $('#update-score').click(function() {
    const scoreA = $('#score-a').val();
    const scoreB = $('#score-b').val();
    const notify = $('#score-notify:checked').val();
    $.post(`/admin/match/${MATCH_INDEX}/score`, { scoreA, scoreB,
       notify }, function(data) {
      console.log(data);
    });
    return false;
  });
  $('#video-new').click(function() {
      $.post(`/admin/match/${MATCH_INDEX}/videos`, {
        video: $('#video-id').val() 
      }, function(data) {
        updateListVideo(data);
        $('#video-id').val('');
    });
    return false;
  });
  $('#bid-new').click(function() {
    $.post(`/admin/match/${MATCH_INDEX}/bids`, {
      time: $('#bid-time').val(), 
      half: $('#bid-half').val(), 
      team: $('#bid-team').val(), 
      subject: $('#bid-subject').val(),
      description: $('#bid-description').val() 
    }, function(data) {
        updateListBid(data);
        $('#bid-time').val('');
        $('#bid-half').val(''); 
        $('#bid-team').val(''); 
        $('#bid-subject').val('');
        $('#bid-description').val(''); 
     }); 
     return false; 
  });
});
