import Store from "../models/store.model.js";
import Rating from "../models/rating.model.js";

export const getStores = async (req, res) => {
  try {
    const stores = await Store.find();

    const updatedStores = await Promise.all(
      stores.map(async (store) => {
        const ratings = await Rating.find({
          store: store._id,
        });

        const avgRating =
          ratings.length > 0
            ? ratings.reduce((acc, item) => acc + item.rating, 0) /
              ratings.length
            : 0;

        const userRating = await Rating.findOne({
          store: store._id,
          user: req.user._id,
        });

        return {
          ...store._doc,
          avgRating,
          userRating: userRating?.rating || null,
        };
      }),
    );

    res.status(200).json(updatedStores);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
