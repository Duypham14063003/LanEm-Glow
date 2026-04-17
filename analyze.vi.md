# Phân Tích Yêu Cầu Kinh Doanh - LanEm Glow

## Định Nghĩa Vấn Đề

LanEm Glow không phải chủ yếu là một hệ thống thương mại điện tử đầy đủ. Đây là một **website trưng bày sản phẩm kết hợp thu lead** cho ngành skincare/cosmetics.

Vấn đề kinh doanh thực sự mà hệ thống này giải quyết là:

1. Biến sự quan tâm sản phẩm thành **lead có số điện thoại** nhanh nhất có thể.
2. Trình bày đủ thông tin để tạo niềm tin, nhưng không tạo ra ma sát như quy trình thanh toán online.
3. Cho admin một cách quản lý sản phẩm và đơn/yêu cầu đơn giản, không cần backend phức tạp.
4. Sử dụng Google Sheet làm nguồn dữ liệu để doanh nghiệp có thể tự cập nhật sản phẩm mà không cần phụ thuộc kỹ thuật.

Điều này có nghĩa KPI chính của website rất có thể là **số điện thoại được gửi thành công**, không phải số đơn thanh toán, không phải thời gian online, và cũng không phải số tài khoản đăng ký.

---

## Các Vấn Đề Cốt Lõi Hệ Thống Đang Giải Quyết

### 1. Hiển thị catalog sản phẩm

Doanh nghiệp cần một cách đơn giản để đưa sản phẩm lên online từ Google Sheet, khả năng cao là để:

- người không kỹ thuật cũng có thể quản lý
- chi phí vận hành thấp
- ra mắt nhanh

### 2. Hỗ trợ người dùng tìm sản phẩm nhanh

Người dùng cần có khả năng browse, search và chọn sản phẩm nhanh, đặc biệt trên mobile. Nếu họ không tìm thấy sản phẩm phù hợp trong vài giây đầu tiên, phễu chuyển đổi sẽ bị gãy ngay từ đầu.

### 3. Thu thông tin ý định mua với ma sát thấp

Thay vì bắt người dùng tạo tài khoản, điền form dài, hoặc thanh toán online, hệ thống chỉ cần thu tín hiệu có giá trị nhất ở mức tối thiểu:

- số điện thoại
- sản phẩm đã chọn

### 4. Chuyển đổi theo mô hình bán hàng thủ công

Doanh nghiệp đang dùng website để thu nhu cầu, sau đó admin liên hệ để chốt đơn. Vì vậy đây gần với **sales funnel** hơn là một mô hình e-commerce tự phục vụ hoàn chỉnh.

### 5. Đơn giản hóa vận hành

Admin cần có cách để quản lý sản phẩm và các yêu cầu/đặt hàng được gửi vào mà không phải duy trì CMS hay hệ thống commerce nặng.

---

## Ý Nghĩa Chiến Lược

Sản phẩm này đang tối ưu cho:

- tốc độ hơn là độ sâu tính năng
- niềm tin hơn là sự đầy đủ
- thu lead hơn là hoàn tất giao dịch
- mobile usability hơn là sự phức tạp trên desktop
- sự đơn giản cho admin hơn là khả năng scale ngay từ đầu

Vì vậy, triết lý sản phẩm phù hợp không phải là "xây một cửa hàng online đầy đủ", mà là:

**tạo ra con đường ngắn nhất từ sự quan tâm sản phẩm đến một lead có thể liên hệ**

---

## Các Yêu Cầu Ẩn Chưa Được Nói Ra

Đây là những thứ chưa được viết rõ, nhưng gần như chắc chắn hệ thống sẽ cần.

### 1. Cấu trúc dữ liệu sản phẩm trong Google Sheet

Google Sheet không thể chỉ có tên và giá sản phẩm. Nó nhiều khả năng sẽ cần các cột như:

- `product_id`
- `product_name`
- `category`
- `price`
- `sale_price`
- `image_url`
- `short_description`
- `skin_concern`
- `status` (`active/inactive`)
- `display_order`
- `availability_note`
- `featured_flag`

Nếu schema không rõ ràng, frontend sẽ rất dễ vỡ.

### 2. Nơi lưu trữ hình ảnh ổn định

Google Sheet có thể lưu link ảnh, nhưng ảnh sản phẩm phải được host ở nơi ổn định và public. Ảnh bị hỏng sẽ ảnh hưởng trực tiếp đến độ tin cậy và conversion.

### 3. Nơi lưu dữ liệu lead/order

Yêu cầu nói admin quản lý đơn hàng, nên các lần gửi thông tin phải được lưu lại. Nếu Google Sheet cũng được dùng để lưu order/lead, thì sẽ cần:

- thời gian gửi
- số điện thoại
- danh sách sản phẩm đã chọn
- số lượng
- ghi chú
- trạng thái như `new/contacted/closed`

### 4. Kiểm tra số điện thoại

Vì số điện thoại là mục tiêu chuyển đổi chính, phần validation rất quan trọng:

- bắt buộc nhập
- đúng định dạng theo thị trường mục tiêu
- có thể cần phát hiện trùng lặp
- có thể cần chống spam cơ bản

### 5. Trạng thái xác nhận sau khi gửi

Người dùng cần được trấn an ngay sau khi gửi:

- gửi thành công
- bước tiếp theo là gì
- admin sẽ liên hệ trong bao lâu

Điều này quan trọng hơn rất nhiều tính năng "trang trí" khác.

### 6. Định nghĩa workflow của admin

"Admin quản lý sản phẩm và đơn hàng" nghe có vẻ đơn giản, nhưng ẩn bên dưới là nhiều câu hỏi:

- Admin chỉ sửa sản phẩm trong Google Sheet hay cần dashboard riêng?
- Admin có cần đổi trạng thái đơn?
- Admin có cần nhận thông báo ngay khi có lead mới?
- Admin có cần tìm kiếm, lọc, export lead không?

### 7. Logic tìm kiếm và lọc

"Browse và search" thường đồng nghĩa với:

- tìm theo tên sản phẩm
- lọc theo danh mục
- lọc theo vấn đề da
- lọc theo giá

Trong skincare, "skin concern" có thể quan trọng hơn category thông thường.

### 8. Xử lý sản phẩm hết hàng / tạm ngừng bán

Ngay cả khi không thanh toán online, người dùng cũng không nên gửi thông tin cho sản phẩm không còn sẵn. Nếu không, quy trình admin follow-up sẽ rất rối.

### 9. Thông điệp pháp lý / quyền riêng tư

Nếu website thu số điện thoại, thì tối thiểu cần:

- thông điệp đồng ý
- chính sách quyền riêng tư
- giải thích thông tin sẽ được dùng để liên hệ ra sao

### 10. Chiến lược hiệu năng trên mobile

Nếu frontend lấy dữ liệu trực tiếp từ Google Sheet mỗi lần tải trang, tốc độ có thể giảm. Gần như chắc chắn sẽ cần cache hoặc đồng bộ theo chu kỳ.

---

## Rủi Ro Và Giới Hạn

### 1. Google Sheet đóng vai trò database

#### Điểm mạnh

- dễ cho admin cập nhật
- chi phí thấp
- ra MVP nhanh

#### Rủi ro

- cấu trúc yếu, khó validation
- chỉ cần sửa nhầm là có thể vỡ frontend
- dễ gặp vấn đề khi nhiều người sửa cùng lúc
- khó query/lọc khi dữ liệu tăng
- có thể chậm hoặc bị giới hạn API
- audit trail kém
- không phù hợp cho order management phức tạp

#### Kết luận

Google Sheet phù hợp với giai đoạn MVP sớm, nhưng nên được xem là **nguồn nội dung tạm thời, nhẹ và dễ vận hành**, không nên xem là transactional database lâu dài.

### 2. Không có thanh toán online

#### Điểm mạnh

- giảm ma sát khi chuyển đổi
- đơn giản hóa phần pháp lý và kỹ thuật
- phù hợp với mô hình bán hàng có tư vấn/follow-up

#### Rủi ro

- mức độ cam kết của khách thấp hơn đơn đã thanh toán
- dễ có lead ảo / lead chất lượng thấp
- tăng khối lượng follow-up thủ công
- chu kỳ chốt đơn chậm hơn
- người dùng có thể không rõ họ đã "đặt hàng" hay chỉ "để lại thông tin"

#### Kết luận

UI cần định nghĩa hành động thật rõ. Nếu không muốn gây hiểu nhầm, CTA có thể nên theo hướng:

- `Để lại số điện thoại để đặt hàng`
- `Nhận tư vấn`
- `Gửi lựa chọn của bạn`

### 3. Không có login cho người dùng

#### Điểm mạnh

- nhanh
- ít ma sát
- UX đơn giản

#### Rủi ro

- không có lịch sử đơn
- không lưu cart giữa các thiết bị
- không có theo dõi trạng thái tự phục vụ
- khó nhận biết khách quay lại ngoài trừ thông qua số điện thoại

#### Kết luận

Đây là lựa chọn hợp lý cho MVP, nhưng phía admin cần bù lại bằng quy trình theo dõi lead gọn gàng.

### 4. Mobile-first và premium visual tone

#### Lợi ích

- phù hợp hành vi người dùng
- hợp với luồng traffic từ social

#### Rủi ro

- giao diện "premium" dễ trở nên quá trang trí
- nhiều hiệu ứng/ảnh lớn có thể làm trang chậm
- màu pastel dễ gây vấn đề contrast nếu không kiểm soát kỹ

#### Kết luận

Thiết kế cần mềm, tinh tế và nữ tính, nhưng CTA và ô nhập số điện thoại vẫn phải là yếu tố nổi bật nhất.

### 5. Admin quản lý "orders"

#### Rủi ro

- Khái niệm "order" đang mơ hồ.
- Vì không thanh toán online, thứ người dùng gửi vào thực chất gần với lead hoặc order request hơn là đơn hoàn tất.
- Nếu không có workflow đơn giản, admin sẽ xử lý không đồng nhất.

#### Gợi ý vòng đời trạng thái tối giản

- `new`
- `contacted`
- `confirmed`
- `closed`
- `cancelled`

### 6. Spam / abuse

Bất kỳ form công khai nào thu số điện thoại đều có nguy cơ:

- số ảo
- bot submit
- gửi trùng lặp

Tối thiểu cần:

- rate limiting
- anti-bot cơ bản
- server-side validation
- logic phát hiện trùng lặp đơn giản

---

## Mâu Thuẫn Cần Giải Quyết

Có một mâu thuẫn sản phẩm rất quan trọng:

Yêu cầu nói rằng người dùng sẽ:

- browse
- search
- chọn sản phẩm
- rồi mới nhập số điện thoại

Nhưng mục tiêu kinh doanh lại là:

**lấy số điện thoại càng nhanh càng tốt**

Hai mục tiêu này có thể xung đột.

- Nếu bắt người dùng xem quá nhiều rồi mới xin số điện thoại, conversion có thể giảm.
- Nếu xin số điện thoại quá sớm, niềm tin có thể chưa đủ.

Vì vậy, hệ thống hợp lý nhất thường sẽ là một funnel lai:

- cho người dùng thấy sản phẩm và giá nhanh
- cho phép chọn sản phẩm nhẹ nhàng
- kích hoạt bước nhập số điện thoại ngay tại điểm ý định mạnh nhất

Điều này gợi ý rằng CTA chính nên xuất hiện sớm và lặp lại nhiều điểm, không chỉ ở bước cuối.

---

## Định Nghĩa Triết Lý Sản Phẩm

### 1. Conversion-first

Website tồn tại để tạo ra lead có thể liên hệ. Mọi màn hình đều nên giúp người dùng đến gần hơn với việc gửi số điện thoại.

### 2. Simplicity-first

Không quy trình thừa, không tạo tài khoản, không cart phức tạp, không checkout dài dòng.

### 3. Trust-first

Vì không có thanh toán online và cần admin follow-up, website phải xây dựng niềm tin qua:

- giao diện sạch, đẹp và đồng bộ
- ảnh sản phẩm thật, rõ
- giá minh bạch
- thông điệp liên hệ rõ ràng
- next step rõ sau khi gửi

### 4. Mobile-first

Mọi thao tác quan trọng đều phải dễ bấm bằng ngón tay, nhanh, dễ thấy và không cần tìm kiếm.

### 5. Admin-light

Mô hình vận hành phải nhẹ. Nếu admin không quản lý dễ dàng, hệ thống sẽ thất bại dù UI có đẹp đến đâu.

---

## Nguyên Tắc UX Thực Tiễn Nên Đi Kèm

1. Danh sách sản phẩm phải quét nhanh được.
2. Ô tìm kiếm phải dễ thấy và phản hồi nhanh.
3. Product card chỉ hiển thị thông tin cần thiết nhất để ra quyết định.
4. CTA phải xuất hiện sớm: trên card, trang chi tiết và khu vực tổng hợp sản phẩm đã chọn.
5. Form số điện thoại phải ngắn, rõ, và ma sát thấp.
6. Sau khi gửi phải có thông điệp xác nhận rõ "sẽ có ai liên hệ" và "trong bao lâu".
7. "Cart" nên là một khối nhẹ, nghĩa là "sản phẩm đã chọn" hơn là mô phỏng checkout truyền thống.
8. Toàn bộ website không được tạo cảm giác đang đi qua một quy trình đặt hàng phức tạp.

---

## Phạm Vi MVP Hợp Lý

Một MVP tốt cho bài toán này khả năng cao sẽ gồm:

- trang landing / homepage
- danh sách sản phẩm đọc từ Google Sheet
- search và filter cơ bản
- trang chi tiết sản phẩm
- luồng chọn sản phẩm / thêm vào danh sách
- form gửi ngắn gọn với số điện thoại
- lưu lead/order request
- admin quản lý sản phẩm qua Google Sheet
- admin xem lead/order ở dashboard đơn giản hoặc qua Sheet
- thông báo cho admin khi có lead mới

Bất kỳ thứ gì vượt qua phạm vi này đều nên được cân nhắc theo KPI chính.

---

## Định Nghĩa Thành Công

Sản phẩm thành công nếu:

- người dùng hiểu sản phẩm trong vài giây
- người dùng gửi thông tin nhanh và ít ma sát
- admin nhận được dữ liệu lead sạch và dễ xử lý
- cập nhật sản phẩm không cần nhờ dev
- trải nghiệm mobile đẹp, nhanh, premium nhưng không nặng

---

## Kết Luận

LanEm Glow nên được xây dựng như một **website lead-generation commerce funnel mobile-first**, không phải một e-commerce store đầy đủ.

Triết lý cốt lõi nên là:

- **conversion-first**
- **simplicity-first**
- **trust-building through elegant presentation**
- **operational lightness through Google Sheet**
- **manual sales follow-up as part of the product model**

Rủi ro lớn nhất bị ẩn bên dưới hai quyết định nghe có vẻ "nhỏ":

- dùng Google Sheet
- không thanh toán online

Thực tế, chính hai lựa chọn này mới là thứ định hình toàn bộ kiến trúc sản phẩm. Đây không chỉ là một website bán hàng, mà là một hệ thống:

- catalog nhẹ
- thu lead
- admin follow-up để chốt đơn
