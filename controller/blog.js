const db = require("../models")

module.exports = {
    async getAllBlog(req,res) {
        try {
            const results = await db.Blog.findAll({
              include: [
                {
                  model: db.User,
                  attributes: ["username"],
                },
                {
                    model: db.Category,
                    attributes: ["categoryName"]
                }
              ],
            });
            res.send({ message: "success get all blog", data: results });
          } catch (errors) {
            res.status(500).send({
              message: "server error",
              errors,
            });
          }
    },
    async createBlog(req, res) {
        const authorID = req.user.id
        const { title, content, categoryID, videoURL, keywords, country } = req.body
        const imgURL = `/static/${req.file.filename}`
        try {
          const newBlog = await db.Blog.create({ title, authorID, imgURL, categoryID, content, videoURL, keywords, country })
          res.status(201).send({
            message: "success create blog",
            data: newBlog,
          });
        } catch (errors) {
          res.status(500).send({
            message: "server error",
            errors,
          })
        }
      }
}