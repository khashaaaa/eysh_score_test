1 Вэбсайтын гол функцууд

    - Имэйлээр нэвтрэх ба OTP баталгаажуулалт: Хэрэглэгч имэйлээрээ нэвтэрч, OTP кодоор баталгаажуулна.

    - Админ нэвтрэлт: Админ өөрийн имэйл, нууц үгээр нэвтэрнэ.

    - JWT Authentication: Аюулгүй байдлыг хангах токен суурьтай authentication.

    - Шалгалт өгөх ба оноо авах: Хэрэглэгч сонгосон хичээлээр шалгалт өгч, оноогоо авна.

    - QR кодоор төлбөр хийх систем: Хэрэглэгч багц худалдан авахдаа QR код ашиглана.

    - Админ самбар: Хичээл, шалгалтын асуултуудыг нэмэх.

2 Суулгах заавар
Backend

        Node багцуудыг суулгах: npm install

        PostgreSQL-дээр eysh_db датабаз үүсгээд query таб дээр schema.sql доторх хүснэгтүүдийг үүсгэнэ.

        PostgreSQL-н DB_USER, DB_PASSWORD, DB_NAME-г өөрийн датабазынхаар өөрчлөх.

        Серверийг ажиллуулахад: node ./server.js

    Frontend

        Node багцуудыг суулгах: npm install

        Frontend-г асаахдаа: npm run dev

3 Ашиглах заавар

    Хэрэглэгчийн нэвтрэлт: имэйлээ оруулна, OTP авна, баталгаажуулна.

    Админ бүртгэл: curl -X POST http://localhost:3000/auth/admin/register -H "Content-Type: application/json" -d '{"email": "admin@example.com", "password": "yourpassword"}'

    Админ нэвтрэлт: admin-login дээр дарж имэйл, нууц үгээ оруулна.

4 Хүснэгтүүдийн бүтэц

    users: id, email, password_hash (админд), is_admin

    otps: email, otp, expires_at, used

    subjects: id, name, duration

    questions: id, subject_id, question, options, correct_answer

    scores: id, user_id, subject_id, score, total, created_at

    packages: id, name, duration, price

    user_packages: id, user_id, package_id, expiry

5 ашиглах заавар

    Админ шинэ асуулт нэмэх

    Хичээл сонгож шалгалт өгөх

    Оноогоо графикаар харах
