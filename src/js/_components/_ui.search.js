$(() => {
  const $searchLat = $('[name="search-lat"]');
  const $searchLng = $('[name="search-lng"]');
  const $nearbyLat = $('#nearby-lat');
  const $nearbyLng = $('#nearby-lng');
  const $radius = $('#distance-radius');
  const $category = $('#distance-category');
  const $newLocation = $('[name="newlocation"]');
  const $setnewlocation = $('#setnewlocation');
  const $newlocationholder = $('.set-newlocation-holder');

  const updatePosition = (lat, lng) => {
    $searchLat.val(lat);
    $searchLng.val(lng);
    $nearbyLat.val(lat);
    $nearbyLng.val(lng);

    $searchLat.change();
    $nearbyLat.change();
  };

  const getGeoPosition = () => {
    const newLocation = $newLocation.val();
    if (!newLocation.length) {
      return;
    }

    $('.search-location .current-val').text(newLocation);
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${newLocation}&key=AIzaSyC00L0023LPBhzj12uTCL-4EwJ_6zgwcTU&sensor=true`;

    $.getJSON(geoUrl)
      .done((data) => {
        if (data.status === 'OK') {
          updatePosition(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
          //getCategories();
        }
      });
  };

  const getCurrentPosition = () => {
    $('.search-location .current-val').text('Current Location');

    navigator.geolocation.getCurrentPosition((position) => {
      updatePosition(position.coords.latitude, position.coords.longitude);
      //hideDistancesThatDontMatter();
    }, () => {
      $('.search-location .current-val').text('Unable to get your location');
      updatePosition('', '');
    });
  }

  if ($newLocation.length && $newLocation.val().length) {
    getGeoPosition();
  } else {
    getCurrentPosition();
  }

  $('#Form_SearchForm').on('keyup keypress', (e) => {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      return false;
    }
  });

  $('.get-current-location').on('click', (e) => {
    e.preventDefault();

    getCurrentPosition();
    $newlocationholder.toggle();
    $newLocation.val('');
  });

  $setnewlocation.on('click', (e) => {
    e.preventDefault();

    $newlocationholder.toggle();
  });


  $newLocation.blur(() => {
    getGeoPosition();
  });

  $('.new-search').on('click', (e) => {
    e.preventDefault();

    $('.section-search-secondary').animate({
      'max-height': 300,
    }, 'slow');
  });

  /*$radius.on('change', () => {
        getCategories();
    });
    function getCategories() {
        $.getJSON(`/api/categoriesnearby/${$searchLat.val()}/${$searchLng.val()}/${$radius.val()}`)
            .done((data) => {
                $category.empty(); // remove old options
                $category.append($('<option></option>').attr('value', 'all').text('All Categories'));

                $.each(data.categories, (i, cat) => {
                    $category.append($('<option></option>').attr('value', cat.id).text(cat.name));
                });
            });
    }

    function hideDistancesThatDontMatter() {
        $.getJSON(`/api/nearestevent/${ $searchLat.val()}/${$searchLat.val()}`)
            .done((data) => {
                const nearest = parseFloat(data);

                $radius.find('option').each(function() {
                    if (this.value !== 'all' && parseFloat(this.value) < nearest) {
                        $(this).hide();
                    }
                });
            });
    }*/

  const $map = $('#Map');
  if (typeof google !== 'undefined' && $map.length) {
    const $directions = $('#DirectionsPanel'),
      $fromAddress = $('#FromAddress'),
      $getDirections = $('#GetDirections'),
      $directionContainer = $('#DirectionContainer'),
      directionsDisplay = new google.maps.DirectionsRenderer(),
      directionsService = new google.maps.DirectionsService(),
      currentPosition = {
        'lat': $map.data('lat'),
        'lng': $map.data('lng'),
      },
      map = new google.maps.Map($map[0], {
        'zoom': 15,
        'mapTypeControl': true,
        'mapTypeId': google.maps.MapTypeId.ROADMAP,
      });

    directionsDisplay.setMap(map);
    directionsDisplay.setPanel($directions[0]);

    map.setCenter(currentPosition);
    new google.maps.Marker({
      map,
      'position': currentPosition,
    });

    $getDirections.click((e) => {
      e.preventDefault();

      const fromLocation = $fromAddress.val();

      if (fromLocation.length) {
        directionsService.route({
          origin: fromLocation,
          destination: currentPosition,
          travelMode: google.maps.DirectionsTravelMode.DRIVING,
        }, (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });

        $directionContainer.slideDown();
      }
    });
  }
});
