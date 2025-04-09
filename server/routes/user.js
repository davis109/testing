const router = require("express").Router();
const userController = require("../controllers/user");
const canvasController = require("../controllers/canvas");

const modelsController = require("../controllers/models");
const nodesController = require("../controllers/nodes");
const edgesController = require("../controllers/edges");

const authMiddleware = require("../middlewares/isAuth");
const fileMiddleware = require("../middlewares/fileHandler");
router.post("/info", authMiddleware.isAuth, userController.getUserInfo);

//canvas CRUD

router.post(
  "/canvas/create",
  authMiddleware.isAuth,
  canvasController.createCanvas
);
router.get("/canvas", authMiddleware.isAuth, canvasController.getAllCanvases);

router.get(
  "/canvas/search",
  authMiddleware.isAuth,
  canvasController.searchCanvases
);
router.get(
  "/canvas/:canvas_id",
  authMiddleware.isAuth,
  canvasController.getCanvas
);
router.put(
  "/canvas/:canvas_id",
  authMiddleware.isAuth,
  canvasController.updateCanvas
);
router.delete(
  "/canvas/:canvas_id",
  authMiddleware.isAuth,
  canvasController.deleteCanvas
);

//processing

router.post(
  "/process/image",
  authMiddleware.isAuth,
  modelsController.processImage
);

//handle nodes

router.post(
  "/create/node/:canvas_id",
  authMiddleware.isAuth,
  fileMiddleware.uploadImage,
  nodesController.createNode
);

//handle edges

router.post(
  "/create/edge/:canvas_id",
  authMiddleware.isAuth,
  edgesController.createEdge
);

module.exports = {
  use: "/user",
  router,
};
