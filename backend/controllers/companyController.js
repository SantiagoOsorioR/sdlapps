const Company = require('../models/company');

exports.list = async (_req, res, next) => {
  try {
    const items = await Company.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { name, abn = '', contact = '' } = req.body || {};
    if (!name) return res.status(400).json({ error: 'name is required' });
    const created = await Company.create({ name, abn, contact });
    return res.status(201).json(created);
  } catch (err) {
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.name) {
      return res.status(409).json({ error: 'Company name already exists' });
    }
    return next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const item = await Company.findById(req.params.id);
    if (!item) return res.sendStatus(404);
    res.json(item);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  } catch (err) {
    if (err && err.code === 11000 && err.keyPattern && err.keyPattern.name) {
      return res.status(409).json({ error: 'Company name already exists' });
    }
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const del = await Company.findByIdAndDelete(req.params.id);
    if (!del) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (err) { next(err); }
};
