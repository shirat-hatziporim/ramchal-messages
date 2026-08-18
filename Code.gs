// ============================================================
//  מערכת זמני שבת אוטומטית | בית כנסת הרמח"ל מיצד
//  Google Apps Script - קובץ ראשי
//  גרסה 2.1 | תשפ"ו
// ============================================================

// ==================== הגדרות ====================
const CONFIG = {
  EMAIL_TO: "metzad-chevra@googlegroups.com",
  EMAIL_SUBJECT_PREFIX: "זמני תפילות לשבת פרשת",
  SHUL_NAME: 'בית כנסת הרמח"ל מיצד',
  LAT: 31.6219,
  LNG: 35.1469,
  MINCHA_BEFORE_SHKIA_MIN: 20,
  MAARIV_AFTER_SHKIA_MIN: 35,
  SHACHARIT_BEFORE_SOF_KRIA_MIN: 40,
  SHACHARIT_LATEST: "08:40",
  AVOT_BANIM_BEFORE_MINCHA_MIN: 40,
  MINCHA_SHABBAT_BEFORE_SHKIA_MIN: 40,
  MAARIV_MOTZASH_AFTER_TZET_MIN: 10,
};

// ==================== בלאנק רשמי (2 חלקים) ====================
// TOP = לוגו עליון | BOT = פוטר תחתון. האמצע (לבן) נמתח לפי אורך התוכן.
const TOP_B64 = "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";
const BOT_B64 = "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";


// ==================== פונקציה ראשית ====================
function sendWeeklyZmanim() {
  try {
    const zmanim = getZmanimForShabbat();
    if (!zmanim) { Logger.log("לא נמצאו זמנים"); return; }

    const parasha = getParasha(zmanim.shabbatDate);

    if (isHolidayWeekend(zmanim.shabbatDate)) {
      Logger.log("חג השבוע - לא שולח אוטומטי");
      notifyGabbai(zmanim.shabbatDate, parasha);
      return;
    }

    const plainMsg = buildPlainMessage(zmanim, parasha);
    sendEmail(plainMsg, parasha, zmanim);
    saveWhatsappMessage(plainMsg);
    Logger.log("✅ נשלח בהצלחה!");

  } catch (e) {
    Logger.log("❌ שגיאה: " + e.toString());
    GmailApp.sendEmail(Session.getActiveUser().getEmail(),
      "⚠️ שגיאה במערכת זמני שבת", "שגיאה: " + e.toString());
  }
}

// ==================== שליפת זמנים ====================
function getZmanimForShabbat() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilShabbat = (6 - dayOfWeek + 7) % 7 || 7;
  const shabbatDate = new Date(today);
  shabbatDate.setDate(today.getDate() + daysUntilShabbat);

  const dateStr = Utilities.formatDate(shabbatDate, "Asia/Jerusalem", "yyyy-MM-dd");
  const url = `https://www.hebcal.com/zmanim?cfg=json&latitude=${CONFIG.LAT}&longitude=${CONFIG.LNG}&tzid=Asia/Jerusalem&date=${dateStr}&sec=1&elevation=900&ue=on`;

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());
  if (!data || !data.times) throw new Error("שגיאה בשליפת זמנים");

  const times = data.times;
  const shkia        = subtractMinutes(parseTime(times.sunset), 1);
  const tzet         = parseTime(times.tzeit85deg || times.nightfall);
  const sofZmanKsh   = parseTime(times.sofZmanShma);
  const mincha       = subtractMinutes(shkia, CONFIG.MINCHA_BEFORE_SHKIA_MIN);
  const maarivLeil   = addMinutes(shkia, CONFIG.MAARIV_AFTER_SHKIA_MIN);
  let shacharit      = subtractMinutes(sofZmanKsh, CONFIG.SHACHARIT_BEFORE_SOF_KRIA_MIN);
  // חסם: שחרית לא מאוחרת מ-CONFIG.SHACHARIT_LATEST
  const shacharitCapped = toMinutes(shacharit) > toMinutes(CONFIG.SHACHARIT_LATEST);
  if (shacharitCapped) shacharit = CONFIG.SHACHARIT_LATEST;
  const minchaShab   = subtractMinutes(shkia, CONFIG.MINCHA_SHABBAT_BEFORE_SHKIA_MIN);
  const avotBanim    = subtractMinutes(minchaShab, CONFIG.AVOT_BANIM_BEFORE_MINCHA_MIN);
  const maarivMotzash = addMinutes(tzet, CONFIG.MAARIV_MOTZASH_AFTER_TZET_MIN);

  return { shabbatDate, shkia, tzet, sofZmanKsh,
           mincha, maarivLeil, shacharit, minchaShab, avotBanim, maarivMotzash,
           shacharitCapped };
}

// ==================== הודעת טקסט לוואטסאפ ====================
function buildPlainMessage(z, parasha) {
  var msg = "*זמני תפילות לשבת פרשת " + parasha + "*\n"
    + CONFIG.SHUL_NAME + "\n"
    + "----------------------------\n"
    + "\n"
    + "מנחה: *" + z.mincha + "* (20 דק' לפני השקיעה)\n"
    + "שקיעה: *" + z.shkia + "*\n"
    + "קבלת שבת בנעימה\n"
    + "מעריב ליל שבת: *" + z.maarivLeil + "* (35 דק' אחרי השקיעה)\n"
    + "\n"
    + "שחרית: *" + z.shacharit + "*"
    + (z.shacharitCapped ? "" : " (" + CONFIG.SHACHARIT_BEFORE_SOF_KRIA_MIN + " דק' לפני סוף זמן ק\"ש)") + "\n"
    + "סוף זמן ק\"ש (גר\"א): *" + z.sofZmanKsh + "*\n"
    + "קידושא רבא לאחר התפילה\n"
    + "\n"
    + "אבות ובנים: *" + z.avotBanim + "* (40 דק' לפני מנחה)\n"
    + "מנחה של שבת: *" + z.minchaShab + "* (40 דק' לפני השקיעה)\n"
    + "מעריב מוצאי שבת: *" + z.maarivMotzash + "* (10 דק' אחרי צאת שבת)\n"
    + "----------------------------\n"
    + "שבת שלום ומבורך!";
  return msg;
}

// ==================== שליחת מייל ====================
function sendEmail(plainMsg, parasha, z) {
  const subject = `${CONFIG.EMAIL_SUBJECT_PREFIX} ${parasha} | ${CONFIG.SHUL_NAME}`;
  GmailApp.sendEmail(CONFIG.EMAIL_TO, subject, plainMsg, {
    htmlBody: buildHtmlEmail(z, parasha),
    name: CONFIG.SHUL_NAME,
  });
  Logger.log("📧 מייל נשלח ל: " + CONFIG.EMAIL_TO);
}

// ==================== שמירת וואטסאפ ====================
function saveWhatsappMessage(message) {
  const docTitle = "הודעת וואטסאפ - זמני שבת";
  const files = DriveApp.getFilesByName(docTitle);
  let doc = files.hasNext()
    ? DocumentApp.openById(files.next().getId())
    : DocumentApp.create(docTitle);
  doc.getBody().clear().setText(message);
  doc.saveAndClose();

  GmailApp.sendEmail(
    Session.getActiveUser().getEmail(),
    "הודעת וואטסאפ מוכנה לשליחה",
    "העתק ושלח לקבוצה:\n\n━━━━━━━━━━━━━━━━\n" + message +
    "\n━━━━━━━━━━━━━━━━\n\nקישור לדוקומנט: " + doc.getUrl()
  );
}

// ==================== בדיקת חג ====================
function isHolidayWeekend(shabbatDate) {
  const friday = new Date(shabbatDate); friday.setDate(shabbatDate.getDate() - 1);
  const sunday = new Date(shabbatDate); sunday.setDate(shabbatDate.getDate() + 1);
  return checkIfHoliday(friday) || checkIfHoliday(sunday);
}

function checkIfHoliday(date) {
  const dateStr = Utilities.formatDate(date, "Asia/Jerusalem", "yyyy-MM-dd");
  const url = `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&min=off&mod=off&nx=off&year=${date.getFullYear()}&month=${date.getMonth()+1}&ss=off&mf=off&c=off&geo=none&m=0&s=on`;
  try {
    const data = JSON.parse(UrlFetchApp.fetch(url).getContentText());
    return (data.items || []).some(i => i.date === dateStr && i.category === "holiday" && i.yomtov === true);
  } catch(e) { return false; }
}

function notifyGabbai(shabbatDate, parasha) {
  const dateStr = Utilities.formatDate(shabbatDate, "Asia/Jerusalem", "dd/MM/yyyy");
  GmailApp.sendEmail(Session.getActiveUser().getEmail(),
    "⚠️ השבוע חל חג - יש לשלוח ידנית",
    `שלום!\n\nהשבוע (${dateStr}) חל חג ביום שישי או ראשון.\nיש לשלוח ידנית עבור פרשת ${parasha} כולל זמני החג.`);
}

// ==================== שליפת פרשה ====================
function getParasha(date) {
  const dateStr = Utilities.formatDate(date, "Asia/Jerusalem", "yyyy-MM-dd");

  // שיטה 1: endpoint shabbat — מחזיר hebrew ישירות
  try {
    const url1 = `https://www.hebcal.com/shabbat?cfg=json&latitude=${CONFIG.LAT}&longitude=${CONFIG.LNG}&tzid=Asia/Jerusalem&m=0`;
    const data1 = JSON.parse(UrlFetchApp.fetch(url1).getContentText());
    const p1 = (data1.items || []).find(i => i.category === "parashat");
    if (p1) {
      Logger.log('פרשה נמצאה (shabbat API): title=' + p1.title + ' hebrew=' + (p1.hebrew || ''));
      if (p1.hebrew) {
        return p1.hebrew.replace(/^פרשת\s+/, '').trim();
      }
      return translateParasha(p1.title);
    }
  } catch(e) {
    Logger.log('שגיאה ב-shabbat API: ' + e.toString());
  }

  // שיטה 2: endpoint hebcal לפי חודש
  try {
    const url2 = `https://www.hebcal.com/hebcal?v=1&cfg=json&maj=off&min=off&mod=off&nx=off&year=${date.getFullYear()}&month=${date.getMonth()+1}&ss=off&mf=off&c=off&geo=none&m=0&s=on&F=on`;
    const data2 = JSON.parse(UrlFetchApp.fetch(url2).getContentText());
    const p2 = (data2.items || []).find(i => i.date === dateStr && i.category === "parashat");
    if (p2) {
      if (p2.hebrew) return p2.hebrew.replace(/^פרשת\s+/, '').trim();
      return translateParasha(p2.title);
    }
  } catch(e) {}

  return "השבוע";
}

// ==================== עזר ====================
function parseTime(isoString) {
  if (!isoString) return "--:--";
  const d = new Date(isoString);
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
}

function addMinutes(t, m) {
  if (t === "--:--") return "--:--";
  const [h, min] = t.split(':').map(Number);
  const total = h * 60 + min + m;
  return `${Math.floor((total/60)%24).toString().padStart(2,'0')}:${(total%60).toString().padStart(2,'0')}`;
}

function subtractMinutes(t, m) { return addMinutes(t, -m); }

// המרת "HH:MM" למספר דקות מחצות — להשוואת שעות
function toMinutes(t) {
  if (!t || t === "--:--") return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function getHebrewDate(date) {
  try {
    const url = `https://www.hebcal.com/converter?cfg=json&gy=${date.getFullYear()}&gm=${date.getMonth()+1}&gd=${date.getDate()}&g2h=1`;
    return JSON.parse(UrlFetchApp.fetch(url).getContentText()).hebrew || "";
  } catch(e) { return ""; }
}

// ==================== תרגום פרשה (מילון מלא) ====================
function translateParasha(n) {
  if (!n) return '';
  n = n.replace(/^Parashat\s+/i, '').trim();
  const t = {
    "Bereshit":"בראשית","Noach":"נח","Lech-Lecha":"לך לך","Lech Lecha":"לך לך","Vayera":"וירא",
    "Chayei Sara":"חיי שרה","Toldot":"תולדות","Vayetzei":"ויצא","Vayishlach":"וישלח",
    "Vayeshev":"וישב","Miketz":"מקץ","Vayigash":"ויגש","Vayechi":"ויחי",
    "Shemot":"שמות","Vaera":"וארא","Bo":"בא","Beshalach":"בשלח",
    "Yitro":"יתרו","Mishpatim":"משפטים","Terumah":"תרומה","Tetzaveh":"תצוה",
    "Ki Tisa":"כי תשא","Vayakhel":"ויקהל","Pekudei":"פקודי","Vayakhel-Pekudei":"ויקהל-פקודי",
    "Vayikra":"ויקרא","Tzav":"צו","Shmini":"שמיני","Tazria":"תזריע",
    "Metzora":"מצורע","Tazria-Metzora":"תזריע-מצורע","Achrei Mot":"אחרי מות",
    "Kedoshim":"קדושים","Achrei Mot-Kedoshim":"אחרי מות-קדושים","Emor":"אמור",
    "Behar":"בהר","Bechukotai":"בחוקותי","Behar-Bechukotai":"בהר-בחוקותי",
    "Bamidbar":"במדבר","Nasso":"נשא","Naso":"נשא",
    "Beha'alotcha":"בהעלותך","Behaalotcha":"בהעלותך",
    "Sh'lach":"שלח לך","Shelach":"שלח לך","Shlach":"שלח לך",
    "Korach":"קרח","Chukat":"חקת","Chukkat":"חקת","Balak":"בלק","Pinchas":"פינחס",
    "Matot":"מטות","Masei":"מסעי","Matot-Masei":"מטות-מסעי","Devarim":"דברים",
    "Vaetchanan":"ואתחנן","Eikev":"עקב","Re'eh":"ראה","Reeh":"ראה","Shoftim":"שופטים",
    "Ki Teitzei":"כי תצא","Ki Tavo":"כי תבוא","Nitzavim":"נצבים",
    "Vayeilech":"וילך","Nitzavim-Vayeilech":"נצבים-וילך","Ha'Azinu":"האזינו","Haazinu":"האזינו",
    "Vezot Haberakhah":"וזאת הברכה","Vzot Haberakhah":"וזאת הברכה"
  };
  if (t[n]) return t[n];
  for (const [e, h] of Object.entries(t)) {
    if (n.toLowerCase() === e.toLowerCase()) return h;
    if (n.includes(e) || e.includes(n)) return h;
  }
  return n;
}

// ==================== טריגר + בדיקה ====================
function setupWeeklyTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'sendWeeklyZmanim') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('sendWeeklyZmanim')
    .timeBased().onWeekDay(ScriptApp.WeekDay.THURSDAY).atHour(19).nearMinute(0).create();
  Logger.log("✅ טריגר הוגדר! כל יום חמישי 19:00");
}

function testRun() {
  Logger.log("🧪 מריץ בדיקה...");
  sendWeeklyZmanim();
}


// ==================== WEB APP - שליחה ידנית מהאתר ====================
function doGet(e) {
  const action = e.parameter.action || '';
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    // ניתוב פעולות מתפללים/חובות (getMembers, saveMember, deleteMember, saveLedger, deleteLedger)
    var _membersRes = handleMembersAction(e, output);
    if (_membersRes) return _membersRes;

    if (action === 'getData') {
      var data = syncGetData();
      var json = JSON.stringify({ ok: true, data: data });
      var callback = e.parameter.callback;
      if (callback) {
        output.setMimeType(ContentService.MimeType.JAVASCRIPT);
        output.setContent(callback + '(' + json + ')');
      } else {
        output.setContent(json);
      }
      return output;
    }

    if (action === 'saveHistory') {
      var entryStr = decodeURIComponent(e.parameter.entry || '{}');
      var entry = JSON.parse(entryStr);
      syncSaveHistory(entry);
      output.setContent(JSON.stringify({ ok: true }));
      return output;
    }

    if (action === 'saveTemplates') {
      var tmplStr = decodeURIComponent(e.parameter.templates || '[]');
      var templates = JSON.parse(tmplStr);
      syncSaveTemplates(templates);
      output.setContent(JSON.stringify({ ok: true }));
      return output;
    }

    if (action === 'test') {
      output.setContent(JSON.stringify({ ok: true, message: 'חיבור תקין!' }));
      return output;
    }

    if (action === 'send') {
      const subject = decodeURIComponent(e.parameter.subject || 'הודעה מבית הכנסת');
      var body      = decodeURIComponent(e.parameter.body || '');
      const mode    = e.parameter.mode || 'test';

      var parasha = e.parameter.parasha ? decodeURIComponent(e.parameter.parasha) : '';

      if (parasha && parasha !== '[פרשה]' && parasha !== 'השבוע') {
        parasha = translateParasha(parasha);
      }

      if (!parasha || parasha === '[פרשה]' || parasha === 'השבוע') {
        try {
          var today = new Date();
          var dow = today.getDay();
          var daysUntilSat = (6 - dow + 7) % 7 || 7;
          var shabbat = new Date(today);
          shabbat.setDate(today.getDate() + daysUntilSat);
          var dateStr = Utilities.formatDate(shabbat, "Asia/Jerusalem", "yyyy-MM-dd");
          var parts = dateStr.split('-');
          var pUrl = "https://www.hebcal.com/hebcal?v=1&cfg=json&maj=off&min=off&F=on&year=" + parts[0] + "&month=" + parts[1] + "&ss=off&mf=off&c=off&geo=none&m=0&s=on";
          var pResp = UrlFetchApp.fetch(pUrl);
          var pData = JSON.parse(pResp.getContentText());
          var pItems = pData.items || [];
          for (var pi = 0; pi < pItems.length; pi++) {
            if (pItems[pi].date === dateStr && pItems[pi].category === 'parashat') {
              var pItem = pItems[pi];
              if (pItem.hebrew) {
                parasha = pItem.hebrew.replace(/^פרשת\s+/, '').trim();
              } else {
                parasha = translateParasha(pItem.title);
              }
              break;
            }
          }
        } catch(pe) {
          Logger.log('שגיאה בשליפת פרשה: ' + pe.toString());
        }
      }

      Logger.log('פרשה סופית: ' + parasha);

      if (parasha && parasha !== '[פרשה]') {
        body = body.replace('[פרשה]', parasha);
      }

      if (!body) {
        output.setContent(JSON.stringify({ ok: false, message: 'אין תוכן להודעה' }));
        return output;
      }

      const emailTo = (mode === 'prod') ? 'metzad-chevra@googlegroups.com' : '4103353@gmail.com';

      var finalSubject = subject;
      if (parasha && parasha !== '[פרשה]') {
        finalSubject = subject
          .replace('[פרשה]', parasha)
          .replace('השבוע', parasha);
        finalSubject = finalSubject.replace(/פרשת\s+([A-Za-z''\-]+)\s*\|/, 'פרשת ' + parasha + ' |');
      }

      const htmlBody = buildHtmlEmailFromText(body, finalSubject);

      GmailApp.sendEmail(emailTo, finalSubject, body, {
        htmlBody: htmlBody,
        name: CONFIG.SHUL_NAME,
      });

      Logger.log('📧 נשלח ידנית מהאתר ל-' + emailTo + ': ' + finalSubject);
      output.setContent(JSON.stringify({ ok: true, message: 'המייל נשלח בהצלחה!' }));
      return output;
    }

    if (action === 'setMode') {
      Logger.log('מצב עודכן: ' + e.parameter.mode);
      output.setContent(JSON.stringify({ ok: true }));
      return output;
    }

    if (action === 'zmanim') {
      const zmanim = getZmanimForShabbat();
      const parasha = decodeURIComponent(e.parameter.parasha || 'השבוע');
      const plainMsg = buildPlainMessage(zmanim, parasha);
      sendEmail(plainMsg, parasha, zmanim);
      output.setContent(JSON.stringify({ ok: true, message: 'זמני שבת נשלחו בהצלחה!' }));
      return output;
    }

    output.setContent(JSON.stringify({ ok: false, message: 'פעולה לא מוכרת' }));
    return output;

  } catch(err) {
    Logger.log('שגיאה ב-doGet: ' + err.toString());
    output.setContent(JSON.stringify({ ok: false, message: err.toString() }));
    return output;
  }
}

// ==================== מייל HTML אוטומטי (שבת) ====================
function buildHtmlEmail(z, parasha) {
  var rowsHtml = ''
    + '<tr><td style="font-size:13px;color:#333;padding:5px 2px;border-bottom:1px dotted #ccc;">מנחה<br><span style="font-size:10px;color:#aaa;">20 דק\' לפני השקיעה</span></td>'
    + '<td style="font-size:16px;font-weight:bold;color:#1a3a5c;text-align:center;direction:ltr;width:60px;border-bottom:1px dotted #ccc;">' + z.mincha + '</td></tr>'
    + '<tr><td style="font-size:13px;color:#333;padding:5px 2px;border-bottom:1px dotted #ccc;">שקיעה</td>'
    + '<td style="font-size:16px;font-weight:bold;color:#1a3a5c;text-align:center;direction:ltr;border-bottom:1px dotted #ccc;">' + z.shkia + '</td></tr>'
    + '<tr><td colspan="2" style="text-align:center;font-size:12px;color:#888;font-style:italic;padding:5px 0;border-bottom:1px dotted #ccc;">- קבלת שבת בנעימה -</td></tr>'
    + '<tr><td style="font-size:13px;color:#333;padding:5px 2px;border-bottom:1px dotted #ccc;">מעריב ליל שבת<br><span style="font-size:10px;color:#aaa;">35 דק\' אחרי השקיעה</span></td>'
    + '<td style="font-size:16px;font-weight:bold;color:#1a3a5c;text-align:center;direction:ltr;border-bottom:1px dotted #ccc;">' + z.maarivLeil + '</td></tr>'
    + '<tr><td style="font-size:13px;color:#333;padding:5px 2px;border-bottom:1px dotted #ccc;">שחרית'
    + (z.shacharitCapped ? '' : '<br><span style="font-size:10px;color:#aaa;">' + CONFIG.SHACHARIT_BEFORE_SOF_KRIA_MIN + ' דק\' לפני סוף זמן ק"ש</span>') + '</td>'
    + '<td style="font-size:16px;font-weight:bold;color:#1a3a5c;text-align:center;direction:ltr;border-bottom:1px dotted #ccc;">' + z.shacharit + '</td></tr>'
    + '<tr><td style="font-size:13px;color:#333;padding:5px 2px;border-bottom:1px dotted #ccc;">סוף זמן ק"ש (גר"א)</td>'
    + '<td style="font-size:16px;font-weight:bold;color:#1a3a5c;text-align:center;direction:ltr;border-bottom:1px dotted #ccc;">' + z.sofZmanKsh + '</td></tr>'
    + '<tr><td colspan="2" style="text-align:center;font-size:12px;color:#888;font-style:italic;padding:5px 0;border-bottom:1px dotted #ccc;">- קידושא רבא לאחר התפילה -</td></tr>'
    + '<tr><td style="font-size:13px;color:#333;padding:5px 2px;border-bottom:1px dotted #ccc;">אבות ובנים<br><span style="font-size:10px;color:#aaa;">40 דק\' לפני מנחה</span></td>'
    + '<td style="font-size:16px;font-weight:bold;color:#1a3a5c;text-align:center;direction:ltr;border-bottom:1px dotted #ccc;">' + z.avotBanim + '</td></tr>'
    + '<tr><td style="font-size:13px;color:#333;padding:5px 2px;border-bottom:1px dotted #ccc;">מנחה של שבת<br><span style="font-size:10px;color:#aaa;">40 דק\' לפני השקיעה</span></td>'
    + '<td style="font-size:16px;font-weight:bold;color:#1a3a5c;text-align:center;direction:ltr;border-bottom:1px dotted #ccc;">' + z.minchaShab + '</td></tr>'
    + '<tr><td style="font-size:13px;color:#333;padding:5px 2px;">מעריב מוצאי שבת<br><span style="font-size:10px;color:#aaa;">10 דק\' אחרי צאת שבת</span></td>'
    + '<td style="font-size:16px;font-weight:bold;color:#1a3a5c;text-align:center;direction:ltr;">' + z.maarivMotzash + '</td></tr>';

  var innerContent = ''
    + '<div style="text-align:center;padding-bottom:10px;">'
    + '<div style="font-size:14px;font-weight:bold;color:#444;margin-bottom:4px;">זמני תפילות לשבת</div>'
    + '<div style="font-size:22px;font-weight:bold;color:#1a3a5c;">פרשת ' + parasha + '</div>'
    + '</div>'
    + '<div style="border-top:1.5px solid #bbb;margin-bottom:8px;"></div>'
    + '<table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">'
    + rowsHtml
    + '</table>'
    + '<div style="border-top:1.5px solid #bbb;margin-top:12px;padding-top:10px;text-align:center;font-size:16px;font-weight:bold;color:#1a3a5c;">שבת שלום ומבורך</div>';

  return buildBlankPage(innerContent);
}

// ==================== מייל HTML מטקסט חופשי ====================
function buildHtmlEmailFromText(body, subject) {
  var cleanBody = body.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  var bodyLines = cleanBody.split("\n");
  var startIdx = 0;
  for (var bi = 0; bi < Math.min(5, bodyLines.length); bi++) {
    if (bodyLines[bi].match(/^[-]{3,}$/)) { startIdx = bi + 1; break; }
  }
  var workLines = bodyLines.slice(startIdx);

  var rows = workLines.map(function(l) {
    if (l.match(/^[-]{3,}$/)) {
      return '<tr><td colspan="2" style="border-top:1px solid #ddd;padding:3px 0;font-size:0;">&nbsp;</td></tr>';
    }
    if (l.trim() === '') {
      return '<tr><td colspan="2" style="padding:2px 0;font-size:5px;">&nbsp;</td></tr>';
    }
    var t = l.trim();
    if (t.length > 6 && t.substring(0,3) === '===' && t.substring(t.length-3) === '===') {
      var dayTitle = t.substring(3, t.length - 3).trim();
      return '<tr><td colspan="2" style="padding:12px 0 4px 0;text-align:center;">'
        + '<span style="color:#1a3a5c;font-size:13px;font-weight:bold;">' + dayTitle + '</span>'
        + '</td></tr>';
    }
    var timeMatch = l.match(/^(.+?):\s*(\d{1,2}:\d{2})\s*(.*)$/);
    if (timeMatch) {
      var label = timeMatch[1];
      var time  = timeMatch[2];
      var note  = timeMatch[3] ? timeMatch[3].replace(/^\(|\)$/g, '') : '';
      return '<tr>'
        + '<td style="font-size:13px;color:#333;padding:4px 2px;direction:rtl;text-align:right;border-bottom:1px dotted #ddd;">'
        + label
        + (note ? '<br><span style="font-size:10px;color:#aaa;">' + note + '</span>' : '')
        + '</td>'
        + '<td style="font-size:15px;font-weight:bold;color:#1a3a5c;text-align:center;direction:ltr;width:60px;border-bottom:1px dotted #ddd;">'
        + time + '</td></tr>';
    }
    if (t.length > 4 && t.charAt(0) === '~' && t.charAt(t.length-1) === '~') {
      var noteText = t.substring(1, t.length-1).trim();
      return '<tr><td colspan="2" style="background:#f5f0e8;border-right:3px solid #c9a84c;padding:8px 12px;font-size:13px;color:#333;direction:rtl;text-align:right;">'
        + noteText + '</td></tr>';
    }
    return '<tr><td colspan="2" style="font-size:13px;color:#555;padding:4px 2px;direction:rtl;text-align:center;font-style:italic;">' + l + '</td></tr>';
  }).join("");

  var innerContent = ''
    + '<div style="font-size:16px;font-weight:bold;color:#1a3a5c;text-align:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1.5px solid #bbb;">' + subject + '</div>'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">'
    + rows
    + '</table>';

  return buildBlankPage(innerContent);
}

// ==================== מעטפת בלאנק 2 חלקים (משותף) ====================
// TOP נצמד למעלה, התוכן באמצע (לבן, נמתח לפי האורך), BOT נצמד למטה.
// כך תוכן ארוך לא גולש על העיצוב — הדף פשוט מתארך.
function buildBlankPage(innerContent) {
  return '<!DOCTYPE html>'
    + '<html dir="rtl" lang="he"><head><meta charset="UTF-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1.0">'
    + '<style>'
    +   'body{margin:0;padding:0;}'
    +   '.wrap{width:100%;max-width:600px;margin:0 auto;background:#ffffff;box-shadow:0 6px 24px rgba(0,0,0,0.18);}'
    +   '.wrap img{display:block;width:100%;height:auto;}'
    +   '.content{padding:8px 30px 16px 30px;direction:rtl;}'
    +   '@media only screen and (max-width:480px){.content{padding:8px 16px 14px 16px;}}'
    + '</style></head>'
    + '<body style="margin:0;padding:0;background:#e6e6e6;font-family:Arial,sans-serif;direction:rtl;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e6e6e6;padding:16px 0;">'
    + '<tr><td align="center" style="padding:0 8px;">'
    + '<table class="wrap" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;box-shadow:0 6px 24px rgba(0,0,0,0.18);">'
    // חלק עליון - לוגו
    + '<tr><td style="padding:0;margin:0;line-height:1;">'
    +   '<img src="data:image/jpeg;base64,' + TOP_B64 + '" width="600" alt="בית מדרש הרמח\'\'ל מיצד" style="display:block;width:100%;height:auto;border:0;outline:none;text-decoration:none;">'
    + '</td></tr>'
    // אמצע - תוכן על רקע לבן (נמתח)
    + '<tr><td class="content" style="background:#ffffff;padding:8px 30px 16px 30px;direction:rtl;">'
    +   innerContent
    + '</td></tr>'
    // חלק תחתון - פוטר
    + '<tr><td style="padding:0;margin:0;line-height:1;">'
    +   '<img src="data:image/jpeg;base64,' + BOT_B64 + '" width="600" alt="בית מדרש הרמח\'\'ל קהילת קודש מיצד" style="display:block;width:100%;height:auto;border:0;outline:none;text-decoration:none;">'
    + '</td></tr>'
    + '</table>'
    + '</td></tr></table></body></html>';
}

// ==================== סנכרון נתונים ====================
function getOrCreateSyncSheet() {
  var sheetName = 'RamchalSync';
  var files = DriveApp.getFilesByName(sheetName);
  var ss;
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create(sheetName);
    var hist = ss.getActiveSheet();
    hist.setName('history');
    hist.appendRow(['id','date','subject','msg','channel','type']);
    var tmpl = ss.insertSheet('templates');
    tmpl.appendRow(['name','subj','msg']);
    Logger.log('Sheet נוצר: ' + ss.getUrl());
  }
  return ss;
}

function syncGetData() {
  var ss = getOrCreateSyncSheet();
  var histSheet = ss.getSheetByName('history');
  var histData = histSheet.getDataRange().getValues();
  var history = [];
  for (var i = 1; i < histData.length; i++) {
    if (histData[i][0]) {
      history.push({
        id: histData[i][0],
        date: histData[i][1],
        subject: histData[i][2],
        msg: histData[i][3],
        channel: histData[i][4],
        type: histData[i][5]
      });
    }
  }
  var tmplSheet = ss.getSheetByName('templates');
  var tmplData = tmplSheet.getDataRange().getValues();
  var templates = [];
  for (var j = 1; j < tmplData.length; j++) {
    if (tmplData[j][0]) {
      templates.push({ name: tmplData[j][0], subj: tmplData[j][1], msg: tmplData[j][2] });
    }
  }
  return { history: history, templates: templates };
}

function syncSaveHistory(entry) {
  var ss = getOrCreateSyncSheet();
  var sheet = ss.getSheetByName('history');
  sheet.appendRow([entry.id, entry.date, entry.subject, entry.msg, entry.channel, entry.type]);
}

function syncSaveTemplates(templates) {
  var ss = getOrCreateSyncSheet();
  var sheet = ss.getSheetByName('templates');
  sheet.clearContents();
  sheet.appendRow(['name','subj','msg']);
  for (var i = 0; i < templates.length; i++) {
    sheet.appendRow([templates[i].name, templates[i].subj || '', templates[i].msg]);
  }
}

// ============================================================
// ==================== מתפללים וחובות ========================
// ============================================================
// נוסף 18.8.2026 — גיליונות 'members' ו-'ledger' בתוך RamchalSync.
// כל הפעולות נגישות דרך doGet (ראו handleMembersAction).

function getMembersSheets() {
  var ss = getOrCreateSyncSheet();

  var mem = ss.getSheetByName('members');
  if (!mem) {
    mem = ss.insertSheet('members');
    mem.appendRow(['id','last','first','father','yichus','phone','email','address','notes','active']);
    mem.getRange('A:A').setNumberFormat('@');
    mem.getRange('F:F').setNumberFormat('@');
  }

  var led = ss.getSheetByName('ledger');
  if (!led) {
    led = ss.insertSheet('ledger');
    led.appendRow(['id','memberId','date','type','amount','desc']);
    led.getRange('A:B').setNumberFormat('@');
    led.getRange('C:C').setNumberFormat('@');
  }

  var hh = ss.getSheetByName('hh');
  if (!hh) {
    hh = ss.insertSheet('hh');
    hh.appendRow(['id','year','memberId','name','rhMen','rhWomen','ykMen','ykWomen','fee','chargeId','notes']);
    hh.getRange('A:D').setNumberFormat('@');
    hh.getRange('J:J').setNumberFormat('@');
  }

  return { members: mem, ledger: led, hh: hh };
}

// תאריך מהגיליון → "YYYY-MM-DD" (Sheets עלול להמיר מחרוזת ל-Date)
function normalizeSheetDate(v) {
  if (!v) return '';
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return Utilities.formatDate(v, "Asia/Jerusalem", "yyyy-MM-dd");
  }
  return String(v);
}

function membersGetAll() {
  var sh = getMembersSheets();

  var md = sh.members.getDataRange().getValues();
  var members = [];
  for (var i = 1; i < md.length; i++) {
    if (!md[i][0]) continue;
    members.push({
      id: String(md[i][0]), last: String(md[i][1] || ''), first: String(md[i][2] || ''),
      father: String(md[i][3] || ''), yichus: String(md[i][4] || ''), phone: String(md[i][5] || ''),
      email: String(md[i][6] || ''), address: String(md[i][7] || ''), notes: String(md[i][8] || ''),
      active: md[i][9] === false ? false : true
    });
  }

  var ld = sh.ledger.getDataRange().getValues();
  var ledger = [];
  for (var j = 1; j < ld.length; j++) {
    if (!ld[j][0]) continue;
    ledger.push({
      id: String(ld[j][0]), memberId: String(ld[j][1]),
      date: normalizeSheetDate(ld[j][2]), type: String(ld[j][3] || 'charge'),
      amount: Number(ld[j][4] || 0), desc: String(ld[j][5] || '')
    });
  }

  var hd = sh.hh.getDataRange().getValues();
  var hh = [];
  for (var k = 1; k < hd.length; k++) {
    if (!hd[k][0]) continue;
    hh.push({
      id: String(hd[k][0]), year: String(hd[k][1] || ''), memberId: String(hd[k][2] || ''),
      name: String(hd[k][3] || ''),
      rhMen: Number(hd[k][4] || 0), rhWomen: Number(hd[k][5] || 0),
      ykMen: Number(hd[k][6] || 0), ykWomen: Number(hd[k][7] || 0),
      fee: Number(hd[k][8] || 0), chargeId: String(hd[k][9] || ''), notes: String(hd[k][10] || '')
    });
  }

  return { members: members, ledger: ledger, hh: hh };
}

function membersUpsert(m) {
  if (!m || !m.id) return;
  var sh = getMembersSheets().members;
  var row = [String(m.id), m.last || '', m.first || '', m.father || '', m.yichus || '',
             String(m.phone || ''), m.email || '', m.address || '', m.notes || '',
             m.active === false ? false : true];
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(m.id)) {
      sh.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return;
    }
  }
  sh.appendRow(row);
}

function membersDelete(id) {
  if (!id) return;
  var sh = getMembersSheets();

  var data = sh.members.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]) === String(id)) sh.members.deleteRow(i + 1);
  }

  var ld = sh.ledger.getDataRange().getValues();
  for (var j = ld.length - 1; j >= 1; j--) {
    if (String(ld[j][1]) === String(id)) sh.ledger.deleteRow(j + 1);
  }
}

function ledgerUpsert(t) {
  if (!t || !t.id) return;
  var sh = getMembersSheets().ledger;
  var row = [String(t.id), String(t.memberId || ''), String(t.date || ''),
             String(t.type || 'charge'), Number(t.amount || 0), t.desc || ''];
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(t.id)) {
      sh.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return;
    }
  }
  sh.appendRow(row);
}

function ledgerDelete(id) {
  if (!id) return;
  var sh = getMembersSheets().ledger;
  var data = sh.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]) === String(id)) sh.ledger.deleteRow(i + 1);
  }
}

function hhUpsert(r) {
  if (!r || !r.id) return;
  var sh = getMembersSheets().hh;
  var row = [String(r.id), String(r.year || ''), String(r.memberId || ''), String(r.name || ''),
             Number(r.rhMen || 0), Number(r.rhWomen || 0), Number(r.ykMen || 0), Number(r.ykWomen || 0),
             Number(r.fee || 0), String(r.chargeId || ''), r.notes || ''];
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(r.id)) {
      sh.getRange(i + 1, 1, 1, row.length).setValues([row]);
      return;
    }
  }
  sh.appendRow(row);
}

function hhDelete(id) {
  if (!id) return;
  var sh = getMembersSheets().hh;
  var data = sh.getDataRange().getValues();
  for (var i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]) === String(id)) sh.deleteRow(i + 1);
  }
}

// סיכום מקומות לשנה — לשימוש ידני בעורך
function hhSummary(year) {
  var all = membersGetAll().hh.filter(function(r) { return !year || r.year === year; });
  var t = { count: all.length, rhMen: 0, rhWomen: 0, ykMen: 0, ykWomen: 0, fee: 0 };
  all.forEach(function(r) {
    t.rhMen += r.rhMen; t.rhWomen += r.rhWomen;
    t.ykMen += r.ykMen; t.ykWomen += r.ykWomen; t.fee += r.fee;
  });
  Logger.log(JSON.stringify(t));
  return t;
}

// יתרת חוב של מתפלל (חיובים פחות תשלומים)
function memberBalanceGs(id) {
  var all = membersGetAll();
  var bal = 0;
  all.ledger.forEach(function(t) {
    if (String(t.memberId) !== String(id)) return;
    bal += (t.type === 'payment' ? -Number(t.amount || 0) : Number(t.amount || 0));
  });
  return bal;
}

// ראוטר — מוחזר מ-doGet. מחזיר null אם ה-action אינו של מתפללים.
// ⚠ אין decodeURIComponent — Apps Script כבר מפענח את ה-query.
function handleMembersAction(e, output) {
  var action = e.parameter.action || '';

  if (action === 'getMembers') {
    var json = JSON.stringify({ ok: true, data: membersGetAll() });
    var cb = e.parameter.callback;
    if (cb) {
      output.setMimeType(ContentService.MimeType.JAVASCRIPT);
      output.setContent(cb + '(' + json + ')');
    } else {
      output.setContent(json);
    }
    return output;
  }

  if (action === 'saveMember') {
    membersUpsert(JSON.parse(e.parameter.entry || '{}'));
    output.setContent(JSON.stringify({ ok: true }));
    return output;
  }

  if (action === 'deleteMember') {
    membersDelete(e.parameter.id || '');
    output.setContent(JSON.stringify({ ok: true }));
    return output;
  }

  if (action === 'saveLedger') {
    ledgerUpsert(JSON.parse(e.parameter.entry || '{}'));
    output.setContent(JSON.stringify({ ok: true }));
    return output;
  }

  if (action === 'deleteLedger') {
    ledgerDelete(e.parameter.id || '');
    output.setContent(JSON.stringify({ ok: true }));
    return output;
  }

  if (action === 'saveHH') {
    hhUpsert(JSON.parse(e.parameter.entry || '{}'));
    output.setContent(JSON.stringify({ ok: true }));
    return output;
  }

  if (action === 'deleteHH') {
    hhDelete(e.parameter.id || '');
    output.setContent(JSON.stringify({ ok: true }));
    return output;
  }

  return null;
}
