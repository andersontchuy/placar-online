const videoTemplate = Handlebars.compile($('#video-template').html());
const bidTemplate = Handlebars.compile($('#bid-template').html());

$(function() {
    const socket = io('', { query: { match: MATCH_INDEX}});
    socket.on('connect', function(){
        console.log('connected');
    })
    socket.on('score', function(score) {
        console.log('score', score);
        // atualiza na lista de jogos
        $(`.match-${score.match}-a`).html(score.scoreA);
        $(`.match-${score.match}-b`).html(score.scoreB);
        // atualiza no placar
        if(MATCH_INDEX == score.match) {
            $(`.score-team-a`).html(score.scoreA);
            $(`.score-team-b`).html(score.scoreB);
        }

        if(score.notify == '1') {
            console.log('notificar');
            $('#audio-gol')[0].currentTime = 0;
            $('#audio-gol')[0].play();
            // animação do gol
            $('.goooolllll').addClass('goooolllll-anim');
            $('.goooolllll-text').addClass('goooolllll-text-anim');
            $('.goooolllll-text').on('transitioEnd webkitTransitionEnd oTransitionEnd', function() {
                $('.goooolllll').removeClass('goooolllll-anim');
                $('.goooolllll-text').removeClass('goooolllll-text-anim');
            } )
        }
    })
    socket.on('supporters', function(supporters){
        console.log(supporters);
        $('.bar-team-a').css('width', `${supporters.teamA}%`);
        $('.bar-team-b').css('width', `${supporters.teamB}%`);
    });
    socket.on('video', function(video) {
        console.log(video);
        $('#videos-wrapper').append(videoTemplate({ video }));  
    });
    socket.on('bid', function(bid) {
        console.log(bid);
        $('#bids-wrapper').prepend(bidTemplate(bid));
    });
    $("#na-torcida-a").click(function(){
        $.post(`/match/${MATCH_INDEX}/supporters`, { team: 'a' }, function(data){})
        return false;
    });
    $("#na-torcida-b").click(function(){
        $.post(`/match/${MATCH_INDEX}/supporters`, { team: 'b' }, function(data){})
        return false;
    });
})
