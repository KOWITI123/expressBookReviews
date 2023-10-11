const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
// Check if username is at least 4 characters
if (username.length < 4) {
    return false;
  }

  // Check if the username consists of letters, numbers, and underscores
  const validChars = /^[a-zA-Z0-9_]+$/;
  if (!validChars.test(username)) {
    return false;
  }

  // Check if the username doesn't start with an underscore
  if (username[0] === '_') {
    return false;
  }

  // If all checks pass, the username is valid
  return true;
}


const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const user = users.find((user) => user.username === username);
return user && user.password === password;
}

// Only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: 'Invalid username and/or password' });
    }
  
    // If authentication is successful, generate a JWT token
    const token = jwt.sign({ username }, 'your_secret_key_here', { expiresIn: '1h' });
  
    // Save the token in the session
    req.session.accessToken = token;
  
    return res.status(200).json({ message: 'Authentication successful', token });
});

  

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: 'Review is required' });
  }

  // Get the username from the session
  const username = req.session.username;

  // Check if a review already exists for the given ISBN by the same user
  const existingReviewIndex = books[isbn].reviews.findIndex((r) => r.username === username);

  if (existingReviewIndex !== -1) {
    // Modify the existing review
    books[isbn].reviews[existingReviewIndex].review = review;
  } else {
    // Add a new review
    books[isbn].reviews.push({ username, review });
  }

  return res.status(200).json({ message: 'Review added/modified successfully' });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
