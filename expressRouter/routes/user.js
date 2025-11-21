import express from 'express';
const router = express.Router();

router.get("/", (req, res) => {
    res.send("this is for users");
    console.log(req.cookies);
    
});
router.get("/:id", (req, res) => {
    res.send(`this is a user, ${req.params.id}`);
});
router.post("/", (req, res) => {
    res.send("all users will be saved");
});
router.delete("/:id", (req, res) => {
    res.send(`the user ${req.params.id} deleted successfully`);
});

export default router;