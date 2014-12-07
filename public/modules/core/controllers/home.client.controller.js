angular.module('core')
		.controller('HomeCtrl', function ($scope) {
				// Slider components
				$scope.slides = [
						{image: 'images/img00.jpg', description: 'Image 00'},
						{image: 'images/img01.jpg', description: 'Image 01'},
						{image: 'images/img02.jpg', description: 'Image 02'},
						{image: 'images/img03.jpg', description: 'Image 03'},
						{image: 'images/img04.jpg', description: 'Image 04'}
				];

				$scope.direction = 'left';
				$scope.currentIndex = 0;

				$scope.setCurrentSlideIndex = function (index) {
						$scope.direction = (index > $scope.currentIndex) ? 'left' : 'right';
						$scope.currentIndex = index;
				};

				$scope.isCurrentSlideIndex = function (index) {
						return $scope.currentIndex === index;
				};

				$scope.prevSlide = function () {
						$scope.direction = 'left';
						$scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
				};

				$scope.nextSlide = function () {
						$scope.direction = 'right';
						$scope.currentIndex = ($scope.currentIndex > 0) ? --$scope.currentIndex : $scope.slides.length - 1;
				};

				// Google map components
				$scope.map = {
						center: {
								latitude: 49.119500,
								longitude: 9.187920
						},
						zoom: 14
				};

				$scope.marker = {
						id: 0,
						coords: {
								latitude: 49.119500,
								longitude: 9.187920
						},
						show: true,
						templateUrl: 'modules/core/views/templates/mapinfo.client.view.html',
						templateParameter: {
								reference: 'Dr. med. Schey',
								addressLine1: 'Horkheimer Straße 29',
								addressLine2: '74081 Heilbronn'
						}
				};

				$scope.windowOptions = {
						visible: true
				};

				$scope.onClick = function() {
						$scope.windowOptions.visible = !$scope.windowOptions.visible;
				};

				$scope.closeClick = function() {
						$scope.windowOptions.visible = false;
				};


		})
		.animation('.slide-animation', function () {
				return {
						beforeAddClass: function (element, className, done) {
								var scope = element.scope();

								if (className == 'ng-hide') {
										var finishPoint = element.parent().width();
										if(scope.direction !== 'right') {
												finishPoint = -finishPoint;
										}
										TweenMax.to(element, 0.5, {left: finishPoint, onComplete: done });
								}
								else {
										done();
								}
						},
						removeClass: function (element, className, done) {
								var scope = element.scope();

								if (className == 'ng-hide') {
										element.removeClass('ng-hide');

										var startPoint = element.parent().width();
										if(scope.direction === 'right') {
												startPoint = -startPoint;
										}

										TweenMax.fromTo(element, 0.5, { left: startPoint }, {left: 0, onComplete: done });
								}
								else {
										done();
								}
						}
				};
		});

