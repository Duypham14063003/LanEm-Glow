# LanEm Glow — Đặc Tả Sản Phẩm

> **Phiên bản:** 1.0.0
> **Cập nhật lần cuối:** 2026-04-17
> **Công nghệ đề xuất:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Google Sheets API · Route Handlers

---

## 1. Khái Niệm & Tầm Nhìn

LanEm Glow là website bán mỹ phẩm/skincare theo mô hình **storefront thu lead** — giúp khách hàng xem sản phẩm, chọn nhanh, để lại số điện thoại, và để admin liên hệ xác nhận đơn thủ công. Hệ thống không hướng tới mô hình thương mại điện tử đầy đủ; thay vào đó, toàn bộ trải nghiệm được tối ưu cho **tốc độ, sự đơn giản và khả năng chuyển đổi cao trên mobile**.

Website cần mang cảm giác **mềm mại, nữ tính, tinh tế và cao cấp nhưng dễ gần** — phù hợp với một thương hiệu skincare nhẹ nhàng, đáng tin. Về mặt vận hành, hệ thống phải đủ gọn để startup có thể ra mắt nhanh, cập nhật sản phẩm qua Google Sheet, và bắt đầu bán hàng ngay mà không phải đầu tư sớm vào backend phức tạp.

---

## 2. Ngôn Ngữ Thiết Kế

### 2.1 Định Hướng Thẩm Mỹ

**Mềm mại, phát sáng và cao cấp** — lấy cảm hứng từ các landing page skincare hiện đại, bố cục editorial beauty, và bao bì pastel sang trọng. Nhiều khoảng trắng, bề mặt hồng dịu, điểm nhấn phát sáng nhẹ, typography thanh lịch. Giao diện cần tạo cảm giác bình tĩnh, chỉn chu và tối ưu chuyển đổi, thay vì trang trí quá đà hoặc quá “kẹo ngọt”.

### 2.2 Bảng Màu

```txt
Chính:           #EFA7B6  (Hồng phấn — CTA chính, điểm nhấn quan trọng)
Phụ:             #7A646D  (Mauve trầm — chữ phụ)
Nhấn:            #D86C87  (Hồng berry — trạng thái active, nhấn CTA)
Nhấn Nhạt:       #FBE4EA  (Hồng pastel — nền section, chip)
Nền Trang:       #FFF8F9  (Ivory hồng ấm — nền tổng thể)
Bề Mặt:          #FFFFFF  (Trắng — card, input, bottom sheet)
Viền:            #F1D7DE  (Hồng viền nhẹ — outline tinh tế)
Lỗi:             #D85C63  (Đỏ hồng)
Thành Công:      #2E9B6F  (Xanh dịu)
Cảnh Báo:        #D9994F  (Vàng ấm)
```

### 2.3 Kiểu Chữ

```txt
Font:
  Tiêu đề:       "Cormorant Garamond" (Google Fonts)
  Nội dung:      "Be Vietnam Pro" (Google Fonts)
  Dự phòng:      system-ui, -apple-system, sans-serif

Tỷ lệ cỡ chữ:
  --text-xs:     0.75rem  / 12px
  --text-sm:     0.875rem / 14px
  --text-base:   1rem     / 16px
  --text-lg:     1.125rem / 18px
  --text-xl:     1.25rem  / 20px
  --text-2xl:    1.5rem   / 24px
  --text-3xl:    1.875rem / 30px
  --text-4xl:    2.25rem  / 36px

Độ đậm:          400 (nội dung) · 500 (medium) · 600 (semibold) · 700 (bold)
Chiều cao dòng:  1.35 (tiêu đề) · 1.6 (nội dung)
Giãn chữ:        -0.02em (tiêu đề), bình thường (nội dung)
```

### 2.4 Hệ Thống Khoảng Cách

```txt
Đơn vị cơ sở:    4px
Thang khoảng cách: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80px
Bo góc:          14px (input) · 20px (card) · 24px (sheet/modal) · 9999px (button/chip)
```

### 2.5 Triết Lý Chuyển Động

- **Xuất hiện:** fade-in + translateY(6px) → translateY(0), 180ms ease-out
- **Stagger:** lệch 40ms giữa các card sản phẩm khi tải lần đầu
- **Hover:** chỉ chuyển màu và bóng đổ nhẹ, không scale mạnh
- **Chuyển trang:** fade 120ms
- **Vi mô:** nút bấm scale(0.98), chip bật/tắt 150ms
- **Không phô diễn:** bottom sheet quick order cần phản hồi nhanh, không kịch tính

### 2.6 Tài Nguyên Hình Ảnh

- **Icon:** Lucide React — nét 1.5px nhất quán, kích thước mặc định 20px
- **Hình ảnh:** ảnh sản phẩm từ thương hiệu hoặc placeholder skincare chất lượng cao
- **Trang trí:** nền blush gradient nhẹ, hiệu ứng glow mờ, grain rất nhẹ nếu thực sự cần
- **Trạng thái trống:** icon hoặc line illustration tối giản, không hoạt hình hóa

---

## 3. Bố Cục & Cấu Trúc

### 3.1 Khung Ứng Dụng

```txt
Website cho khách hàng

┌────────────────────────────────────────────────────────────┐
│  Thanh trên / Header                                      │
│  Logo              Tìm kiếm              Hotline / CTA    │
├────────────────────────────────────────────────────────────┤
│  Hero / Danh mục / Danh sách SP / Chi tiết SP             │
│                                                            │
│  Khu vực nội dung chính                                    │
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Footer                                                    │
└────────────────────────────────────────────────────────────┘

Thanh hành động dính trên mobile:
┌────────────────────────────────────────────────────────────┐
│  Đã chọn 2 sản phẩm               Để lại số               │
└────────────────────────────────────────────────────────────┘
```

```txt
Khu vực quản trị

┌────────────────────────────────────────────────────────────┐
│  Sidebar (220px)       │  Khu vực nội dung chính          │
│  ───────────────────   │  ──────────────────────────────   │
│  LanEm Glow Admin      │  Thanh trên                      │
│  Đơn hàng              │  Tiêu đề trang + bộ lọc          │
│  Sản phẩm              │  Bảng / Form nội dung            │
│  Cài đặt               │                                  │
└────────────────────────────────────────────────────────────┘
```

### 3.2 Sidebar

- Rộng 220px, cố định bên trái trên desktop admin
- Nền `#FFFFFF` với viền phải nhẹ
- Khu logo cao 64px, wordmark thương hiệu với nhấn hồng dịu
- Menu gồm icon + nhãn, trạng thái active có nền blush và chữ berry
- Trên mobile admin, sidebar thu gọn thành panel trượt

### 3.3 Thanh Trên

- Thanh trên phía khách hàng:
  - Trái: logo
  - Giữa: ô tìm kiếm hoặc tiêu đề trang tùy màn hình
  - Phải: hotline / liên hệ nhanh
- Thanh trên admin:
  - Trái: breadcrumb hoặc tiêu đề trang
  - Phải: tìm kiếm, làm mới, menu tài khoản admin
- Nền trắng hoặc trắng mờ với viền dưới nhẹ

### 3.4 Chiến Lược Responsive

```txt
Desktop (≥1280px):  Full layout, 3-4 cột sản phẩm, sidebar admin cố định
Tablet  (768-1279): 2 cột sản phẩm, header gọn hơn, sidebar admin có thể thu gọn
Mobile  (<768px):   Luồng 1 cột, sticky CTA dưới cùng, tương tác chủ yếu qua bottom sheet
```

### 3.5 Mẫu Bố Cục Trang

- **Landing/Homepage:** Hero → trust strip → sản phẩm nổi bật → nhóm vấn đề da → testimonial → CTA
- **Trang danh sách:** Tìm kiếm → chip ngang → danh sách sản phẩm → sticky quick order bar
- **Trang chi tiết:** Gallery ảnh → tiêu đề/giá/CTA → mô tả ngắn → cách dùng / loại da phù hợp
- **Khu vực form:** Bottom sheet trên mobile, modal/card căn giữa trên desktop
- **Trang admin:** Thanh lọc → bảng/list → drawer chi tiết hoặc màn hình chỉnh sửa

---

## 4. Tính Năng & Tương Tác

### 4.1 Trang Chủ

| Tính năng                 | Hành vi                                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Hero                      | Ảnh hero theo phong cách skincare, headline ngắn gọn cao cấp, mô tả hỗ trợ, CTA chính `Xem sản phẩm`, CTA phụ `Để lại số để được tư vấn`. |
| Trust strip               | 3-4 điểm tin cậy ngắn: hàng chính hãng, tư vấn theo nhu cầu da, không cần thanh toán trước, liên hệ nhanh.                                |
| Sản phẩm nổi bật          | Hiển thị 4-8 sản phẩm nổi bật từ Google Sheet với `is_featured = true`. Có thể chọn trực tiếp từ card.                                    |
| Điều hướng theo vấn đề da | Chip/card vào nhanh cho `da mụn`, `da khô`, `phục hồi`, `làm sáng`, `chống nắng`.                                                         |
| Bằng chứng xã hội         | Testimonial ngắn, trích đoạn review, hoặc chỉ số nhỏ như số khách đã được tư vấn.                                                         |
| Khối chuyển đổi           | Các block CTA lặp lại sau những đoạn nội dung có ý định cao.                                                                              |

### 4.2 Danh Sách Sản Phẩm

```txt
Thanh tìm kiếm
[ Da mụn ] [ Da khô ] [ Chống nắng ] [ Serum ] [ Lọc ]

┌────────────────────┐
│  Ảnh sản phẩm      │
│  Tên sản phẩm      │
│  Lợi ích ngắn      │
│  420.000đ          │
│  [Da nhạy cảm]     │
│  [Chọn sản phẩm]   │
└────────────────────┘
```

| Tính năng              | Hành vi                                                                   |
| ---------------------- | ------------------------------------------------------------------------- |
| Nguồn dữ liệu          | Dữ liệu được đọc từ sheet `products` với điều kiện `status = active`.     |
| Chọn từ card           | Người dùng có thể chọn trực tiếp từ card mà không cần vào trang chi tiết. |
| Trạng thái card        | Nút đổi từ `Chọn sản phẩm` sang `Đã chọn`.                                |
| Xử lý tồn kho          | Sản phẩm `out_of_stock` vẫn được nhìn thấy nhưng nút bị vô hiệu.          |
| Sticky quick order bar | Xuất hiện khi có ít nhất 1 sản phẩm được chọn.                            |

### 4.3 Tìm Kiếm & Bộ Lọc

| Hành động        | Hành vi                                                                             |
| ---------------- | ----------------------------------------------------------------------------------- |
| Tìm kiếm         | Tìm theo tên sản phẩm, category, vấn đề da, và từ khóa metadata.                    |
| Chip lọc         | Danh sách chip ngang cho các concern/category phổ biến.                             |
| Bộ lọc đầy đủ    | Mở bottom sheet với các tùy chọn category, concern, khoảng giá, trạng thái tồn kho. |
| Xóa bộ lọc       | Luôn hiển thị khi đang có filter được áp dụng.                                      |
| Không có kết quả | Hiển thị trạng thái trống thân thiện với nút reset và gợi ý thay thế.               |

### 4.4 Chi Tiết Sản Phẩm

| Tính năng          | Hành vi                                                                |
| ------------------ | ---------------------------------------------------------------------- |
| Gallery            | Ảnh chính và gallery ảnh bổ sung nếu có.                               |
| Khối tóm tắt       | Tên sản phẩm, giá, giá gốc nếu có, lợi ích ngắn, trạng thái tồn kho.   |
| Khối nội dung      | Mô tả ngắn, vấn đề da phù hợp, hướng dẫn sử dụng cơ bản, lưu ý nếu có. |
| CTA chính          | `Chọn sản phẩm` hoặc `Đã chọn`.                                        |
| CTA phụ            | `Để lại số để được tư vấn` mở quick order sheet ngay.                  |
| Sản phẩm liên quan | Khối nhẹ hiển thị 3-4 sản phẩm liên quan nếu cần.                      |

### 4.5 Quick Order

| Tính năng        | Hành vi                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| Điểm kích hoạt   | Mở từ sticky bar, các khối CTA hoặc trang chi tiết sản phẩm.                                     |
| Mô hình          | Không phải cart truyền thống. Đây là luồng xác nhận các sản phẩm đã chọn ở dạng nhẹ.             |
| Trường form      | `Số điện thoại` (bắt buộc), `Tên` (tùy chọn), `Ghi chú` (tùy chọn).                              |
| Tóm tắt lựa chọn | Hiển thị danh sách sản phẩm đã chọn, cho phép xóa trước khi gửi.                                 |
| Gửi yêu cầu      | Gửi đơn lên backend, kiểm tra lại tồn kho, ghi vào Google Sheet, hiển thị trạng thái thành công. |
| Thành công       | Hiển thị thông báo admin sẽ liên hệ xác nhận đơn sớm.                                            |

### 4.6 Module Đơn Hàng Trong Admin

| Hành động        | Hành vi                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Danh sách        | Bảng/list đơn vào mới, sắp xếp mới nhất trước.                                                       |
| Tìm kiếm         | Tìm theo số điện thoại hoặc mã đơn.                                                                  |
| Bộ lọc           | Lọc theo trạng thái, khoảng ngày, cờ trùng lặp.                                                      |
| Luồng trạng thái | `new → contacted → confirmed → closed`, ngoài ra có `cancelled`, `duplicate`, `invalid`.             |
| Chi tiết đơn     | Xem số điện thoại, tên khách, sản phẩm đã chọn, ghi chú khách, nguồn vào, chiến dịch, ghi chú admin. |
| Ghi chú admin    | Trường ghi chú nội bộ để phục vụ follow-up.                                                          |

### 4.7 Module Sản Phẩm Trong Admin

| Hành động            | Hành vi                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Mô hình dữ liệu      | Google Sheet vẫn là nguồn dữ liệu chính.                                                                              |
| Giao diện admin      | Màn hình tối giản để xem và kiểm tra sản phẩm, chưa nhất thiết là trình chỉnh sửa đầy đủ ở v1.                        |
| Chiến lược chỉnh sửa | Việc chỉnh sửa sản phẩm diễn ra trong Google Sheet; admin panel có thể cung cấp trạng thái đồng bộ và liên kết nhanh. |
| Hiển thị công khai   | Chỉ các sản phẩm `active` mới được đưa ra ngoài website.                                                              |

### 4.8 Module Cài Đặt Trong Admin

- **Chung:** số điện thoại thương hiệu, link Zalo, nội dung thông báo công khai, CTA có thể tùy chỉnh
- **Catalog:** làm mới cache, cấu hình nhóm concern nổi bật
- **Xử lý đơn:** email nhận thông báo, bật/tắt notification, ngưỡng phát hiện đơn trùng

### 4.9 Thông Báo

- Gửi email tới admin khi có order mới
- Có thể mở rộng sang Telegram hoặc Slack webhook trong tương lai
- Hiển thị badge/số lượng đơn mới trong admin panel

### 4.10 Chính Sách Công Khai & Niềm Tin

- Thông báo quyền riêng tư gần form
- Ghi rõ không cần thanh toán online
- Hiển thị thông tin liên hệ ở footer và gần các vùng CTA quan trọng

---

## 5. Danh Mục Thành Phần

### 5.1 Thành Phần UI Cơ Bản

| Thành phần    | Trạng thái                                | Ghi chú                                                         |
| ------------- | ----------------------------------------- | --------------------------------------------------------------- |
| `Button`      | default, hover, active, disabled, loading | Biến thể: primary, secondary, ghost, danger. Kiểu pill bo tròn. |
| `Input`       | default, focus, error, disabled           | Dùng cho tìm kiếm, số điện thoại, bộ lọc admin.                 |
| `Textarea`    | default, focus, error, disabled           | Dùng cho ghi chú tùy chọn.                                      |
| `Chip`        | inactive, active, disabled                | Dùng cho filter và shortcut vấn đề da.                          |
| `Badge`       | success, warning, error, info, neutral    | Dùng cho trạng thái tồn kho và trạng thái đơn.                  |
| `Card`        | default, selected, disabled               | Card sản phẩm, testimonial, khối tóm tắt.                       |
| `BottomSheet` | closed, open                              | Bề mặt tương tác chính trên mobile cho quick order và bộ lọc.   |
| `Modal`       | closed, open                              | Tương đương desktop cho một số tương tác chọn lọc.              |
| `Table`       | default, loading, empty                   | Bảng đơn hàng admin.                                            |
| `Skeleton`    | —                                         | Loading cho grid sản phẩm, chi tiết sản phẩm, danh sách admin.  |
| `Toast`       | success, error, warning, info             | Phản hồi hệ thống ngắn gọn.                                     |
| `EmptyState`  | —                                         | Trạng thái trống thân thiện có CTA phục hồi.                    |

### 5.2 Thành Phần Đặc Thù Thương Mại

| Thành phần        | Mô tả                                                   |
| ----------------- | ------------------------------------------------------- |
| `ProductCard`     | Ảnh + tên + lợi ích ngắn + giá + CTA chọn               |
| `QuickOrderBar`   | Thanh sticky mobile hiển thị số sản phẩm đã chọn và CTA |
| `QuickOrderSheet` | Tóm tắt lựa chọn + form số điện thoại                   |
| `ConcernScroller` | Hàng chip ngang trên mobile cho nhóm concern            |
| `TrustStrip`      | Dải thông điệp củng cố niềm tin                         |
| `TestimonialCard` | Card review với trích dẫn ngắn                          |

### 5.3 Thành Phần Bố Cục

| Thành phần           | Mô tả                                                        |
| -------------------- | ------------------------------------------------------------ |
| `SiteHeader`         | Logo, tìm kiếm, hành động liên hệ nhanh                      |
| `SiteFooter`         | Thông tin liên hệ, mạng xã hội, liên kết chính sách          |
| `PageSection`        | Wrapper chung cho section với max-width và spacing nhất quán |
| `StickyCTAContainer` | Bao quanh thanh hành động mobile ở cuối                      |
| `AdminSidebar`       | Điều hướng admin tối giản                                    |
| `AdminTopbar`        | Bộ lọc, tiêu đề, tiện ích thao tác                           |

---

## 6. Hướng Tiếp Cận Kỹ Thuật

### 6.1 Cấu Trúc Dự Án

```txt
src/
├── app/
│   ├── (site)/
│   │   ├── page.tsx                    ← Trang chủ
│   │   ├── products/
│   │   │   ├── page.tsx                ← Danh sách sản phẩm
│   │   │   └── [slug]/
│   │   │       └── page.tsx            ← Chi tiết sản phẩm
│   │   └── layout.tsx                  ← Layout website
│   ├── admin/
│   │   ├── layout.tsx                  ← Khung admin
│   │   ├── page.tsx                    ← Tổng quan đơn hàng
│   │   ├── orders/page.tsx             ← Danh sách đơn
│   │   ├── products/page.tsx           ← Tổng quan đồng bộ sản phẩm / chỉ đọc
│   │   └── settings/page.tsx           ← Cài đặt
│   ├── api/
│   │   ├── products/
│   │   │   └── route.ts                ← GET catalog
│   │   ├── products/[slug]/
│   │   │   └── route.ts                ← GET chi tiết
│   │   ├── orders/
│   │   │   └── route.ts                ← POST quick order / GET danh sách admin
│   │   └── settings/public/
│   │       └── route.ts                ← GET cài đặt công khai
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── chip.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── bottom-sheet.tsx
│   │   ├── modal.tsx
│   │   ├── table.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── empty-state.tsx
│   ├── site/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── product-card.tsx
│   │   ├── quick-order-bar.tsx
│   │   ├── quick-order-sheet.tsx
│   │   ├── trust-strip.tsx
│   │   └── concern-scroller.tsx
│   └── admin/
│       ├── sidebar.tsx
│       ├── topbar.tsx
│       └── orders-table.tsx
├── lib/
│   ├── sheets.ts                       ← client Google Sheets
│   ├── cache.ts                        ← helper cache catalog
│   ├── validation.ts                   ← schema Zod / chuẩn hóa số điện thoại
│   ├── notifications.ts                ← email / webhook thông báo
│   └── utils.ts                        ← helper định dạng
├── services/
│   ├── products.ts
│   ├── orders.ts
│   └── settings.ts
├── types/
│   └── index.ts
└── hooks/
    ├── use-selected-products.ts
    └── use-quick-order.ts
```

### 6.2 Lược Đồ Dữ Liệu

```txt
Cấu trúc Google Sheet

Sheet: products
  product_id             string   duy nhất
  slug                   string   duy nhất
  name                   string
  short_description      string
  description            string
  category               string
  skin_concern           string
  price                  number
  compare_at_price       number?
  image_url              string
  gallery_urls           string   phân tách bằng dấu |
  status                 active | inactive
  stock_status           in_stock | out_of_stock | preorder
  is_featured            true | false
  display_order          number
  search_keywords        string
  created_at             datetime
  updated_at             datetime

Sheet: orders
  order_id               string   duy nhất
  created_at             datetime
  phone                  string
  customer_name          string
  selected_product_ids   string   phân tách bằng dấu |
  selected_product_names string   snapshot, phân tách bằng dấu |
  item_count             number
  customer_note          string
  status                 new | contacted | confirmed | closed | cancelled | duplicate | invalid
  admin_note             string
  source_page            string
  source_campaign        string
  duplicate_flag         true | false
  client_fingerprint     string
  processed_at           datetime

Sheet: settings
  key                    string
  value                  string
```

### 6.3 Thiết Kế API

Mọi thao tác đọc và ghi đều đi qua API nội bộ hoặc service phía server. Frontend không được phép đọc Google Sheets trực tiếp từ trình duyệt.

**Các endpoint REST:**

```txt
GET    /api/products             — Lấy danh sách sản phẩm active có hỗ trợ filter/search
GET    /api/products/[slug]      — Lấy chi tiết sản phẩm
GET    /api/settings/public      — Lấy cài đặt công khai
POST   /api/orders               — Gửi quick order
GET    /api/orders               — Lấy danh sách đơn cho admin
PATCH  /api/orders/[id]          — Cập nhật trạng thái đơn / ghi chú admin
```

**Payload quick order:**

```json
{
  "phone": "0912345678",
  "customerName": "Nguyen A",
  "selectedProductIds": ["SERUM-01", "TONER-02"],
  "note": "Can tu van cho da nhay cam",
  "sourcePage": "listing",
  "sourceCampaign": "facebook-ads"
}
```

### 6.4 Validation

- Số điện thoại phải được chuẩn hóa về định dạng mobile Việt Nam trước khi lưu
- Bắt buộc có ít nhất 1 sản phẩm được chọn
- Product ID phải tồn tại và ở trạng thái `active`
- Sản phẩm `out_of_stock` không được phép submit
- Logic trùng lặp sẽ kiểm tra cùng số điện thoại + cùng sản phẩm trong một khoảng thời gian ngắn

**Regex số điện thoại:**

```txt
^(0)(3|5|7|8|9)[0-9]{8}$
```

### 6.5 Chiến Lược Đọc Dữ Liệu

- Backend đọc sheet `products` và `settings` từ Google Sheet
- Dữ liệu được chuẩn hóa thành các typed object
- Catalog được cache phía server từ 1-5 phút
- Frontend chỉ dùng JSON đã được chuẩn hóa

### 6.6 Chiến Lược Ghi Đơn

- Frontend gửi lên `POST /api/orders`
- Backend validate payload và trạng thái tồn kho hiện tại
- Backend sinh mã đơn
- Backend thêm một dòng mới vào sheet `orders`
- Backend gửi thông báo cho admin
- API trả về trạng thái thành công và mã tham chiếu

### 6.7 Thư Viện Chính

```txt
Phụ thuộc:
  next                ^15
  react               ^19
  typescript          ^5
  tailwindcss         ^4
  lucide-react        ^0.468
  clsx                ^2
  tailwind-merge      ^2
  zod                 ^3
  react-hook-form     ^7
  googleapis          ^144
  date-fns            ^4
  nodemailer          ^6

Tùy chọn:
  resend              ^4         ← Nếu dùng dịch vụ email giao dịch
  @tanstack/react-query          ← Nếu luồng đồng bộ dữ liệu phía client tăng lên
```

### 6.8 Biến Môi Trường

```env
# Google Sheets
GOOGLE_SERVICE_ACCOUNT_EMAIL=""
GOOGLE_PRIVATE_KEY=""
GOOGLE_SHEET_ID=""

# Ứng dụng công khai
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Thông báo
ADMIN_NOTIFY_EMAIL=""
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""

# Hành vi hệ thống
CATALOG_CACHE_TTL_SECONDS="300"
DUPLICATE_ORDER_WINDOW_MINUTES="10"
```

---

## 7. Các Mốc Triển Khai

| #   | Mốc                      | Bàn giao                                                                           |
| --- | ------------------------ | ---------------------------------------------------------------------------------- |
| 1   | **Khởi tạo & Theme**     | Setup Next.js, global styles, typography, color system, UI primitives dùng chung   |
| 2   | **Lớp đọc catalog**      | Tích hợp Google Sheets, chuẩn hóa dữ liệu sản phẩm, lớp cache, public product APIs |
| 3   | **Trang cho khách hàng** | Homepage, danh sách sản phẩm, search/filter, chi tiết sản phẩm                     |
| 4   | **Luồng Quick Order**    | State sản phẩm đã chọn, sticky CTA trên mobile, quick order sheet, validation form |
| 5   | **Lớp ghi đơn**          | API lưu order, logic phát hiện trùng, kiểm tra lại tồn kho, trạng thái thành công  |
| 6   | **Admin Panel MVP**      | Khung admin, bảng đơn hàng, chi tiết đơn, cập nhật trạng thái, ghi chú admin       |
| 7   | **Thông báo & Ổn định**  | Gửi email, xử lý lỗi, loading states, empty states, rate limiting                  |
| 8   | **Hoàn thiện & Ra mắt**  | Tinh chỉnh mobile, SEO cơ bản, hook analytics, QA cuối                             |

---

## 8. Các Hạng Mục Ngoài Phạm Vi (v1)

- Tích hợp cổng thanh toán online
- Đăng nhập / tài khoản khách hàng
- Giỏ hàng đầy đủ và checkout nhiều bước
- Quản lý tồn kho theo số lượng chi tiết trên từng SKU
- Engine khuyến mãi / coupon phức tạp
- CRM quản lý vòng đời khách hàng ở mức đầy đủ
- AI gợi ý skincare nâng cao
- Mô hình nhiều cửa hàng / nhiều cấp admin phức tạp
