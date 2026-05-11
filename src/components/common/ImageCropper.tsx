"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { X, Check, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropperProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImageBase64: string) => void;
  aspectRatio?: number;
  outputWidth?: number;
  outputHeight?: number;
}

export function ImageCropper({
  open,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  outputWidth = 400,
  outputHeight = 400,
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ w: 480, h: 480 });
  const [cropBoxSize, setCropBoxSize] = useState(320);

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setImgLoaded(false);
  }, [imageSrc, open]);

  useEffect(() => {
    if (!open || !containerRef.current) return;
    const w = Math.min(containerRef.current.clientWidth - 32, 480);
    setCanvasSize({ w, h: w });
    setCropBoxSize(Math.round(w * 0.7));
  }, [open]);

  useEffect(() => {
    if (!imageSrc || !open) return;
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc, open]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgLoaded) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = canvasSize;
    canvas.width = w;
    canvas.height = h;

    const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight) * zoom;
    const imgW = img.naturalWidth * scale;
    const imgH = img.naturalHeight * scale;
    const imgX = w / 2 - imgW / 2 + offset.x;
    const imgY = h / 2 - imgH / 2 + offset.y;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, imgX, imgY, imgW, imgH);

    const cropX = (w - cropBoxSize) / 2;
    const cropY = (h - cropBoxSize) / 2;

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, w, cropY);
    ctx.fillRect(0, cropY + cropBoxSize, w, h);
    ctx.fillRect(0, cropY, cropX, cropBoxSize);
    ctx.fillRect(cropX + cropBoxSize, cropY, w, cropBoxSize);

    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropBoxSize, cropBoxSize);

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    const t = cropBoxSize / 3;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(cropX + t * i, cropY); ctx.lineTo(cropX + t * i, cropY + cropBoxSize); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cropX, cropY + t * i); ctx.lineTo(cropX + cropBoxSize, cropY + t * i); ctx.stroke();
    }

    const hs = 14;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ([
      [cropX, cropY, 1, 1],
      [cropX + cropBoxSize, cropY, -1, 1],
      [cropX, cropY + cropBoxSize, 1, -1],
      [cropX + cropBoxSize, cropY + cropBoxSize, -1, -1],
    ] as [number, number, number, number][]).forEach(([cx, cy, dx, dy]) => {
      ctx.beginPath(); ctx.moveTo(cx, cy + dy * hs); ctx.lineTo(cx, cy); ctx.lineTo(cx + dx * hs, cy); ctx.stroke();
    });

    // Dimension label inside crop box
    const label = `${outputWidth} × ${outputHeight} px`;
    ctx.font = "bold 11px system-ui, sans-serif";
    const labelW = ctx.measureText(label).width + 16;
    const labelH = 22;
    const labelX = cropX + cropBoxSize / 2 - labelW / 2;
    const labelY = cropY + cropBoxSize - labelH - 8;
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.roundRect(labelX, labelY, labelW, labelH, 4);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, cropX + cropBoxSize / 2, labelY + labelH / 2);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }, [imgLoaded, zoom, offset, canvasSize, cropBoxSize, outputWidth, outputHeight]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y }); };
  const handleMouseMove = (e: React.MouseEvent) => { if (!isDragging) return; setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const handleMouseUp = () => setIsDragging(false);
  const handleTouchStart = (e: React.TouchEvent) => { const t = e.touches[0]; setIsDragging(true); setDragStart({ x: t.clientX - offset.x, y: t.clientY - offset.y }); };
  const handleTouchMove = (e: React.TouchEvent) => { if (!isDragging) return; const t = e.touches[0]; setOffset({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y }); };

  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;
    const { w, h } = canvasSize;
    const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight) * zoom;
    const imgX = w / 2 - img.naturalWidth * scale / 2 + offset.x;
    const imgY = h / 2 - img.naturalHeight * scale / 2 + offset.y;
    const cropX = (w - cropBoxSize) / 2;
    const cropY = (h - cropBoxSize) / 2;
    const srcX = (cropX - imgX) / scale;
    const srcY = (cropY - imgY) / scale;
    const srcSize = cropBoxSize / scale;
    const out = document.createElement("canvas");
    out.width = outputWidth; out.height = outputHeight;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, outputWidth, outputHeight);
    onCropComplete(out.toDataURL("image/jpeg", 0.88));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden w-full max-w-lg shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Crop Profile Photo</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Drag to reposition · Scroll or slider to zoom · Output: <span className="font-semibold text-blue-500">{outputWidth} × {outputHeight} px</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} /></button>
        </div>

        <div ref={containerRef} className="relative flex items-center justify-center bg-black select-none" style={{ minHeight: canvasSize.h }}>
          {!imgLoaded && <div className="absolute inset-0 flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}
          <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h}
            className={`touch-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            style={{ display: imgLoaded ? "block" : "none" }}
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleMouseUp}
            onWheel={(e) => { e.preventDefault(); setZoom(z => Math.min(4, Math.max(0.5, z - e.deltaY * 0.002))); }}
          />
        </div>

        <div className="flex items-center gap-3 px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"><ZoomOut size={16} /></button>
          <input type="range" min={0.5} max={4} step={0.01} value={zoom} onChange={e => setZoom(Number(e.target.value))} className="flex-1 accent-blue-600" />
          <button onClick={() => setZoom(z => Math.min(4, z + 0.1))} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"><ZoomIn size={16} /></button>
          <span className="text-xs font-mono text-gray-400 w-10 text-right">{Math.round(zoom * 100)}%</span>
        </div>

        <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100 dark:border-gray-800">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
            <Check size={15} strokeWidth={3} /> Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
}
