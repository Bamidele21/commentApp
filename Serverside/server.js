import fastify from "fastify";
import dotenv from "dotenv"
import cors from "@fastify/cors"
import { PrismaClient } from "@prisma/client";
import Sensible from "@fastify/sensible";
dotenv.config()
const app = fastify();
app.register(Sensible)
app.register(cors, {origin: process.env.CLIENT_URL, credentials: true})
const prisma = new PrismaClient()




app.get("/posts", async (req, res) => {
  
  return await commitToDB(prisma.post.findMany({select: {
        id: true,
        title: true
    }})
)

})

app.get("/posts/:id", async (req, res) => {
  
  return await commitToDB(prisma.post.findUnique({
    where: {
        id: req.params.id},select: {
          body: true,
          title: true,
          comments: {
            orderBy: {
              created_at: "desc"
            }, select: {
              id: true,
              message: true,
              parent_id: true,
              created_at: true,
              user: {
                select: {
                  id: true,
                  name: true
                }}
  
            }
       
    }}})
)

})

async function commitToDB(promise) {
   const [error,data] = await app.to(promise)
   if (error)  return app.httpErrors.internalServerError(error.message)
   return data
}

app.listen({port: process.env.PORT});