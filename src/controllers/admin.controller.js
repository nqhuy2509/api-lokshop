const {PrismaClient} = require('@prisma/client')
const { BadRequestExeption } = require('../utils/response')

const prisma = new PrismaClient()



const handleLogin = async (req,res) =>{
    const {username, password} = req.body

    if(!username || !password){
        return BadRequestExeption(res)
    }

    const exist = prisma.admin.findUnique({
        where: {
            username
        }
    })

    if(!exist){
        return BadRequestExeption(res)
    }
    return res.send("OK")

}

module.exports ={
    handleLogin
}