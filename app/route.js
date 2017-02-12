'use strict'

var multer = require('multer'); // FOR FILE UPLOAD WITH FORM POST REQUEST
var upload = multer({
    dest: 'public/'
}); // FOR FILE UPLOAD WITH FORM POST REQUEST
var fs = require("fs");
var fetch = require('node-fetch');
var fs = require('fs');
const appRoot = require("app-root-path");

let Players = [{id:0, total_score:0},{id:1, total_score:0}];
let Games = [{
    id: 0,
    name:"RIT Brickhack 3",
    desc:"Berickhack's premiere scavenger hunt!",
    thumb_url:"https://people.rit.edu/kah4525/portfolio/Images/RITLogo.png",
    loc: {
        N: 43.084574,
        W: -77.673806
    },
    task: [{
        id:0,
        requirement: "Find any drink",
        tag: ["drink", "cup", "beverage", "bottle", "male", "man"],
        status: false
    }, {
                id:1,
        requirement: "Find an animal",
        tag: ["animal", "creature", "manmual"],
        status: false
    }, {
                id:2,
        requirement: "Find a laptop",
        tag: ["laptop", "computer", "device", "netbook", "white", "macbook", "electronics"],
        status: false
    }, {
                id:3,
        requirement: "Find a microsoft logo",
        tag: ["microsoft", "logo", "sign"],
        status: false
    }, {
                id:4,
        requirement: "Find a person sitting on the chair",
        tag: ["chair", "person", "man"],
        status: false
    }],
    leaderboard: []
}, {
    id: 1,
    name:"Rochester treasure hunt",
    desc:"Rochester's premiere treasure hunt!",
    thumb_url:"http://homewoodsuites3.hilton.com/resources/media/hw/RSTROHW/en_US/img/shared/full_page_image_gallery/main/HG_patio_19_505x305_FitToBoxSmallDimension_Center.jpg",
    loc: {
        N: 43.184574,
        W: -77.573806
    },
    currentTaskNumber: 0,
    task: [{
                id:0,
        requirement: "Find a red solo cup",
        tag: ["cup", "beverage", "electronics"],
        status: false
    }, {
                id:1,
        requirement: "Find a scoreboard",
                tag: ["indoor","sign","ceiling"],
        status: false
    }, {
                id:2,
        requirement: "Find a keyboard",
        tag: ["keyboard","electronics"],
        status: false
    }, {
                id:3,
        requirement: "Find a cellphone",
        tag: ["cellphone","electronics"],
        status: false
    }],
    leaderboard: []
}, {
    id: 2,
        name:"University of Rochester",
    desc:"Come hunt with us!",
    thumb_url:"https://www.rochester.edu/aboutus/images/Rocky2009.jpg",
    loc: {
        N: 43.086574,
        W: -77.693806
    },
    currentTaskNumber: 0,
    task: [{
                id:0,
        requirement: "Find a bottle",
        status: true
    }, {
                id:1,
        requirement: "Find a Jet",
        status: false
    }, {
                id:2,
        requirement: "Find cheezit",
        status: false
    }, {
                id:3,
        requirement: "Find a CD",
        status: false
    }],
    leaderboard: [{userid:0, score:20},{userid:1, score:10}]
}];

// player:{
//     id:#,
//     name:""
// }

// game:{
//     name:"",
//     id:#,
//     loc:{
//      N:#,
//      W:#,
//     },
//     task:[
//         {
//          requirement:""
//         }
//     ],
//     leaderboard:[
//         {
//             userid:#,
//             score:#
//         }
//     ]
// }

module.exports = (app) => {

    //     /** This is how file is uploaded
    //         <form method="post" enctype="multipart/form-data" action="/verifyimage/:gameid">
    //             <input type="file" name="image">
    //             <input type="submit" value="Submit">
    //         </form>
    //     */

    //     // Check that this image completes any of the tasks

    
    app.post("/win/:userid.:gameid.:taskid", (req, res) => {
        const gameid = req.params.gameid;
        const userid = req.params.userid;
        const taskid = req.params.taskid;
        Games[gameid].task[taskid].status = "true";
        if(!Games[gameid].leaderboard.containsID(userid)){
            Games[gameid].leaderboard.push({userid:userid, score:10});
        }else{
            Games[gameid].leaderboard[Games[gameid].leaderboard.containsID(userid)].score += 10;
        }
        
        if(!Players.containsID(userid)){
            Players.push({userid:userid, total_score:10});
        }else{
            Players[Players.containsID(userid)].total_score += 10;
        }
        res.send(200);
    })

    app.post("/verifyimage/:id.:l", upload.single("image"), (req,res) => {
        fs.renameSync(req.file.path, "public/image.jpg")
        setTimeout(function () {
            res.send(200);
        }, 0);
    })

    app.get('/leaderboard/:gameid', (req, res)=>{
        res.send({leaderboard:Games[req.params.gameid].leaderboard});
    })

    app.get('/join-game/:userid.:gameid', (req, res) => {
        const userid = req.params.userid;
        const gameid = req.params.gameid;

        Games[gameid].leaderboard.push({
            userid: userid,
            score: 0
        });

        console.log("A user: ", userid, " joined the game", Games);
        res.sendStatus(200);
    });

    //     // Get leaderboard for game
    app.get("/leaderboard/:gameid", (req, res) => {
        const theGame = Games[Games.containsID(req.params.gameid)];
        console.log("Game by id: ", req.params.gameid, theGame);
        res.send(theGame);
    });

    //     // Return all games available to join
    app.get("/allgames", (req, res) => {
        console.log("All games: ", Games);
        res.send({
            allgames: Games
        })
    });

    app.get('/list-game/:userid', (req, res) => {
        if (Players.containsID(req.params.id)) {

        }
        else {
            Players.push({
                id: req.params.id,
                name: req.body.name
            })
            console.log("Players:" + Players);
        }

        const games = Games.map((game) => {
            if (game.id == req.params.id) {
                return game;
            }
            else {
                return;
            }
        })
        res.send({
            userid: req.params.id,
            games: games
        });
    });






}


Array.prototype.containsID = function(gameid) {
    for (let i in this) {
        if (this[i].id == gameid) return i;
    }
    return false;
}


Array.prototype.containsTag = function(tag) {
    for (let i in this) {
        if (this[i].requirement == tag) return i;
    }
    return false;
}
