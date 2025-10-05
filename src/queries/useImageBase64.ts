
import { useQuery } from '@tanstack/react-query';
import { fetchImageAsBase64, getCachedBase64, setCachedBase64 } from '../api';

/**
 * Check if a string is a valid HTTP or HTTPS URL.
 * @param src URL string to validate
 * @returns True if valid, false otherwise
 **/
function isValidHttpUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}


// getCachedBase64 and setCachedBase64 now use IndexedDB (see imageCacheDB.ts)

export function useImageBase64(src: string) {
  return useQuery({
    queryKey: ['image-base64', src],
    queryFn: async () => {
      if (!isValidHttpUrl(src)) {
        throw new Error('Invalid image URL');
      }
      const cached = await getCachedBase64(src);
      if (cached) return cached;
      const base64 = await fetchImageAsBase64(src);
      await setCachedBase64(src, base64);
      return base64;
    },
    enabled: !!src,
  });
}
