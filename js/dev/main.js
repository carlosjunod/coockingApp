$(document).ready(function(){
    $('#modal').hide();
    $('.layer-modal').hide();


    var form = $('#js-add-recipe');
    var addNewRecipe = $('#js-add-recipe').find('#add-recipe');
    let editRecipe = $('#js-add-recipe').find('#edit');
    var localRecipes = [];

    // creating recipe object
    class Recipe {
        constructor(img, title, description, rating) {
            this.img = img;
            this.title = title;
            this.description = description;
            this.rating = rating;
        }
    }

    // Parsing JSON
    var dataRecipes = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "/js/recipes.json",
            'dataType': "json",
            'success': function (data) {
                json = data;
            }
        });
        return json;
    })();

    // converting Json Objecst into JS Objects
    $.each(dataRecipes, (index, recipes) => {
        $.each(recipes, (index, recipe) => {
            // console.log(recipe.title);
            let myRecipe = new Recipe(recipe.image, recipe.title, recipe.description, recipe.rating)
            toDOM(myRecipe)
        })
    })

    // restoring from local
    // restoreLocal()


    // click event to Create and add a new recipe
    $(addNewRecipe).on('click', e => {
        e.preventDefault()
        let nameRecipe = $('#recipe-name').val();
        let descRecipe = $('#recipe-desc').val();
        let starsRecipe= $('#recipe-stars').val();
        let imgRecipe= $('#recipe-img').val();

        let myRecipe = new Recipe(imgRecipe, nameRecipe, descRecipe, starsRecipe)

        toDOM(myRecipe)
        localRecipes.push(myRecipe)
    })



    //opening modal
    $('#add').on('click', function(){
        openModal()
    })

    // closing modal
    $('#close-button').on('click', function(){
        closeModal()
    })


    function openModal(recipe = null){

        if (recipe != null) {
            //removing event from the button edit
            $(editRecipe).off()

            //creating variables from the previous data
            let imgRecipe= $(recipe).find('img').attr('src');
            let nameRecipe = $(recipe).find('h2').text();
            let descRecipe = $(recipe).find('p').text();
            let starsRecipe= $(recipe).find('.fa-star').length;

            //populating fields on the modal
            $('#modal').find('#recipe-img').val(imgRecipe);
            $('#modal').find('#recipe-name').val(nameRecipe);
            $('#modal').find('#recipe-desc').val(descRecipe);
            $('#modal').find('#recipe-stars').val(starsRecipe);

            // display buttons
            $('#modal').find('h3').text('Edit Recipe')
            $('#modal').find('#add-recipe').hide();
            $('#modal').find('#edit').show();

            //editing
            $(editRecipe).on('click', function(e) {
                e.preventDefault()
                $(recipe).find('img').attr('src', $('#recipe-img').val());
                $(recipe).find('h2').text($('#recipe-name').val());
                $(recipe).find('p').text($('#recipe-desc').val());

                closeModal()
            })


        } else {
            // display buttons
            $('#modal').find('#add-recipe').show();
            $('#modal').find('#edit').hide();
        }

        //display modal
        $('#modal').delay(100).fadeIn();
        $('.layer-modal').fadeIn();
    }


    function closeModal(){
        $('#modal').fadeOut();
        $('.layer-modal').delay(100).fadeOut(function(){
            $(form).find('input').each(function(index, field){
                $(field).val('');
            })
        });
    }


    // print objects into the DOM
    function toDOM(newRecip){
        let container = $('<article class="recipe"></article>')
        let rating = getRating(newRecip.rating).html();

        $(container).append(`
            <img src="${newRecip.img}" alt='${newRecip.title}'/>
            <h2>${newRecip.title}</h2>
            <p>${newRecip.description.substr(0, 100)}</p>
            <ul class="rating-tools">
                <li class="stars">
                ${rating}
                </li>
                <li>
                    <ul class="edit">
                        <li class="edit-buton"><i class="fa fa-pencil" aria-hidden="true"></i></li>
                        <li class="delete-buton"><i class="fa fa-trash" aria-hidden="true"></i></li>
                    </ul>
                </li>
            </ul>
        `)


        localRecipes.push($(container))
        $('#recipes').append(container)

        // Creating event on click for the edit button
        $(container).find('.edit-buton').on('click', function(){
            openModal(container)
        })

        //Creating event on click for the delete button
        $(container).find('.delete-buton').on('click', function(){
            $(this).closest('article').animate({
                opacity: 0,
                top: '-=20px',
                height: '100px'
            }, function(){
                $(this).remove()
            })
        })

        closeModal()
    }

    // generating the filled stars.
    function getRating(rating){
        var ratCont = $('<div></div>')
        for (var i = 0; i < rating; i++) {
            $(ratCont).append('<i class="fa fa-star" aria-hidden="true" data-rating="1"></i>')
        }
        for (var i = 0; i < (5-rating); i++) {
            $(ratCont).append('<i class="fa fa-star-o" aria-hidden="true" data-rating="1"></i>')
        }
        return ratCont;
    }

    $('#local').on('click', function() {
        console.log('------------------ restaurando ------------------');
        restoreLocal()
    });



    function restoreLocal(){
        var loaded = localStorage.getItem('recipes2');
        let allRecipes = $('#recipes').html(loaded)
    }


    saveLocal()

    function saveLocal(){
        let allRecipes = $('#recipes').html()
        localStorage.setItem("recipes2", allRecipes);
    }
})
