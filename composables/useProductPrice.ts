import { toValue } from "vue";
import { formatAmount, FormatAmountParams } from "~/utils/format-price";
import { computed } from "#imports";
import { CalculatedVariant } from "~/types/medusa";

export const useProductPrice = (product, variantId, cart) => {
  const getPercentageDiff = (original: number, calculated: number) => {
    const diff = original - calculated;
    const decrease = (diff / original) * 100;

    return decrease.toFixed();
  };

  const cheapestPrice = computed(() => {
    if (
      !toValue(product) ||
      !toValue(product).variants?.length ||
      !toValue(cart)?.region
    ) {
      return null;
    }

    const variants = toValue(product).variants as CalculatedVariant[];
    const region = toValue(cart).region;

    const cheapestVariant = variants.reduce((prev, curr) => {
      return prev.calculated_price < curr.calculated_price ? prev : curr;
    });

    return {
      calculatedPrice: formatAmount({
        amount: cheapestVariant.calculated_price,
        region,
        includeTaxes: false,
      } as FormatAmountParams),
      originalPrice: formatAmount({
        amount: cheapestVariant.original_price,
        region,
        includeTaxes: false,
      } as FormatAmountParams),
      priceType: cheapestVariant.calculated_price_type,
      percentageDiff: getPercentageDiff(
        cheapestVariant.original_price,
        cheapestVariant.calculated_price
      ),
    };
  });
  const variantPrice = computed(() => {
    if (
      !toValue(product) ||
      !toValue(product).variants?.length ||
      !toValue(cart)?.region
    ) {
      return null;
    }
    const region = toValue(cart).region;
    const variant = toValue(product).variants.find(
      (v) => v.id === toValue(variantId) || v.sku === toValue(variantId)
    ) as CalculatedVariant;

    if (!variant) {
      return null;
    }

    return {
      calculatedPrice: formatAmount({
        amount: variant.calculated_price,
        region,
        includeTaxes: false,
      } as FormatAmountParams),
      originalPrice: formatAmount({
        amount: variant.original_price,
        region,
        includeTaxes: false,
      } as FormatAmountParams),
      priceType: variant.calculated_price_type,
      percentageDiff: getPercentageDiff(
        variant.original_price,
        variant.calculated_price
      ),
    };
  });

  return {
    cheapestPrice,
    variantPrice,
  };
};
