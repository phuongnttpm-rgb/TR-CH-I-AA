import React from 'react';

interface ChemistryDiagramProps {
  type?: 'general_structure' | 'zwitterion' | 'glycine' | 'alanine' | 'valine' | 'lysine' | 'glutamic_acid' | 'peptide_bond' | 'tripeptide' | 'biuret' | 'electrophoresis';
  caption?: string;
  className?: string;
}

export const ChemistryDiagram: React.FC<ChemistryDiagramProps> = ({ type, caption, className = '' }) => {
  if (!type) return null;

  return (
    <div className={`flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/85 border border-cyan-500/30 backdrop-blur shadow-inner shadow-cyan-950/40 ${className}`}>
      <div className="w-full flex items-center justify-center max-h-24 sm:max-h-28 overflow-hidden">
        {type === 'general_structure' && (
          <svg viewBox="0 0 420 120" className="w-full max-w-md h-auto">
            {/* Background glow */}
            <rect x="10" y="10" width="400" height="100" rx="12" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
            
            {/* H2N group */}
            <g transform="translate(45, 65)">
              <rect x="-35" y="-22" width="70" height="42" rx="8" fill="#1e3a8a" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="18" fontFamily="monospace">H₂N</text>
            </g>

            {/* Bond */}
            <line x1="85" y1="65" x2="140" y2="65" stroke="#94a3b8" strokeWidth="3" />

            {/* CH(R) group */}
            <g transform="translate(180, 65)">
              <circle cx="0" cy="0" r="26" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2" />
              <text x="0" y="6" textAnchor="middle" fill="#f8fafc" fontWeight="bold" fontSize="18" fontFamily="monospace">CH</text>
              {/* R group branch */}
              <line x1="0" y1="-26" x2="0" y2="-52" stroke="#94a3b8" strokeWidth="3" strokeDasharray="3 3" />
              <rect x="-18" y="-72" width="36" height="24" rx="4" fill="#854d0e" stroke="#fbbf24" strokeWidth="1.5" />
              <text x="0" y="-55" textAnchor="middle" fill="#fef08a" fontWeight="bold" fontSize="14" fontFamily="monospace">R</text>
            </g>

            {/* Bond */}
            <line x1="210" y1="65" x2="265" y2="65" stroke="#94a3b8" strokeWidth="3" />

            {/* COOH group */}
            <g transform="translate(325, 65)">
              <rect x="-45" y="-22" width="90" height="42" rx="8" fill="#881337" fillOpacity="0.4" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#fb7185" fontWeight="bold" fontSize="18" fontFamily="monospace">COOH</text>
            </g>

            {/* Annotations */}
            <text x="45" y="102" textAnchor="middle" fill="#7dd3fc" fontSize="11" fontWeight="600">Nhóm amino (base)</text>
            <text x="180" y="102" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="600">Gốc hydrocarbon</text>
            <text x="325" y="102" textAnchor="middle" fill="#fda4af" fontSize="11" fontWeight="600">Nhóm carboxyl (acid)</text>
          </svg>
        )}

        {type === 'zwitterion' && (
          <svg viewBox="0 0 460 125" className="w-full max-w-lg h-auto">
            <rect x="10" y="8" width="440" height="108" rx="12" fill="#0b1329" stroke="#1e293b" />
            
            {/* Left: Neutral form */}
            <text x="110" y="32" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">Dạng phân tử trung hòa</text>
            <text x="110" y="68" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontFamily="monospace" fontWeight="bold">
              H₂N—CH(R)—COOH
            </text>

            {/* Equilibrium arrows */}
            <g transform="translate(230, 64)">
              <line x1="-20" y1="-5" x2="20" y2="-5" stroke="#38bdf8" strokeWidth="2.5" />
              <polygon points="15,-8 22,-5 15,-2" fill="#38bdf8" />
              <line x1="20" y1="5" x2="-20" y2="5" stroke="#38bdf8" strokeWidth="2.5" />
              <polygon points="-15,8 -22,5 -15,2" fill="#38bdf8" />
            </g>

            {/* Right: Zwitterion form */}
            <text x="350" y="32" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">Dạng ion lưỡng cực (chủ yếu)</text>
            <g transform="translate(350, 68)">
              <text x="-65" y="0" textAnchor="middle" fill="#38bdf8" fontSize="16" fontFamily="monospace" fontWeight="bold">H₃N⁺</text>
              <text x="0" y="0" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontFamily="monospace" fontWeight="bold">—CH(R)—</text>
              <text x="75" y="0" textAnchor="middle" fill="#fb7185" fontSize="16" fontFamily="monospace" fontWeight="bold">COO⁻</text>
            </g>

            <rect x="270" y="88" width="160" height="20" rx="4" fill="#0284c7" fillOpacity="0.2" />
            <text x="350" y="102" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600">Nhiệt độ nóng chảy cao, tan tốt trong H₂O</text>
          </svg>
        )}

        {type === 'glycine' && (
          <svg viewBox="0 0 380 110" className="w-full max-w-sm h-auto">
            <rect x="10" y="10" width="360" height="90" rx="10" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
            <g transform="translate(70, 52)">
              <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#0369a1" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="18" fontFamily="monospace">H₂N</text>
            </g>
            <line x1="110" y1="52" x2="160" y2="52" stroke="#94a3b8" strokeWidth="3" />
            <g transform="translate(190, 52)">
              <rect x="-25" y="-18" width="50" height="36" rx="6" fill="#334155" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#f8fafc" fontWeight="bold" fontSize="18" fontFamily="monospace">CH₂</text>
            </g>
            <line x1="220" y1="52" x2="270" y2="52" stroke="#94a3b8" strokeWidth="3" />
            <g transform="translate(310, 52)">
              <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#be123c" fillOpacity="0.3" stroke="#fb7185" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#fb7185" fontWeight="bold" fontSize="18" fontFamily="monospace">COOH</text>
            </g>
            <text x="190" y="92" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">GLYCINE (Gly) | M = 75 g/mol</text>
          </svg>
        )}

        {type === 'alanine' && (
          <svg viewBox="0 0 380 130" className="w-full max-w-sm h-auto">
            <rect x="10" y="10" width="360" height="110" rx="10" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
            <g transform="translate(70, 70)">
              <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#0369a1" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="18" fontFamily="monospace">H₂N</text>
            </g>
            <line x1="110" y1="70" x2="160" y2="70" stroke="#94a3b8" strokeWidth="3" />
            <g transform="translate(190, 70)">
              <rect x="-25" y="-18" width="50" height="36" rx="6" fill="#334155" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#f8fafc" fontWeight="bold" fontSize="18" fontFamily="monospace">CH</text>
              {/* CH3 branch */}
              <line x1="0" y1="-18" x2="0" y2="-40" stroke="#94a3b8" strokeWidth="3" />
              <rect x="-22" y="-62" width="44" height="24" rx="4" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
              <text x="0" y="-45" textAnchor="middle" fill="#6ee7b7" fontWeight="bold" fontSize="14" fontFamily="monospace">CH₃</text>
            </g>
            <line x1="220" y1="70" x2="270" y2="70" stroke="#94a3b8" strokeWidth="3" />
            <g transform="translate(310, 70)">
              <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#be123c" fillOpacity="0.3" stroke="#fb7185" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#fb7185" fontWeight="bold" fontSize="18" fontFamily="monospace">COOH</text>
            </g>
            <text x="190" y="112" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">ALANINE (Ala) | M = 89 g/mol</text>
          </svg>
        )}

        {type === 'valine' && (
          <svg viewBox="0 0 400 130" className="w-full max-w-sm h-auto">
            <rect x="10" y="10" width="380" height="110" rx="10" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
            <text x="200" y="32" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">VALINE (Val) - (CH₃)₂CH-CH(NH₂)-COOH | M = 117</text>
            <g transform="translate(75, 75)">
              <text x="0" y="0" textAnchor="middle" fill="#34d399" fontWeight="bold" fontSize="16" fontFamily="monospace">(CH₃)₂CH</text>
            </g>
            <line x1="125" y1="70" x2="165" y2="70" stroke="#94a3b8" strokeWidth="3" />
            <g transform="translate(200, 75)">
              <text x="0" y="0" textAnchor="middle" fill="#f8fafc" fontWeight="bold" fontSize="16" fontFamily="monospace">CH(NH₂)</text>
            </g>
            <line x1="240" y1="70" x2="280" y2="70" stroke="#94a3b8" strokeWidth="3" />
            <g transform="translate(320, 75)">
              <rect x="-30" y="-18" width="60" height="30" rx="6" fill="#be123c" fillOpacity="0.3" stroke="#fb7185" strokeWidth="1.5" />
              <text x="0" y="3" textAnchor="middle" fill="#fb7185" fontWeight="bold" fontSize="16" fontFamily="monospace">COOH</text>
            </g>
          </svg>
        )}

        {type === 'lysine' && (
          <svg viewBox="0 0 420 120" className="w-full max-w-md h-auto">
            <rect x="10" y="10" width="400" height="100" rx="10" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
            <g transform="translate(60, 55)">
              <rect x="-30" y="-16" width="60" height="32" rx="6" fill="#0369a1" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="15" fontFamily="monospace">H₂N</text>
              <text x="0" y="28" textAnchor="middle" fill="#38bdf8" fontSize="10">Nhóm 1</text>
            </g>
            <line x1="95" y1="55" x2="135" y2="55" stroke="#94a3b8" strokeWidth="3" />
            <text x="175" y="60" textAnchor="middle" fill="#e2e8f0" fontWeight="bold" fontSize="16" fontFamily="monospace">[CH₂]₄</text>
            <line x1="215" y1="55" x2="245" y2="55" stroke="#94a3b8" strokeWidth="3" />
            <g transform="translate(285, 55)">
              <rect x="-35" y="-16" width="70" height="32" rx="6" fill="#0369a1" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="14" fontFamily="monospace">CH(NH₂)</text>
              <text x="0" y="28" textAnchor="middle" fill="#38bdf8" fontSize="10">Nhóm 2</text>
            </g>
            <line x1="325" y1="55" x2="345" y2="55" stroke="#94a3b8" strokeWidth="3" />
            <g transform="translate(375, 55)">
              <rect x="-25" y="-16" width="50" height="32" rx="6" fill="#be123c" fillOpacity="0.4" stroke="#fb7185" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#fb7185" fontWeight="bold" fontSize="14" fontFamily="monospace">COOH</text>
            </g>
            <text x="210" y="25" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">LYSINE (Lys) - 2 nhóm -NH₂ (môi trường kiềm nhẹ, quỳ hóa xanh)</text>
          </svg>
        )}

        {type === 'glutamic_acid' && (
          <svg viewBox="0 0 420 120" className="w-full max-w-md h-auto">
            <rect x="10" y="10" width="400" height="100" rx="10" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
            <g transform="translate(55, 55)">
              <rect x="-30" y="-16" width="60" height="32" rx="6" fill="#be123c" fillOpacity="0.4" stroke="#fb7185" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#fb7185" fontWeight="bold" fontSize="14" fontFamily="monospace">HOOC</text>
              <text x="0" y="28" textAnchor="middle" fill="#fb7185" fontSize="10">Nhóm 1</text>
            </g>
            <line x1="90" y1="55" x2="135" y2="55" stroke="#94a3b8" strokeWidth="3" />
            <text x="175" y="60" textAnchor="middle" fill="#e2e8f0" fontWeight="bold" fontSize="16" fontFamily="monospace">[CH₂]₂</text>
            <line x1="215" y1="55" x2="245" y2="55" stroke="#94a3b8" strokeWidth="3" />
            <g transform="translate(285, 55)">
              <rect x="-35" y="-16" width="70" height="32" rx="6" fill="#0369a1" fillOpacity="0.4" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="14" fontFamily="monospace">CH(NH₂)</text>
            </g>
            <line x1="325" y1="55" x2="345" y2="55" stroke="#94a3b8" strokeWidth="3" />
            <g transform="translate(375, 55)">
              <rect x="-25" y="-16" width="50" height="32" rx="6" fill="#be123c" fillOpacity="0.4" stroke="#fb7185" strokeWidth="1.5" />
              <text x="0" y="6" textAnchor="middle" fill="#fb7185" fontWeight="bold" fontSize="14" fontFamily="monospace">COOH</text>
              <text x="0" y="28" textAnchor="middle" fill="#fb7185" fontSize="10">Nhóm 2</text>
            </g>
            <text x="210" y="25" textAnchor="middle" fill="#fb7185" fontSize="12" fontWeight="bold">GLUTAMIC ACID (Glu) - 2 nhóm -COOH (môi trường acid, quỳ hóa đỏ)</text>
          </svg>
        )}

        {type === 'peptide_bond' && (
          <svg viewBox="0 0 420 120" className="w-full max-w-md h-auto">
            <rect x="10" y="10" width="400" height="100" rx="12" fill="#0f172a" stroke="#ca8a04" strokeWidth="1.5" />
            <text x="80" y="65" textAnchor="middle" fill="#cbd5e1" fontSize="16" fontFamily="monospace">H₂N—CH(R₁)—</text>
            
            {/* Highlighted peptide bond */}
            <g transform="translate(210, 60)">
              <rect x="-42" y="-28" width="84" height="48" rx="8" fill="#eab308" fillOpacity="0.25" stroke="#facc15" strokeWidth="2" />
              <text x="0" y="2" textAnchor="middle" fill="#fde047" fontWeight="bold" fontSize="20" fontFamily="monospace">—CO—NH—</text>
              <text x="0" y="32" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="bold">Liên kết peptide</text>
            </g>

            <text x="340" y="65" textAnchor="middle" fill="#cbd5e1" fontSize="16" fontFamily="monospace">—CH(R₂)—COOH</text>
            <text x="210" y="25" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="bold">Cấu trúc liên kết peptide giữa hai đơn vị α-amino acid</text>
          </svg>
        )}

        {type === 'tripeptide' && (
          <svg viewBox="0 0 460 120" className="w-full max-w-lg h-auto">
            <rect x="10" y="8" width="440" height="104" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            {/* Head N */}
            <g transform="translate(60, 55)">
              <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#0369a1" fillOpacity="0.5" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="16">Val</text>
              <text x="0" y="28" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="bold">Đầu N (-NH₂)</text>
            </g>

            {/* Bond 1 */}
            <g transform="translate(130, 52)">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#facc15" strokeWidth="3" />
              <text x="0" y="16" textAnchor="middle" fill="#facc15" fontSize="9" fontWeight="bold">lk 1</text>
            </g>

            {/* Middle */}
            <g transform="translate(195, 55)">
              <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#334155" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" fill="#f8fafc" fontWeight="bold" fontSize="16">Gly</text>
              <text x="0" y="28" textAnchor="middle" fill="#94a3b8" fontSize="10">ở giữa</text>
            </g>

            {/* Bond 2 */}
            <g transform="translate(265, 52)">
              <line x1="-15" y1="0" x2="15" y2="0" stroke="#facc15" strokeWidth="3" />
              <text x="0" y="16" textAnchor="middle" fill="#facc15" fontSize="9" fontWeight="bold">lk 2</text>
            </g>

            {/* Head C */}
            <g transform="translate(330, 55)">
              <rect x="-35" y="-18" width="70" height="36" rx="6" fill="#be123c" fillOpacity="0.5" stroke="#fb7185" strokeWidth="1.5" />
              <text x="0" y="5" textAnchor="middle" fill="#fb7185" fontWeight="bold" fontSize="16">Ala</text>
              <text x="0" y="28" textAnchor="middle" fill="#fda4af" fontSize="10" fontWeight="bold">Đầu C (-COOH)</text>
            </g>

            <text x="230" y="22" textAnchor="middle" fill="#e0f2fe" fontSize="12" fontWeight="bold">Tripeptide Val-Gly-Ala: 3 mắt xích, 2 liên kết peptide</text>
          </svg>
        )}

        {type === 'biuret' && (
          <svg viewBox="0 0 420 120" className="w-full max-w-md h-auto">
            <rect x="10" y="10" width="400" height="100" rx="10" fill="#2e1065" stroke="#a855f7" strokeWidth="1.5" />
            <g transform="translate(70, 60)">
              <circle cx="0" cy="0" r="28" fill="#581c87" stroke="#d8b4fe" strokeWidth="2" />
              <text x="0" y="5" textAnchor="middle" fill="#f3e8ff" fontSize="11" fontWeight="bold">Peptide</text>
              <text x="0" y="16" textAnchor="middle" fill="#c084fc" fontSize="9">(≥ 2 lk -CONH-)</text>
            </g>

            <text x="135" y="65" textAnchor="middle" fill="#d8b4fe" fontSize="20" fontWeight="bold">+</text>

            <g transform="translate(195, 60)">
              <rect x="-35" y="-22" width="70" height="44" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
              <text x="0" y="0" textAnchor="middle" fill="#818cf8" fontSize="13" fontWeight="bold">Cu(OH)₂</text>
              <text x="0" y="14" textAnchor="middle" fill="#a5b4fc" fontSize="9">môi trường kiềm</text>
            </g>

            <text x="260" y="65" textAnchor="middle" fill="#d8b4fe" fontSize="22" fontWeight="bold">→</text>

            <g transform="translate(340, 60)">
              <rect x="-55" y="-25" width="110" height="50" rx="10" fill="#9333ea" stroke="#f3e8ff" strokeWidth="2" />
              <text x="0" y="0" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">DUNG DỊCH TÍM</text>
              <text x="0" y="15" textAnchor="middle" fill="#f3e8ff" fontSize="10">Phức chất Cu²⁺</text>
            </g>

            <text x="210" y="24" textAnchor="middle" fill="#f5d0fe" fontSize="11" fontWeight="bold">Phản ứng màu biuret đặc trưng (Dipeptide KHÔNG có phản ứng này)</text>
          </svg>
        )}

        {type === 'electrophoresis' && (
          <svg viewBox="0 0 440 125" className="w-full max-w-md h-auto">
            <rect x="8" y="8" width="424" height="108" rx="10" fill="#0f172a" stroke="#38bdf8" />
            <text x="220" y="24" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">Hiện tượng điện di của Glycine trong điện trường</text>
            
            {/* Pole - */}
            <rect x="25" y="38" width="24" height="66" rx="4" fill="#dc2626" />
            <text x="37" y="78" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold">-</text>
            <text x="37" y="116" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">Cực âm</text>

            {/* pH < 6 */}
            <g transform="translate(105, 70)">
              <rect x="-35" y="-25" width="70" height="50" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="1.5" />
              <text x="0" y="-8" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="bold">pH &lt; 6</text>
              <text x="0" y="8" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace">H₃N⁺-CH₂-COOH</text>
              <text x="0" y="20" textAnchor="middle" fill="#fca5a5" fontSize="9">Dạng Cation ➔ Cực (-)</text>
            </g>

            {/* pH ~ 6 */}
            <g transform="translate(220, 70)">
              <rect x="-38" y="-25" width="76" height="50" rx="6" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
              <text x="0" y="-8" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">pH ≈ 6</text>
              <text x="0" y="8" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">H₃N⁺-CH₂-COO⁻</text>
              <text x="0" y="20" textAnchor="middle" fill="#94a3b8" fontSize="9">Điện tích 0 ➔ Đứng yên</text>
            </g>

            {/* pH > 6 */}
            <g transform="translate(335, 70)">
              <rect x="-35" y="-25" width="70" height="50" rx="6" fill="#042f2e" stroke="#14b8a6" strokeWidth="1.5" />
              <text x="0" y="-8" textAnchor="middle" fill="#99f6e4" fontSize="11" fontWeight="bold">pH &gt; 6</text>
              <text x="0" y="8" textAnchor="middle" fill="#ffffff" fontSize="11" fontFamily="monospace">H₂N-CH₂-COO⁻</text>
              <text x="0" y="20" textAnchor="middle" fill="#99f6e4" fontSize="9">Dạng Anion ➔ Cực (+)</text>
            </g>

            {/* Pole + */}
            <rect x="390" y="38" width="24" height="66" rx="4" fill="#0284c7" />
            <text x="402" y="78" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold">+</text>
            <text x="402" y="116" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">Cực dương</text>
          </svg>
        )}
      </div>

      {caption && (
        <p className="mt-2 text-xs text-cyan-300/80 font-medium tracking-wide text-center">
          🔬 {caption}
        </p>
      )}
    </div>
  );
};
