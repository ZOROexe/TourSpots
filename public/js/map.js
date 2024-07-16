maptilersdk.config.apiKey = MAPTILER_API_KEY;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: foundDest.geometry.coordinates, // starting position [lng, lat]
    zoom: 11 // starting zoom
});

new maptilersdk.Marker()
    .setLngLat(foundDest.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${foundDest.title}</h3><p>${foundDest.location}</p>`
            )
    )
    .addTo(map)