// AI-assisted: see AI-ATTRIBUTION.md
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { extname } from "node:path";
import { ImageDAO } from "../ImageDAO";

export class S3ImageDAO implements ImageDAO {
  private readonly bucketName: string;
  private readonly region: string;
  private readonly client: S3Client;

  constructor() {
    const bucketName = process.env.PROFILE_IMAGES_BUCKET;
    if (!bucketName) {
      throw new Error("PROFILE_IMAGES_BUCKET environment variable is required");
    }

    this.bucketName = bucketName;
    this.region = process.env.AWS_REGION || "us-east-1";
    this.client = new S3Client({ region: this.region });
  }

  async putImage(fileName: string, imageStringBase64: string): Promise<string> {
    const contentTypes: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".avif": "image/avif",
      ".bmp": "image/bmp",
      ".ico": "image/x-icon",
      ".tif": "image/tiff",
      ".tiff": "image/tiff",
    };
    const base64 = imageStringBase64.replace(/^data:image\/[^;,]+;base64,/i, "");

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: "image/" + fileName,
        Body: Buffer.from(base64, "base64"),
        ContentType: contentTypes[extname(fileName).toLowerCase()] ?? "image/png",
      }),
    );

    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/image/${fileName}`;
  }
}