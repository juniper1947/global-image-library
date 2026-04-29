window.GIL_CONFIG = {
  // To enable direct website upload, set both values below from Cloudinary.
  // If left blank, the page will show a GitHub upload fallback button.
  cloudinaryCloudName: "dozcy2jve",
  cloudinaryUnsignedPreset: "global_image_library_unsigned",

  // Optional
  cloudinaryFolder: "global-image-library",
  cloudinaryListTag: "global-image-library",
  githubBranch: "main",
  githubUploadFolder: "docs/uploads",

  // Optional upload gate:
  // Put a SHA-256 hex hash of your passcode (lowercase). Leave blank to disable lock.
  // Important: this is only a client-side gate, not full server-side security.
  uploadPasscodeHash: ""
};
