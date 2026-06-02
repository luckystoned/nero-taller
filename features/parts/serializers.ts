type DecimalLike = {
  toNumber?: () => number;
  toString: () => string;
};

type PartShape = {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
  brand: string | null;
  unitCost: DecimalLike;
  salePrice: DecimalLike | null;
  stock: number | null;
  supplierId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SerializedPart = Omit<PartShape, "unitCost" | "salePrice"> & {
  unitCost: number;
  salePrice: number | null;
};

function decimalToNumber(value: DecimalLike) {
  return value.toNumber?.() ?? Number(value.toString());
}

function nullableDecimalToNumber(value: DecimalLike | null) {
  return value ? decimalToNumber(value) : null;
}

export function serializePart<TPart extends PartShape>(
  part: TPart,
): Omit<TPart, "unitCost" | "salePrice"> & SerializedPart {
  return {
    ...part,
    unitCost: decimalToNumber(part.unitCost),
    salePrice: nullableDecimalToNumber(part.salePrice),
  };
}
