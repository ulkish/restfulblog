var express      = require("express"),
methodOverride   = require("method-override"),
bodyParser       = require("body-parser"),
mongoose         = require("mongoose"),
expressSanitizer = require("express-sanitizer"),
app              = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app", {
    useMongoClient: true
});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test blog",
//     image: "https://images.unsplash.com/photo-1467952497026-86722ef1916f?auto=format&fit=crop&w=1650&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
//     body: "Hello this is me, Bamby, in the woods",
// });




// RESTFUL ROUTES BELOW


app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
        
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
    
});

// CREATE ROUTE
app.post("/blogs", function(req, res) {
    // Create blogs
    req.body.blog.body = req.sanitize(req.body.blog.body) //Sanitizing body first
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log("ERROR!");
        } else {    // Then, redirect to index
            res.redirect("/blogs");
        }
    });

});

// CHART ROUTE
app.get("/blogs/routes", function(req, res){
    res.render("routes");

});


// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT ROUTE

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body) //Sanitizing body first
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
        
    });
    
});

// DELETE ROUTE

app.delete("/blogs/:id", function(req, res){
    //Destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/blogs");
        } else { //Redirect somewhere
            res.redirect("/blogs");
        }
        
    });
    
    
});


app.listen(process.env.PORT, process.env.IP, function() {
        console.log("Server is running!");
});

