(function ($) {

    "use strict";

    $('.blog-main').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 1000,
        arrows: false,
        dots: true,
        centerMode: true,
        centerPadding: '0px',
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
    },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
    },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
    },

  ]
    });

    $('.recommended-articles').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 2000,
        arrows: false,
        dots: true,
        centerMode: true,
        centerPadding: '0px',
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
    },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
    },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
    },

  ]
    });
    //animation scroll js
    var html_body = $('html, body');
    $('.navbar a , .scroll-down a , .backtotop a').on('click', function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                html_body.animate({
                    scrollTop: target.offset().top - 65
                }, 1500);
                return false;
            }
        }
    });
    // preloader
    $(window).on('load', function () {
        $('.preloader').delay(1000).fadeOut(1000);

    });
    // Closes responsive menu when a scroll link is clicked
    $('.nav-link').on('click', function () {
        $('.navbar-collapse').collapse('hide');
    });


    if($('.navbar').offset().top > 5){
        $('.navbar').addClass("nav-bg");
    }
    $(window).scroll(function () {
        var scrolling = $(this).scrollTop();
        var stikey = $('.sticky-top');
        if (scrolling >= 5) {
            $(stikey).addClass("nav-bg");
        } else {
            $(stikey).removeClass("nav-bg");
        }
        if (scrolling > 280) {
            $('.backtotop').fadeIn(500);
        } else {
            $('.backtotop').fadeOut(500);
        }
    });
    //scorllspy js
    $('body').scrollspy({
        target: ".navbar",
        offset: 70,
    });


    $(".more-articles").on("click", function () {
        var offset = $('.blog-item').length;
        var search = window.location.search;

        var getData = {
            'offset' : offset,
            'search' : search,
        };
        $('.loader-inner').addClass('pacman')
        $(this).hide();
        $.ajax({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            url: '/articles',
            type: 'get',
            data: getData,
            success: function (data) {
                setTimeout(function () {
                    $('.loader-inner').removeClass('pacman');
                    $('.articles').append(data);
                    if(data !== '' && $('.blog-item').length - offset > 5){
                        $(".more-articles").show()
                    }

                },1500)
            },
        });

    });

    $(".more-articles-by-tag").on("click", function () {
        var offset = $('.blog-item').length;

        var pathname = window.pathname;

        var getData = {
            'offset' : offset,
        };
        $('.loader-inner').addClass('pacman')
        $(this).hide();
        $.ajax({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            url: pathname,
            type: 'get',
            data: getData,
            success: function (data) {
                setTimeout(function () {
                    $('.loader-inner').removeClass('pacman');
                    if(data !== '' && $('.blog-item').length - offset > 5){
                        $(".more-articles").show()
                    }
                    $('.articles').append(data);

                },1500)
            },
        });

    });

    $(".get-products").on("click", function () {
        $('#products .modal-body').html(`<div class="loader-wrapper">
                        <div class="loader-inner pacman">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>`)

        $('#products .modal-title').text($(this).data('category-name'));
        $('#products .modal-footer').html(`<button type="button" class="dropboxx2" data-dismiss="modal">Продолжить покупки</button>
<button type="button" style="background: limegreen;" class="dropboxx2 show-cart" >Корзина <i class="fa fa-shopping-cart" aria-hidden="true"></i></button>`);

        $('#products').modal('show');

        var postData = {
            'category_id' : $(this).data('category'),
        };
        $.ajax({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            url: '/products',
            type: 'post',
            data: postData,
            success: function (data) {
                setTimeout(() => {
                    $('#products .modal-body').html(data)
                },300)
            },
        });
    })

    function addToCart(selector, count){

        var oldThis = $(selector);
        var productId = oldThis.data('product');
        var postData = {
            'product_id' : productId,
            'count' : count
        };

        $.ajax({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            url: '/cart',
            type: 'post',
            data: postData,
            success: function (data) {
                if(data === 'add'){
                    $.toast('success', 'Товар добавлен в корзину!');
                    oldThis.find('i').removeClass('fa-shopping-cart');
                    oldThis.find('i').addClass('fa-check');
                    oldThis.find('.fa-check').attr("style", "color:green !important");
                }else {
                    $.toast('error', 'Товар удалён из корзины!');
                    oldThis.find('i').removeClass('fa-check');
                    oldThis.find('i').addClass('fa-shopping-cart');
                    oldThis.find('.fa-shopping-cart').attr("style", "color:#ff7657 !important");
                }
            },
        });
    }

    $("body").on("click", '.product-cart', function () {
        addToCart(this,1);
    });

    $("body").on("click", '.product-cart-delete', function () {
        var postData = {
            'product_id' : $(this).data('product'),
        };

        $.ajax({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            url: '/delete-from-cart',
            type: 'post',
            data: postData,
            success: function (data) {
                updateCart(false)
            },
        });
    });


    function updateCart(stateModal, showAnimation = false){
        $('#payment').modal('hide');

        if (showAnimation){
            $('#products .modal-body').html(`<div class="loader-wrapper">
                        <div class="loader-inner pacman">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>`);
            $('#products .modal-footer').html(``);
        }
        $('#products .modal-title').text('Корзина');

        if(stateModal){
            $('#products').modal('show');
        }

        $.ajax({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            url: '/get-cart-products',
            type: 'post',
            success: function (data) {
                setTimeout(() => {
                    $('#products .modal-body').html(data)
                    if($('.products-wrapper__item').length > 0){
                        $('#products .modal-footer').html(`
                            <button type="button" class="dropboxx2 clear-cart" style="background: orangered;">Очистить <i class="fa fa-trash" aria-hidden="true"></i></button>
                            <button type="button" class="dropboxx2 pay" data-dismiss="modal" style="background: limegreen;">Далее <i class="fa fa-arrow-right" aria-hidden="true"></i></button>
                            `);
                    }else {
                        $('#products .modal-footer').html(`<button type="button" class="dropboxx2" data-dismiss="modal" style="background: limegreen;">Продолжить покупки</button>`);
                    }
                }, 500)
            },
        });
    }

    $("body").on("click", '.show-cart', function () {
        updateCart(true, true);
    });

    $("body").on("click", '.pay', function () {

        $.ajax({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            url: '/payment',
            type: 'post',
            success: function (data) {
               $('#payment .modal-body').html(data)
            },
        });

        setTimeout(function () {
            $('#payment').modal('show')
        }, 500)
    });


    $("body").on("click", '.clear-cart', function () {

        $.ajax({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            url: '/clear-cart',
            type: 'post',
            success: function (data) {
                if(data === 'clear'){
                    updateCart(false)
                }else{
                    $.toast('error', 'Товар удалён из корзины!');
                }
            },
        });
    });


    // $('body').on('click', '.payment-order', function(e) {
    //
    //
    //
    //     var $form = $('#order-payment');
    //
    //     e.preventDefault();
    //
    //     var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    //
    //
    //     $.ajax({
    //         headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
    //         type: 'post',
    //         url: '/order-payment',
    //         data: $form.serialize()
    //     }).done(function(data) {
    //         console.log(data);
    //     }).fail(function() {
    //         console.log('fail');
    //     });
    //     //отмена действия по умолчанию для кнопки submit
    // });



    $('body').on('click', '.form_radio_btn label', function() {
        if($(this).prev().val() === 'qiwi'){
            $('.qiwi').show();
            $('.wm').hide();
        }

        if($(this).prev().val() === 'webmoney'){
            $('.wm').show();
            $('.qiwi').hide();
        }
    });

    $('body').on('click', '.payment-order', function(e) {


        $("form[name='payment']").validate({
            rules: {
                payment_type: "required",
                email: {
                    required: true,
                    email: true
                },
            },
            messages: {
                email: "Введите корректный E-mail."
            },
            submitHandler: function (form, e) {
                e.preventDefault();
                $.ajax({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    type: 'post',
                    url: '/order-payment',
                    data: {
                        'email' : $('.email-payment').val(),
                        'payment_type' : $('input[name="payment_type"]:checked').val()
                    }
                }).done(function(data) {
                    window.location.href = data;
                }).fail(function(data) {
                    if(data.responseJSON.errors.payment_type){
                        $('#payment_type-error').text(data.responseJSON.errors.payment_type[0]);
                    };
                });
            }
        });
    });

    $('body').on('click', 'input[type="radio"]', function () {
        $('#payment_type-error').text('')
    })

    function updateCartCount(productId, newCount){
        var postData = {
            'product_id' : productId,
            'count' : newCount
        };

        $.ajax({
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            url: '/cart-update',
            type: 'post',
            data: postData,
            success: function (data) {
                updateCart(false)
            },
        });
    }

    $('body').on('click', '.plus-js', function () {
        let oldCount = $(this).parent().find('input').val();
        let newCount = parseInt(oldCount) + parseInt(1);
        $(this).parent().find('input').val(newCount);

        var productId = $(this).parent().find('input').data('product');
        updateCartCount(productId, newCount)
    })

    $('body').on('click', '.minus-js', function () {
        let oldCount = $(this).parent().find('input').val();
        let newCount = parseInt(oldCount) - parseInt(1);
        if(oldCount > 1){
            $(this).parent().find('input').val(newCount);
            var productId = $(this).parent().find('input').data('product');
            updateCartCount(productId, newCount)
        }
    })

    $('body').on('input', 'input.count-in-cart', function(){
        let $this = $(this);
        setTimeout(function () {
            let newCount = $this.val();

            let productId = $this.data('product');
            if(newCount){

                updateCartCount(productId, newCount)
            }
        },300);
    });

    $('body').on('click', '.show-desc', function () {
        $('#product-desc .modal-body p').text($(this).parent().find('span').text());
        $('#product-desc').modal('show')
    });


    ;(function(window, $){
        "use strict";

        var defaultConfig = {
            type: '',
            autoDismiss: false,
            container: '#toasts',
            autoDismissDelay: 5000,
            transitionDuration: 500
        };

        $.toast = function(config){
            var size = arguments.length;
            var isString = typeof(config) === 'string';

            if(isString && size === 1){
                config = {
                    message: config
                };
            }

            if(isString && size === 2){
                config = {
                    message: arguments[1],
                    type: arguments[0]
                };
            }

            return new toast(config);
        };

        var toast = function(config){
            config = $.extend({}, defaultConfig, config);
            // show "x" or not
            var close = config.autoDismiss ? '' : '&times;';

            // toast template
            var toast = $([
                '<div class="toast ' + config.type + '">',
                '<p>' + config.message + '</p>',
                '<div class="close">' + close + '</div>',
                '</div>'
            ].join(''));

            // handle dismiss
            toast.find('.close').on('click', function(){
                var toast = $(this).parent();

                toast.addClass('hide');

                setTimeout(function(){
                    toast.remove();
                }, config.transitionDuration);
            });

            // append toast to toasts container
            $(config.container).append(toast);

            // transition in
            setTimeout(function(){
                toast.addClass('show');
            }, config.transitionDuration);

            // if auto-dismiss, start counting
            setTimeout(function(){
                toast.find('.close').click();
            }, config.autoDismissDelay);

            return this;
        };

    })(window, jQuery);

    $(document).on('click', '.backtotop', function (e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: (0)}, '4000');
    });

    $('body').on('click', '.show-converter-keywords', function () {
        $(this).toggleClass("fa-angle-down");
        $('.converter-keywords').toggle();
    });

    $("body").on('click', '.json-copy', function(){
        var textarea = $("#json");
        textarea.select();
        if(textarea.val() !== ''){
            document.execCommand("copy");
            $.toast('success', 'Скопировано!');
        }
    });

    $("body").on('click', '.clear-field', function(){
        $('textarea#netscape').val('')
    });

}(jQuery));
