export type GenerateSocialImage = {
  // The name of the content.
  title: string;
  // Author name to display.
  author?: string;
  // Width of the social image.
  width?: number;
  // Height of the social image.
  height?: number;
  // Font size to use for the title and author name.
  fontSize?: number;
  // How much margin to leave around the edges of the image.
  margin?: number;
  // Path to the author profile image to display.
  profileImage?: string;
  // The radius of the author's profile image, if an image is supplied.
  profileRadius?: number;
  // The font to use for all text in the social image.
  font?: string;
};
