const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});//finds all campgrounds
    res.render('campgrounds/index.ejs', { campgrounds })//pass campgrounds to template
}

module.exports.renderNewForm = (req,res) =>{//dont need async function here since its a form and wont be getting or posting until form is submitted    
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req,res,next) => {
    //if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);-- this line just checks to see if the req.body has campground--adding Joi for validation will allow much more detail validation for all values--campground is the key and all the values are under campground (ex. campground[price] or campground[description] etc.)--moved the joi schema from below to a function about so it can just be called on the other routes
        
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;//associate the author with newly created campgrounds--req.user is automatically added in
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');//installing connect-flash allows flash messages to be displayed to the user--want to use after the save in case there are any errors thrown--after the message you want to redirect--after the redirect you want to display that message in the template you redirect to--it could be added to the show routes individually but instead its added to the middleware that will take everything on every request and show the message--middleware will be defined in index.js to make this possible
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate: {//set an object on this nested populate--populate all the reviews on the show page for the campground we are finding, populate the reviews, then populate their author, and then seperately below in the second populate, populate the author of this campground 
            path: 'author'
        }
    }).populate('author');//adding .populate gives the campground access to the reviews for that campground and the author so it is displayed on the show page for that campground--author is available to the campground under the key author.username--reviews and author are 2 fields that are on campground--to put the name of the reviewer on each review, we want to populate the reviews author
    //  console.log(campground);
        if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    // console.log(campground);
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {//isAuthor validates if user can edit a campground
    const { id } = req.params;
    const campground = await Campground.findById(id)    
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    
    res.render('campgrounds/edit', { campground })
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;

    //using the spread operator ...req.body.campground spreads that object into the object found from the id searched for in Campground.findByIdAndUpdate 

    //const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})--this line has to be broken up to protect the route--have to check and see if the user owns this camground before allowing them to update it

    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req ,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);//findByIdAndDelete() triggers only the delete middleware, findOneAndDelete added to in campgrounds.js--if another delete or remove method is used, it will not trigger
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
}