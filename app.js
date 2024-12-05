const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));


let nextPostId = 1; // To assign unique IDs to posts
let posts = [
  { id: 1, title: "Tech Trends", content: "Lorem ipsum dolor sit amet, consect etur adipiscing elit, sed do eiu mod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in repre hender it in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", category: "Tech", img:"tech" },
  { id: 2, title: "Healthy Living", content: "Tips for a healthier life...", category: "Lifestyle", img:"lifestyle"},

];

app.get('/', (req, res) => {
    

    res.render('home', { posts
});
  
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.get('/edit/:postId', (req, res) => {
  const postId = req.params.postId;
  const post = posts.find(post => post.id === parseInt(postId));
  
  if (!post) {
    return res.status(404).send('Post not found');
  }

  res.render('edit', { post: post });
});

// Route to handle updating a post
app.post('/edit/:postId', (req, res) => {
  const postId = req.params.postId;
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  const updatedCategory = req.body.category;
  const updatedImg = req.body.img;

  let post = posts.find(post => post.id === parseInt(postId));

  if (!post) {
    return res.status(404).send('Post not found');
  }

  // Update the post
  post.title = updatedTitle;
  post.content = updatedContent;
  post.category = updatedCategory;

  // Redirect to the updated post's page
  res.redirect(`/post/${post.id}`);
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/post/:postId', (req, res) => {
  const postId = parseInt(req.params.postId); // Extract the post ID from the URL
  const post = posts.find(post => post.id === postId); // Find the corresponding post from the array

  if (post) {
      res.render('post', { post }); // Render the 'post.ejs' template with the post data
  } else {
      res.status(404).send('Post not found'); // Handle invalid post IDs
  }
});

app.post('/create', (req, res) => {
  const newPost = {
      id: posts.length + 1, // Assign a new ID (based on the length of the array)
      title: req.body.postTitle,
      content: req.body.postContent,
      category: req.body.postCategory,
      img: req.body.postImg,
  };

posts.push(newPost); // Add the new post to the posts array
res.redirect("/");   // Redirect back to the home page
});


app.post('/delete/:postId', (req, res) => {
  const postId = req.params.postId;
  console.log("Deleting post with ID:", postId);
  
  posts = posts.filter(post => post.id !== parseInt(postId));
  
  res.redirect('/');
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});