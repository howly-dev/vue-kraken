import {
  ProductVariant as ProductVariantEntity,
  Region,
  StoreCartsRes,
} from "@medusajs/medusa";
import { ProductVariantInfo, RegionInfo } from "../types";
/// /////////////////////////////////////////////////

/// /////////// medusa-react/types.ts /////////////

/// /////////// medusa-react/utils /////////////
// TODO replace with loadash
export const isObject = (input: any) => input instanceof Object;
export const isArray = (input: any) => Array.isArray(input);
export const isEmpty = (input: any) => {
  return (
    input === null ||
    input === undefined ||
    (isObject(input) && Object.keys(input).length === 0) ||
    (isArray(input) && (input as any[]).length === 0) ||
    (typeof input === "string" && input.trim().length === 0)
  );
};

// Choose only a subset of the type Region to allow for some flexibility
export type RegionInfo = Pick<
  Region,
  "currency_code" | "tax_code" | "tax_rate"
>;

type ConvertDateToString<T extends {}> = {
  [P in keyof T]: T[P] extends Date ? Date | string : T[P];
};
export type ProductVariant = ConvertDateToString<
  Omit<ProductVariantEntity, "beforeInsert">
>;
export type ProductVariantInfo = Pick<ProductVariant, "prices">;

export type Cart = StoreCartsRes["cart"];
/// ///////////////////////////////////////

/// /////////// medusa-react/types.ts /////////////

type FormatVariantPriceParams = {
  variant: ProductVariantInfo;
  region: RegionInfo;
  includeTaxes?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
};

type ConvertToLocaleParams = {
  amount: number;
  currency_code: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
};

/**
 * Takes a product variant and a region, and converts the variant's price to a localized decimal format
 */
export const formatVariantPrice = ({
  variant,
  region,
  includeTaxes = true,
  ...rest
}: FormatVariantPriceParams) => {
  const amount = computeVariantPrice({ variant, region, includeTaxes });

  return convertToLocale(<ConvertToLocaleParams>{
    amount,
    currency_code: region?.currency_code,
    ...rest,
  });
};

type ComputeVariantPriceParams = {
  variant: ProductVariantInfo;
  region: RegionInfo;
  includeTaxes?: boolean;
};

/**
 * Takes a product variant and region, and returns the variant price as a decimal number
 * @param params.variant - product variant
 * @param params.region - region
 * @param params.includeTaxes - whether to include taxes or not
 */
export const computeVariantPrice = ({
  variant,
  region,
  includeTaxes = true,
}: ComputeVariantPriceParams) => {
  const amount = getVariantPrice(variant, region);

  return computeAmount({
    amount,
    region,
    includeTaxes,
  });
};

/**
 * Finds the price amount correspoding to the region selected
 * @param variant - the product variant
 * @param region - the region
 * @returns - the price's amount
 */
export const getVariantPrice = (
  variant: ProductVariantInfo,
  region: RegionInfo
) => {
  const price = variant?.prices?.find(
    (p) =>
      p.currency_code.toLowerCase() === region?.currency_code?.toLowerCase()
  );

  return price?.amount || 0;
};

type ComputeAmountParams = {
  amount: number;
  region: RegionInfo;
  includeTaxes?: boolean;
};

/**
 * Takes an amount, a region, and returns the amount as a decimal including or excluding taxes
 */
export const computeAmount = ({
  amount,
  region,
  includeTaxes = true,
}: ComputeAmountParams) => {
  const toDecimal = convertToDecimal(amount, region);

  const taxRate = includeTaxes ? getTaxRate(region) : 0;

  const amountWithTaxes = toDecimal * (1 + taxRate);

  return amountWithTaxes;
};

type FormatAmountParams = {
  amount: number | null;
  region: RegionInfo;
  includeTaxes?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
};

/**
 * Takes an amount and a region, and converts the amount to a localized decimal format
 */
export const formatAmount = ({
  amount,
  region,
  includeTaxes = true,
  ...rest
}: FormatAmountParams) => {
  // TODO fix typescript issue 'as any'
  const taxAwareAmount = computeAmount({
    amount,
    region,
    includeTaxes,
  } as any);
  return convertToLocale({
    amount: taxAwareAmount,
    currency_code: region.currency_code,
    ...rest,
  });
};

// we should probably add a more extensive list
const noDivisionCurrencies = ["krw", "jpy", "vnd"];

const convertToDecimal = (amount: number, region: RegionInfo) => {
  const divisor = noDivisionCurrencies.includes(
    <string>region?.currency_code?.toLowerCase()
  )
    ? 1
    : 100;

  return Math.floor(amount) / divisor;
};

const getTaxRate = (region?: RegionInfo) => {
  return region && !isEmpty(region) ? region?.tax_rate / 100 : 0;
};

// TODO fix typescript issue with Intl.NumberFormat
const convertToLocale = ({
  amount,
  // eslint-disable-next-line camelcase
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  // eslint-disable-next-line camelcase
  return currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(
        locale as string,
        {
          style: "currency",
          // eslint-disable-next-line camelcase
          currency: currency_code,
          minimumFractionDigits,
          maximumFractionDigits,
        } as any
      ).format(amount)
    : amount.toString();
};
/// ///////////////////////////////////////
