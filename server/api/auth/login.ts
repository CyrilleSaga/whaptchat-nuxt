import {prisma} from "~/server/prisma";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {

    const {username, password} = await readBody(event)
    const {jwtSecret} = useRuntimeConfig()

    // Check if user already exists
    const user = await prisma.user.findUnique({where: {username}})
    if (!user) {
        return new Response('Username or password is invalid', {status: 401})
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
        return new Response('Username or password is invalid', {status: 401})
    }

    // Generate JWT Token
    const token = jwt.sign({userId: user.id, username: user.username}, jwtSecret, {expiresIn: '1h'})

    return {token}
})