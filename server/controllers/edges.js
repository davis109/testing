const Node = require("../models/nodes");

const edgesController = {
  createEdge: async (req, res) => {
    try {
      const { source, target } = req.body;
      const { canvas_id } = req.params;
      const user_id = req.user?.id;

      const newNode = new Node({
        canvas_id,
        user_id,
        source,
        target,
        last_modified: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: "Edge created successfully",
        data: newNode,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },
};

module.exports = edgesController;
