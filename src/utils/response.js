var { INVALID_CREDENTIAL, PAGE_NOTFOUND }  = require( "../constants/message")
var {BAD_REQUEST, NOT_FOUND} = require( "../constants/statusCode")

const reponseUtil = (code, message, data) =>{
    return {
        code,message,data
    }
}

const BadRequestExeption = (response)=>{
    return response.status(BAD_REQUEST).json(reponseUtil(BAD_REQUEST,INVALID_CREDENTIAL, null))
}

const NotFoundException = (response) =>{
    return response.status(NOT_FOUND).json(reponseUtil(NOT_FOUND,PAGE_NOTFOUND, null))
}

module.exports = {
    BadRequestExeption,
    NotFoundException
}