(function ( $ ) {

    $.fn.alertMe = function(status){
        var settings = $.extend({
            color: 'white',
            backgroundColor: 'silver',
            type: 'normal',
            message: ''
        }, status);


        if (settings.type == 'normal') {

        } else if (settings.type == 'alert') {
            settings.backgroundColor = '#FE575E';

        } else if (settings.type == 'warning') {
            settings.backgroundColor = '#E9AD2E';

        } else if (settings.type == 'success'){
            settings.backgroundColor = '#67B165';

        }


        this.each(function() {
            var message = this;
            var newMsg = $(message).clone().appendTo('.alert-container');

            $(newMsg).css({
                color: settings.color,
                backgroundColor: settings.backgroundColor
            });

            $(newMsg).text(settings.message);

            $(newMsg).addClass('alertme').wrapAll( "<div class='container-message'></div>").slideToggle().delay(3000).slideToggle();

            $(newMsg).on('click', function(event){
                $(this).slideDown().parent().remove();
                console.log(this);
            });
        });



    }

}( jQuery ));
