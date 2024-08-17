const net = require("node:net");
const fs = require("node:fs/promises");
const path = require("node:path");

function clearLine(dir) {
  return new Promise((res, rej) =>
    process.stdout.clearLine(dir, () => {
      res();
    })
  );
}

function moveCursor(dx, dy) {
  return new Promise((res, rej) => {
    process.stdout.moveCursor(dx, dy, () => {
      res();
    });
  });
}

const socket = net.createConnection({ host: "::1", port: 5050 }, async () => {
  const filePath = process.argv[2];
  const filename = path.basename(filePath);
  let uploaded = 0;
  let perc = 0;

  const fileHandle = await fs.open(filePath, "r");
  const readStream = fileHandle.createReadStream();
  const { size } = await fileHandle.stat();

  socket.write(`filenamestart- ${filename} -filenameend`);

  console.log();
  readStream.on("data", async (chunk) => {
    if (!socket.write(chunk)) readStream.pause();
    uploaded += chunk.length;
    let newPerc = Math.floor((uploaded / size) * 100);
    if (newPerc !== perc) {
      perc = newPerc;
      await clearLine(0);
      await moveCursor(0, -1);
      console.log(`uploading... ${newPerc}%`);
    }
  });

  socket.on("drain", () => {
    readStream.resume();
  });

  readStream.on("end", () => {
    console.log("file uploaded successfully.");
    socket.end();
  });
});

socket.on("error", (err) => {
  console.log("socket error:", err.message);
});
