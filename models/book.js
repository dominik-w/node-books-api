const mongoose = require('mongoose');

// Reviews model.
const reviewSchema = mongoose.Schema({
    review: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true
  }
);

// Books model.
const bookSchema = mongoose.Schema({
    bookName: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    releaseDate: {
      type: Date,
      default: Date.now(),
      required: true
    },
    genre: {
      type: String,
      required: true
    },
    reviews: [reviewSchema]
  },
  {
    timestamps: true,
    collection: 'books'
  }
);

// Enable indexes...
// bookSchema.index({ bookName: 1, author: 1, genre: 1 });

// Export models.
const Book = module.exports = mongoose.model('book', bookSchema);

module.exports.get = function(callback, limit) {
  Book.find(callback).limit(limit);
};
