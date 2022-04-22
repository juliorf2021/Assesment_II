const mongoose = require('mongoose');

const favsListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    favs: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FavsList = mongoose.model('FavsList', favsListSchema);

module.exports = FavsList;
