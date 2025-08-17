const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  abn:  { type: String, default: '' },
  contact: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
