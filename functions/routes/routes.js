const express=require('express')
const router=express.Router()
const {
    addComingUp,
    addToProgramLineUp,
    register,
    aboutApp,
    getAll,
    comingUp,
    upload,
    verify,
    addPlv,
    privacySettings,
    updateData,
    getAdmin
}=require("../controllers/controller")

router.post('/api/programLine',addToProgramLineUp)
router.post("/api/coming",addComingUp)
router.post("/api/register",register)
router.post("/api/app",aboutApp)
router.get("/api/programs",getAll)
router.get("/api/comingupTv",comingUp)
router.post("/api/addPlv",addPlv)//adding a live,podcast and VOD
router.get("/api/upload",upload)
router.get("/api/token",verify)
router.post("/api/privacy",privacySettings)
router.get("/api/data",updateData)
router.get('/api/admin',getAdmin)
module.exports=router