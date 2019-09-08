;'use strict';

  $('.directory__col').slick({
    infinite: true,
	slidesToShow: 1,
	// autoplay: true,
	speed: 2000,
	autoplaySpeed: 3000,
	dots: true,

	responsive: [
	{
		breakpoint: 767,
		settings: {
			arrows: false
		}
	},

	{
		breakpoint: 576,
		settings: {
			arrows: false
		}
	}
	]
  });
