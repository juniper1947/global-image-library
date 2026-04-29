window.GIL_CONFIG = {
  // To enable direct website upload, set both values below from Cloudinary.
  // If left blank, the page will show a GitHub upload fallback button.
  cloudinaryCloudName: "dozcy2jve",
  cloudinaryUnsignedPreset: "global_image_library_unsigned",

  // Optional
  cloudinaryFolder: "images",
  cloudinaryListTag: "global-image-library",
  githubBranch: "main",
  githubUploadFolder: "docs/uploads",

  // Optional upload gate:
  // Put a SHA-256 hex hash of your passcode (lowercase). Leave blank to disable lock.
  // Important: this is only a client-side gate, not full server-side security.
  uploadPasscodeHash: "0d24b605de5edad4a8abc36e59b28e26d114756c066e1a77d356ff91b7ddfe20"
};
