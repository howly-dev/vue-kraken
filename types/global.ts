export type ProductPreviewType = {
  id: string;
  title: string;
  handle: string | null;
  thumbnail: string | null;
  price?: {
    calculated_price: string;
    original_price: string;
    difference: string;
    price_type: "default" | "sale";
  };
};
