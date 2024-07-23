export const uploadToImgKit = (
  file: string,
  fileName: string,
  folder: string
) => {
  const url = "https://upload.imagekit.io/api/v2/files/upload";
  const form = new FormData();
  form.append("file", file);
  form.append("fileName", fileName);
  form.append("folder", folder);
  form.append("useUniqueFileName", "false");

  const options = {
    method: "POST",
    headers: {
      Authorization: `Basic ${process.env.IMGKIT_PRIVATE_KEY}` as string,
      Accept: "application/json",
    },
    body: form,
  };

  try {
    fetch(url, options).catch((error) => console.error("error", error));
  } catch (error) {
    console.error(error);
  }
};
