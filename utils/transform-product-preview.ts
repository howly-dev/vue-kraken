import { Product, Region } from "@medusajs/medusa";
import { CalculatedVariant } from "~/types/medusa";
import { ProductPreviewType } from "~/types/global";
import { formatAmount } from "~/utils/format-price";
import { getPercentageDiff } from "~/utils/get-precentage-diff";

const transformProductPreview = (
  product: Product,
  region: Region
): ProductPreviewType => {
  const variants = product.variants as CalculatedVariant[];

  let cheapestVariant;

  if (variants?.length > 0) {
    cheapestVariant = variants.reduce((acc, curr) => {
      if (acc.calculated_price > curr.calculated_price) {
        return curr;
      }
      return acc;
    }, variants[0]);
  }

  return {
    id: product.id,
    title: product.title,
    handle: product.handle,
    thumbnail: product.thumbnail,
    price: cheapestVariant
      ? {
          calculated_price: formatAmount({
            amount: cheapestVariant.calculated_price,
            region,
            includeTaxes: false,
          } as any),
          original_price: formatAmount({
            amount: cheapestVariant.original_price,
            region,
            includeTaxes: false,
          } as any),
          difference: getPercentageDiff(
            cheapestVariant.original_price,
            cheapestVariant.calculated_price
          ),
          price_type: cheapestVariant.calculated_price_type,
        }
      : undefined,
  };
};

export default transformProductPreview;
