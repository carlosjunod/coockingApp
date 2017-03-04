var myRecipes = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "/js/myRecipes.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();


$('#add').on('click', function(){
    $('#modal').delay(100).fadeIn();
    $('.layer-modal').fadeIn();
})

$('#close-button').on('click', function(){
    $(this).closest('#modal').fadeOut();
    $('.layer-modal').delay(100).fadeOut();
})

var stars = $('.stars');

console.log(myRecipes);
