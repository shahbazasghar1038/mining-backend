import config from "config";
import aws from "aws-sdk";
import fs from "fs";
import crypto from "crypto";
const region = "ap-south-1";
const bucketName = "natmarts";
const accessKeyId = config.get<string>("ACCESS_KEY_ID");
const secretAccessKey = config.get<string>("SECRET_KEY");

type File = {
  path: string;
  filename: string;
};

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

module.exports.generateUploadURL = async () => {
  const rawBytes = await crypto.randomBytes(16);
  const image = rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: image,
    Expires: 60,
  };

  const url = await s3.getSignedUrlPromise("putObject", params);
  return url;
};

export const uploadFile = (file: File) => {
  const fileStream = fs.createReadStream(file.path);

  const params = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(params).promise();
};
