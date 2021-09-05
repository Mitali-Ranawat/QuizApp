const router = require("express").Router();
const bcrypt = require("bcrypt");
const user = require("../../models/user.model");
const jwt = require("jsonwebtoken");
const verify= require('../../middleware/verifyToken');

// router.route("/").get((req, res) => {
//   user
//     .find()
//     .then((users) => res.json(users))
//     .catch((err) => res.status(400).json("error : " + err));
// });

//to get logged in users info
router.route("/myInfo").get(verify,async(req,res)=>{
  try{
    email=req.user.email;
    const doc = await user.findOne({ email });
    if(doc){
      let myInfo={
        name: doc.name,
        email:doc.email,
        id:doc._id,
        phone:doc.phone,
        role:doc.role
        };
      res.status(200).send({message:myInfo,success:true})
    }else{
      res.send({message:"Given user does not exists",success:false})
    }
  }catch(err){
    res.send({message:"Error occured check your internet",success:false})
  }
})


//signup route
router.route("/add").post(async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email.toLowerCase();
    const password = await bcrypt.hash(req.body.password, 10);

    const doc = await user.findOne({ email }).exec();
    if (doc) {
      return res.status(400).send({ message: "Account already exists!",success:false });
    }
    let newuser;
    if(req.body.phone){
      const phone= req.body.phone;
      newuser = new user({ name, email, password,phone });
    }else{
      newuser = new user({ name, email, password });
    }
    newuser
      .save()
      .then(() => res.send({message:"user added!",success:true}))
      .catch((err) => res.status(400).json({message:"Error while saving the new user",success:false}));
  } catch (err) {
    return res.status(400).send({message:"Error occured check your internet",success:false});
  }
});




//login route
router.route("/login").post(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  const doc = await user.findOne({ email }).exec();
  if (!doc) {
    return res.status(400).send({"message":"Incorrect password/email",success:false});
  }

  const passwordCheck = bcrypt.compareSync(password, doc.password);
  if (!passwordCheck) {
    return res.status(400).send({"message":"Incorrect password",success:false});
  } else {
    const token = jwt.sign(
      { id: doc._id, email: doc.email },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.status(200).send({ "message":{role: doc.role,name:doc.name,token:token},success:true});
  }
});

module.exports = router;