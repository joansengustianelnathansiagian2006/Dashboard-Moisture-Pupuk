const express =
require("express");

const router =
express.Router();

/*
===================================
TEST API
===================================
*/

router.get("/", (req,res)=>{

  res.json({

    message:
    "Backend Monitoring Aktif"

  });

});

module.exports = router;