const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const OAuth = require('oauth').OAuth;
const {Client}=require("twitter.js");

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'quizzcatdb.cvqsuiqqa7na.eu-north-1.rds.amazonaws.com',
  user: 'admin',
  password: 'Pranjalcat',
  port:3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID ', connection.threadId);
});

const consumerKey = 'BbTBkxy4KgC0lBXeqKl0Go6FC';
const consumerSecret = 'Jjb9nwLyjam9rvSDpgjx6N10WRmTLxOg8znXG0FyY3VOkpcX1h';
const targetAccountId = 'elonmusk';
const bearerToken="AAAAAAAAAAAAAAAAAAAAABwmuwEAAAAAgPU6iUGQaELk1hoBrLvfqaOTNhc%3DSPi7z3wwiF2eX4VR3qblSrMI3yYHjUG1R3fC1G0rw5mCBe5nvR";

const oauth = new OAuth(
  'https://api.twitter.com/oauth/request_token',
  'https://api.twitter.com/oauth/access_token',
  consumerKey,
  consumerSecret,
  '1.0A',
  null,
  'HMAC-SHA1'
);

app.get('/check-follow', (req, res) => {
  const { user_id, access_token, access_token_secret } = req.query;

  const url = `https://api.twitter.com/1.1/friendships/show.json?source_id=${user_id}&target_id=${targetAccountId}`;

  oauth.get(url, access_token, access_token_secret, (error, data) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error checking follow status');
    } else {
      const relationship = JSON.parse(data).relationship;
      const isFollowing = relationship.source.following;
      res.json({ isFollowing });
    }
  });
});
app.get('/s',(req,res)=>{
  axios.get('https://api.twitter.com/2/users/0xpranjl/following', {
    headers: {
      Authorization: `Bearer ${bearerToken}`
    },
    // params: {
    //   user_id: '0xpranjl' // Replace with the ID of the user whose friends (followed users) you want to fetch
    // }
  })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

