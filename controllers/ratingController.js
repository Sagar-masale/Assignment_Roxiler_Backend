import Rating from "../models/rating.model.js";

export const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    const existingRating = await Rating.findOne({
      user: req.user._id,
      store: storeId,
    })

    if (existingRating) {
      existingRating.rating = rating
      await existingRating.save();

      return res.status(200).json({ message: "Rating updated" });
    }

    await Rating.create({
      user: req.user._id,
      store: storeId,
      rating,
    })

    res.status(201).json({ message: "Rating submitted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}