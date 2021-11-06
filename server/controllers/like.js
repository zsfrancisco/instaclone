const Like = require("../models/like");

async function addLike(idPublication, context) {
    try {
        const newLike = new Like({
            idPublication,
            idUser: context.user.id
        });
        await newLike.save();
        return true;
    } catch (error) {
        console.log("Error liking a publication - ", error);
        return false;
    }
}

async function deleteLike(idPublication, context) {
    try {
        await Like.findOneAndDelete({idPublication}).where({idUser: context.user.id});
        return true;
    } catch (error) {
        console.log("Error deleting like - ", error);
        return false;
    }
}

async function isLike(idPublication, context) {
    try {
        const result = await Like.findOne({idPublication}).where({idUser: context.user.id});
        if (!result) throw new Error("No le ha dado like");
        return true;
    } catch (error) {
        console.log("Erros consulting is like publication - ", error);
        return false;
    }
}

async function countLikes(idPublication) {
    try {
        return Like.countDocuments({idPublication});
    } catch (error) {
        console.log("Error counting likes publication - ", error);
    }
}

module.exports = {
    addLike,
    deleteLike,
    isLike,
    countLikes
}
