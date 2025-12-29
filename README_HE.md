# 🎫 Helpdesk Ticket Management System

מערכת ניהול טיקטים עם ממשק משתמש מודרני ב-React.

## 📋 תיאור המערכת

אפליקציה מלאה לניהול פניות ותגובות במערכת, המאפשרת:
- **Customer**: יצירת טיקטים חדשים, הוספת תגובות, צפייה בטיקטים שלהם
- **Agent**: צפייה בטיקטים שהוקצו להם, עדכון סטטוסים, הוספת תגובות
- **Admin**: ניהול מלא של כל הטיקטים, הקצאה לעובדים, הוספת סטטוסים ועדיפויות

---

## 👥 תפקידי המשתמשים

### Customer
- 📝 רואה רק טיקטים שהוא יצר
- ✨ יכול לפתוח טיקט חדש
- 💬 יכול להוסיף תגובות בטיקט שלו

### Agent
- 📌 רואה רק טיקטים שהוקצו אליו
- 🔄 יכול לעדכן סטטוס טיקט
- 💬 יכול להוסיף תגובות

### Admin
- 👁️ רואה את כל הטיקטים
- 🎯 יכול להקצות טיקטים ל־Agent
- 🔄 יכול לשנות סטטוסים
- ⭐ יכול להוסיף עדיפויות חדשות
- 📊 יכול להוסיף סטטוסים חדשים

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: MobX + React Query
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Build Tool**: Vite

---

## 📦 Installation

### דרישות קדם:
- Node.js 16+
- npm או yarn

### שלבי התקנה:

```bash
# 1. שכפל את הריפו
git clone <repo-url>
cd react_project

# 2. התקן dependencies
npm install

# 3. הרץ את השרת (בטרמינל נפרד)
# השרת צריך להיות רץ ב-http://localhost:4000
# (ראה https://github.com/sarataber/helpdesk-api)

# 4. הרץ את האפליקציה
npm run dev
```

האפליקציה תפתח ב- `http://localhost:5173`

---

## 🚀 שימוש

### התחברות
1. עבור ל- `/login`
2. הכנס אימייל וסיסמה
3. אתה יופנה ל-Dashboard

### יצירת טיקט (Customer)
1. לחץ על "צור טיקט חדש"
2. מלא: נושא, תיאור, עדיפות
3. לחץ "יצור"
4. קבל הודעת הצלחה

### ניהול טיקטים (Admin)
1. גש ל- `/tickets`
2. השתמש בסינונים לפי סטטוס, עדיפות, agent
3. בחר טיקט וערוך סטטוס/עדיפות/הקצאה

---

## 🔐 API דרכים

### Login
```
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Tickets
```
GET    /tickets              - קבל את כל הטיקטים שלך
GET    /tickets/:id          - קבל טיקט ספציפי
POST   /tickets              - צור טיקט חדש
PATCH  /tickets/:id          - עדכן סטטוס/עדיפות/הקצאה
```

### Comments
```
GET    /tickets/:id/comments - קבל תגובות
POST   /tickets/:id/comments - הוסף תגובה
```

דוקומנטציה מלאה זמינה ב- `http://localhost:4000/docs` (Swagger)

---

## 🎨 Features

✅ **Material-UI Design** - עיצוב מודרני וחונן
✅ **Real-time Search** - חיפוש מיידי
✅ **Multi-filter** - סינון מתקדם
✅ **Role-based UI** - ממשק מותאם לתפקיד
✅ **Loading States** - אינדיקטורים לטעינה
✅ **Error Handling** - הודעות שגיאה ברורות
✅ **Data Persistence** - שמירת נתונים עם caching

---

## 📁 מבנה הפרויקט

```
src/
├── pages/          # עמודים ראשיים
│   ├── login.tsx
│   ├── dashboard.tsx
│   ├── allTickets.tsx
│   ├── ticketDetails.tsx
│   ├── newTicket.tsx
│   └── layout.tsx
├── components/     # קומפוננטות חד-כוונות
│   ├── ticket.tsx
│   ├── commentsList.tsx
│   ├── addComment.tsx
│   ├── changStatus.tsx
│   ├── changePriority.tsx
│   ├── toAgent.tsx
│   ├── searchTickets.tsx
│   └── ...
├── store/          # MobX stores
│   ├── auth.store.ts
│   ├── tickets.store.ts
│   ├── status.store.ts
│   ├── priorities.store.ts
│   └── users.store.ts
├── services/       # API calls
│   └── api.service.ts
├── models/         # TypeScript interfaces
└── App.tsx
```

---

## 🔧 Build & Deploy

```bash
# Production build
npm run build

# Preview build
npm run preview
```

---

## 📝 Notes

- ⚠️ השרת צריך להיות רץ ב-`http://localhost:4000`
- 🔐 Token מאוחסן ב-localStorage בצורה מאובטחת
- 🚀 הפרויקט משתמש ב-Vite לביצועים מהירים
- 📦 Code splitting עם Material-UI bundle נפרד

---

## 👨‍💻 Development

```bash
# Run dev server with HMR
npm run dev

# Check TypeScript
npm run type-check

# Build for production
npm run build
```

---

## 📄 License

This project is created for educational purposes.
