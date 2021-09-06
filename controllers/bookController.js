// Book controller.
const AppConfig = require('../common/app-config');
Book = require('../models/book');

// Basic CRUD.

// List action.
exports.index = function(req, res) {
  Book.get(function(err, books) {
    if (err) {
      res.json({
        status: AppConfig.api.statusError,
        message: err
      });
    }
    res.json({
      status: AppConfig.api.statusSuccess,
      message: 'Books retrieved successfully.',
      data: books
    });
  });
};

// Show/view action.
exports.view = function(req, res) {
  Book.findById(req.params.book_id, function(err, book) {
    if (err) {
      res.json({
        status: AppConfig.api.statusError,
        message: err
      });
    }
    res.json({
      status: AppConfig.api.statusSuccess,
      message: 'Book found.',
      data: book
    });
  });
};

// Update.
exports.update = function(req, res) {
  Book.findById(req.params.book_id, function(err, book) {
    if (err) {
      res.json({
        status: AppConfig.api.statusError,
        message: err
      });
    }

    book.bookName = req.body.bookName;
    book.author = req.body.author;
    book.releaseDate = req.body.releaseDate;
    book.genre = req.body.genre;
    book.reviews = req.body.reviews;
    book.save(function(err) {
      if (err) {
        res.json({
          status: AppConfig.api.statusError,
          message: err
        });
      }
      res.json({
        status: AppConfig.api.statusSuccess,
        message: 'Book record updated.',
        data: book
      });
    });
  });
};

// Delete.
exports.delete = function(req, res) {
  Book.deleteOne({
    _id: req.params.book_id
  }, function(err) {
    if (err) {
      res.json({
        status: AppConfig.api.statusError,
        message: err
      });
    }
    res.json({
      status: AppConfig.api.statusSuccess,
      message: 'Book record deleted.',
      data: {}
    });
  });
};

// Create action.
// POST add a new book to the directory.
exports.new = function(req, res) {
  let book = new Book();
  book.bookName = req.body.bookName;
  book.author = req.body.author;
  book.releaseDate = req.body.releaseDate ? req.body.releaseDate : book.releaseDate;
  book.genre = req.body.genre;
  book.reviews = req.body.reviews;

  book.save(function(err) {
    if (err) {
      res.json({
        status: AppConfig.api.statusError,
        message: err
      });
    }
    res.json({
      status: AppConfig.api.statusSuccess,
      message: 'New book created.',
      data: book
    });
  });
};

// Extended.

// GET books grouped by genre.
exports.indexGenre = function(req, res) {
  Book.aggregate([
    {
      $group: {
        _id: "$genre",
        bookName: { $first: "$bookName" },
        author: { $first: "$author" },
        releaseDate: { $first: "$releaseDate" },
        // reviews: { $first: "$reviews" },
        count: { $sum: 1 }
      }
    },
  ]).exec(function(err, books) {
    if (err) {
      res.json({
        status: AppConfig.api.statusError,
        message: err
      });
    }
    res.json({
      status: AppConfig.api.statusSuccess,
      message: 'Books by genre.',
      data: books
    });
  });
};

// GET books grouped by genre and release date.
exports.indexGenreDate = function(req, res) {
  Book.aggregate([
    {
      $group: {
        _id: {
          genre: "$genre",
          releaseDate: "$releaseDate"
        },

        bookName: { $first: "$bookName" },
        author: { $first: "$author" },
        count: { $sum: 1 }
      }
    },
  ]).exec(function(err, books) {
    if (err) {
      res.json({
        status: AppConfig.api.statusError,
        message: err
      });
    }
    res.json({
      status: AppConfig.api.statusSuccess,
      message: 'Books by genre and release date.',
      data: books
    });
  });
};

// GET sum of review ratings grouped by author.
exports.indexSumAuthorReviews = function(req, res) {
  Book.aggregate([
    {
      $unwind: "$reviews"
    },
    {
      $group: {
        _id: "$author",
        sum: { $sum: "$reviews.rating" },
        count: { $sum: 1 }
      }
    },
  ]).exec(function(err, books) {
    if (err) {
      res.json({
        status: AppConfig.api.statusError,
        message: err
      });
    }
    res.json({
      status: AppConfig.api.statusSuccess,
      message: 'A sum of review ratings grouped by author.',
      data: books
    });
  });
};


// POST add a review.
exports.newReview = function(req, res) {
  Book.findById(req.body.book_id, function(err, book) {
    if (err) {
      res.json({
        status: AppConfig.api.statusError,
        message: err
      });
    }

    const rev = {
      review: req.body.review,
      rating: req.body.rating
    }
    book.reviews.push(rev);
    book.save(function(err) {
      if (err) {
        res.json({
          status: AppConfig.api.statusError,
          message: err
        });
      }
      res.json({
        status: AppConfig.api.statusSuccess,
        message: 'New review created.'
      });
    });
  });
};

// DELETE delete a review.
exports.deleteReview = function(req, res) {
  Book.findById(req.body.book_id, function(err, book) {
    if (err) {
      res.json({
        status: AppConfig.api.statusError,
        message: err
      });
    }

    book.reviews.pull({ _id: req.body.review_id });
    book.save(function(err) {
      if (err) {
        res.json({
          status: AppConfig.api.statusError,
          message: err
        });
      }
      res.json({
        status: AppConfig.api.statusSuccess,
        message: 'Review record deleted.'
      });
    });
  });
};
