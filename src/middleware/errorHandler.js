const { NotFoundException } = require("../utils/response");

module.exports = (req,res) =>{
    console.log("Sorry....page is not found")
    return NotFoundException(res)
}