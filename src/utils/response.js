const { AUTHENTICATE_FAILED } = require("../constants/message")
var {BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED, BAD_GATEWAY,} = require( "../constants/statusCode")

const reponseUtil = (code, message, data) =>{
    return {
        code,message,data
    }
}

const SuccessResponse = (response,message, data=null)=>{
    return response.status(OK).json(reponseUtil(OK, message, data))
}


const BadRequestExeption = (response, message, error =null)=>{
    return response.status(BAD_REQUEST).json(reponseUtil(BAD_REQUEST,message, error))
}

const NotFoundException = (response,message, error= null) =>{
    return response.status(NOT_FOUND).json(reponseUtil(NOT_FOUND,message, error))
}

const AuthorizationExeption = (response, error=null) =>{
    return response.status(UNAUTHORIZED).json(reponseUtil(UNAUTHORIZED,AUTHENTICATE_FAILED, error))
}

const BadGatewayExeption = (response,message, error=null)=>{
    return response.status(BAD_GATEWAY).json(reponseUtil(BAD_GATEWAY, message,error))
}

module.exports = {
    BadRequestExeption,
    NotFoundException, 
    SuccessResponse,
    AuthorizationExeption,
    BadGatewayExeption
}