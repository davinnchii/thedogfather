interface PriceProps {
  amount: string;
  note?: string;
  /** Price text color; default highlight */
  className?: string;
}

export default function Price({
  amount,
  note,
  className = "text-highlight",
}: PriceProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={`text-2xl md:text-3xl font-bold ${className}`}>
          {amount}
        </span>
      </div>
      {note && (
        <p className="text-xs md:text-sm text-white-80 leading-relaxed">
          {note}
        </p>
      )}
    </div>
  );
}
