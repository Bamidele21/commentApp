import { PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
    await prisma.post.deleteMany()
    await prisma.user.deleteMany()
    const BamBam = await prisma.user.create ({data: {name: "BamBam"}})
    const SomeGuy = await prisma.user.create({data: {name: "SomeGuy"}})

    const post1 = await prisma.post.create({data: {
        body: "this is a post hahaha this is a post hahaha this is a post hahaha this is a post hahaha this is a post hahaha this is a post hahaha this is the post hahaha this is a post hahaha this is a post.",
        title: "Post 1",
    }})
    
    const post2 = await prisma.post.create({data: {
        body: "this is a second post lmao this is a second post lmao this is a second post lmao this is a second post lmao this is a second post lmao this is a second post lmao this is a second post lmao.",
        title: "Post 2",
    }})

    const comment1 = await prisma.comment.create({data: {
        message: "hey! its the first comment!",
        userId: BamBam.id,
        post_id: post1.id
     }})

     const comment2 = await prisma.comment.create({data: {
        message: "hey! its the second comment!",
        userId: SomeGuy.id,
        post_id: post2.id
     }})

     const comment3 = await prisma.comment.create({data: {
        parent_id: comment2.id,
        message: "hey! this comment is way cooler then someGuys comment!",
        userId: BamBam.id,
        post_id: post1.id
     }})
}
seed()