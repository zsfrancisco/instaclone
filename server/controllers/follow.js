const Follow = require("../models/follow");
const User = require("../models/user");

async function follow(username, context) {
    const userFound = await User.findOne({username});
    if (!userFound) {
        throw new Error("Usuario no encontrado");
    }

    try {
        const newFollow = new Follow({
            idUser: context.user.id,
            follow: userFound._id
        });
        await newFollow.save();
        return true
    } catch (error) {
        console.log("error following user - ", error);
        return false;
    }
}

async function isFollow(username, ctx) {
    const userFound = await User.findOne({username});
    if (!userFound) throw new Error("Usuario no encontrado");

    const usersFollowed = await Follow.find({idUser: ctx.user.id})
        .where("follow")
        .equals(userFound._id);

    return usersFollowed.length > 0;
}

async function unfollow(username, context) {
    const userFound = await User.findOne({username});
    if (!userFound) throw new Error("Usuario no encontrado");

    const followDeleted = await Follow.deleteOne({idUser: context.user.id})
        .where("follow")
        .equals(userFound._id);

    return followDeleted.deletedCount > 0;
}

async function getFollowers(username) {
    const user = await User.findOne({username});
    const followers = await Follow.find({follow: user._id}).populate("idUser");

    const followersList = [];
    for await (const data of followers) {
        followersList.push(data.idUser);
    }
    return followersList;
}

async function getFollowed(username) {
    const user = await User.findOne({username});
    const followers = await Follow.find({idUser: user._id}).populate("follow");

    const followersList = [];
    for await (const data of followers) {
        followersList.push(data.follow);
    }
    return followersList;
}

async function getNotFollowed(context) {
    const users = await User.find().limit(50);
    const usersNotFollowed = [];
    for await (const user of users) {
        const isUserFollow = await Follow
            .findOne({idUser: context.user.id})
            .where("follow")
            .equals(user._id);

        if (!isUserFollow) {
            if (user._id.toString() !== context.user.id.toString()) {
                usersNotFollowed.push(user);
            }
        }
    }
    return usersNotFollowed;
}

module.exports = {
    follow,
    isFollow,
    unfollow,
    getFollowers,
    getFollowed,
    getNotFollowed
}
