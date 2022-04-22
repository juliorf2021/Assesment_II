const FavsList = require('../models/FavsList');

const getAllFavsLists = async (req, res, next) => {
  try {
    const favsLists = await FavsList.find({ userId: req.token.userId });
    return res.json(favsLists);
  } catch (err) {
    return next(err);
  }
};

const createFavsList = async (req, res, next) => {
  try {
    const favsList = await FavsList.create({
      name: req.body.name,
      userId: req.token.userId,
      favs: [],
    });

    return res.status(201).json(favsList);
  } catch (err) {
    return next(err);
  }
};

const getFavsListById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.token;

    const favsList = await FavsList.findOne({ _id: id, userId });
    if (!favsList)
      return res
        .status(400)
        .json({ error: `favs with id ${id} does not exist` });

    return res.json(favsList);
  } catch (err) {
    return next(err);
  }
};

const deleteFavsListById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.token;

    const favsList = await FavsList.findOne({ _id: id, userId });
    if (!favsList)
      return res
        .status(400)
        .json({ error: `favs with id ${id} does not exist` });

    await FavsList.deleteOne({ _id: id, userId });
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};

const addItemToFavsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.token;
    const favsItem = req.body;

    const favsList = await FavsList.findOne({ _id: id, userId });
    if (!favsList)
      return res
        .status(400)
        .json({ error: `favs with id ${id} does not exist` });

    await FavsList.updateOne(
      { _id: id, userId },
      {
        $push: {
          favs: [favsItem],
        },
      }
    );

    return res.status(201).json(favsItem);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getAllFavsLists,
  createFavsList,
  getFavsListById,
  deleteFavsListById,
  addItemToFavsById,
};
