import axios from "axios";


const RECOMMEND_BASE_URL = process.env.RECOMMEND_SERVICE_URL;

export const getMLRecommendations = async (req, res) => {
  const { productId } = req.params;

  const response = await axios.get(
     `${RECOMMEND_BASE_URL}/recommend/${productId}`
  );

  res.json(response.data);
};
