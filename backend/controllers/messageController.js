const { User, Message, Block } = require('../models');
const { Op } = require('sequelize');

exports.sendMessage = async (req, res) => {
  try {
    const { receiver_usercode, content } = req.body;
    const sender_id = req.user.id;

    // 1. Enforce 250-character limit
    if (!content || content.length > 250) {
      return res.status(400).json({ message: 'Message must be between 1 and 250 characters.' });
    }

    // 2. Find Receiver
    const receiver = await User.findOne({ where: { public_usercode: receiver_usercode } });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found.' });
    }
    const receiver_id = receiver.id;

    // Prevent sending to self
    if (sender_id === receiver_id) {
      return res.status(400).json({ message: 'You cannot send messages to yourself.' });
    }

    // 3. Check if Sender is Blocked by Receiver
    const isBlocked = await Block.findOne({
      where: {
        blocker_id: receiver_id,
        blocked_id: sender_id
      }
    });

    if (isBlocked) {
      return res.status(403).json({ message: 'You are blocked by this user.' });
    }

    // 4. Rate Limiting Check (30 messages/24h)
    const dayAgo = new Date(new Date() - 24 * 60 * 60 * 1000);
    const messageCount = await Message.count({
      where: {
        sender_id,
        receiver_id,
        createdAt: { [Op.gt]: dayAgo }
      }
    });

    if (messageCount >= 30) {
      return res.status(429).json({ message: 'Daily limit of 30 messages reached for this user.' });
    }

    // 5. Save Message
    const message = await Message.create({
      sender_id,
      receiver_id,
      content
    });

    res.status(201).json({
      message: 'Message sent successfully.',
      data: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt
      }
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error while sending message.' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get all messages where user is either sender or receiver
    // Note: In actual implementation, we might want to group by 'thread'
    // For now, simpler fetch
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching messages.' });
  }
};
