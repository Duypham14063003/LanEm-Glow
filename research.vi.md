# Nghiên Cứu Best Practices - LanEm Glow

## Kết Luận Nhanh

Với LanEm Glow, best practice không phải là làm một website bán hàng "đầy đủ", mà là làm một **mobile-first beauty landing commerce flow**: xem nhanh sản phẩm, chọn nhanh, để lại số điện thoại thật ít ma sát, admin xử lý gọn. Từ các nguồn UX và tài liệu chính thức, mô hình phù hợp nhất là:

- **Landing page định hướng chuyển đổi**, không phải homepage nhiều nhánh.
- **Không ép cart/checkout truyền thống**; thay vào đó là "chọn sản phẩm + gửi số điện thoại".
- **Tập trung vào 1 CTA chính**, lặp lại nhiều điểm.
- **Google Sheet chỉ nên là nguồn dữ liệu MVP**, không nên xem là backend lâu dài.

---

## 1. Landing Page Cho Mỹ Phẩm/Skincare Có Chuyển Đổi Tốt

- Hero đầu trang nên trả lời ngay 3 câu: "sản phẩm dành cho ai", "giải quyết vấn đề gì", "làm gì tiếp theo". CTA phải nhìn thấy ngay ở phần đầu màn hình, vì trang đích hiệu quả cần giữ hành động chính "above the fold" và giảm điều hướng phụ. Nguồn: Unbounce, Google Search Central.
- Với skincare, yếu tố chuyển đổi không chỉ là đẹp mà là **niềm tin**. Phần đầu trang nên có: hình sản phẩm rõ, claim ngắn gọn, giá hoặc khoảng giá minh bạch, lợi ích chính, và bằng chứng tin cậy như feedback, số khách đã mua, hoặc cam kết hàng chính hãng. Đây là suy luận theo best practices landing page + đặc thù ngành beauty.
- Nội dung nên đi theo thứ tự: `vấn đề da` -> `giải pháp/sản phẩm` -> `lý do tin tưởng` -> `CTA để lại số điện thoại`. Đừng để người dùng phải đọc dài mới hiểu phải làm gì.
- Nên hạn chế menu đầy đủ như website corporate. Landing page chuyển đổi tốt thường bỏ bớt điều hướng phụ để tránh phân tán. Nguồn: Unbounce.
- Ảnh cần "thật" và mang ngữ cảnh sử dụng, thay vì chỉ là ảnh packshot đẹp. Điều này giúp người dùng hình dung sản phẩm trong đời thực và tăng tín nhiệm. Nguồn: Unbounce.
- Với mỹ phẩm, một pattern hiệu quả là chia theo **skin concern** hơn là chỉ theo brand/category: da mụn, da khô, làm sáng, phục hồi, chống nắng. Đây là suy luận từ hành vi mua skincare và best practices filtering.

---

## 2. No-Cart / Quick-Order Flow Theo Mô Hình Thu Lead

- Flow hợp lý nhất cho LanEm Glow là: `Xem sản phẩm` -> `Chọn` -> `Mở panel/tờ form ngắn` -> `Nhập số điện thoại` -> `Gửi yêu cầu` -> `Thông báo sẽ được liên hệ`.
- Không cần cart truyền thống với quá nhiều bước. Baymard cho thấy vấn đề lớn không nằm ở "1 bước hay nhiều bước", mà ở **số field và độ nặng nhận thức** của flow. Vì LanEm Glow không có thanh toán online, quick-order phải còn nhẹ hơn checkout thông thường. Nguồn: Baymard.
- Tốt nhất là dùng "selected products" hoặc "giỏ quan tâm" nhẹ, chứ không mô phỏng checkout như Shopee. Người dùng chỉ cần biết họ đã chọn gì và còn một bước cuối là để lại số điện thoại.
- CTA nên đổi trạng thái rõ sau khi chọn, ví dụ từ `Chọn sản phẩm` sang `Đã chọn` + bộ đếm số sản phẩm đã chọn. Đây là pattern rất mạnh vì giúp người dùng không bị mất dấu trạng thái chọn. Baymard quan sát pattern tương tự ở nút Add to Cart chuyển thành quantity selector giúp thao tác nhanh và dễ nhận biết trạng thái. Nguồn: Baymard.
- Nếu phải xin thêm dữ liệu ngoài số điện thoại, hãy dùng **multi-step micro flow**: bước 1 chỉ lấy số điện thoại, bước 2 mới là ghi chú tùy chọn. Unbounce và Baymard đều cho thấy giảm field nhìn thấy ngay từ đầu sẽ giảm cảm giác nặng form.
- Tên CTA nên rõ ý nghĩa thực: `Để lại số để được tư vấn`, `Gửi yêu cầu đặt hàng`, `Chốt đơn qua điện thoại`. Không nên dùng `Thanh toán` vì hệ thống không thanh toán online.

---

## 3. Mobile UX Cho Người Dùng Việt Nam

- Việt Nam có mức độ dùng di động và social rất cao. Theo DataReportal, cuối năm 2025 Việt Nam có **137 triệu kết nối di động**, **85.6 triệu người dùng internet**, và **79.0 triệu định danh người dùng mạng xã hội**. Điều này ủng hộ quyết định mobile-first và social-entry-first. Nguồn: DataReportal.
- Suy luận quan trọng: nhiều người dùng sẽ đi vào trang từ Facebook, TikTok, Instagram, hoặc link chat, nên landing page phải **vào thẳng vấn đề**, không yêu cầu tìm hiểu cấu trúc site trước.
- UX mobile nên ưu tiên:
  - thanh search cố định hoặc rất dễ thấy,
  - nút CTA lớn, dễ bấm bằng ngón tay,
  - sticky CTA ở cuối màn hình,
  - ảnh tối ưu nhẹ,
  - không popup che toàn màn hình quá sớm.
- Google khuyến nghị responsive design và nhấn mạnh page experience: Core Web Vitals tốt, hiển thị tốt trên mobile, tránh quá nhiều yếu tố gây nhiễu và tránh intrusive interstitials. Nguồn: Google Search Central.
- Với thị trường Việt Nam, điện thoại thường là kênh follow-up chính. Vì vậy nên có thêm các đường thoát nhanh như `Gọi ngay`, `Chat Zalo`, `Để lại số`, nhưng vẫn giữ **1 CTA chính** để không loãng mục tiêu.
- Microcopy nên ngắn, thân thiện, ít thuật ngữ kỹ thuật. Người dùng mobile không đọc block dài; họ quét rất nhanh.

---

## 4. Google Sheet Làm Database: Ưu, Nhược Và Giới Hạn Scale

- Ưu điểm:
  - rất nhanh để ra MVP,
  - admin không kỹ thuật vẫn cập nhật được,
  - chi phí gần như bằng 0,
  - dễ dùng cho catalog nhỏ và order volume thấp.
- Nhược điểm:
  - dễ hỏng dữ liệu nếu sửa tay sai cấu trúc,
  - kiểm soát validation yếu,
  - khó quản lý quan hệ dữ liệu,
  - khó audit và phân quyền tinh,
  - hiệu năng giảm khi sheet nhiều công thức/phụ thuộc.
- Google Sheets API có quota theo phút, ví dụ đọc/ghi giới hạn theo project và theo user; nếu vượt có thể gặp lỗi `429`. Google cũng khuyến nghị payload khoảng 2 MB và dùng exponential backoff. Nguồn: Google Sheets API Limits.
- Nếu dùng Apps Script để đồng bộ/ghi đơn, quota lại tính theo user và reset theo 24 giờ; quota có thể thay đổi và nếu vượt script sẽ dừng. Nguồn: Apps Script Quotas.
- Google xác nhận mỗi lần sửa ô có thể kích hoạt tính toán lại ô đó và các ô phụ thuộc. Điều này có nghĩa sheet nhiều công thức hoặc automation chồng nhau sẽ chậm dần theo thời gian. Nguồn: Google Docs Editors Help.
- Kết luận thực tiễn:
  - Dùng Google Sheet tốt cho `catalog + lead log` ở giai đoạn đầu.
  - Không nên dùng lâu dài khi bắt đầu có:
    - nhiều admin cùng sửa,
    - nhiều đơn mỗi ngày,
    - nhiều trạng thái xử lý,
    - nhu cầu tìm kiếm/lọc/report phức tạp.
- Best practice cho MVP:
  - 1 sheet cho `products`,
  - 1 sheet cho `orders/leads`,
  - 1 sheet cho `settings/lookups`,
  - không để frontend đọc sheet live ở mọi request; nên cache hoặc sync định kỳ.

---

## 5. UX Cho Product Listing Và Filtering

- Baymard cho thấy product listing/filtering ảnh hưởng trực tiếp đến việc người dùng có tìm được sản phẩm hay không. Với mobile, phần lớn site vẫn làm chưa tốt. Nguồn: Baymard.
- Những filter quan trọng nên có nếu phù hợp:
  - giá,
  - brand,
  - đánh giá,
  - màu/texture nếu có,
  - size/dung tích nếu có.
  Với skincare, cần bổ sung một lớp filter theo ngữ cảnh ngành: `vấn đề da`, `loại da`, `công dụng`, `kết cấu`, `dùng sáng/tối`.
- Applied filters phải hiện rõ ở đầu danh sách và có thể bỏ nhanh từng filter hoặc `Xóa tất cả`. Baymard chỉ ra nếu không có overview này, người dùng dễ mất ngữ cảnh và khó gỡ filter.
- Sorting tối thiểu nên có:
  - giá tăng/giảm,
  - bán chạy,
  - mới nhất,
  - nổi bật/được quan tâm.
  Baymard ghi nhận price, rating, best-selling, newest là các kiểu sort cốt lõi.
- Trên mobile, pattern tốt là:
  - search bar cố định gần đầu,
  - hàng chip filter ngang,
  - nút `Lọc` mở bottom sheet,
  - applied filters nằm ngay trên grid/list.
- Với skincare, mỗi card sản phẩm nên cực ngắn: ảnh, tên, công dụng 1 dòng, giá, tag vấn đề da, CTA chọn. Đừng nhồi quá nhiều text.

---

## 6. Form UX Để Thu Số Điện Thoại Với Chuyển Đổi Cao

- Form nên là **single-column**, vì cả Baymard lẫn Atlassian đều chỉ ra multi-column dễ gây hiểu nhầm.
- Đặt label ở phía trên field, không dùng inline label biến mất khi gõ. Baymard coi đây là lỗi mobile form rất phổ biến.
- Giảm tối đa số field nhìn thấy ngay từ đầu. Baymard ghi nhận người dùng dễ nản khi form hiển thị 10-15 field và 18% đã từng bỏ giỏ vì checkout quá dài hoặc phức tạp.
- Với LanEm Glow, form chuyển đổi cao nhất nhiều khả năng chỉ cần:
  - `Số điện thoại` bắt buộc
  - `Tên` tùy chọn
  - `Ghi chú` tùy chọn
- Thêm mô tả ngắn để giảm lo lắng, ví dụ: `LanEm Glow sẽ liên hệ xác nhận đơn trong 5-10 phút làm việc`. Baymard khuyến nghị giải thích vì sao đang xin thông tin cá nhân.
- Nên dùng:
  - bàn phím số trên mobile,
  - format số điện thoại linh hoạt,
  - báo lỗi ngay dưới field,
  - thông báo thành công rất rõ sau submit.
- Intro text phải ngắn. Atlassian khuyến nghị chỉ đưa đúng lượng hướng dẫn cần thiết, thay vì đoạn mô tả dài.
- Nếu traffic lạnh từ ads/social, có thể test 2 phiên bản:
  - Form inline ngay ở hero
  - Form mở bằng bottom sheet/modal sau khi bấm CTA
  Với ngành skincare, bản thứ hai thường an toàn hơn vì người dùng cần chút ngữ cảnh trước khi để lại số.

---

## 7. Admin Panel Tối Giản Nên Thiết Kế Thế Nào

- Admin panel cho MVP không cần dashboard "đẹp"; cần **quản lý nhanh**.
- Menu tối thiểu:
  - `Sản phẩm`
  - `Đơn / Lead`
  - `Bộ lọc`
  - `Trạng thái`
- Màn `Đơn / Lead` nên là trung tâm:
  - danh sách đơn mới nhất,
  - lọc theo trạng thái,
  - tìm theo số điện thoại,
  - xem nhanh sản phẩm đã chọn,
  - nút đổi trạng thái nhanh.
- Material Design gợi ý data table nên căn trái text và căn phải số để dễ quét. Điều này rất hữu ích cho admin list.
- Với mobile admin không phải ưu tiên, nhưng nếu có thì nên dùng list card thay cho table đầy đủ.
- Đừng nhồi biểu đồ ở giai đoạn đầu. Admin tối giản nên ưu tiên "làm việc" hơn "phân tích".
- Trạng thái đơn nên rất ít:
  - `Mới`
  - `Đã liên hệ`
  - `Đã chốt`
  - `Hủy`
- Nếu admin vẫn quản lý sản phẩm bằng Google Sheet, panel riêng chỉ cần xử lý `leads/orders`. Đó là cách tối giản và thực tế nhất cho MVP.

---

## UX Patterns Nên Học Từ Shopee / Instagram Shop / Landing Pages

Phần này là **suy luận thiết kế**, dựa trên pattern phổ biến của marketplace/social commerce và các best practices ở trên.

- Từ **Shopee**:
  - search luôn nổi bật ở đầu,
  - filter/sort cực dễ chạm,
  - trạng thái chọn sản phẩm hiển thị ngay,
  - badge giá/khuyến mãi/điểm nổi bật quét rất nhanh,
  - sticky action bar ở cuối màn hình.
- Từ **Instagram Shop / social commerce**:
  - ảnh sản phẩm là điểm vào chính,
  - nội dung phải "tapable" nhanh,
  - ít text nhưng đúng ý,
  - chuyển từ cảm hứng sang hành động trong rất ít bước.
- Từ **landing pages chuyển đổi**:
  - một mục tiêu duy nhất trên trang,
  - CTA lặp lại theo nhịp cuộn,
  - social proof đặt gần CTA,
  - bỏ bớt menu và các lối thoát không cần thiết.

---

## Cách Giảm Friction Khi Đặt Hàng

- Cho phép chọn sản phẩm ngay từ listing, không bắt buộc vào trang chi tiết.
- Giữ sticky CTA kiểu `Đã chọn 2 sản phẩm • Để lại số`.
- Không bắt login.
- Không bắt nhập địa chỉ ở bước đầu.
- Chỉ yêu cầu số điện thoại ở bước submit.
- Tự lưu danh sách đã chọn trong local storage để người dùng quay lại không mất.
- Hiển thị rõ "không cần thanh toán online".
- Sau khi submit, nói rõ điều gì xảy ra tiếp theo và trong bao lâu.
- Nếu có thể, thêm lựa chọn `Gọi cho tôi` hoặc `Chat Zalo` như kênh phụ, nhưng không thay CTA chính.
- Dùng microcopy giảm lo lắng: `Tư vấn miễn phí`, `Không cần thanh toán trước`, `Xác nhận đơn qua điện thoại`.

---

## Nguồn Chính Đã Dùng

- Google Search Central: https://developers.google.com/search/docs/appearance/page-experience
- Google mobile-first indexing: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
- Google Sheets API limits: https://developers.google.com/workspace/sheets/api/limits
- Apps Script quotas: https://developers.google.com/apps-script/guides/services/quotas
- Google Sheets performance: https://support.google.com/docs/answer/11468464
- DataReportal Vietnam 2026: https://datareportal.com/reports/digital-2026-vietnam
- Baymard form design: https://baymard.com/learn/form-design
- Baymard product list & filtering: https://baymard.com/blog/current-state-product-list-and-filtering
- Baymard one-page checkout: https://baymard.com/blog/one-page-checkout
- Baymard add-to-cart state pattern: https://baymard.com/blog/grocery-add-to-cart-buttons
- Material Design data tables: https://m1.material.io/components/data-tables.html
- Atlassian form design: https://www.atlassian.com/software/jira/service-management/product-guide/tips-and-tricks/form-design-best-practices
- Unbounce landing page best practices: https://unbounce.com/landing-page-articles/landing-page-best-practices/
