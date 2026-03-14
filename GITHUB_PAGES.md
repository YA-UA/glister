# 🚀 Як розмістити сайт на GitHub Pages (БЕЗКОШТОВНО)

## ⚡ Швидкий спосіб (5 хвилин)

### Крок 1: Створіть акаунт GitHub

1. Перейдіть на https://github.com
2. Натисніть **Sign up** (Зареєструватися)
3. Заповніть форму:
   - Username (ім'я користувача): наприклад, `glister-ua`
   - Email: ваша пошта
   - Password: придумайте пароль
4. Підтвердіть email

---

### Крок 2: Створіть новий репозиторій

1. Після входу натисніть **"+"** → **New repository**
2. Заповніть:
   - **Repository name**: `glister` (або інша назва)
   - **Description**: `Glister - Зубна паста`
   - ✅ **Public** (обов'язково!)
   - ✅ Встановіть галочку **"Add a README file"**
3. Натисніть **"Create repository"**

---

### Крок 3: Завантажте файли сайту

#### Спосіб A: Через веб-інтерфейс (простіше)

1. У створеному репозиторії натисніть **"Add file"** → **"Upload files"**
2. Перетягніть всі файли проєкту:
   ```
   index.html
   robots.txt
   sitemap.xml
   📁 css/
      └── style.css
   📁 js/
      └── script.js
   📁 (всі .md файли - опціонально)
   ```
3. Напишіть коментар: `Додано сайт Glister`
4. Натисніть **"Commit changes"**

#### Спосіб B: Через Git (для досвідчених)

```bash
git clone https://github.com/username/glister.git
cd glister
# Скопіюйте всі файли сайту в цю папку
git add .
git commit -m "Додано сайт Glister"
git push
```

---

### Крок 4: Увімкніть GitHub Pages

1. У репозиторії перейдіть в **Settings** (Налаштування)
2. Прокрутіть до розділу **"Pages"** (ліва панель)
3. У **"Source"** виберіть:
   - **Branch**: `main` (або `master`)
   - **Folder**: `/ (root)`
4. Натисніть **"Save"**

**Готово!** Через 1-2 хвилини сайт буде доступний за адресою:
```
https://username.github.io/glister/
```

*(замініть `username` на ваше ім'я користувача GitHub)*

---

## 🌐 Підключення власного домену (опціонально)

### Якщо у вас є домен (наприклад, glister.com.ua):

1. У розділі **Settings → Pages**
2. У полі **"Custom domain"** введіть: `glister.com.ua`
3. Натисніть **"Save"**
4. У налаштуваннях вашого домену (де купили) додайте записи:
   ```
   Тип: A
   Хост: @
   Значення: 185.199.108.153
   
   Тип: A
   Хост: @
   Значення: 185.199.109.153
   
   Тип: A
   Хост: @
   Значення: 185.199.110.153
   
   Тип: A
   Хост: @
   Значення: 185.199.111.153
   
   Тип: CNAME
   Хост: www
   Значення: username.github.io
   ```
5. Почекайте 1-24 години (поширення DNS)

---

## ✅ Після розміщення

### Оновіть URL в файлах:

#### 1. В `index.html` (рядок 27):
```html
<meta property="og:url" content="https://username.github.io/glister/">
```

#### 2. В `index.html` (рядок 30):
```html
<link rel="canonical" href="https://username.github.io/glister/">
```

#### 3. В `robots.txt`:
```
Sitemap: https://username.github.io/glister/sitemap.xml
```

#### 4. В `sitemap.xml` (всі `<loc>` теги):
```xml
<loc>https://username.github.io/glister/</loc>
```

---

## 📝 Реєстрація в Google Search Console

### Крок 1: Перейдіть на Google Search Console

https://search.google.com/search-console

### Крок 2: Додайте сайт

1. Натисніть **"Додати ресурс"**
2. Виберіть **"Префікс URL"**
3. Введіть: `https://username.github.io/glister/`
4. Натисніть **"Продовжити"**

### Крок 3: Підтвердіть власність

**Спосіб 1: HTML файл (рекомендую для GitHub Pages)**

1. Завантажте файл підтвердження (наприклад, `google123456.html`)
2. Завантажте його в корінь репозиторію GitHub
3. Зачекайте 1-2 хвилини (GitHub оновить сайт)
4. Натисніть **"Підтвердити"**

**Спосіб 2: Мета-тег HTML**

1. Скопіюйте мета-тег (буде виглядати так):
   ```html
   <meta name="google-site-verification" content="abc123...">
   ```
2. Додайте його в `<head>` файлу `index.html` (після інших мета-тегів)
3. Завантажте оновлений файл на GitHub
4. Натисніть **"Підтвердити"**

### Крок 4: Надішліть Sitemap

1. У Google Search Console перейдіть в **"Sitemap"**
2. Введіть: `sitemap.xml`
3. Натисніть **"Відправити"**

**Готово!** Через 1-7 днів сайт почне з'являтися в пошуку.

---

## 📊 Додати Google Analytics (опціонально)

### Щоб бачити статистику відвідувачів:

1. Перейдіть на https://analytics.google.com
2. Створіть обліковий запис
3. Отримайте код відстеження (Tracking ID)
4. Додайте перед `</head>` в `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

*(замініть `G-XXXXXXXXXX` на ваш Tracking ID)*

---

## 🔧 Оновлення сайту

### Як змінити файли після розміщення:

1. У GitHub репозиторії відкрийте потрібний файл
2. Натисніть на іконку **✏️ (олівець)** - "Edit this file"
3. Внесіть зміни
4. Натисніть **"Commit changes"**
5. Через 1-2 хвилини зміни з'являться на сайті

---

## 🎯 Чеклист після розміщення

- [ ] Сайт доступний за URL
- [ ] Всі сторінки відкриваються
- [ ] Форма замовлення працює
- [ ] Telegram Bot працює
- [ ] URL оновлені в файлах
- [ ] Зареєстровано в Google Search Console
- [ ] Sitemap відправлено
- [ ] robots.txt доступний
- [ ] Google Analytics підключено (опціонально)

---

## 💡 Переваги GitHub Pages

✅ **Безкоштовно** - назавжди  
✅ **HTTPS** - автоматично (безпечне з'єднання)  
✅ **Швидко** - CDN по всьому світу  
✅ **Надійно** - 99.9% uptime  
✅ **Просто** - оновлення через веб-інтерфейс  
✅ **Git** - версіонування змін  

---

## ❓ Вирішення проблем

### Проблема: "404 Page not found"

**Рішення:**
- Перевірте, чи файл `index.html` в корені репозиторію
- Перевірте, чи увімкнено GitHub Pages в налаштуваннях
- Почекайте 2-3 хвилини після увімкнення

### Проблема: Зміни не відображаються

**Рішення:**
- Очистіть кеш браузера (Ctrl+Shift+R)
- Почекайте 1-2 хвилини після commit
- Перевірте GitHub Actions (вкладка Actions) - чи успішний build

### Проблема: Форма не працює

**Рішення:**
- Перевірте консоль браузера (F12)
- Telegram Bot Token та Chat ID правильні?
- EmailJS налаштований?

---

## 📞 Підтримка

**Питання?** Документація:
- 📖 `SEO_GUIDE.md` - повний SEO посібник
- 📱 `TELEGRAM_SETUP.md` - налаштування Telegram
- 📋 `README.md` - головна документація

---

## 🎉 Готово!

Ваш сайт тепер в Інтернеті!

**URL:** `https://username.github.io/glister/`

**Наступні кроки:**
1. ✅ Оновіть URL в файлах
2. ✅ Зареєструйте в Google Search Console
3. ✅ Надішліть sitemap
4. ✅ Чекайте 1-7 днів

**Успіхів! 🚀**
