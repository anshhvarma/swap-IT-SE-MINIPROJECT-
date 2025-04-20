const { PrismaClient } = require("@prisma/client")

const database = new PrismaClient();

const main = async () => {
    try {
        await database.category.createMany({
            data: [
                { name: "Good" },
                { name: "Fair" },
                {name: "New"}
            ]
        })
        console.log("Success")
    } catch (error) {
        
    }
}

main();