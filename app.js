const express = require('express');
const morgan = require('morgan');

require('dotenv').config();
const Blog = require('./models/blog');
// express app
const app = express();

const dbURI = process.env.DB_URI;
const mongoose = require('mongoose');
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.USER,
  pass: process.env.PASS
})
  .then(res => {
    // console.log(res);
    // listen for requests
    app.listen(3000);
  })
  .catch(err => console.log(err));


// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));

app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ', req.path);
  console.log('method: ', req.method);
  next();
});

app.use((req, res, next) => {
  console.log('in the next middleware');
  next();
});

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.get('/add-blog',(req,res)=>{
  const blog = new Blog({
    title:'new blog 2',
    snippet:'about my mongo demo',
    body:'it is awesome'
  });
  blog.save()
  .then(result => res.send(result))
  .catch(err => console.log(err)
  );
})

app.get('/all-blogs',(req,res)=>{
  Blog.find()
  .then((result)=>{
    res.send(result);
  })
  .catch(err => console.log(err)
  )
})

app.get('/find-blog',(req,res)=>{
  Blog.findById('60cea7427cb3223798402ac2')
  .then((result)=>{
    res.send(result);
  })
  .catch(err => console.log(err)
  )
})

app.get('/', (req, res) => {
  const blogs = [
    { title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    { title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    { title: 'How to defeat bowser', snippet: 'Lorem ipsum dolor sit amet consectetur' },
  ];
  res.render('index', { title: 'Home', blogs });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});