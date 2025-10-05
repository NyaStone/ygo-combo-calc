/**
 * Fetch an image from a URL and return it as a base64-encoded string.
 * @param src URL of the image to fetch
 * @returns A promise that resolves to the base64-encoded image string
 */
export async function fetchImageAsBase64(src: string): Promise<string> {
  const response = await fetch(src);
  const contentType = response.headers.get('content-type');
  if (!response.ok || !contentType || !contentType.startsWith('image/')) {
    throw new Error('Not a valid image URL');
  }
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
