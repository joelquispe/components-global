export default class GoogleMapsComponent {
  apiKey;
	containerId;
	pathOfImage;
	onBack;
	onFindAddress;
	onConfirm;
	pacInput;
	containerPac;
	containerDetails;
	mapsInputForm;
	mapsTitle;
	mapsSubtitle;
	map;
	marker;
	myLatLng;
	formatted_address;
	place;
	imageClear;
	mapsFind;
	containerBack;
	mapsRegisterBack;
	findAddress;
	bonusButton;
	/**
	 * Parámetros de googleMapsComponent.
	 * @param {string} apiKey - ApiKey de google maps.
	 * @param {string} containerId - Id de contenedor donde se construirá el mapa.
	 * @param {string} pathOfImage - Ruta de las imágenes.
	 * @param {Function} onBack - Botón para regresar.
	 * @param {Function} onFindAddress - En caso pulsa que no se encuentra su dirección en el googlemaps.
	 * @param {Function} onConfirm - Confirmar la localización seleccionada.
	 */
	constructor(
		apiKey,
		containerId,
		pathOfImage,
		onBack,
		onFindAddress,
		onConfirm
	) {
		this.apiKey = apiKey;
		this.containerId = containerId;
		this.pathOfImage = pathOfImage;
		this.onBack = onBack;
		this.onFindAddress = onFindAddress;
		this.onConfirm = onConfirm;
		this.pacInput = null;
		this.containerPac = null;
		this.containerDetails = null;
		this.mapsInputForm = null;
		this.mapsTitle = null;
		this.mapsSubtitle = null;
		this.map = null;
		this.marker = null;
		this.myLatLng = null;
		this.formatted_address = null;
		this.place = null;
	}
	// initialize
	init() {
		this.loadMapsAPI();
	}

	//agregar ruta a las imágenes
	pathOfImages() {
		// Obtén todas las imágenes dentro del componente
		var images = document
			.getElementById(this.containerId)
			.getElementsByTagName('img');

		// Agrega la ruta adicional al inicio de los src de las imágenes
		for (var i = 0; i < images.length; i++) {
			var srcActual = images[i].getAttribute('src');
			images[i].setAttribute('src', this.pathOfImage + srcActual);
		}
	}

	//cargar apiKey
	loadMapsAPI() {
		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
		script.async = true;
		script.defer = true;
		script.onload = () => {
			this.render();
			this.pathOfImages();
			this.selectElements();
			this.addEventListeners();
			this.movePacContainer();
			this.initAutocomplete();
		};
		document.head.appendChild(script);
	}
	// html del componente
	render() {
		const componentContainer = document.getElementById(this.containerId);
		console.log(componentContainer);
		const componentHTML = `
            <div class="container-pac"  id="container-pac">
              <div class="bonus-container-header">

                <img class="bonus-input-icon-back" style="cursor: pointer;" id="container-back" src="back-map.svg" alt="" />
                <div class="bonus-container-input-place">
                  <input id="pac-input" class="input-place" type="text" placeholder="Buscar lugares" />
                  <img id="image-clear" style="cursor: pointer;"  src="clear-map.svg" alt="" />
                </div>
               
              </div>
              <p class="bonus-map-tooltip">
                <a class="find-address"  >¿No encuentras tu dirección?</a>
              </p>
              <div id="maps-input-form" class="maps-input-form">
                <!-- Contenedor para el pac-container -->
              </div>
            </div>
            <div class="container-details display-off" id="container-details" >
              
              <div style="display: flex;align-items: center;">
                <img
                style="cursor: pointer;margin-right: 10px;"
                id="maps-register-back"
                class="bonus-input-icon-back"
                src="back-map.svg"
              />
                <h4 class="bonus-map-title bonus-text-sub-title bonus-text-sub-title-bold">Verifica la ubicación<h4/>
              </div>
              <div id="map"  class="map"></div>
              <div class="container-button-text">
              <div style="display: flex;align-items: center;justify-content: space-around;margin-top: 20px;margin-bottom: 20px;">
                <div>
                  <p id="maps-title" class="bonus-map-address-title"></p>
                  <p id="maps-sub-title" class="bonus-map-address-sub-title"></p>
                </div>
                <div id="maps-find" class="bonus-maps-find"  >
                  <img src="spot.svg" alt="" />
                  <p style="margin-left: 5px;">Encuéntrame</p>
                </div>
              </div>
              <div style="display: grid; justify-content: center;">
                <button id="bonus-button" class="bonus-button bonus-button-yellow" >
                  CONFIRMAR UBICACIÓN
                </button>
                <p class="bonus-map-tooltip">
                  <a class="find-address" >¿No encuentras tu dirección?</a>
                </p>
              </div>
              </div>
            </div>  
        `;
		componentContainer.innerHTML = componentHTML;
	}
	// elementos
	selectElements() {
		this.pacInput = document.querySelector('#pac-input');
		this.imageClear = document.querySelector('#image-clear');
		this.mapsFind = document.querySelector('#maps-find');
		this.containerBack = document.querySelector('#container-back');
		this.mapsRegisterBack = document.querySelector('#maps-register-back');
		this.mapsInputForm = document.querySelector('#maps-input-form');
		this.mapsTitle = document.querySelector('#maps-title');
		this.mapsSubtitle = document.querySelector('#maps-sub-title');
		this.findAddress = document.querySelectorAll('.find-address');
		this.bonusButton = document.querySelector('#bonus-button');
		//primera página
		this.containerPac = document.querySelector('#container-pac');
		//segunda página
		this.containerDetails = document.querySelector('#container-details');
	}

	// eventos
	addEventListeners() {
		// limpiar input cuando este vacío
		this.pacInput.addEventListener('keyup', (e) => {
			if (e.target.value.trim() === '') {
				// Realizar acciones cuando el input esté vacío
				this.onClearInputPlace();
			}
		});

		// evento al retroceder página
		this.containerBack.addEventListener('click', (e) => {
			this.onBack();
		});

		// evento al retroceder a seleccionar lugar
		this.mapsRegisterBack.addEventListener('click', (e) => {
			this.onBackSelectPlace();
		});

		//evento eliminar pac-items
		this.imageClear.addEventListener('click', (e) => {
			this.onClearInputPlace();
		});

		// evento para encontrar mi localización
		this.mapsFind.addEventListener('click', (e) => {
			this.onFindMe();
		});

		// evento al seleccionar que no encuentra su dirección en google maps
		this.findAddress.forEach((element) => {
			element.addEventListener('click', () => {
				this.onFindAddress();
			});
		});

		// evento de confirmación de ubicación
		this.bonusButton.addEventListener('click', (e) => {
			this.onConfirm();
		});
	}

	// agregar los pac-items al escribir en el input lugar
	movePacContainer() {
		const pacContainer = document.querySelector('.pac-container');
		if (pacContainer) {
			pacContainer.style.height = '100%';
			this.mapsInputForm.appendChild(pacContainer);
		} else {
			setTimeout(() => this.movePacContainer(), 100);
		}
	}

	// inicializar auto completado
	initAutocomplete() {
		const autocomplete = new google.maps.places.Autocomplete(this.pacInput);
		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();
			if (place.geometry && place.geometry.location) {
				this.place = place;
        // limpiar input y borrar la lista de auto completado
				this.onClearInputPlace();
        // mostrar mapa
				document.getElementById('map').style.opacity = 1;
				this.initMap(place.geometry.location);

        // texto inferior de detalles del mapa
				this.formatted_address = place.formatted_address.split(',');
				this.mapsTitle.innerText = this.formatted_address[0];
				this.mapsSubtitle.innerText = `${this.formatted_address[2]} - ${this.formatted_address[1]}`;
			}
			this.onNextStep();
		});
	}
	// eliminar contenido de pac-container
	clearPacContainer() {
		const pacItems = document.querySelectorAll('.pac-item');
		pacItems.forEach((element) => {
			element.remove();
		});
	}

	// avanzar al siguiente paso - detalles del lugar seleccionado
	onNextStep() {
		this.containerPac.classList.toggle('display-off');
		this.containerDetails.classList.toggle('display-off');
	}

	// retroceder a seleccionar un lugar
	onBackSelectPlace() {
		this.containerPac.classList.toggle('display-off');
		this.containerDetails.classList.toggle('display-off');
	}

	//poner market en el mapa
	placeMarker(latLng) {
		if (this.marker) {
			this.marker.setMap(null);
		}
		this.marker = new google.maps.Marker({
			position: latLng,
			map: this.map,
			title: 'Mi ubicación',
			icon: `${this.pathOfImage}marker.svg`,
		});
		this.marker.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(() => {
			this.marker.setAnimation(null);
		}, 2000);
	}

	// inicializar mapa
	initMap(latLng) {
		this.map = new google.maps.Map(document.getElementById('map'), {
			center: latLng,
			zoom: 16,

			streetViewControl: false,
			mapTypeControl: false,
			fullscreenControl: false,
		});
		console.log(this.map);
		this.map.setCenter(latLng);
		this.placeMarker(latLng);
	}

	// limpiar input de lugar
	onClearInputPlace() {
		this.pacInput.value = '';
		this.clearPacContainer();
	}

	// mi localización
	onFindMe() {
		this.getCurrentLocation();
	}

	// geoLocalización
	getCurrentLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;
					this.myLatLng = { lat: latitude, lng: longitude };
          //mostrar ubicación en el mapa
					this.initMap(this.myLatLng)
          //obtener place mediante las coordenadas;
					this.geocodingOfCoords(this.myLatLng);
				},
				(error) => {
					console.error('Error al obtener la ubicación:', error);
				}
			);
		} else {
			console.error('Geolocalización no es compatible con este navegador.');
		}
	}

	// geocoding de latitud y longitud para obtener un json del lugar
	geocodingOfCoords(LatLng) {
		const geocoder = new google.maps.Geocoder();
		geocoder.geocode({ location: LatLng }, (results, status) => {
			if (status === 'OK') {
				if (results[0]) {
					// El primer resultado contiene la información del lugar
					this.place = results[0];
				} else {
					console.log('No se encontraron resultados para la ubicación.');
				}
			} else {
				console.log('Geocoder falló debido a:', status);
			}
		});
	}
}
