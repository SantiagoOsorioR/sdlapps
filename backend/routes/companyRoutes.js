const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/companyController');

const router = express.Router();

router.get('/',    protect, ctrl.list);
router.post('/',   protect, ctrl.create);
router.get('/:id', protect, ctrl.get);
router.patch('/:id', protect, ctrl.update);
router.delete('/:id', protect, ctrl.remove);

module.exports = router;
