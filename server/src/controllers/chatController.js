import { processChatRequest } from '../services/chatService.js';

export async function handleChatMessage(req, res, next) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const response = await processChatRequest(message);
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
}
