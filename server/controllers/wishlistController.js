const Wishlist = require('../models/Wishlist');

const wishlistController = {
  addToWishlist: async (req, res) => {
    try {
      const { userId, cardId } = req.body;
      const newEntry = new Wishlist({ user: userId, card: cardId });
      await newEntry.save();
      res.status(201).json(newEntry);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = wishlistController;
