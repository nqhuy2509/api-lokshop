const {PrismaClient} = require('@prisma/client')
const { BadRequestExeption, SuccessResponse, AuthorizationExeption } = require('../utils/response')
const { INVALID_CREDENTIAL, LOGIN_SUCCESS } = require('../constants/message')
const bcrypt = require('bcryptjs')
const { createToken } = require('../utils/token')

const prisma = new PrismaClient()



const handleLogin = async (req,res) =>{
    const {username, password} = req.body

    if(!username || !password){
        return BadRequestExeption(res, INVALID_CREDENTIAL, null)
    }

    const exist = await prisma.admin.findUnique({
        where: {
            username
        }
    })

    if(!exist){
        return BadRequestExeption(res, INVALID_CREDENTIAL, null)
    }
    const isMatchPass = await bcrypt.compare(password, exist.password)

    if(!isMatchPass){
        return BadRequestExeption(res, INVALID_CREDENTIAL, null)
    }

    const token = createToken({sub: exist.email})

    return SuccessResponse(res, LOGIN_SUCCESS, {
        email : exist.email,
        token
    })
}

const getProfile = async (req,res) =>{
    const email = req.user
    if(!email){
        return AuthorizationExeption(res, null)
    }

    
    const admin = await prisma.admin.findUnique(email)


}

module.exports ={
    handleLogin,
    getProfile
}