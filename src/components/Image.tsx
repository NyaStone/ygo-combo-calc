import React from "react";
import { useImageBase64 } from "../queries";

/**
 * Image component that displays an image or a placeholder.
 *
 * All images get cached indefinitely in IndexedDB as base64 strings
 * to minimize external API calls.
 *
 * @param props React.ImgHTMLAttributes<HTMLImageElement>
 * @returns Image element using base64 source or a placeholder span
 */
export function Image(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    const { src, alt } = props;

    if (!src) return <span>{alt || "Missing image"}</span>;

    const { data: base64, isLoading } = useImageBase64(src);

    if (isLoading) return <span>Loading...</span>;
    if (!base64) return <span>Error loading image</span>;
    
    const { src: _src, ...otherProps } = props;
    return <img {...otherProps} src={base64} alt={alt} />;
}