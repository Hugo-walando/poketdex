const Notification = require('../models/Notification');

const notificationController = {
  // Créer une notification
  createNotification: async (req, res) => {
    try {
      const { userId, type, content } = req.body;
      
      const newNotification = new Notification({
        user: userId,
        type,
        content
      });

      await newNotification.save();
      res.status(201).json(newNotification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (req, res) => {
    try {
      const updatedNotification = await Notification.findByIdAndUpdate(
        req.params.id,
        { is_read: true },
        { new: true }
      );
      res.json(updatedNotification);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

module.exports = notificationController;
