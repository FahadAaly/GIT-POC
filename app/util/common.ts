export const validateUrl = (url: string) => {
  return /https:\/\/github.com\/[\w-]+\/[\w-]+/.test(url);
};
