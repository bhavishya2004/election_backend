import express from "express";
import pg from "pg";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "election",
  password: "A1b2c3d4e5@",
  port: 5432,
});
db.connect();

app.get("/", function (req, res) {
  res.send("Hello World");
});



app.post("/register", async (req, res) => {
  console.log("Register")
  const username = req.body.username;
  const voteridno = req.body.voteridno;
  const gender = req.body.gender;
  const imgurl = req.body.imgurl;
  const dateofbirth = req.body.dateofbirth;
  const fathername = req.body.fathername;
  try {
    const checkResult = await db.query(
      "SELECT * FROM vote WHERE username = $1",
      [username]
    );
    if (checkResult.rows.length > 0) {
      //if the length of checkResult.rows dose not have any records,entries.
      res.json("username already exists. Try logging in.");
    } else {
      const result = await db.query(
        "INSERT INTO vote (username, voteridno,gender,imgurl,dateofbirth,fathername) VALUES ($1, $2,$3,$4,$5,$6)",
        [username, voteridno,gender,imgurl,dateofbirth,fathername]
      );
      console.log(result);
      res.json("success");
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async function (req, res) {
  let { username, voteridno } = req.body;
  try {
    const result = await db.query(
      "SELECT username ,voteridno FROM vote WHERE username=$1 AND voteridno = $2",
      [username, voteridno]
    );
    console.log(result.rows);
    if (result.rows.length > 0) {
      res.json("success");
    } else {
      res.json("no user found");
    }
  } catch (error) {
    console.log(error);
  }
});
app.post("/checkStatus", async function (req, res) {
  let { username} = req.body;

  try {
    const result = await db.query(
      "SELECT voted FROM vote WHERE username=$1 ",
      [username]
    );
    console.log(result.rows);
    if (result.rows[0] == "0") {
      res.json("not");
    } else {
      res.json("Voted");
    }
  } catch (error) {
    console.log(error);
  }
});
app.post("/addVoterData", async function (req, res) {
  let { username, voteridno, gender, dateofbirth, fathername, imgurl } =
    req.body;

  // v_total = (gender * dateofbirth ) + (fathername * imgurl)
  // console.log(req.body);
  try {
    const result = await db.query(
      "INSERT INTO vote (username,voteridno,gender,dateofbirth,fathername,imgurl) VALUES ($1,$2,$3,$4,$5,$6)",
      [username, voteridno, gender, dateofbirth, fathername, imgurl]
    );
    console.log(result.rows);
    res.json("success");
  } catch (error) {
    console.log(error);
  }
});

app.get("/voterData", async function (req, res) {
  try {
    const result = await db.query("SELECT * FROM vote");
    //console.log(result.rows)
    res.json(result.rows);
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete2", async function (req, res) {
  console.log(req.body);

  try {
    const result = await db.query("DELETE FROM vote WHERE id = $1", [
      req.body.id,
    ]);
    //console.log(result.rows)
    res.json("success");
  } catch (error) {
    console.log(error);
  }
});

app.post("/getUpdateData2", async function (req, res) {
  console.log(req.body);

  try {
    const result = await db.query("SELECT * FROM vote WHERE id = $1", [
      req.body.id,
    ]);
    //  console.log(result.rows[0])
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

app.post("/Vupdate", async function (req, res) {
  console.log(req.body);
  let { id, username, voteridno, gender, dateofbirth, fathername, imgurl } =
    req.body;

  try {
    const result = await db.query(
      "UPDATE vote SET username=$2,voteridno=$3,gender=$4,dateofbirth=$5,fathername=$6,imgurl=$7  WHERE id = $1",
      [id, username, voteridno, gender, dateofbirth, fathername, imgurl]
    );
    //  console.log(result.rows[0])
    //  console.log(result.rows)
    res.json("success");
  } catch (error) {
    console.log(error);
  }
});

app.post("/vote1", async function (req, res) {
  const { id } = req.body;
  try {
    const result = await db.query("UPDATE vote SET voted = 1  WHERE id=$1", [
      id,
    ]);
    console.log(result.rows);
    res.json("success");
  } catch (error) {
    console.log(error);
  }
});

app.post("/addCandidate", async function (req, res) {
  let { cno, cname, cparty, csymble, totalvote, imgurl } = req.body;

  // v_total = (gender * dateofbirth ) + (fathername * imgurl)
  // console.log(req.body);
  try {
    const result = await db.query(
      "INSERT INTO candidate (cno,cname,cparty,csymble,totalvote,imgurl) VALUES ($1,$2,$3,$4,$5,$6)",
      [cno, cname, cparty, csymble, totalvote, imgurl]
    );
    console.log(result.rows);
    res.json("success");
  } catch (error) {
    console.log(error);
  }
});

app.get("/candidateData", async function (req, res) {
  try {
    const result = await db.query("SELECT * FROM candidate");
    //console.log(result.rows)
    res.json(result.rows);
  } catch (error) {
    console.log(error);
  }
});

app.post("/delete1", async function (req, res) {
  console.log(req.body);

  try {
    const result = await db.query("DELETE FROM candidate WHERE id = $1", [
      req.body.id,
    ]);
    //console.log(result.rows)
    res.json("success");
  } catch (error) {
    console.log(error);
  }
});

app.post("/getUpdateData1", async function (req, res) {
  console.log(req.body);

  try {
    const result = await db.query("SELECT * FROM candidate WHERE id = $1", [
      req.body.id,
    ]);
    //  console.log(result.rows[0])
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
  }
});

app.post("/Cupdate", async function (req, res) {
  console.log(req.body);
  let { id, cno, cname, cparty, csymble, totalvote, imgurl } = req.body;

  try {
    const result = await db.query(
      "UPDATE candidate SET cno=$2,cname=$3,cparty=$4,csymble=$5,totalvote=$6,imgurl=$7  WHERE id = $1",
      [id, cno, cname, cparty, csymble, totalvote, imgurl]
    );
    //  console.log(result.rows[0])
    //  console.log(result.rows)
    res.json("success");
  } catch (error) {
    console.log(error);
  }
});

app.post("/vote", async function (req, res) {
  const { id } = req.body;
  try {
    const result = await db.query(
      "UPDATE candidate SET totalvote=totalvote+ 1  WHERE id=$1",
      [id]
    );
    console.log(result.rows);
    res.json("success");
  } catch (error) {
    console.log(error);
  }
});

app.listen(3001);