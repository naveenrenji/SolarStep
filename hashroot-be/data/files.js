const fs = require("fs");
const path = require("path");

const uploadPdfFile = (projectName, fileStream) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `${projectName}_${currentDate}.pdf`;
    const filePath = path.join(__dirname, "../assets/contracts", fileName);

    const writeStream = fs.createWriteStream(filePath);
    fileStream.pipe(writeStream);

    writeStream.on("finish", () => {
      resolve({ message: "File uploaded successfully!" });
    });

    writeStream.on("error", (error) => {
      reject({ error: "Failed to upload file." });
    });
  });
};

module.exports = { uploadPdfFile };
