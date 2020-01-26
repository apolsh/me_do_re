const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema(
    {
        discipline: String,
        faculty: String,
        title: String,
        authors: String,
        year: String,
        mimeType: String,
        binary: Buffer
    }
);

module.exports = mongoose.model("Doc", DocumentSchema);