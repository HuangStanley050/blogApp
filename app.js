
var express=require("express");
var methodOverride=require("method-override");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var expressSanitizer=require("express-sanitizer");



//APP Config
mongoose.connect("mongodb://localhost/restful_blog_app");


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//Mongoose model configu
var blogSchema=new mongoose.Schema({
    
    title: String,
    image: String,
    body: String,
    created: {type:Date,default:Date.now}
    
    
    
    
});

var Blog=mongoose.model("Blog",blogSchema);

/*Blog.create({
    
    title: "Test Blog",
    image: "http://images.unsplash.com/photo-1516152714327-094406db9da9?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6a07980d3294bf49270be3b6ce1862d6&auto=format&fit=crop&w=1350&q=80",
    body:"Hello this is blog",

})*/

//Routes






app.get("/",function(req,res){
    res.redirect("/blogs");
});




//index route

app.get("/blogs",function(req,res){
    
    Blog.find({},function(err,blogs){
        
        if(err){
            console.log(err);
        }
        else{
            
            res.render("index.ejs",{blogs:blogs});
        }
        
        
    });
    
    
});



//create new


app.get("/blogs/new",function(req,res){
    
    res.render("new.ejs");
    
    
});

//Post route

app.post("/blogs",function(req,res){
    
   req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBLog){
        
        if(err){
            res.render("new.ejs");
        }
        else{
            
            
            res.redirect("/blogs");
            
        }
        
        
    });
    
    
});

//show route

app.get("/blogs/:id",function(req,res){
    
    
    //res.send("Show Page");
    Blog.findById(req.params.id,function(err,foundBlog){
        
        if(err){
            res.redirct("/blogs");
        }
        else{
            
            res.render("show.ejs",{blog:foundBlog});
        }
        
    });
    
    
});

//Edit route

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit.ejs",{blog:foundBlog});
        }
        
        
        
    });
    
  
    
    
});

//put route Update route

app.put("/blogs/:id",function(req,res){
    //res.send("Update Route");
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
        
        
        
    });
    
});


//Delete Destroy route

app.delete("/blogs/:id",function(req,res){
    
    //res.send("Delete");
    Blog.findByIdAndRemove(req.params.id,function(err){
        
      if(err){
          res.redirect("/blogs");
      }
      else{
          res.redirect("/blogs");
      }
          
      
      
        
    });
    
});


app.listen(process.env.PORT,process.env.IP,function(){
    
    console.log("Server running");
});