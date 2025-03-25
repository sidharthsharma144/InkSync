const designController = require('../controllers/designController')
const router = require('express').Router()
const auth = require('../middlewares/middleware')

router.post('/create-user-design', designController.create_user_design)
router.get('/user-design/:design_id', designController.get_user_design)
router.put('/update-user-design/:design_id', designController.update_user_design)
router.post('/add-user-image', designController.add_user_image)
router.get('/get-user-image', designController.get_user_image)
router.get('/design-images', designController.get_initial_image)
router.get('/background-images', designController.get_background_image)
router.get('/user-designs', designController.get_user_designs)
router.put('/delete-user-image/:design_id', designController.delete_user_image)
router.get('/templates', designController.get_templates)
router.get('/add-user-template/:template_id', designController.add_user_template)

module.exports = router