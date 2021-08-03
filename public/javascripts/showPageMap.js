mapboxgl.accessToken = 'mapToken';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});        
            //'pk.eyJ1IjoiY2hhcnIxMzA5IiwiYSI6ImNrcndiMG03czBld3cydW5wanZseWI0d3gifQ.TBHOKH9GvJXeee0tC3bIoQ' is the token but since its used in the controllers.js and possibly other places, using process.env.MAPBOX_TOKEN instead allows the token to be changed in only one place to affect all uses--code below places the map at the top of the screen over the card as specified in show.ejs--lecture 543

            //mapboxgl.accessToken = '<%-process.env.MAPBOX_TOKEN%>'; was the code when the code was in show.ejs--when moved to a seperate file, setting the src to "/javascripts/showPageMap.js" will not work since no javascript will come through when showPageMap.js is read in show.ejs, so a variable mapToken is created at the top of show.ejs and is populated  when showPageMap.js is pulled into show.ejs--lecture 543 time 5:47

              
       