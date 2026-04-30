"use client";

const roadCSS = `
  .road-lines {
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 200%;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 30px,
      rgba(255,255,255,0.3) 30px,
      rgba(255,255,255,0.3) 60px
    );
    animation: roadMove 0.6s linear infinite;
  }
  @keyframes roadMove {
    from { transform: translateY(0); }
    to   { transform: translateY(60px); }
  }
`;

export default function Road() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0a0a0a] z-0">
      <style dangerouslySetInnerHTML={{ __html: roadCSS }} />

      <div className="absolute inset-0 flex flex-col items-center">
        {/* Perspective road strip */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: "100vw",
            height: "100vh",
            background: "linear-gradient(to top, #1a1a1a 0%, #0a0a0a 100%)",
            clipPath: "polygon(35% 100%, 65% 100%, 55% 0%, 45% 0%)",
          }}
        />
        {/* Animated dashed center line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-2"
          style={{ top: 0, bottom: 0 }}
        >
          <div className="road-lines" />
        </div>
      </div>
    </div>
  );
}
