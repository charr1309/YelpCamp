const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');//allows us to alter the method for our form


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);//template engine to use static template files to design HTML easier
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))//must tell express to parse the body so use this or nothing will come back when you use req.body for anything
app.use(methodOverride('_method'));//tell express to use methodOverride

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});//finds all campgrounds
    res.render('campgrounds/index.ejs', { campgrounds })//pass campgrounds to template
})

//this route below has to come before the :id route. If it doesnt the brower will match the :id route and since there is no new, id, you will get a time out error, so order does matter

app.get('/campgrounds/new', (req,res) =>{//dont need async function here since its a form and wont be getting or posting until form is submitted
    res.render('campgrounds/new');
})

//req.body had to be parsed above. We add app.use(express.urlencode)...
//code below sets up the endpoint from the form in campgrounds/new as a post request

app.post('/campgrounds', async(req,res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})
app.get('/campgrounds/:id', async (req,res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground })
})
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
})
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;

    //using the spread operator ...req.body.campground spreads that object into the object found from the id searched for in Campground.findByIdAndUpdate 

    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})
app.delete('/campgrounds/:id', async (req ,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})



app.listen(3000, ()=> {
    console.log('Serving on port 3000')
})

