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
    find: jest.fn(),
    create: jest.fn(),
  },
}));

import { GET, POST } from "@/app/api/admin/departments/route";

const departmentMock = jest.requireMock("@/models/Department").default as {
  find: jest.Mock;
  create: jest.Mock;
};

describe("admin departments route", () => {
  beforeEach(() => {
    departmentMock.find.mockReset();
    departmentMock.create.mockReset();
  });

  it("lists departments with GET", async () => {
    departmentMock.find.mockResolvedValue([{ slug: "aydinlatma" }, { slug: "mobilya" }]);

    const response = await GET(new Request("http://localhost/api/admin/departments"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(departmentMock.find).toHaveBeenCalledWith({});
  });

  it("creates a department with POST", async () => {
    departmentMock.create.mockResolvedValue({
      slug: "aydinlatma",
      title: "Aydınlatma",
    });

    const response = await POST(
      new Request("http://localhost/api/admin/departments", {
        method: "POST",
        body: JSON.stringify({ slug: "aydinlatma", title: "Aydınlatma" }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(departmentMock.create).toHaveBeenCalledWith({ slug: "aydinlatma", title: "Aydınlatma" });
    expect(body.slug).toBe("aydinlatma");
  });
});
