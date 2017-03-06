'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(function () {
    $('#modal').hide();
    $('.layer-modal').hide();

    var form = $('#js-add-recipe');
    var addNewRecipe = $('#js-add-recipe').find('#add-recipe');
    var editRecipe = $('#js-add-recipe').find('#edit');
    var allRecipes = [];

    // creating recipe object

    var Recipe = function () {
        function Recipe(img, title, description, rating) {
            _classCallCheck(this, Recipe);

            this.img = img;
            this.title = title;
            this.description = description;
            this.rating = rating;
        }

        _createClass(Recipe, [{
            key: 'intoDOM',
            value: function intoDOM() {
                var container = $('<article class="recipe"></article>');
                var rating = getRating(this.rating).html();

                $(container).append('\n                <img src="' + this.img + '" alt=\'' + this.title + '\'/>\n                <h2>' + this.title + '</h2>\n                <p>' + this.description.substr(0, 100) + '</p>\n                <ul class="rating-tools">\n                    <li class="stars">\n                    ' + rating + '\n                    </li>\n                    <li>\n                        <ul class="edit">\n                            <li class="edit-buton"><i class="fa fa-pencil" aria-hidden="true"></i></li>\n                            <li class="delete-buton"><i class="fa fa-trash" aria-hidden="true"></i></li>\n                        </ul>\n                    </li>\n                </ul>\n            ');

                $('#recipes').append(container);

                // Creating event on click for the edit button
                $(container).find('.edit-buton').on('click', function () {
                    openModal($(this).closest('article'));
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

                allRecipes.push(this);
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
            }
        }]);

        return Recipe;
    }();

    // Parsing JSON


    var dataRecipes = function () {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "./js/recipes.json",
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
            var myRecipe = new Recipe(recipe.image, recipe.title, recipe.description, recipe.rating);
            myRecipe.intoDOM();
        });
    });

    for (var i = 0; i < allRecipes.length; i++) {
        console.log(allRecipes[i]);
    }
    console.log('=================');

    // click event to Create and add a new recipe
    $(addNewRecipe).on('click', function (e) {
        e.preventDefault();
        var nameRecipe = $('#recipe-name').val();
        var descRecipe = $('#recipe-desc').val();
        var starsRecipe = $('#recipe-stars').val();
        var imgRecipe = $('#recipe-img').val();

        var myRecipe = new Recipe(imgRecipe, nameRecipe, descRecipe, starsRecipe);

        myRecipe.intoDOM();
        allRecipes.push(myRecipe);
        closeModal();
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


        console.log('============= recipe in modal ===============');
        console.log(recipe);

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
                saveLocal();
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

    function saveLocal() {
        localStorage.setItem("recipes", JSON.stringify(allRecipes));
    }

    // animations GreenSock
    if ($('#header-site').width() <= 500) {} else if ($('#header-site').width() >= 600) {
        TweenLite.to('#header-site', 1.5, { height: '100vh', ease: Bounce.easeOut });
        TweenMax.staggerTo('#splash', 0.5, { opacity: 1, x: -200, delay: 1 }, 0.2);
    }

    //
    // TweenLite.to('#header-site', 1.5, {height:'100vh', ease: Bounce.easeOut})
    // TweenMax.staggerFrom('#splash', 0.5, {opacity: 0, x:-200, delay: 1}, 0.2)
});