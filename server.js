const net = require("node:net");
const fs = require("node:fs/promises");

const server = net.createServer();

server.on("connection", (socket) => {
  let fileHandle;
  let writeStream;

  console.log("new connection.");

  socket.on("data", async (chunk) => {
    if (!fileHandle) {
      socket.pause();
      const filename = chunk.subarray(15, chunk.indexOf(" -filenameend"));

      fileHandle = await fs.open(`storage/${filename}`, "w");
      writeStream = fileHandle.createWriteStream({ highWaterMark: 65536 });

      chunk = chunk.subarray(chunk.indexOf(" -filenameend") + 15);

      writeStream.on("drain", () => {
        socket.resume();
      });

      socket.resume();
    }
    if (!writeStream?.write(chunk)) {
      socket.pause();
    }
  });

  socket.on("end", async () => {
    console.log("connection ended.");
    await fileHandle.close();
    fileHandle = null;
    writeStream = null;
  });

  socket.on("error", async (err) => {
    console.log("Socket error:", err.message);
    if (fileHandle) {
      await fileHandle.close();
      fileHandle = null;
      writeStream = null;
    }
  });
});

server.listen(5050, "::1", () => {
  console.log("server runnnig on:", server.address());
});
