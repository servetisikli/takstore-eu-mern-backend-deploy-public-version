const formatPrice = (priceInCents, currency = "EUR", locale = "de-DE") => {
  // Hata Kontrolü: Geçersiz veya negatif değerleri engelle
  if (!Number.isFinite(priceInCents) || priceInCents < 0) return "Invalid Price";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(priceInCents / 100);
};

export default formatPrice;
