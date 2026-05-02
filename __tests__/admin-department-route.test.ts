/**
 * @jest-environment node
 */

jest.mock("@/lib/mongodb", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/models/Department", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

import { GET, PUT } from "@/app/api/admin/departments/[slug]/route";

const departmentMock = jest.requireMock("@/models/Department").default as {
  findOne: jest.Mock;
  findOneAndUpdate: jest.Mock;
};

describe("admin department route", () => {
  beforeEach(() => {
    departmentMock.findOne.mockReset();
    departmentMock.findOneAndUpdate.mockReset();
  });

  it("returns the department record for GET", async () => {
    departmentMock.findOne.mockResolvedValue({
      slug: "aydinlatma",
      title: "Aydınlatma",
      products: [{ slug: "hokasu-arc" }],
    });

    const response = await GET(new Request("http://localhost/api/admin/departments/aydinlatma"), {
      params: Promise.resolve({ slug: "aydinlatma" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(departmentMock.findOne).toHaveBeenCalledWith({ slug: "aydinlatma" });
    expect(body.slug).toBe("aydinlatma");
    expect(body.products).toHaveLength(1);
  });

  it("updates the department record for PUT", async () => {
    const payload = {
      slug: "aydinlatma",
      title: "Aydınlatma",
      products: [{ slug: "hokasu-arc", title: "Hokasu Arc" }],
    };

    departmentMock.findOneAndUpdate.mockResolvedValue({
      ...payload,
      description: "Güncellenmiş açıklama",
    });

    const response = await PUT(
      new Request("http://localhost/api/admin/departments/aydinlatma", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
      {
        params: Promise.resolve({ slug: "aydinlatma" }),
      },
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(departmentMock.findOneAndUpdate).toHaveBeenCalledWith(
      { slug: "aydinlatma" },
      payload,
      expect.objectContaining({ upsert: true, returnDocument: "after" }),
    );
    expect(body.description).toBe("Güncellenmiş açıklama");
  });

  it("hydrates material departments with catalog products when DB is empty", async () => {
    departmentMock.findOne.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/admin/departments/aydinlatma"), {
      params: Promise.resolve({ slug: "aydinlatma" }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products).toHaveLength(10);
    expect(body.products[0]).toHaveProperty("title");
    expect(body.products[0]).toHaveProperty("heroImage");
  });
});
