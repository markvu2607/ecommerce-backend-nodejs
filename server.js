const app = require("./src/app");

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server express")
    // notify when server crash
  })
})
