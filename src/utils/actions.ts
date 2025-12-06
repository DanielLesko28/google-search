import type { SearchResultItem } from "./types";

export function downloadCSV(data: SearchResultItem[]) {
  const headers = ["Title", "Link"];

  const rows = data.map((item) => [
    item.title.replace(/"/g, '""'),
    item.link.replace(/"/g, '""'),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "Search.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadXLSX(data: SearchResultItem[]) {
  const XLSX = await import("xlsx");

  const sheetData = data.map((item) => ({
    Title: item.title,
    Link: item.link,
  }));

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

  XLSX.writeFile(workbook, "Search.xlsx");
}
