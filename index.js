import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());



    mongoose.connect("mongodb+srv://shubhamingole0020:S2CX4NLjvUott9lR@elansol.29yhjmv.mongodb.net/?retryWrites=true&w=majority&appName=elansol", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected");
});

const userSchema = new mongoose.Schema({
    name: String,
    dob: String,
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

//Routes

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successfull", user: user });
            } else {
                res.send({ message: "Password didn't match" });
            }
        } else {
            res.send({ message: "User not registered" });
        }
    });
});

app.post("/register", (req, res) => {
    const { name, dob, email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: "User already registered" });
        } else {
            const newUser = new User({
                name,
                dob,
                email,
                password
            });
            newUser.save(err => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({ message: "Successfully Registered, Please login now." });
                }
            });
        }
    });
});

app.delete("/remove/:userId", (req, res) => {
    const userId = req.params.userId;

    User.findByIdAndRemove(userId, (err, user) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (user) {
                res.status(200).send({ message: "User removed successfully" });
            } else {
                res.status(404).send({ message: "User not found" });
            }
        }
    });
});

app.get("/users", (req, res) => {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(users);
        }
    });
});

app.listen(9002, () => {
    console.log("BE started at port 9002");
});
