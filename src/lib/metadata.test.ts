import assert from "node:assert/strict";
import test from "node:test";

import { buildMetadata, buildProductMetadata } from "@/lib/metadata";

test("buildMetadata returns canonical and social metadata fields", () => {
  const metadata = buildMetadata({
    title: "LanEm Glow",
    description: "Skincare",
    path: "/products",
  });

  assert.equal(metadata.title, "LanEm Glow");
  assert.equal(metadata.description, "Skincare");
  assert.equal(metadata.alternates?.canonical, "/products");
});

test("buildProductMetadata maps product data into product page metadata", () => {
  const metadata = buildProductMetadata({
    name: "Serum Phuc Hoi",
    description: "Mo ta ngan",
    slug: "serum-phuc-hoi",
    imageUrl: "https://example.com/serum.jpg",
  });

  assert.equal(metadata.title, "Serum Phuc Hoi | LanEm Glow");
  assert.equal(metadata.description, "Mo ta ngan");
});
