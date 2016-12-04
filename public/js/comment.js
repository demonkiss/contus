$(function(){
    $('.comment').click(function(e){
        var target = $(this);
        var toId = target.attr('data-toid');
        var commentId = target.attr('data-commentid');
        $('<input>').attr({
            type: 'hidden',
            name: 'comment[toId]',
            value: toId
        }).appendTo('#commentForm');
        $('<input>').attr({
            type: 'hidden',
            name: 'comment[commentId]',
            value: commentId
        }).appendTo('#commentForm');

    });
});
