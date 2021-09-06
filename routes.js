const Router = require('express').Router();

// Default API response.
Router.get('/', function(req, res) {
  res.json({
    status: 'OK',
    message: 'Book /api/'
  });
});

// Book routes.
const bookController = require('./controllers/bookController');

Router.route('/books')
  .get(bookController.index)
  .post(bookController.new);

Router.route('/books/:book_id')
  .get(bookController.view)
  .patch(bookController.update)
  .put(bookController.update)
  .delete(bookController.delete);

Router.route('/books_genre')
  .get(bookController.indexGenre);

Router.route('/books_genre_date')
  .get(bookController.indexGenreDate);

Router.route('/books_author_rating')
  .get(bookController.indexSumAuthorReviews);

Router.route('/books_review')
  .post(bookController.newReview)
  .delete(bookController.deleteReview);

// Export router.
module.exports = Router;
