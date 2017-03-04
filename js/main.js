$(document).ready(function(){
    $('#modal').hide();
    $('.layer-modal').hide();
})

var form = $('#js-add-recipe');
var formButton = $('#js-add-recipe').find('button');

// creating recipe object
class Recipe {
    constructor(title, preparation, rating) {
        this.title = title;
        this.preparation = preparation;
        this.rating = rating;
    }
}



$(formButton).on('click', function(e){
    e.preventDefault()
    let nameRecipe = $('#recipe-name').val();
    let descRecipe = $('#recipe-desc').val();
    let starsRecipe= $('#recipe-stars').val();

    let myRecipe = new Recipe(nameRecipe, descRecipe, starsRecipe)

    let container = $('<article class="recipe"></div>')

    $(container).append('<h2>' + myRecipe.title + '</h2><p>'+ myRecipe.preparation +'</p>')

    $('#recipes').append(container)
    closeModal()

})




// var myRecipes = (function() {
//         var json = null;
//         $.ajax({
//             'async': false,
//             'global': false,
//             'url': "/js/myRecipes.json",
//             'dataType': "json",
//             'success': function (data) {
//                 json = data;
//             }
//         });
//         return json;
//     })();

//opening modal
$('#add').on('click', function(){
    openModal()
})

// closing modal
$('#close-button').on('click', function(){
    closeModal()
})

function closeModal(){
    $('#modal').fadeOut();
    $('.layer-modal').delay(100).fadeOut(function(){
        $(form).find('input').each(function(index, field){
            $(field).val('');
        })
    });

}

function openModal(){
    $('#modal').delay(100).fadeIn();
    $('.layer-modal').fadeIn();
}

var stars = $('.stars');

//console.log(myRecipes);
