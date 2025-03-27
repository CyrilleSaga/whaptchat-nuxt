import {prisma} from "~/server/prisma";
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const {username, password} = body

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({where: {username}})
    if (existingUser) {
        return new Response('User already exists', {status: 409})
    }

    // Hash user password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword
        }
    })

    return new Response(JSON.stringify(user), {status: 201})
})