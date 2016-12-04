$(function(){
    $('.del').click(function(e){
        var target = $(e.target);
        var id = target.attr('data-id');
        var tr = $('.item-id-'+id);

        $.ajax({
            type: 'DELETE',
            url: '/admin/product/delete?id=' + id
        })
        .done(function(result){
                console.log(result);
                if(result.success == 1){
                    if(tr){
                        tr.remove();
                    }
                }
            });
    });
});
