const express = require('express');
const bodyParser = require('body-parser');
const multer = require("multer")
require('dotenv').config()
const fs = require("fs");
const uploadFile = require("./middleware/upload");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const customCss = fs.readFileSync((process.cwd() + "/swagger.css"), "utf8");
const taskController = require('./controller/task.controller');
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";
var cors = require('cors')
const app = express();
app.use(cors())
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCss }));
app.use('/user_folders', express.static('user_folders'));
const path__ = require('path');
const blacklist = [];
const refreshTokens = []
const Stripe_Key = "stripe_key";
const stripe = require("stripe")(Stripe_Key);



function jwtoken(data) {
    let result = {}
    try {
        const userInfo = jwt.verify(data, secretKey);
        result.obj = userInfo,
            result.verified = 'true'
        return result;
    } catch (err) {
        result.verified = 'false'
        return result;
    }
}

//----------------------users route --------------------
app.post("/refreshToken", (req, res) => {
    const refreshToken = req.body.refreshToken; // req.body
    let data = {}
    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.status(401).json({ message: 'Invalid refresh token' }); //if invalid
    }
    try {
        const userInfo = jwt.verify(refreshToken, secretKey); //request token verify
        console.log("---------------->>>>>>>>>>>>>>>>", userInfo)
        const accessToken = jwt.sign(userInfo, secretKey, { expiresIn: '1d' });
        const newRefreshToken = jwt.sign(userInfo, secretKey);
        refreshTokens.push(data.newRefreshToken);
        //---response object
        data.genToken = accessToken
        data.refreshToken = newRefreshToken
        data.status = 200
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        data.message = 'Error generating access token'
        data.status = 500
        return res.status(500).json(data);
    }
})

app.post("/api/logIn", async (req, res) => {
    taskController.logInTask(req.body).then(data => {
        if (data.status == 200) {
            refreshTokens.push(data.refreshToken);
            // console.log(refreshTokens)
            res.status(200).json(data)
        } else if (data.status == 400) {
            res.status(400).json(data)
        }
        else if (data.status == 404) {
            res.status(404).json(data)
        } else {
            res.status(500).json(data)
        }
    });
})

app.post("/api/register", (req, res) => {
    taskController.createTask(req.body).then(data => {
        if (data.status == 201)
            res.status(201).json(data)
        else if (data.status == 400) {
            res.status(400).json(data)
        }
        else {
            res.status(500).json(data)
        }
    });
})

app.get("/api/logout", (req, res) => {
    let reqToken = req.headers.token.split(" ")[1]
    let tokenVerify = jwtoken(reqToken)
    if (tokenVerify.verified == "true") {
        blacklist.push(reqToken);
        let response = {
            message: "logged out",
            status: 200
        }
        res.status(200).json(response)
    } else {
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response)
    }
})

// ---------------digital vault routes-----------------------

app.post("/api/upload", async (req, res) => {
    let reqToken = req.headers.token.split(" ")[1]
    let tokenVerify = await jwtoken(reqToken)
    const isBlacklisted = blacklist.includes(reqToken);
    if (tokenVerify.verified == "true" && !isBlacklisted) {
        await uploadFile(req, res);
        if (req.file != undefined) {
            taskController.uploadTask(req.file.originalname, req.body, tokenVerify.obj).then(data => {
                if (data.status == 200) {
                    res.status(200).json(data)
                }
                else {
                    res.status(500).json(data)
                }
            });
        } else {
            let response = {
                message: "no file found",
                status: 404
            }
            res.status(404).json(response)
        }
    } else {
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response)
    }


});

app.get("/api/myMarketPlace", async (req, res) => {
    let token_ = req.headers.token
    let reqToken = token_.split(" ")[1]
    let tokenVerify = await jwtoken(reqToken)
    const isBlacklisted = blacklist.includes(reqToken);
    // const userInfo = await jwt.verify(reqToken, secretKey);
    if (tokenVerify.verified == "true" && !isBlacklisted) {

        taskController.myMarketPlace(tokenVerify.obj).then(data => {
            if (data.status == 200) {
                res.status(200).json(data)
            } else {
                res.status(500).json(data)
            }
        });
    }
    else {
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response)
    }
});

app.get("/api/myAssets", async (req, res) => {
    let token_ = req.headers.token
    let reqToken = token_.split(" ")[1]
    let tokenVerify = await jwtoken(reqToken)
    const isBlacklisted = blacklist.includes(reqToken);
    // const userInfo = await jwt.verify(reqToken, secretKey);
    if (tokenVerify.verified == "true" && !isBlacklisted) {
        taskController.myAssets(tokenVerify.obj).then(data => {
            if (data.status == 200) {
                res.status(200).json(data)
            } else {
                res.status(500).json(data)
            }
        });
    }
    else {
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response)
    }
    // taskController.myAssets(userInfo).then(data => res.status(200).json(data));
});

app.get("/api/myUpload", async (req, res) => {
    let token_ = req.headers.token
    let reqToken = token_.split(" ")[1]
    let tokenVerify = await jwtoken(reqToken)
    const isBlacklisted = blacklist.includes(reqToken);
    // const userInfo = await jwt.verify(reqToken, secretKey);
    if (tokenVerify.verified == "true" && !isBlacklisted) {
        taskController.myUpload(tokenVerify.obj).then(data => {
            if (data.status == 200) {
                res.status(200).json(data)
            } else {
                res.status(500).json(data)
            }
        });
    }
    else {
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response)
    }
    // taskController.myUpload(userInfo).then(data => res.status(200).json(data));
});

app.post("/api/purchased/:id", async (req, res) => {
    let token_ = req.headers.token
    let reqToken = token_.split(" ")[1]
    const isBlacklisted = blacklist.includes(reqToken);
    let tokenVerify = await jwtoken(reqToken)
    if (tokenVerify.verified == "true" && !isBlacklisted) {
        let app_root = path__.resolve(__dirname);
        let app_roots = app_root.replace(/\\/g, '/')
        // const userInfo = await jwt.verify(reqToken, secretKey);
        await taskController.prevData(tokenVerify.obj, req.params.id, app_roots)
        taskController.purchased(tokenVerify.obj, req.params.id).then(data => res.status(200).json(data));
    } else {
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response)
    }
})

app.get("/api/asset/:id", async (req, res) => {
    let token_ = req.headers.token
    let reqToken = token_.split(" ")[1]
    let tokenVerify = await jwtoken(reqToken)
    const isBlacklisted = blacklist.includes(reqToken);
    // const userInfo = await jwt.verify(reqToken, secretKey);
    if (tokenVerify.verified == "true" && !isBlacklisted) {
        taskController.assetsById(tokenVerify.obj, req.params.id).then(data => {
            if (data.status == 200) {
                res.status(200).json(data)
            } else {
                res.status(500).json(data)
            }
        });
    }
    else {
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response)
    }
    // taskController.assetsById(userInfo, req.params.id).then(data => res.status(200).json(data));
})

//--------------------stripe apis-------------

app.post("/api/createCustomer", async (req, res) => {
    let token_ = req.headers.token
    let reqToken = token_.split(" ")[1]
    let tokenVerify = await jwtoken(reqToken)
    const isBlacklisted = blacklist.includes(reqToken);
    if (tokenVerify.verified == "true" && !isBlacklisted) {
        const obj = {
            name: req.body.name,
            email: req.body.email
        }
        taskController.createCustomer(obj,tokenVerify.obj).then(data => {
            if(data.status == 200){
                res.status(200).json(data)
            }else{
                res.status(400).json(data)
            }
        });
    }else{
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response) 
    }
})

app.post("/api/addCard", async (req, res) => {
    let token_ = req.headers.token
    let reqToken = token_.split(" ")[1]
    let tokenVerify = await jwtoken(reqToken)
    const isBlacklisted = blacklist.includes(reqToken);
    if (tokenVerify.verified == "true" && !isBlacklisted) {
    taskController.addCard(req.body,tokenVerify.obj).then(data => {
        if(data.status == 200){
            res.status(200).json(data)
        }else{
            res.status(400).json(data)
        }
    });
    }else{
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response) 
    }
})

app.get("/api/cardsList", async (req, res) => {
    let token_ = req.headers.token
    let reqToken = token_.split(" ")[1]
    let tokenVerify = await jwtoken(reqToken)
    const isBlacklisted = blacklist.includes(reqToken);
    if (tokenVerify.verified == "true" && !isBlacklisted) {
    taskController.cardsList(tokenVerify.obj).then(data => {
        if(data.status == 200){
            res.status(200).json(data)
        }else{
            res.status(400).json(data)
        }
    });
    }else{
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response) 
    }
})

app.delete('/api/delCard/:id',async(req, res) => {
    let token_ = req.headers.token
    let reqToken = token_.split(" ")[1]
    let tokenVerify = await jwtoken(reqToken)
    const isBlacklisted = blacklist.includes(reqToken);
    if (tokenVerify.verified == "true" && !isBlacklisted) {
    taskController.delCard(tokenVerify.obj,req.params.id).then(data => {
        if(data.status == 200){
            res.json(data)
        }else{
            res.status(400).json(data)
        }
    });
    }else{
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response) 
    }
})

app.post("/api/payment/:id", async (req,res)=>{
    let token_ = req.headers.token
    let reqToken = token_.split(" ")[1]
    let tokenVerify = await jwtoken(reqToken)
    const isBlacklisted = blacklist.includes(reqToken);
    if (tokenVerify.verified == "true" && !isBlacklisted) {
    taskController.payment(tokenVerify.obj,req.params.id,req.body).then(data => {
        if(data.status == 200){
            res.json(data)
        }else{
            res.status(400).json(data)
        }
    });
    }else{
        let response = {
            message: "token invalid",
            status: 401
        }
        res.status(401).json(response) 
    }
})


app.get('/', (req, res) => {
    res.send(`<h1>API Works !!!</h1>`)
});

app.listen(port, host, () => {
    console.log(`Server listening on the port  ${port}`);
})
