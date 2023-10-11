const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// Register a new user
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
  });


// Get the book list available in the shop
// public_users.get('/',function (req, res) {
  
//     const listedBooks = Object.values(books).map((book) => {
//         return {
//             author: book.author,
//             title: book.title
//         }
//     });
//     const booksJson = JSON.stringify(listedBooks); 
//   return res.status(200).send(booksJson);
// });

public_users.get('/', async function (req, res) {
    try {
      const listedBooks = Object.values(books).map((book) => {
        return {
          author: book.author,
          title: book.title
        };
      });
  
      const booksJson = JSON.stringify(listedBooks);
      res.status(200).send(booksJson);
    } catch (error) {
      res.status(500).send({ error: 'An error occurred' });
    }
  });

//  

// Get book details based on ISBN

  public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
  
    try {
      const book = books[isbn];
      if (book) {
        const bookDetails = {
          author: book.author,
          title: book.title,
          reviews: book.reviews
        };
        res.status(200).json(bookDetails);
      } else {
        throw { status: 404, message: 'Book not found' };
      }
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  });
  
  
// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     const authorName = req.params.author;
//     const matchingBooks = [];

//     for (const isbn in books) {
//         const book = books[isbn];
//         if (book.author === authorName) {
//             matchingBooks.push({
//                 isbn: isbn,
//                 author: book.author,
//                 title: book.title,
//             });
//         }
//     }

//     if (matchingBooks.length > 0) {
//         res.status(200).json(matchingBooks);
//     } else {
//         res.status(404).json({ message: "No books found by the specified author" });
//     }
// });

// public_users.get('/title/:title', function (req, res) {
//     const bookTitle = req.params.title;
//     const matchingBooks = [];
  
//     for (const isbn in books) {
//       const book = books[isbn];
//       if (book.title === bookTitle) {
//         matchingBooks.push({
//           isbn: isbn,
//           author: book.author,
//           title: book.title,
//         });
//       }
//     }
  
//     if (matchingBooks.length > 0) {
//       res.status(200).json(matchingBooks);
//     } else {
//       res.status(404).json({ message: 'No books found with the specified title' });
//     }
//   });
  
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const bookTitle = req.params.title;

  try {
    const matchingBooks = [];
    for (const isbn in books) {
      const book = books[isbn];
      if (book.title === bookTitle) {
        matchingBooks.push({
          isbn: isbn,
          author: book.author,
          title: book.title,
        });
      }
    }

    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      throw { status: 404, message: 'No books found with the specified title' };
    }
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

// Get book reviews based on ISBN
// public_users.get('/review/:isbn', function (req, res) {
//     const isbn = req.params.isbn;

//     // Find the book with the matching ISBN in your 'books' data
//     const book = books[isbn];

//     if (book) {
//         const reviews = book.reviews;

//         if (Object.keys(reviews).length > 0) {
//             // If there are reviews for the book, send them as a JSON response
//             res.status(200).json(reviews);
//         } else {
//             // If there are no reviews for the book, send a 404 (Not Found) response with a custom message
//             res.status(404).json({ message: `No reviews found for ISBN "${isbn}"` });
//         }
//     } else {
//         // If the book with the specified ISBN is not found, send a 404 (Not Found) response with a custom message
//         res.status(404).json({ message: `Book with ISBN "${isbn}" not found` });
//     }
// });

public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const book = books[isbn];

    if (book) {
      const reviews = book.reviews;

      if (Object.keys(reviews).length > 0) {
        res.status(200).json(reviews);
      } else {
        throw { status: 404, message: `No reviews found for ISBN "${isbn}"` };
      }
    } else {
      throw { status: 404, message: `Book with ISBN "${isbn}" not found` };
    }
  } catch (error) {
    res.status(error.status).json({ message: error.message });
  }
});

module.exports.general = public_users;