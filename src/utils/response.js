const { AUTHENTICATE_FAILED, SOMETHING_WRONG } = require("../constants/message")
var {BAD_REQUEST, NOT_FOUND, OK, UNAUTHORIZED, BAD_GATEWAY,} = require( "../constants/statusCode")

const responseUtil = (code, message, data) =>{
    return {
        code,message,data
    }
}

const SuccessResponse = (response,message, data=null)=>{
    return response.status(OK).json(responseUtil(OK, message, data))
}


const BadRequestException = (response, message, error =null)=>{
    return response.status(BAD_REQUEST).json(responseUtil(BAD_REQUEST,message, error))
}

const NotFoundException = (response,message, error= null) =>{
    return response.status(NOT_FOUND).json(responseUtil(NOT_FOUND,message, error))
}

const AuthorizationException = (response, error=null) =>{
    return response.status(UNAUTHORIZED).json(responseUtil(UNAUTHORIZED,AUTHENTICATE_FAILED, error))
}

const BadGatewayException = (response,message = SOMETHING_WRONG, error=null)=>{
    return response.status(BAD_GATEWAY).json(responseUtil(BAD_GATEWAY, message,error))
}

module.exports = {
    BadRequestException,
    NotFoundException, 
    SuccessResponse,
    AuthorizationException,
    BadGatewayException
}