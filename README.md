# SUN CINEMA

## 1. Giới thiệu hệ thống
SUN CINEMA là hệ thống đặt vé xem phim trực tuyến gồm 3 phần chính:
- Frontend (client): giao diện người dùng React.
- Backend (server): API Node.js + Express xử lý nghiệp vụ và giao tiếp dữ liệu.
- Data Layer: MongoDB lưu dữ liệu phim, suất chiếu, người dùng, vé, đánh giá...

## 2. Kiến trúc tổng quát
Hệ thống được thiết kế theo sơ đồ kiến trúc chuẩn sau:
- Người dùng tương tác trực quan qua trình duyệt bằng ứng dụng React.
- Frontend gọi API REST tới backend để lấy dữ liệu phim, lịch chiếu, thanh toán và quản lý tài khoản.
- Backend dùng Express làm API Gateway, tích hợp middleware xử lý JWT, xác thực, phân quyền và ghi log (logging).
- Backend kết nối cơ sở dữ liệu MongoDB qua Mongoose để lưu trữ và truy vấn dữ liệu.
- Backend sử dụng Socket.IO để xử lý giữ ghế và đồng bộ trạng thái ghế theo thời gian thực.
- Hình ảnh, poster, avatar, file media được lưu trữ tại thư mục upload nội bộ của server.

## 3. Vị trí lưu trữ dữ liệu
### 3.1 Database
- Dữ liệu chính của hệ thống được lưu trữ tập trung trong MongoDB.
- Tệp cấu hình kết nối: `server/src/config/connectDB.js`.
- Chuỗi kết nối MongoDB được cấu hình động qua biến môi trường `process.env.CONNECT_DB`.
- Trong mã nguồn seed dữ liệu và các script phụ, nếu không tìm thấy biến môi trường hệ thống sẽ tự động dùng fallback mặc định: `mongodb://127.0.0.1:27017/movie2`.

### 3.2 File storage
- Toàn bộ ảnh phim, poster, backdrop, ảnh đại diện (avatar) và hình ảnh dịch vụ được upload và lưu cục bộ tại:
  - `server/src/uploads/movies`
  - `server/src/uploads/services`
  - `server/src/uploads/avatars`
  - `server/src/uploads/category`
- Server Express phục vụ thư mục `server/src` dưới dạng static files, do đó URL của tài nguyên ảnh sẽ có cấu trúc dạng `/uploads/...`.

## 4. API được lưu trữ ở đâu
### 4.1 Vị trí API
- Mã nguồn định nghĩa API chính nằm trong thư mục: `server/src/routes`.
- Tệp định tuyến tổng hợp: `server/src/routes/index.routes.js`.
- Tệp cấu hình khởi chạy `server/src/server.js` đảm nhận khởi tạo Express và kích hoạt định tuyến thông qua hàm `routes(app)`.

### 4.2 Các nhóm API chính
- `/api/users` - Quản lý tài khoản người dùng, đăng nhập, đăng ký và cập nhật avatar.
- `/api/category` - Quản lý danh mục và thể loại phim.
- `/api/movies` - Thêm, sửa, xóa và truy vấn thông tin phim.
- `/api/cinemas` - Quản lý hệ thống rạp chiếu.
- `/api/rooms` - Quản lý phòng chiếu phim.
- `/api/showtimes` - Quản lý các suất chiếu.
- `/api/services` - Quản lý dịch vụ ăn uống, bắp nước và các gói combo đi kèm.
- `/api/bookings` - Quy trình đặt vé, giữ ghế và quản lý đơn hàng.
- `/api/vouchers` - Quản lý mã giảm giá, voucher khuyến mãi.
- `/api/payment` - Tích hợp cổng thanh toán trực tuyến MoMo/VNPAY.
- `/api/reviews` - Tiếp nhận phản hồi và đánh giá phim từ khán giả.
- `/api/statistics` - Thống kê báo cáo doanh thu và hiệu suất phòng vé.
- `/api/gifts` - Quản lý quà tặng thành viên.
- `/api/chatbot` - API tích hợp trợ lý ảo thông minh hỗ trợ khách hàng.
- `/api/notifications` - Hệ thống gửi thông báo tự động tới người dùng.

## 5. Các chức năng chính vận hành
### 5.1 Frontend
- Sử dụng thư viện React để quản lý UI, điều hướng phân luồng trang bằng React Router.
- Kết nối và gọi API thông qua Axios/FETCH để lấy dữ liệu phim, lịch chiếu, sơ đồ ghế và thực hiện thanh toán.
- Hiển thị danh sách phim trực quan, chi tiết phim, giao diện chọn ghế trực quan, cổng checkout và quản lý thông tin cá nhân.

### 5.2 Backend
- Tiếp nhận và xử lý request từ client, trả về phản hồi chuẩn hóa dưới định dạng dữ liệu JSON.
- Mỗi route được điều hướng và xử lý bởi một controller tương ứng đặt tại `server/src/controller`.
- Controller gọi tầng service tại `server/src/services` để thực thi các nghiệp vụ logic sâu hơn.
- Hệ thống định nghĩa cấu trúc bảng (collection) MongoDB thông qua các model tại `server/src/models`.
- Lớp bảo mật middleware `server/src/auth/checkAuth.js` thực hiện xác thực chữ ký mã hóa JWT và kiểm tra phân quyền truy cập.
- Thư viện Socket.IO quản lý toàn bộ trạng thái đóng/mở giữ ghế theo thời gian thực khi người dùng tương tác trên sơ đồ rạp.

### 5.3 Database
- Hệ thống lưu trữ các tập dữ liệu bao gồm: users, movies, categories, cinemas, rooms, showtimes, bookings, payments, reviews, vouchers, notifications, chat histories.
- Dữ liệu mẫu (Seed data) phục vụ môi trường thử nghiệm được khởi tạo nhanh chóng thông qua các script tại hệ thống tệp `server/src/seed*.js`.

### 5.4 Các chức năng nổi bật
- **Đặt ghế và giữ ghế thời gian thực**: Người dùng chọn ghế trực tiếp trên sơ đồ phòng chiếu, hệ thống sử dụng Socket.IO thiết lập phiên giữ ghế tạm thời, đồng bộ ngay lập tức tới tất cả người dùng khác đang xem cùng suất chiếu nhằm tránh trùng ghế.
- **Bình luận & Đánh giá phim chuyên sâu**: Khách hàng có thể đóng góp ý kiến cá nhân bằng cách chấm điểm sao và viết bình luận, hệ thống tự động tổng hợp tính điểm rating trung bình cho từng bộ phim.
- **Trợ lý ảo Chatbot AI**: Tích hợp mô hình AI thông minh hỗ trợ giải đáp nhanh lịch chiếu, giá vé, hướng dẫn thao tác đặt vé và xử lý các câu hỏi thường gặp một cách tự động.

### 5.5 Quy trình đặt vé tiêu chuẩn
1. Người dùng tìm kiếm và lựa chọn phim kèm suất chiếu mong muốn.
2. Frontend thực hiện gọi API `/api/showtimes` để truy xuất cấu trúc phòng và trạng thái ghế hiện thời.
3. Người dùng click chọn ghế trên sơ đồ, luồng truyền thông Socket.IO phát tín hiệu `seat:hold` lên máy chủ để khóa ghế tạm thời.
4. Server tiếp nhận lệnh giữ ghế và phát quảng bá (broadcast) cập nhật trạng thái tới tất cả các client đang kết nối trong phòng vé đó.
5. Người dùng hoàn tất biểu mẫu thông tin và tiến hành thanh toán hóa đơn thông qua API `/api/payment`.
6. Sau khi cổng thanh toán phản hồi thành công, server chính thức tạo bản ghi booking vào cơ sở dữ liệu MongoDB và giải phóng phiên giữ ghế tạm.

### 5.6 Tích hợp thanh toán trực tuyến MoMo và VNPay
- Hệ thống xử lý cổng thanh toán trực tuyến được định tuyến tại `server/src/routes/payment.routes.js`.
- Client gửi yêu cầu khởi tạo giao dịch thông qua các API:
  - `POST /api/payment/momo` để lấy URL thanh toán từ cổng MoMo.
  - `POST /api/payment/vnpay` để lấy URL thanh toán từ cổng VNPay.
- Hệ thống tự động thiết lập một bản ghi booking lưu trạng thái `status='Pending'` thông qua lớp nghiệp vụ `server/src/services/payment.service.js` trước khi điều hướng người dùng tới trang thanh toán.
- **Đối với MoMo**: Service thực hiện đóng gói cấu trúc request sandbox gửi tới cổng thử nghiệm `test-payment.momo.vn` sử dụng bộ khóa xác thực `accessKey`, `secretKey`, `partnerCode` kèm trường dữ liệu mở rộng `extraData` chứa thông tin định danh `bookingId`.
- **Đối với VNPay**: Service ứng dụng thư viện `vnpay` chính thức để thiết lập URL thanh toán mã hóa gửi tới `https://sandbox.vnpayment.vn` kèm tham số đơn hàng và địa chỉ phản hồi cấu hình `vnp_ReturnUrl`.
- Khi người dùng hoàn tất giao dịch, hệ thống áp dụng cơ chế xác thực kép:
  - Luồng truyền thông ngầm Server-to-Server (IPN) qua endpoint `POST /api/payment/momo/callback` hoặc `GET /api/payment/vnpay/callback`.
  - Kết hợp luồng điều hướng trình duyệt của client về trang xử lý trung gian: `POST /api/payment/momo/confirm-return` hoặc `POST /api/payment/vnpay/confirm-return` để thực hiện hậu kiểm dữ liệu.
- Sau khi xác thực thông tin giao dịch khớp và thành công, hàm `markBookingAsPaid()` được kích hoạt nhằm cập nhật trạng thái hóa đơn từ `Pending` sang `Paid`, lưu vết mã giao dịch `paymentTransactionId`, đồng thời kích hoạt các tiến trình phụ bao gồm trừ hạn mức voucher, gửi email hóa đơn điện tử xác nhận và xử lý quà tặng tích lũy.

### 5.7 Quét mã QR kiểm tra và soát vé tự động
- Mã QR đính kèm trên mỗi vé điện tử được mã hóa trực tiếp từ chuỗi định danh duy nhất `booking._id` do MongoDB sinh ra tự động. Vì `_id` này mang tính duy nhất toàn hệ thống, mã QR tương ứng sẽ không thể làm giả hoặc trùng lặp.
- Phía giao diện, mã QR được tạo động bằng cách truyền giá trị vào cấu phần `<QRCode value={booking._id} />` tại các màn hình kết quả `client/src/pages/Booking/BookingResultPage.jsx` và trang lịch sử vé `client/src/pages/Booking/MyTicketsPage.jsx`.
- Nhân viên soát vé tại rạp sử dụng camera thiết bị truy cập vào phân hệ quản lý `client/src/pages/Employee/ScannerPage.jsx`, ứng dụng thư viện quét mã `html5-qrcode` để nhận diện dữ liệu.
- Khi nhận diện mã thành công, hệ thống frontend gửi yêu cầu thực thi tới API:
  - `GET /api/bookings/:id/verify` để truy xuất thông tin chi tiết và xác thực tính hợp lệ của vé.
  - `PUT /api/bookings/:id/checkin` để xác nhận soát vé thành công và chuyển đổi trạng thái bản ghi sang `CheckedIn`.
- Toàn bộ tiến trình nghiệp vụ soát vé được điều khiển bởi tập tệp `server/src/routes/booking.routes.js` và `server/src/controller/booking.controller.js`.
- Hệ thống ràng buộc nghiêm ngặt điều kiện vé phải tồn tại hợp lệ và trạng thái giao dịch phải là đã thanh toán (`status === 'Paid'`) trước khi cho phép check-in vào rạp. Sau khi hoàn tất kiểm tra, hệ thống lưu vết định danh nhân viên soát vé và cho phép kết nối máy in nhiệt xuất vé giấy thông qua thư viện `react-to-print`.

### 5.8 Bình luận và chấm điểm đánh giá phim
- Chức năng tiếp nhận phản hồi của người dùng vận hành qua định tuyến `server/src/routes/review.routes.js`.
- Khách hàng sau khi đăng nhập tài khoản hợp lệ có thể gửi đánh giá cho bộ phim yêu thích qua API `POST /api/reviews/:movieId`.
- Để đảm bảo tính khách quan và chống spam, hệ thống giới hạn mỗi tài khoản chỉ được quyền đánh giá một lần duy nhất trên một bộ phim.
- Một bản ghi đánh giá tiêu chuẩn bao gồm:
  - `rating`: Số sao bình chọn từ 1 đến 5.
  - `comment`: Nội dung văn bản bình luận.
  - `isVerified`: Nhãn chứng thực người dùng đã thực sự phát sinh giao dịch mua vé xem phim này tại hệ thống hay chưa.
- Hệ thống thực hiện hậu kiểm tại lớp xử lý `server/src/services/review.service.js`, kiểm tra xem tài khoản đã có lịch sử đơn hàng hoàn tất đối với bộ phim này chưa để gán nhãn chứng thực.
- Toàn bộ dữ liệu phản hồi được lưu trữ trong collection `reviews` thông qua mô hình `server/src/models/review.model.js`, từ đó hệ thống liên tục tính toán cập nhật điểm số rating trung bình và tổng số lượng phản hồi công khai của phim.
- **Tính năng AI tích hợp**: Khi một bộ phim nhận đủ lượng phản hồi lớn (tối thiểu từ 5 đánh giá trở lên), hệ thống sẽ tự động kích hoạt tiến trình nền gọi mô hình AI để tóm tắt, tổng hợp xu hướng ý kiến của khán giả và cập nhật trực tiếp vào trường dữ liệu `aiSummary` của bộ phim đó tại `server/src/models/movies.model.js`.

### 5.9 Hệ thống trợ lý Chatbot AI thông minh
- Chatbot AI được định tuyến tại `server/src/routes/chatbot.routes.js` và điều khiển luồng bởi `server/src/controller/chatbot.controller.js`.
- Ứng dụng frontend tương tác với máy chủ thông qua cổng kết nối API `POST /api/chatbot/chat` định nghĩa tại tệp cấu hình `client/src/config/ChatbotRequest.js`.
- Máy chủ thực hiện nhận diện người dùng qua chuỗi token JWT nếu đã đăng nhập hệ thống, hoặc tự động cấp phát mã phiên định danh `sessionId` cục bộ lưu tại bộ nhớ trình duyệt nếu là khách vãng lai.
- Nhật ký hội thoại của phiên làm việc được lưu giữ tại collection `chat_histories` thông qua mô hình cấu trúc dữ liệu `server/src/models/chatHistory.model.js`.
- Logic cốt lõi của Chatbot vận hành tại `server/src/services/chatbot.service.js` với cấu trúc 3 hàm nghiệp vụ chính:
  - Hàm `buildMovieContext()` đảm nhận truy vấn danh mục phim đang chiếu, sắp chiếu thực tế từ database MongoDB nhằm liên tục cập nhật ngữ cảnh chính xác cho AI.
  - Hàm `chat()` thiết lập kịch bản nền `systemPrompt` cố định đóng vai trò là một giao dịch viên chuyên nghiệp của rạp chiếu phim **SUN CINEMA**, kết hợp nhúng ngữ cảnh phim để gọi trực tiếp dịch vụ xử lý ngôn ngữ Groq AI thông qua thư viện `groq-sdk`.
  - Hàm `chatWithHistory()` thực hiện trích xuất tối đa 10 luồng tin nhắn hội thoại gần nhất trong lịch sử nạp vào request gửi đi, giúp trợ lý ảo ghi nhớ mạch câu chuyện và đưa ra phản hồi thông minh, liền mạch.
- Cơ chế vận hành của Chatbot dựa trên kiến trúc RAG (Retrieval-Augmented Generation) thay vì tự học sâu trực tiếp làm thay đổi trọng số mô hình:
  - Ứng dụng mô hình ngôn ngữ lớn từ bên thứ ba (Groq AI) đã được tối ưu hóa năng lực xử lý ngôn ngữ tự nhiên.
  - Tại mỗi request, hệ thống thực hiện truy vấn cơ sở dữ liệu thời gian thực để tạo gói ngữ cảnh dữ liệu phim và lịch sử trò chuyện đi kèm.
  - Mọi câu hỏi gửi lên cổng API Groq sẽ sinh ra câu trả lời được kiểm soát chặt chẽ trong phạm vi prompt thiết lập và dữ liệu thực tế tại rạp.
- Ngoài ra, service còn được tích hợp module xử lý ngôn ngữ chuyên biệt hỗ trợ quét và tóm tắt nhanh hàng loạt bình luận phim theo yêu cầu, hỗ trợ đắc lực cho quản trị viên theo dõi thị hiếu khách hàng.

## 6. Hướng dẫn triển khai nhanh
1. Di chuyển vào thư mục dự án backend: `cd server/`, tiến hành cài đặt toàn bộ thư viện bằng lệnh `npm install`, sau đó khởi chạy ứng dụng bằng lệnh `npm run dev`.
2. Di chuyển vào thư mục dự án frontend: `cd client/`, tiến hành cài đặt toàn bộ thư viện bằng lệnh `npm install`, sau đó khởi chạy môi trường local bằng lệnh `npm run dev`.
3. Lưu ý cấu hình đầy đủ tệp biến môi trường `.env`, đảm bảo biến `CONNECT_DB` trỏ chính xác tới máy chủ cơ sở dữ liệu MongoDB và biến `URL_CLIENT` trỏ đúng địa chỉ máy ảo client để tránh lỗi chặn chia sẻ tài nguyên (CORS).
