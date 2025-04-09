const mongoose = require("mongoose");
const Node = require("../models/nodes");

const nodesController = {
  createNode: async (req, res, next) => {
    try {
      const position = JSON.parse(req.body.position);
      const data = JSON.parse(req.body.data);
      const type = req.body.type;
      const { canvas_id } = req.params;
      const user_id = req.user?.id;
      const image_path = req.body.filePath;

      if (!canvas_id || !user_id || !type || !data || !position) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const newNode = new Node({
        canvas_id,
        user_id,
        type,
        data,
        image_path,
        position,
        last_modified: new Date(),
      });

      await newNode.save();

      return res.status(201).json({
        success: true,
        message: "Node created successfully",
        data: newNode,
      });
    } catch (error) {
      next(error);
    }
  },

  FetchNodes: async (req, res, next) => {
    try {
      const { canvas_id, node_id } = req.params;

      return res.status(201).json({
        success: true,
        message: "Node created successfully",
        data: newNode,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = nodesController;
