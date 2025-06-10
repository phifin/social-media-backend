import Message from "../Models/message.js";
export async function getMessages(req, res) {
  const  userId = req.userId;
  const { partnerId } = req.params;

  const messages = await Message.find({
    $or: [
      { from: userId, to: partnerId },
      { from: partnerId, to: userId },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
}

export const sendMessage = async (req, res) => {
    try {
      const from = req.userId; 
      const { to, content, type } = req.body;
  
      const message = await Message.create({
        from,
        to,
        content,
      });
  
      res.status(201).json(message);
    } catch (err) {
      console.error("Send Message Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
