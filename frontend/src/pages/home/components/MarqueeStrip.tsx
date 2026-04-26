const items = [
  "2024 BMW 7 Series — $89,900",
  "2024 Porsche Cayenne — $96,200",
  "2023 Mercedes GLE 450 — $74,500",
  "2024 Tesla Model S — $79,990",
  "2023 Range Rover Sport — $82,400",
  "2023 Audi A8 L — $88,000",
  "2024 Lexus LX 600 — $91,500",
  "2023 Bentley Bentayga — $198,000",
];

export default function MarqueeStrip() {
  return (
    <div className="bg-[#d4af37] py-3 overflow-hidden">
      <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-6 text-[#1a1a1a] text-sm font-semibold"
          >
            <i className="ri-star-fill text-[#1a1a1a]/40 text-xs"></i>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
