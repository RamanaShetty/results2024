const updateVoteQuery =
  "UPDATE candidates SET votes = ? WHERE candidate_id = ? AND constituency_id = ?";

const validationQuery =
  "SELECT COUNT(*) AS count FROM users WHERE user_id = ? AND pwd = ?;";

const postTokenQuery = "INSERT INTO tokenised (user_id,tokens) VALUES (?, ?)";

const checkTokenQuery =
  "SELECT COUNT(*) AS count FROM tokenised WHERE tokens=?;";

module.exports = {
  updateVoteQuery,
  validationQuery,
  postTokenQuery,
  checkTokenQuery,
};
