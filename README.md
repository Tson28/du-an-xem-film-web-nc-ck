# TT-CINEMA

## 1. Giới thiệu hệ thống
TT-CINEMA là hệ thống đặt vé xem phim trực tuyến gồm 3 phần chính:
- Frontend (client): giao diện người dùng React.
- Backend (server): API Node.js + Express xử lý nghiệp vụ và giao tiếp dữ liệu.
- Data Layer: MongoDB lưu dữ liệu phim, suất chiếu, người dùng, vé, đánh giá...

## 2. Kiến trúc tổng quát
Hệ thống của bạn trông giống sơ đồ kiến trúc sau:
- Người dùng tương tác qua trình duyệt/ứng dụng React.
- Frontend gọi API REST tới backend để lấy dữ liệu phim, lịch chiếu, thanh toán và quản lý tài khoản.
- Backend dùng Express làm API Gateway, có middleware xử lý JWT, xác thực, phân quyền và logging.
- Backend kết nối MongoDB qua Mongoose để lưu trữ dữ liệu.
- Backend cũng sử dụng Socket.IO để xử lý ghế giữ/chia sẻ trạng thái ghế trong thời gian thực.
- Hình ảnh, poster, avatar, file media được lưu tạm trong thư mục upload nội bộ của server.

## 3. Vị trí lưu trữ dữ liệu
### 3.1 Database
- Dữ liệu chính của hệ thống lưu trong MongoDB.
- Tệp cấu hình kết nối: `server/src/config/connectDB.js`.
- Chuỗi kết nối MongoDB lấy từ biến môi trường `process.env.CONNECT_DB`.
- Trong mã nguồn seed và các script phụ, nếu không có biến môi trường thì dùng fallback `mongodb://127.0.0.1:27017/movie2`.

### 3.2 File storage
- Ảnh phim, poster, backdrop, avatar, hình service được upload và lưu local tại:
  - `server/src/uploads/movies`
  - `server/src/uploads/services`
  - `server/src/uploads/avatars`
  - `server/src/uploads/category`
- Server Express đang phục vụ thư mục `server/src` làm static files, nên URL ảnh sẽ có dạng `/uploads/...`.

## 4. API được lưu trữ ở đâu
### 4.1 Vị trí API
- API chính nằm trong thư mục: `server/src/routes`.
- Tệp định tuyến tổng: `server/src/routes/index.routes.js`.
- `server/src/server.js` khởi tạo Express và gọi `routes(app)`.

### 4.2 Các nhóm API chính
- `/api/users` - quản lý người dùng, đăng nhập, đăng ký, avatar.
- `/api/category` - quản lý danh mục phim.
- `/api/movies` - tạo, chỉnh sửa, lấy thông tin phim.
- `/api/cinemas` - quản lý rạp.
- `/api/rooms` - quản lý phòng chiếu.
- `/api/showtimes` - quản lý suất chiếu.
- `/api/services` - quản lý dịch vụ ăn uống, combo.
- `/api/bookings` - đặt vé, giữ ghế, đơn hàng.
- `/api/vouchers` - quản lý voucher giảm giá.
- `/api/payment` - thanh toán Momo/VNPAY.
- `/api/reviews` - đánh giá phim.
- `/api/statistics` - báo cáo doanh thu, thống kê.
- `/api/gifts` - quản lý quà tặng.
- `/api/chatbot` - chatbot trợ giúp người dùng.
- `/api/notifications` - thông báo cho người dùng.

## 5. Các chức năng chính vận hành
### 5.1 Frontend
- React quản lý UI, định tuyến bằng React Router.
- Gọi API bằng Axios/FETCH để lấy dữ liệu phim, lịch chiếu, ghế, thanh toán.
- Hiển thị danh sách phim, chi tiết phim, chọn ghế, thanh toán, quản lý tài khoản.

### 5.2 Backend
- Express xử lý request, trả response JSON.
- Mỗi route điều khiển bởi controller tương ứng trong `server/src/controller`.
- Controller gọi service để xử lý nghiệp vụ trong `server/src/services`.
- Mỗi model trong `server/src/models` định nghĩa collection MongoDB.
- Middleware `server/src/auth/checkAuth.js` kiểm tra JWT và quyền truy cập.
- Socket.IO xử lý giữ ghế thời gian thực khi người dùng chọn ghế.

### 5.3 Database
- MongoDB lưu:
  - users
  - movies
  - categories
  - cinemas
  - rooms
  - showtimes
  - bookings
  - payments
  - reviews
  - vouchers
  - notifications
  - chat histories
- Dữ liệu seed có thể được khởi tạo bằng các script trong `server/src/seed*.js`.

### 5.4 Các chức năng nổi bật
- Đặt ghế và giữ ghế online: người dùng chọn ghế trực tiếp trên giao diện, hệ thống dùng Socket.IO để giữ ghế trong thời gian thực và tránh trùng lặp.
- Comment và đánh giá phim: khách hàng có thể để lại bình luận, đánh giá sao và xem điểm đánh giá trung bình của từng phim.
- Chatbot AI: hỗ trợ người dùng tra cứu phim, hướng dẫn đặt vé, thanh toán và giải đáp các câu hỏi thường gặp bằng AI.

### 5.5 Quy trình đặt vé
1. Người dùng chọn phim và suất chiếu.
2. Frontend gọi API `/api/showtimes` để lấy thông tin ghế và suất.
3. Người dùng chọn ghế, Socket.IO gửi `seat:hold` lên server để giữ ghế.
4. Server xử lý giữ ghế và broadcast trạng thái ghế cho các client khác trong cùng suất chiếu.
5. Người dùng hoàn tất đơn đặt vé và thanh toán qua API `/api/payment`.
6. Nếu thanh toán thành công, server tạo booking trong MongoDB và giải phóng ghế giữ.

### 5.6 Thanh toán Momo và VNPay
- Thanh toán Momo và VNPay được xử lý qua `server/src/routes/payment.routes.js`.
- User gửi yêu cầu tạo thanh toán bằng API:
  - `POST /api/payment/momo` để tạo link Momo.
  - `POST /api/payment/vnpay` để tạo link VNPay.
- Backend tạo booking với `status='Pending'` bằng `server/src/services/payment.service.js` trước khi trả về URL thanh toán.
- Với Momo, service xây dựng yêu cầu sandbox đến `test-payment.momo.vn` bằng `accessKey`, `secretKey`, `partnerCode` và gửi `extraData` chứa `bookingId`.
- Với VNPay, service dùng thư viện `vnpay` để tạo URL thanh toán đến `https://sandbox.vnpayment.vn` với thông tin đơn hàng và `vnp_ReturnUrl`.
- Sau khi người dùng thanh toán thành công, có 2 luồng xác nhận:
  - Callback server-to-server (IPN) với `POST /api/payment/momo/callback` hoặc `GET /api/payment/vnpay/callback`.
  - Client redirect quay về và gọi tiếp `POST /api/payment/momo/confirm-return` hoặc `POST /api/payment/vnpay/confirm-return` để cập nhật booking.
- Khi thanh toán thành công, backend gọi `markBookingAsPaid()` để chuyển trạng thái booking từ `Pending` thành `Paid`, lưu `paymentTransactionId` và chạy các hành động hậu cần như cập nhật voucher, gửi email xác nhận và xử lý quà tặng.

### 5.7 Quét QR để kiểm tra và soát vé
- QR code trên vé thực tế là `booking._id` được tạo bởi hệ thống.
- Mỗi lần khách đặt vé thành công, MongoDB tạo ra một `_id` duy nhất cho booking đó. Vì `_id` này khác nhau cho mỗi đơn vé, nên mã QR cũng khác nhau cho mỗi vé.
- Trong frontend, giá trị này được đưa vào QR bằng cách dùng `QRCode value={booking._id}` ở các trang `client/src/pages/Booking/BookingResultPage.jsx` và `client/src/pages/Booking/MyTicketsPage.jsx`.
- Máy quét vé nhân viên dùng trang `client/src/pages/Employee/ScannerPage.jsx` với `html5-qrcode` để quét camera.
- Khi quét được, frontend gọi API:
  - `GET /api/bookings/:id/verify` để lấy chi tiết vé và kiểm tra trạng thái.
  - `PUT /api/bookings/:id/checkin` để soát vé và chuyển trạng thái sang `CheckedIn`.
- Backend xử lý trên `server/src/routes/booking.routes.js` và `server/src/controller/booking.controller.js`.
- Kiểm tra vé đảm bảo vé phải tồn tại và đã được thanh toán (`status === 'Paid'`) trước khi cho phép soát.
- Sau khi soát, vé được đánh dấu `CheckedIn`, lưu người soát, và trang nhân viên có thể in vé bằng `react-to-print`.

### 5.8 Comment và đánh giá phim
- Chức năng bình luận và đánh giá phim được triển khai qua route `server/src/routes/review.routes.js`.
- Người dùng đã đăng nhập có thể gửi đánh giá cho một phim bằng API `POST /api/reviews/:movieId`.
- Mỗi người dùng chỉ được đánh giá một lần cho mỗi phim.
- Review gồm:
  - `rating`: điểm số từ 1 đến 5 sao.
  - `comment`: nội dung bình luận.
  - `isVerified`: đánh dấu người đánh giá đã từng mua vé xem phim đó hay chưa.
- Backend kiểm tra người dùng có booking đã thanh toán cho phim đó trong `server/src/services/review.service.js` trước khi cho phép tạo review.
- Hệ thống tính trung bình số sao và tổng số review cho từng phim.
- Các review được lưu trong collection `reviews` thông qua model `server/src/models/review.model.js`.
- Nếu số lượng review đủ lớn (từ 5 đánh giá), hệ thống tự động gọi AI để tóm tắt ý kiến khán giả và cập nhật vào trường `aiSummary` của phim trong model `server/src/models/movies.model.js`.
- Chức năng này giúp hiện thị đánh giá chi tiết và tạo ra một bản tóm tắt tổng quan cho người dùng.

### 5.9 Chatbot AI
- Chatbot nằm trong backend `server/src/routes/chatbot.routes.js` và controller `server/src/controller/chatbot.controller.js`.
- Frontend gọi API `POST /api/chatbot/chat` qua `client/src/config/ChatbotRequest.js`.
- Backend định danh người dùng bằng token JWT nếu đã login, hoặc dùng `sessionId` cục bộ nếu guest.
- Lịch sử chat được lưu trong collection `chat_histories` qua model `server/src/models/chatHistory.model.js`.
- Logic AI chính nằm ở `server/src/services/chatbot.service.js`:
  - Hàm `buildMovieContext()` lấy dữ liệu phim đang chiếu từ MongoDB để tạo ngữ cảnh ngày càng chính xác.
  - Hàm `chat()` xây dựng `systemPrompt` cố định với nhiệm vụ trợ lý rạp chiếu và nhúng danh sách phim, rồi gọi Groq AI qua `groq-sdk`.
  - Hàm `chatWithHistory()` kết hợp lịch sử 10 tin nhắn gần nhất vào request để AI trả lời có ngữ cảnh.
- Chatbot không “tự học” trực tiếp từ toàn bộ website theo cách lưu trữ học lại model. Thay vào đó:
  - Nó dùng mô hình ngôn ngữ bên thứ ba (Groq AI) đã được huấn luyện trước.
  - Nó cung cấp cho mô hình ngữ cảnh hiện tại từ cơ sở dữ liệu phim và lịch sử chat.
  - Mọi câu hỏi đều được gửi đến API Groq để sinh câu trả lời dựa trên prompt và dữ liệu hiện có.
- Ngoài ra, service còn có chức năng tóm tắt review phim bằng AI với prompt chuyên biệt, giúp tổng hợp cảm nhận người xem.



## 6. Cách chạy nhanh
1. Vào thư mục `server/`, cài dependencies và chạy `npm run dev`.
2. Vào thư mục `client/`, cài dependencies và chạy `npm run dev`.
3. Đảm bảo `CONNECT_DB` trỏ đến MongoDB và `URL_CLIENT` trỏ đến địa chỉ client.

---
