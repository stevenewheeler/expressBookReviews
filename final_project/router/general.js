const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});


// ASYNCHRONOUS METHODS //

// Get the book list available in the shop with get books promise
public_users.get("/get-books",function (req, res) {
    
    const get_books = new Promise((resolve, reject) => {
      resolve(res.send(JSON.stringify({ books }, null, 4)));
    });

    get_books.then(() => console.log("Promise Resolved: Get Books"));
    
});
  
// Get book details based on ISBN with get books ISBN promise
public_users.get("/get-books-ISBN",function (req, res) {
    
    const isbn = req.params.isbn
    const get_books_ISBN = new Promise((resolve, reject) => {
      if(req.params.isbn <=10) {
      resolve(res.send(books[isbn]));
    }
      else {
      reject(res.send("ISBN Not Found"));
      }
    });

    get_books_ISBN.then(() => console.log("Promise Resolved: Get Books by ISBN"));
  
});

// Get book details based on author with get books author promise
public_users.get("/get-books-author",function (req, res) {
    
    const get_books_author = new Promise((resolve, reject) => {

    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({ books }, null, 4)));
    }

    });
    reject(res.send("Author does not exist "))
        
    });

    get_books_author.then(() => console.log("Promise Resolved: Get Books by Author"));
  
});

// Get book details based on title with get books title promise
public_users.get("/get-books-title",function (req, res) {
    
    const get_books_title = new Promise((resolve, reject) => {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                           "author":books[isbn]["author"],
                           "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({ books }, null, 4)));
    }

    });
    reject(res.send("Title does not exist "))

    });

    get_books_title.then(() => console.log("Promise Resolved: Get Books by Title"));
  
});


// SYNCHRONOUS METHODS //

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbyauthor}, null, 4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                           "author":books[isbn]["author"],
                           "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbytitle}, null, 4));
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const reviews = books[isbn]["reviews"];
    res.send(JSON.stringify(reviews,null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
