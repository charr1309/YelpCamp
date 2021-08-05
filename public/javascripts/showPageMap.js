
            //'pk.eyJ1IjoiY2hhcnIxMzA5IiwiYSI6ImNrcndiMG03czBld3cydW5wanZseWI0d3gifQ.TBHOKH9GvJXeee0tC3bIoQ' is the token but since its used in the controllers.js and possibly other places, using process.env.MAPBOX_TOKEN instead allows the token to be changed in only one place to affect all uses--code below places the map at the top of the screen over the card as specified in show.ejs--lecture 543

            //mapboxgl.accessToken = '<%-process.env.MAPBOX_TOKEN%>'; was the code when the code below was in show.ejs--when moved to a seperate file, setting the src to "/javascripts/showPageMap.js" will not work since no javascript will come through when showPageMap.js is read in show.ejs, so a variable mapToken is created at the top of show.ejs and is populated  when showPageMap.js is pulled into show.ejs--lecture 543 time 5:47

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]--changed to this in lecture 544--campground.geometry.coordinates added to script in show.ejs
     zoom: 9 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

//add a pin to the map that marks the location of the longitude and latitude

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${campground.title}</h3><p>${campground.location}</p>`
        )
    )
    .addTo(map)
       