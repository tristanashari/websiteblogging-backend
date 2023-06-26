const db = require("../models")

module.exports = {
    async getAllBlog(req,res) {
        const pagination = {
            catID: req.query.catID || undefined,
            page: Number(req.query.page) || 1,
            perPage: 8,
            search: req.query.search || undefined,
            sortBy: req.query.sortBy
        }

        try {
            const where = {}
            if (pagination.search) {
                where.title = {
                    [db.Sequelize.Op.like]: `%${pagination.search}%`
                }
            }
            if (pagination.catID) {
                where.categoryID = {
                    [db.Sequelize.Op.like]: pagination.catID
                }
            }
            const order = []
            for (const sort in pagination.sortBy) {
                order.push([sort, pagination.sortBy[sort]])
            }

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
              attributes: {
                exclude: [
                    "password"
                ]
              },
              where,
              limit: pagination.perPage,
              offset: (pagination.page - 1) * pagination.perPage,
              order
            });

            const totalBlog = await db.Blog.count({where})
            res.send({ 
                message: "success get all blog", 
                pagination: {
                    ...pagination,
                    totalData: totalBlog,
                },
                data: results 
            })
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