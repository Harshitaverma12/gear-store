import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Gallery.module.scss';

export function Gallery({ images = [] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const thumbsRef = useRef(null);

  const handleThumbClick = useCallback((idx) => {
    setActiveIdx(idx);
    // scroll selected thumb into view horizontally
    const el = thumbsRef.current?.children[idx];
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, []);

  if (!images.length) return null;

  return (
    <>
      <div className={styles.gallery}>
        {/* ── Main image ── */}
        <div
          className={styles.mainWrap}
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setLightboxOpen(true)}
          aria-label="Click to zoom image"
        >
          <img
            src={images[activeIdx]}
            alt={`Product view ${activeIdx + 1}`}
            className={styles.mainImage}
            draggable={false}
          />
          <span className={styles.zoomHint} aria-hidden="true">
            <ZoomIcon /> Click to zoom
          </span>
          <span className={styles.counter} aria-hidden="true">
            {activeIdx + 1} / {images.length}
          </span>
        </div>

        {/* ── Horizontal thumbnail row (desktop) ── */}
        {images.length > 1 && (
          <div className={styles.thumbRow} ref={thumbsRef} role="list" aria-label="Product images">
            {images.map((src, idx) => (
              <button
                key={idx}
                role="listitem"
                className={`${styles.thumb} ${idx === activeIdx ? styles.thumbActive : ''}`}
                onClick={() => handleThumbClick(idx)}
                aria-label={`View image ${idx + 1}`}
                aria-pressed={idx === activeIdx}
              >
                <img src={src} alt="" loading="lazy" draggable={false} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Mobile dots ── */}
      <div className={styles.dots} aria-hidden="true">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === activeIdx ? styles.dotActive : ''}`}
            onClick={() => handleThumbClick(idx)}
          />
        ))}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          startIndex={activeIdx}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={setActiveIdx}
        />
      )}
    </>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose, onIndexChange }) {
  const [idx, setIdx] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, panX: 0, panY: 0 });
  const containerRef = useRef(null);
  const lastTouchDist = useRef(null);

  useEffect(() => { onIndexChange(idx); }, [idx]);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')                   onClose();
      if (e.key === 'ArrowRight')               navigate(1);
      if (e.key === 'ArrowLeft')                navigate(-1);
      if (e.key === '+' || e.key === '=')       adjustZoom(0.5);
      if (e.key === '-')                        adjustZoom(-0.5);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, zoom]);

  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  function navigate(dir) {
    setIdx(i => (i + dir + images.length) % images.length);
    resetZoom();
  }

  function adjustZoom(delta) {
    setZoom(z => {
      const next = Math.min(4, Math.max(1, z + delta));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }

  function handleImageClick(e) {
    if (dragging) return;
    if (zoom > 1) { resetZoom(); return; }
    const rect = containerRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    setZoom(2.5);
    setPan({ x: -relX * 1.5, y: -relY * 1.5 });
  }

  function handleMouseDown(e) {
    if (zoom <= 1) return;
    e.preventDefault();
    setDragging(false);
    setDragStart({ x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y });

    function onMove(e) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) setDragging(true);
      setPan({ x: dragStart.panX + dx, y: dragStart.panY + dy });
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setTimeout(() => setDragging(false), 0);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  function handleWheel(e) {
    e.preventDefault();
    adjustZoom(e.deltaY > 0 ? -0.3 : 0.3);
  }

  function handleTouchStart(e) {
    if (e.touches.length === 2)
      lastTouchDist.current = getTouchDist(e.touches);
  }
  function handleTouchMove(e) {
    if (e.touches.length !== 2) return;
    e.preventDefault();
    const dist = getTouchDist(e.touches);
    const delta = (dist - lastTouchDist.current) / 120;
    lastTouchDist.current = dist;
    setZoom(z => Math.min(4, Math.max(1, z + delta)));
  }
  function getTouchDist(t) {
    const dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  const isZoomed = zoom > 1;

  return (
    <div className={styles.lightboxOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Image viewer">

      <button className={styles.lbClose} onClick={onClose} aria-label="Close"><CloseIcon /></button>

      <div className={styles.lbControls} onClick={e => e.stopPropagation()}>
        <button className={styles.lbCtrlBtn} onClick={() => adjustZoom(0.5)} disabled={zoom >= 4} aria-label="Zoom in"><ZoomInIcon /></button>
        <span className={styles.lbZoomLevel}>{Math.round(zoom * 100)}%</span>
        <button className={styles.lbCtrlBtn} onClick={() => adjustZoom(-0.5)} disabled={zoom <= 1} aria-label="Zoom out"><ZoomOutIcon /></button>
        {isZoomed && <button className={styles.lbCtrlBtn} onClick={resetZoom} aria-label="Reset"><ResetIcon /></button>}
      </div>

      {images.length > 1 && (
        <>
          <button className={`${styles.lbNav} ${styles.lbNavPrev}`} onClick={e => { e.stopPropagation(); navigate(-1); }} aria-label="Previous"><ChevronLeft /></button>
          <button className={`${styles.lbNav} ${styles.lbNavNext}`} onClick={e => { e.stopPropagation(); navigate(1); }} aria-label="Next"><ChevronRight /></button>
        </>
      )}

      <div
        className={`${styles.lbImgWrap} ${isZoomed ? styles.lbZoomed : ''}`}
        ref={containerRef}
        onClick={e => e.stopPropagation()}
        onDoubleClick={handleImageClick}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        style={{ cursor: isZoomed ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
      >
        <img
          src={images[idx]}
          alt={`Product view ${idx + 1}`}
          className={styles.lbImage}
          draggable={false}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transition: dragging ? 'none' : 'transform 0.2s ease',
          }}
        />
        {!isZoomed && (
          <span className={styles.lbHint} aria-hidden="true">
            <ZoomIcon /> Double-click or scroll to zoom
          </span>
        )}
      </div>

      {/* Bottom thumbnail strip inside lightbox */}
      <div className={styles.lbThumbs} onClick={e => e.stopPropagation()}>
        {images.map((src, i) => (
          <button key={i}
            className={`${styles.lbThumb} ${i === idx ? styles.lbThumbActive : ''}`}
            onClick={() => { setIdx(i); resetZoom(); }}
            aria-label={`View image ${i + 1}`}>
            <img src={src} alt="" draggable={false} />
          </button>
        ))}
      </div>

      <span className={styles.lbCounter} aria-live="polite">{idx + 1} / {images.length}</span>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const ZoomIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);
const ZoomInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);
const ZoomOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
);
const ResetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
