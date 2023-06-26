const db = require("../models")

module.exports = {
    async getAllBlog(req,res) {
        const pagination = {
            catID: req.query.catID || undefined,
            page: Number(req.query.page) || 1,
            perPage: 10,
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
          } catch (error) {
            res.status(500).send({
              message: "server error",
              error: error.message,
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
        } catch (error) {
          res.status(500).send({
            message: "server error",
            error: error.message,
          })
        }
      },
      async likeBlog(req, res) {
        const blogID = req.params.id
        const userID = req.user.id

        try{
          const isExist = await db.Blog.findOne({
            where: { id: blogID },
          });
          if (!isExist) {
            return res.status(404).send({
              message: "blog not found",
            });
          }

          const isLiked = await db.Like.findOne({
            where: {
              [db.Sequelize.Op.and] : [{ userID }, { blogID }]
            }
          })
          if(isLiked) {
            return res.status(400).send({
              message: "Blog already liked"
            })
          }

          const likeData = await db.Like.create({
            userID,
            blogID
          })

          res.status(200).send({
            message: "Liked",
            data: likeData
          })
        } catch(error) {
          res.status(500).send({
            message: "server error",
            error: error.message
          })
        }
      },
      async mostFavorite(req, res) {
        try{
          const mostFavorite = await db.Like.findAll({
            attributes: [
              "blogID",
              [db.sequelize.fn("COUNT", db.sequelize.col("userID")), "likeCount"],
            ],
            include: [
              {
                model: db.Blog,
                include: [
                  {
                    model: db.User,
                    attributes: ["username"],
                  },
                  {
                    model: db.Category,
                    attributes: ["categoryName"],
                  },
                ],
              },
            ],
            group: ["blogID"],
            order: [[db.sequelize.literal("likeCount"), "DESC"]],
            limit: 10,
          });

          res.status(200).send({
            message: "Most Favorite Blogs",
            data: mostFavorite
          })
        } catch(error) {
          res.status(500).send({
            message: "server error",
            error: error.message
          })
        }
      },
      async getMyBlog(req,res) {
        const authorID = req.user.id
        const pagination = {
          catID: req.query.catID || undefined,
          page: Number(req.query.page) || 1,
          perPage: 10,
          search: req.query.search || undefined,
          sortBy: req.query.sortBy
        }

        try {
          const where = { authorID }
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
        } catch (error) {
          res.status(500).send({
            message: "server error",
            error: error.message,
          });
        }
      },
      async getLikedBlog(req,res) {
        const userID = req.user.id;
        try {
          const blogData = await db.Like.findAll({
            where: {
              userID,
            },
            include: db.Blog,
          })
    
          res.status(200).send({
            message: "Liked Blogs",
            blogData,
          })
        } catch (error) {
          res.status(500).send({
            message: "server error",
            error: error.message,
          })
        }
      }
}