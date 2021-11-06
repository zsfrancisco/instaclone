const Comment = require("../models/comment");

async function addComment(input, context) {
    try {
        const newComment = new Comment({
            idPublication: input.idPublication,
            idUser: context.user.id,
            comment: input.comment
        });
        await newComment.save();
        return newComment;
    } catch (error) {
        console.log("Error commenting a photo - ", error);
    }
    return null;
}

async function getComments(idPublication) {
    return  Comment.find({idPublication}).populate("idUser");
}

module.exports = {
    addComment,
    getComments
}