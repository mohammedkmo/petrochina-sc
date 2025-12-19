/**
 * Image Cropper Component
 * Clean, professional, minimalist image cropper
 */

"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { X, Check, ZoomIn, ZoomOut, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

interface ImageCropperProps {
  imageSrc: string;
  onCrop: (croppedImageDataUrl: string) => void;
  onCancel: () => void;
  targetWidth: number;
  targetHeight: number;
}

export default function ImageCropper({
  imageSrc,
  onCrop,
  onCancel,
  targetWidth = 1200,
  targetHeight = 150,
}: ImageCropperProps) {
  const t = useTranslations("form.companyLetterhead.cropper");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [cropSize, setCropSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, cropX: 0, cropY: 0 });

  const aspectRatio = targetWidth / targetHeight;
  const minCropSize = 200;

  // Update container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    
    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', updateSize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Initialize crop box when image loads
  useEffect(() => {
    if (imageLoaded && containerRef.current && imageRef.current && containerSize.width > 0) {
      const img = imageRef.current;
      const imgRect = img.getBoundingClientRect();
      
      const imgDisplayWidth = imgRect.width;
      const containerWidth = containerSize.width;
      const containerHeight = containerSize.height;
      
      // Calculate initial size (70% of image or 80% of container, whichever is smaller)
      const initialWidth = Math.min(
        imgDisplayWidth * 0.7,
        containerWidth * 0.8,
        Math.max(minCropSize, containerWidth * 0.6)
      );
      const initialHeight = initialWidth / aspectRatio;
      
      // Center the crop box
      const initialX = Math.max(0, (containerWidth - initialWidth) / 2);
      const initialY = Math.max(0, (containerHeight - initialHeight) / 2);
      
      // Ensure crop box stays within bounds
      const finalX = Math.min(initialX, containerWidth - initialWidth);
      const finalY = Math.min(initialY, containerHeight - initialHeight);
      
      setCrop({ x: Math.max(0, finalX), y: Math.max(0, finalY) });
      setCropSize({ 
        width: Math.max(minCropSize, initialWidth), 
        height: Math.max(minCropSize / aspectRatio, initialHeight) 
      });
    }
  }, [imageLoaded, aspectRatio, containerSize, minCropSize]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleCropBoxMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    setIsDragging(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - crop.x - rect.left,
        y: e.clientY - crop.y - rect.top,
      });
    }
    e.preventDefault();
  };

  const handleResizeMouseDown = (e: React.MouseEvent, corner: string) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setResizeCorner(corner);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: cropSize.width,
        height: cropSize.height,
        cropX: crop.x,
        cropY: crop.y,
      });
    }
  };

  const constrainCropBox = useCallback((
    x: number,
    y: number,
    width: number,
    height: number
  ): { x: number; y: number; width: number; height: number } => {
    const containerWidth = containerSize.width;
    const containerHeight = containerSize.height;
    
    // Ensure minimum size
    let finalWidth = Math.max(minCropSize, width);
    let finalHeight = finalWidth / aspectRatio;
    
    // Ensure maximum size doesn't exceed container
    finalWidth = Math.min(finalWidth, containerWidth);
    finalHeight = Math.min(finalHeight, containerHeight);
    
    // Constrain position - ensure crop box stays within bounds
    let finalX = x;
    let finalY = y;
    
    // Adjust position if crop box goes out of bounds
    if (finalX < 0) finalX = 0;
    if (finalY < 0) finalY = 0;
    if (finalX + finalWidth > containerWidth) {
      finalX = Math.max(0, containerWidth - finalWidth);
    }
    if (finalY + finalHeight > containerHeight) {
      finalY = Math.max(0, containerHeight - finalHeight);
    }
    
    // If size is too large for position, adjust size
    if (finalX + finalWidth > containerWidth) {
      finalWidth = containerWidth - finalX;
      finalHeight = finalWidth / aspectRatio;
    }
    if (finalY + finalHeight > containerHeight) {
      finalHeight = containerHeight - finalY;
      finalWidth = finalHeight * aspectRatio;
    }
    
    // Final size check
    finalWidth = Math.max(minCropSize, finalWidth);
    finalHeight = finalWidth / aspectRatio;
    
    return {
      x: Math.max(0, Math.min(finalX, containerWidth - finalWidth)),
      y: Math.max(0, Math.min(finalY, containerHeight - finalHeight)),
      width: finalWidth,
      height: finalHeight,
    };
  }, [containerSize, aspectRatio, minCropSize]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !imageRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    if (isDragging) {
      let newX = e.clientX - dragStart.x - containerRect.left;
      let newY = e.clientY - dragStart.y - containerRect.top;
      
      // Constrain to container bounds
      newX = Math.max(0, Math.min(newX, containerWidth - cropSize.width));
      newY = Math.max(0, Math.min(newY, containerHeight - cropSize.height));
      
      setCrop({ x: newX, y: newY });
    } else if (isResizing && resizeCorner) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      // Determine resize direction based on corner
      let sizeDelta = 0;
      if (resizeCorner === 'se') {
        // Bottom-right: grow when moving right/down
        sizeDelta = Math.max(deltaX, deltaY);
      } else if (resizeCorner === 'nw') {
        // Top-left: grow when moving left/up (negative delta)
        sizeDelta = -Math.max(Math.abs(deltaX), Math.abs(deltaY));
      } else if (resizeCorner === 'ne') {
        // Top-right: grow when moving right/up
        sizeDelta = deltaX - deltaY;
      } else if (resizeCorner === 'sw') {
        // Bottom-left: grow when moving left/down
        sizeDelta = -deltaX + deltaY;
      }
      
      // Calculate new size maintaining aspect ratio
      let newWidth = resizeStart.width + sizeDelta;
      let newHeight = newWidth / aspectRatio;
      
      // Ensure minimum size
      if (newWidth < minCropSize) {
        newWidth = minCropSize;
        newHeight = newWidth / aspectRatio;
      }
      
      // Calculate new position based on corner
      let newX = resizeStart.cropX;
      let newY = resizeStart.cropY;
      
      if (resizeCorner.includes('n')) {
        // Top corners: adjust Y position upward
        const heightDiff = resizeStart.height - newHeight;
        newY = resizeStart.cropY + heightDiff;
      }
      if (resizeCorner.includes('w')) {
        // Left corners: adjust X position leftward
        const widthDiff = resizeStart.width - newWidth;
        newX = resizeStart.cropX + widthDiff;
      }
      
      // Constrain the crop box - this ensures it never disappears
      const constrained = constrainCropBox(newX, newY, newWidth, newHeight);
      
      // Always update with constrained values to prevent disappearing
      setCrop({ x: constrained.x, y: constrained.y });
      setCropSize({ width: constrained.width, height: constrained.height });
    }
  }, [isDragging, isResizing, resizeCorner, dragStart, resizeStart, cropSize, constrainCropBox, aspectRatio, minCropSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeCorner(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = isDragging ? 'grabbing' : 'default';
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleCrop = () => {
    if (!imageRef.current || !containerRef.current || cropSize.width === 0 || cropSize.height === 0) return;

    const img = imageRef.current;
    const containerRect = containerRef.current.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;
    
    const imgOffsetX = (containerRect.width - imgRect.width) / 2;
    const imgOffsetY = (containerRect.height - imgRect.height) / 2;
    
    const cropXRelativeToImage = crop.x - imgOffsetX;
    const cropYRelativeToImage = crop.y - imgOffsetY;
    
    const cropX = Math.max(0, cropXRelativeToImage * scaleX);
    const cropY = Math.max(0, cropYRelativeToImage * scaleY);
    const cropWidth = Math.min(cropSize.width * scaleX, img.naturalWidth - cropX);
    const cropHeight = Math.min(cropSize.height * scaleY, img.naturalHeight - cropY);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      img,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    const croppedDataUrl = canvas.toDataURL("image/png", 0.95);
    onCrop(croppedDataUrl);
  };

  const adjustZoom = (delta: number) => {
    setZoom(prev => {
      const newZoom = Math.max(0.25, Math.min(3, prev + delta));
      return newZoom;
    });
  };

  const dialogContent = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/80 z-[99999]"
      onClick={onCancel}
    >
      <div
        className="bg-white w-[98vw] h-[96vh] max-w-[1800px] max-h-[1100px] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Ultra minimal */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
          <h2 className="text-lg font-medium text-gray-900">
            {t("title", { width: targetWidth, height: targetHeight })}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Cropper Area - Full bleed */}
        <div className="flex-1 overflow-hidden relative bg-black">
          <div
            ref={containerRef}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Image */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt={t("cropPreview")}
              className="max-w-full max-h-full object-contain select-none"
              style={{ 
                transform: `scale(${zoom})`,
                position: 'relative',
                zIndex: 1,
              }}
              onLoad={handleImageLoad}
              draggable={false}
            />

            {/* Overlay and Crop Box */}
            {imageLoaded && cropSize.width > 0 && cropSize.height > 0 && (
              <>
                {/* Dark overlay outside crop area */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    zIndex: 2,
                    background: `
                      linear-gradient(to right, 
                        rgba(0,0,0,0.7) 0%, 
                        rgba(0,0,0,0.7) ${(crop.x / (containerSize.width || 1)) * 100}%,
                        transparent ${(crop.x / (containerSize.width || 1)) * 100}%,
                        transparent ${((crop.x + cropSize.width) / (containerSize.width || 1)) * 100}%,
                        rgba(0,0,0,0.7) ${((crop.x + cropSize.width) / (containerSize.width || 1)) * 100}%),
                      linear-gradient(to bottom, 
                        rgba(0,0,0,0.7) 0%, 
                        rgba(0,0,0,0.7) ${(crop.y / (containerSize.height || 1)) * 100}%,
                        transparent ${(crop.y / (containerSize.height || 1)) * 100}%,
                        transparent ${((crop.y + cropSize.height) / (containerSize.height || 1)) * 100}%,
                        rgba(0,0,0,0.7) ${((crop.y + cropSize.height) / (containerSize.height || 1)) * 100}%)
                    `,
                  }}
                />
                
                {/* Crop Box - Minimal design */}
                <div
                  className="absolute cursor-move"
                  style={{
                    position: 'absolute',
                    left: `${crop.x}px`,
                    top: `${crop.y}px`,
                    width: `${cropSize.width}px`,
                    height: `${cropSize.height}px`,
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                    backgroundColor: 'transparent',
                    zIndex: 1000,
                    boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.2)',
                  }}
                  onMouseDown={handleCropBoxMouseDown}
                >
                  {/* Minimal grid lines */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
                  </div>
                  
                  {/* Corner resize handles - Minimal */}
                  {['nw', 'ne', 'sw', 'se'].map((corner) => {
                    const positions = {
                      nw: { top: '-4px', left: '-4px', cursor: 'nwse-resize' },
                      ne: { top: '-4px', right: '-4px', cursor: 'nesw-resize' },
                      sw: { bottom: '-4px', left: '-4px', cursor: 'nesw-resize' },
                      se: { bottom: '-4px', right: '-4px', cursor: 'nwse-resize' },
                    };
                    
                    return (
                      <div
                        key={corner}
                        className="resize-handle absolute bg-white rounded-full hover:scale-125 transition-transform"
                        style={{
                          width: '12px',
                          height: '12px',
                          zIndex: 2000,
                          cursor: positions[corner as keyof typeof positions].cursor,
                          ...positions[corner as keyof typeof positions],
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
                        }}
                        onMouseDown={(e) => handleResizeMouseDown(e, corner)}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Controls Bar - Minimal and clean */}
        <div className="px-6 py-4 flex-shrink-0 border-t border-gray-100">
          <div className="flex items-center justify-between gap-6">
            {/* Zoom Controls - Simplified */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustZoom(-0.1)}
                disabled={zoom <= 0.25}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ZoomOut className="w-4 h-4 text-gray-700" />
              </button>
              <div className="flex items-center gap-2 min-w-[120px]">
                <input
                  type="range"
                  min="0.25"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-900"
                />
                <span className="text-xs font-medium text-gray-600 w-10 text-right tabular-nums">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <button
                type="button"
                onClick={() => adjustZoom(0.1)}
                disabled={zoom >= 3}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ZoomIn className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Size Display - Minimal */}
            {imageLoaded && cropSize.width > 0 && (
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="font-mono">
                  {Math.round(cropSize.width)} × {Math.round(cropSize.height)}
                </span>
                <span className="text-gray-400">→</span>
                <span className="font-mono text-gray-900">
                  {targetWidth} × {targetHeight}
                </span>
              </div>
            )}

            {/* Action Buttons - Minimal */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 h-9 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleCrop}
                disabled={!imageLoaded || cropSize.width < minCropSize}
                className="px-4 h-9 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {t("cropAndSave")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(dialogContent, document.body);
}
