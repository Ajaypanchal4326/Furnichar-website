import axios from "axios";

export const getMLRecommendations = async (req, res) => {
  const { productId } = req.params;

  const response = await axios.get(
    `http://localhost:8000/recommend/${productId}`
  );

  res.json(response.data);
};
