const Canvas = require("../models/canvas");
const mongoose = require("mongoose");

// Helper function to handle errors
const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({
    success: false,
    message: "An error occurred",
    error: error.message,
  });
};

const canvasController = {
  // Create a new canvas
  createCanvas: async (req, res) => {
    try {
      const { name } = req.body;
      console.log(req.body);

      const user_id = req.user?.id; // Assuming you have user data in req.user from auth middleware
      
      // Special handling for guest user
      let userIdForDb = user_id;
      
      // If this is a guest user, create a valid ObjectId for the database
      if (user_id === 'guest-user-id') {
        userIdForDb = mongoose.Types.ObjectId();
      }

      // Generate a unique canvas_id
      const canvas_id = Date.now().toString();

      const newCanvas = new Canvas({
        name: name,
        canvas_id,
        user_id: userIdForDb,
        last_modified: new Date(),
      });

      const savedCanvas = await newCanvas.save();

      return res.status(201).json({
        success: true,
        message: "Canvas created successfully",
        data: savedCanvas,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // Get all canvases for a user
  getAllCanvases: async (req, res) => {
    try {
      const user_id = req.user.id;
      
      // For guest users, return an empty array since they don't have persistent storage
      if (user_id === 'guest-user-id') {
        return res.status(200).json({
          success: true,
          message: "Canvases retrieved successfully",
          data: [],
        });
      }

      const canvases = await Canvas.find({ user_id }).sort({
        last_modified: -1,
      });

      return res.status(200).json({
        success: true,
        message: "Canvases retrieved successfully",
        data: canvases,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // Get a single canvas by canvas_id
  getCanvas: async (req, res) => {
    try {
      const { canvas_id } = req.params;
      const user_id = req.user.id;

      const canvas = await Canvas.findOne({ canvas_id, user_id });

      if (!canvas) {
        return res.status(404).json({
          success: false,
          message: "Canvas not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Canvas retrieved successfully",
        data: canvas,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // Update a canvas
  updateCanvas: async (req, res) => {
    try {
      const { canvas_id } = req.params;
      const { nodes, edges } = req.body;

      const user_id = req.user.id;

      const updatedCanvas = await Canvas.findOneAndUpdate(
        { canvas_id, user_id },
        {
          $set: {
            nodes,
            edges,
            last_modified: new Date(),
          },
        },
        { new: true } // Return the updated document
      );

      if (!updatedCanvas) {
        return res.status(404).json({
          success: false,
          message: "Canvas not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Canvas updated successfully",
        data: updatedCanvas,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // Delete a canvas
  deleteCanvas: async (req, res) => {
    try {
      const { canvas_id } = req.params;
      const user_id = req.user._id;

      const deletedCanvas = await Canvas.findOneAndDelete({
        canvas_id,
        user_id,
      });

      if (!deletedCanvas) {
        return res.status(404).json({
          success: false,
          message: "Canvas not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Canvas deleted successfully",
        data: deletedCanvas,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },

  // Search canvases by name
  searchCanvases: async (req, res) => {
    try {
      const { query } = req.query;
      const user_id = req.user._id;

      const canvases = await Canvas.find({
        user_id,
        name: { $regex: query, $options: "i" },
      }).sort({ last_modified: -1 });

      return res.status(200).json({
        success: true,
        message: "Search completed successfully",
        data: canvases,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },
};

module.exports = canvasController;
