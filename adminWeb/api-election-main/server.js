const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const db = require("./dbConnection");
const {
  updateVoteQuery,
  validationQuery,
  postTokenQuery,
  checkTokenQuery,
} = require("./Queries");

const app = express();

const port = 3000;
const secret = "H5Tn&X*6Swp$!2gF";

app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5500",
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/login", async (req, res) => {
  const { userId, pwd } = req.query;

  db.query(validationQuery, [userId, pwd], async (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server error");
    } else {
      if (result[0].count > 0) {
        jwt.sign({ userId }, secret, async (err, token) => {
          if (err) {
            console.log(err);
            res.status(500).send("Token generation error");
          } else {
            db.query(postTokenQuery, [userId, token], (err, result) => {
              if (err) {
                console.log(err);
                res.status(500).send("Database update error");
              } else {
                res.status(200).send(token);
              }
            });
          }
        });
      } else {
        res.status(401).send("Invalid credentials");
      }
    }
  });
});

app.put("/update-votes", (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, secret, (err, decode) => {
    if (err) throw err;
    db.query(checkTokenQuery, [token], (err, result) => {
      if (err) {
        res.status(500).send("");
      }
      const votesData = req.body;
      console.log(votesData);
      if (!Array.isArray(votesData) || votesData.length === 0) {
        res.status(400).send("Invalid format of data");
      }

      votesData.forEach((voteData) => {
        const { constituencyId, candiId, votes } = voteData;

        db.query(
          updateVoteQuery,
          [votes, candiId, constituencyId],
          (err, result) => {
            if (err) console.log(err);
          }
        );
      });
      res.status(200).send(result);
    });
  });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
