const axios = require("axios");

const modelsController = {
  processImage: async (req, res) => {
    try {
      const { image } = req.body;

      const response = await axios.post("http://localhost:3000/process-image", {
        image: image,
      });

      if (response.status === 200) {
        return res.status(200).json({
          success: true,
          data: response.data,
        });
      } else {
        return res.status(response.status).json({
          success: false,
          message: "Failed to process image.",
        });
      }
    } catch (error) {
      console.error("Error processing image:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing the image.",
        error: error.message,
      });
    }
  },
};

module.exports = modelsController;
