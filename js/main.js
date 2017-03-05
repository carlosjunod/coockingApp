'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(function () {
    $('#modal').hide();
    $('.layer-modal').hide();

    var form = $('#js-add-recipe');
    var addNewRecipe = $('#js-add-recipe').find('#add-recipe');
    var editRecipe = $('#js-add-recipe').find('#edit');
    var localRecipes = [];

    // creating recipe object

    var Recipe = function Recipe(img, title, description, rating) {
        _classCallCheck(this, Recipe);

        this.img = img;
        this.title = title;
        this.description = description;
        this.rating = rating;
    };

    // Parsing JSON


    var dataRecipes = function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "js/recipes.json",
            'dataType': "json",
            'success': function success(data) {
                json = data;
            }
        });
        return json;
    }();

    // converting Json Objecst into JS Objects
    $.each(dataRecipes, function (index, recipes) {
        $.each(recipes, function (index, recipe) {
            // console.log(recipe.title);
            var myRecipe = new Recipe(recipe.image, recipe.title, recipe.description, recipe.rating);
            toDOM(myRecipe);
        });
    });

    // restoring from local
    // restoreLocal()


    // click event to Create and add a new recipe
    $(addNewRecipe).on('click', function (e) {
        e.preventDefault();
        var nameRecipe = $('#recipe-name').val();
        var descRecipe = $('#recipe-desc').val();
        var starsRecipe = $('#recipe-stars').val();
        var imgRecipe = $('#recipe-img').val();

        var myRecipe = new Recipe(imgRecipe, nameRecipe, descRecipe, starsRecipe);

        toDOM(myRecipe);
        localRecipes.push(myRecipe);
    });

    //opening modal
    $('#add').on('click', function () {
        openModal();
    });

    // closing modal
    $('#close-button').on('click', function () {
        closeModal();
    });

    function openModal() {
        var recipe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;


        if (recipe != null) {
            //removing event from the button edit
            $(editRecipe).off();

            //creating variables from the previous data
            var imgRecipe = $(recipe).find('img').attr('src');
            var nameRecipe = $(recipe).find('h2').text();
            var descRecipe = $(recipe).find('p').text();
            var starsRecipe = $(recipe).find('.fa-star').length;

            //populating fields on the modal
            $('#modal').find('#recipe-img').val(imgRecipe);
            $('#modal').find('#recipe-name').val(nameRecipe);
            $('#modal').find('#recipe-desc').val(descRecipe);
            $('#modal').find('#recipe-stars').val(starsRecipe);

            // display buttons
            $('#modal').find('h3').text('Edit Recipe');
            $('#modal').find('#add-recipe').hide();
            $('#modal').find('#edit').show();

            //editing
            $(editRecipe).on('click', function (e) {
                e.preventDefault();
                $(recipe).find('img').attr('src', $('#recipe-img').val());
                $(recipe).find('h2').text($('#recipe-name').val());
                $(recipe).find('p').text($('#recipe-desc').val());

                closeModal();
            });
        } else {
            // display buttons
            $('#modal').find('#add-recipe').show();
            $('#modal').find('#edit').hide();
        }

        //display modal
        $('#modal').delay(100).fadeIn();
        $('.layer-modal').fadeIn();
    }

    function closeModal() {
        $('#modal').fadeOut();
        $('.layer-modal').delay(100).fadeOut(function () {
            $(form).find('input').each(function (index, field) {
                $(field).val('');
            });
        });
    }

    // print objects into the DOM
    function toDOM(newRecip) {
        var container = $('<article class="recipe"></article>');
        var rating = getRating(newRecip.rating).html();

        $(container).append('\n            <img src="' + newRecip.img + '" alt=\'' + newRecip.title + '\'/>\n            <h2>' + newRecip.title + '</h2>\n            <p>' + newRecip.description.substr(0, 100) + '</p>\n            <ul class="rating-tools">\n                <li class="stars">\n                ' + rating + '\n                </li>\n                <li>\n                    <ul class="edit">\n                        <li class="edit-buton"><i class="fa fa-pencil" aria-hidden="true"></i></li>\n                        <li class="delete-buton"><i class="fa fa-trash" aria-hidden="true"></i></li>\n                    </ul>\n                </li>\n            </ul>\n        ');

        localRecipes.push($(container));
        $('#recipes').append(container);

        // Creating event on click for the edit button
        $(container).find('.edit-buton').on('click', function () {
            openModal(container);
        });

        //Creating event on click for the delete button
        $(container).find('.delete-buton').on('click', function () {
            $(this).closest('article').animate({
                opacity: 0,
                top: '-=20px',
                height: '100px'
            }, function () {
                $(this).remove();
            });
        });

        closeModal();
    }

    // generating the filled stars.
    function getRating(rating) {
        var ratCont = $('<div></div>');
        for (var i = 0; i < rating; i++) {
            $(ratCont).append('<i class="fa fa-star" aria-hidden="true" data-rating="1"></i>');
        }
        for (var i = 0; i < 5 - rating; i++) {
            $(ratCont).append('<i class="fa fa-star-o" aria-hidden="true" data-rating="1"></i>');
        }
        return ratCont;
    }

    $('#local').on('click', function () {
        console.log('------------------ restaurando ------------------');
        restoreLocal();
    });

    function restoreLocal() {
        var loaded = localStorage.getItem('recipes2');
        var allRecipes = $('#recipes').html(loaded);
    }

    saveLocal();

    function saveLocal() {
        var allRecipes = $('#recipes').html();
        localStorage.setItem("recipes2", allRecipes);
    }
});