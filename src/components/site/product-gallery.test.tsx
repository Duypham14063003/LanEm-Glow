import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ProductGallery } from "@/components/site/product-gallery";

test("ProductGallery places TikTok media before product images when present", () => {
  const markup = renderToStaticMarkup(
    <ProductGallery
      name="Serum Phuc Hoi"
      imageUrl="https://example.com/main.jpg"
      galleryUrls={["https://example.com/1.jpg", "https://example.com/2.jpg"]}
      tiktokUrl="https://www.tiktok.com/@lanemglow/video/7481234567890123456"
    />
  );

  assert.match(markup, /Video review TikTok/);
  assert.match(markup, /Chạm để xem video TikTok/);
  assert.match(markup, /Video<\/span>/);

  const videoIndex = markup.indexOf("Chạm để xem video TikTok");
  const imageIndex = markup.indexOf('src="https://example.com/main.jpg"');

  assert.notEqual(videoIndex, -1);
  assert.notEqual(imageIndex, -1);
  assert.ok(videoIndex < imageIndex);
});
