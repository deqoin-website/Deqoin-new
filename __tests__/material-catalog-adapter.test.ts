jest.mock("@/lib/mongodb", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/models/Department", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    }),
  },
}));

import { loadMaterialCategoryView, loadMaterialProductView } from "@/lib/material-catalog";

describe("material catalog adapter", () => {
  it("returns ten products for a category when DB fallback is used", async () => {
    const result = await loadMaterialCategoryView("aydinlatma");

    expect(result.exists).toBe(true);
    expect(result.category.slug).toBe("aydinlatma");
    expect(result.products).toHaveLength(10);
  });

  it("returns product detail data with related products", async () => {
    const result = await loadMaterialProductView("aydinlatma", "hokasu-arc");

    expect(result.exists).toBe(true);
    expect(result.product?.slug).toBe("hokasu-arc");
    expect(result.product?.gallery).toHaveLength(3);
    expect(result.relatedProducts).toHaveLength(4);
  });
});
