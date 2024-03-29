const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')

async function main(){
    const password = await bcrypt.hash("admin@123", 10)
    const newAdmin = await prisma.admin.upsert({
        where:{ email: 'admin@gmail.com'},
        update: {},
        create: {
            email: "admin@gmail.com",
            username: "admin",
            password: password
        }
    })

    const other = await prisma.productCategory.upsert({
        where: {name : "Other"},
        update: {},
        create: {
            name: "Other",
        }
    })
    console.log(newAdmin);
    console.log(other);
}

main().then(async ( )=>{
    await prisma.$disconnect()
}).catch(async (e)=>{
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})