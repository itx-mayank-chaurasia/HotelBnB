import express from 'express';
const router = express.Router();

router.get("/", (req, res) => {
    res.send("this is all of posts");
});
router.get("/:id", (req, res) => {
    res.send(`this is a post ${req.params.id}`);
});
router.post("/", (req, res) => {
    res.send("all post saved");
});
router.delete("/:id", (req, res) => {
    res.send(`the post ${req.params.id} is deleted`);
});

export default router;