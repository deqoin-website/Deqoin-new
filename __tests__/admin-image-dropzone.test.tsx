import { fireEvent, render, screen } from "@testing-library/react";

import { AdminImageDropzone } from "@/components/admin/AdminImageDropzone";

describe("AdminImageDropzone", () => {
  it("calls onFileSelect when a file is dropped or selected", async () => {
    const onFileSelect = jest.fn().mockResolvedValue(undefined);
    const file = new File(["hello"], "hero.png", { type: "image/png" });

    const { container } = render(
      <AdminImageDropzone title="Hero" emptyTitle="Hero" onFileSelect={onFileSelect} />,
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeTruthy();

    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalledWith(file);

    onFileSelect.mockClear();

    const button = screen.getByRole("button", { name: /hero/i });
    fireEvent.dragEnter(button, {
      dataTransfer: { files: [file] },
    });
    fireEvent.drop(button, {
      dataTransfer: { files: [file] },
    });

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });
});
