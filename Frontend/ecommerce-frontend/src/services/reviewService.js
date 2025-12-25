export const getReviews = async (productId) => {
  const res = await fetch(`/api/reviews/${productId}`);
  return res.json();
};

export const submitReview = async (productId, data, token) => {
  const res = await fetch(`/api/reviews/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};
