# Price Layout Variants for Mobile

Here are several variants for displaying prices on mobile devices:

## Variant 1: Stacked Layout (Title Above, Price Below)
**Best for:** Long titles and detailed price notes
```tsx
<div className="mb-4">
  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
    {service.title}
  </h3>
  {service.price && (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className={`text-2xl md:text-3xl font-bold ${accentColor}`}>
        {service.price}
      </div>
      {service.priceNote && (
        <div className="text-xs md:text-sm text-white/80">
          {service.priceNote}
        </div>
      )}
    </div>
  )}
</div>
```

## Variant 2: Price Badge/Pill
**Best for:** Prominent price display, modern look
```tsx
<div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-3">
  <h3 className="text-2xl md:text-3xl font-bold text-white flex-1">
    {service.title}
  </h3>
  {service.price && (
    <div className="flex-shrink-0">
      <div className={`inline-flex flex-col items-end md:items-center px-4 py-2 rounded-full ${cardBgVariant} border-2 border-mint-leaf/50`}>
        <div className={`text-2xl md:text-3xl font-bold ${accentColor}`}>
          {service.price}
        </div>
        {service.priceNote && (
          <div className="text-xs text-white/70 mt-1 text-center">
            {service.priceNote}
          </div>
        )}
      </div>
    </div>
  )}
</div>
```

## Variant 3: Price Callout Box
**Best for:** Emphasizing price with additional context
```tsx
<div className="mb-4">
  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
    {service.title}
  </h3>
  {service.price && (
    <div className={`p-4 rounded-lg ${cardBgVariant} border-l-4 border-mint-leaf`}>
      <div className="flex items-baseline gap-2 mb-2">
        <div className={`text-3xl font-bold ${accentColor}`}>
          {service.price}
        </div>
      </div>
      {service.priceNote && (
        <div className="text-sm text-white/80 leading-relaxed">
          {service.priceNote}
        </div>
      )}
    </div>
  )}
</div>
```

## Variant 4: Compact Inline with Wrapping
**Best for:** Space-efficient, keeps title and price together
```tsx
<div className="mb-4">
  <div className="flex flex-wrap items-baseline gap-2 md:gap-4">
    <h3 className="text-2xl md:text-3xl font-bold text-white flex-1 min-w-[200px]">
      {service.title}
    </h3>
    {service.price && (
      <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-2">
        <div className={`text-2xl md:text-3xl font-bold ${accentColor} whitespace-nowrap`}>
          {service.price}
        </div>
        {service.priceNote && (
          <div className="text-xs md:text-sm text-white/80">
            {service.priceNote}
          </div>
        )}
      </div>
    )}
  </div>
</div>
```

## Variant 5: Top-Right Corner Badge (Desktop) / Full Width (Mobile)
**Best for:** Similar to current but better mobile handling
```tsx
<div className="relative mb-4">
  <h3 className="text-2xl md:text-3xl font-bold text-white pr-0 md:pr-32">
    {service.title}
  </h3>
  {service.price && (
    <div className="mt-3 md:mt-0 md:absolute md:top-0 md:right-0">
      <div className={`text-2xl md:text-3xl font-bold ${accentColor} md:text-right`}>
        {service.price}
      </div>
      {service.priceNote && (
        <div className="text-xs md:text-sm text-white/80 mt-1 md:text-right">
          {service.priceNote}
        </div>
      )}
    </div>
  )}
</div>
```

## Variant 6: Split Card Header
**Best for:** Clear separation, professional look
```tsx
<div className={`mb-4 p-4 rounded-lg ${cardBgVariant} border-b-2 border-mint-leaf/30`}>
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
    <h3 className="text-2xl md:text-3xl font-bold text-white">
      {service.title}
    </h3>
    {service.price && (
      <div className="flex flex-col md:items-end gap-1">
        <div className={`text-2xl md:text-3xl font-bold ${accentColor}`}>
          {service.price}
        </div>
        {service.priceNote && (
          <div className="text-xs md:text-sm text-white/80 text-left md:text-right">
            {service.priceNote}
          </div>
        )}
      </div>
    )}
  </div>
</div>
```

## Recommendation
Based on the image you shared, I'd recommend **Variant 1 (Stacked Layout)** or **Variant 3 (Price Callout Box)** as they:
- Handle long Norwegian text well
- Make price notes readable on mobile
- Maintain visual hierarchy
- Work well with the dark green background

Would you like me to implement one of these variants?

