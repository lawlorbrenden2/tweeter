import { Buffer } from "buffer";
import { AuthPresenter, AuthView } from "./AuthPresenter";

export class RegisterPresenter extends AuthPresenter {
  private imageBytes: Uint8Array = new Uint8Array();
  private imageFileExtension: string = "";

  public handleImageFile = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        this.imageBytes = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = file.name.split(".").pop();
      if (fileExtension) {
        this.imageFileExtension = fileExtension;
      }
    } else {
      this.imageBytes = new Uint8Array();
      this.imageFileExtension = "";
    }
  };

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    rememberMe: boolean,
  ) {
    await this.doAuthenticationOperation(
      () =>
        this.userService.register(
          firstName,
          lastName,
          alias,
          password,
          this.imageBytes,
          this.imageFileExtension,
        ),
      "register user",
      rememberMe,
    );
  }
}
