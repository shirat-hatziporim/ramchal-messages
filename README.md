# מערכת ניהול הודעות | בית כנסת הרמח"ל מיצד

## הגדרה ב-GitHub Pages (5 דקות)

### שלב 1 — יצירת Repository
1. כנס ל-github.com והתחבר
2. לחץ **New repository**
3. שם: `ramchal-messages` (או כל שם)
4. סמן **Public**
5. לחץ **Create repository**

### שלב 2 — העלאת הקבצים
1. בדף ה-Repository לחץ **Add file → Upload files**
2. גרור את הקובץ `index.html`
3. לחץ **Commit changes**

### שלב 3 — הפעלת GitHub Pages
1. לחץ **Settings** (בתפריט ה-Repository)
2. גלול ל-**Pages** בתפריט הצד
3. תחת **Source** בחר: `main` branch, `/ (root)`
4. לחץ **Save**
5. המערכת תהיה זמינה בכתובת:
   `https://[שם-המשתמש-שלך].github.io/ramchal-messages`

---

## חיבור ל-Apps Script (אופציונלי)

לשליחת מיילים ישירות מהאתר:

1. ב-Apps Script פתח את הפרויקט `זמני שבת - הרמח"ל`
2. לחץ **Deploy → New deployment**
3. סוג: **Web app**
4. Execute as: **Me**
5. Who has access: **Anyone**
6. לחץ **Deploy** והעתק את ה-URL
7. במערכת הניהול → **הגדרות** → הדבק את ה-URL בשדה **Web App URL**

---

## תכונות המערכת

- **לוח בקרה** — סקירה כללית וסטטיסטיקות
- **זמני שבת** — חישוב אוטומטי + שליחה
- **הודעה חופשית** — לחגים, אירועים, עדכונים
- **היסטוריה** — כל ההודעות ששנשלחו
- **הגדרות** — שינוי פרמטרים

כל הנתונים נשמרים בדפדפן (localStorage).
