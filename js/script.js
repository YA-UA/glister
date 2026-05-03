// ============================================
// НАЛАШТУВАННЯ TELEGRAM BOT
// ============================================
// ВАЖЛИВО: Токен бота НЕ зберігається тут.
// Використовуйте Cloudflare Worker або інший проксі-сервер.
// Інструкція: TELEGRAM_SETUP.md
const TELEGRAM_CONFIG = {
    enabled: true,
    // FIX: Токен видалено з коду — він був відкритий публічно.
    // Вставте сюди URL вашого Cloudflare Worker замість прямого виклику Telegram API.
    workerUrl: 'https://telegramm.movementnow4.workers.dev'
};

// ============================================
// Smooth Scroll for Navigation Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// ВІДПРАВКА В TELEGRAM (через Worker-проксі)
// ============================================
async function sendToTelegram(orderData) {
    if (!TELEGRAM_CONFIG.enabled) {
        console.log('Telegram відправка вимкнена');
        return { success: false, disabled: true };
    }

    if (!TELEGRAM_CONFIG.workerUrl || TELEGRAM_CONFIG.workerUrl.includes('YOUR_WORKER')) {
        console.warn('Telegram Worker URL не налаштовано. Перегляньте TELEGRAM_SETUP.md');
        return { success: false, notConfigured: true };
    }

    try {
        const orderId = Date.now().toString().slice(-6);

        const message = `
🎉 НОВЕ ЗАМОВЛЕННЯ #${orderId}

📦 Товар: ${orderData.productName}
💰 Ціна: ${orderData.productPrice}

👤 Клієнт:
• Ім'я: ${orderData.customerName}
• Телефон: ${orderData.customerPhone}
• 📮 Відділення НП: ${orderData.customerNovaPoshta}

${orderData.customerOtherProduct !== 'Не вказано' ? `📝 Додатковий товар:\n${orderData.customerOtherProduct}\n` : ''}
💝 Доставка НП - комплімент від нас!

📅 Дата: ${orderData.orderDate}
        `.trim();

        // FIX: Відправляємо на Worker, а не напряму на api.telegram.org
        const response = await fetch(TELEGRAM_CONFIG.workerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (response.ok) {
            console.log('✅ Замовлення успішно відправлено в Telegram!');
            return { success: true };
        } else {
            const error = await response.json();
            console.error('❌ Помилка Worker:', error);
            return { success: false, error };
        }
    } catch (error) {
        console.error('❌ Помилка відправки в Telegram:', error);
        return { success: false, error };
    }
}

// ============================================
// ОБРОБКА ФОРМИ ЗАМОВЛЕННЯ
// ============================================
const orderForm = document.getElementById('orderForm');

orderForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = this.name.value.trim();
    const phone = this.phone.value.trim();
    const novaposhta = this.novaposhta.value.trim();
    const otherProduct = this.other_product.value.trim();

    const submitBtn = this.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Відправляємо...';
    submitBtn.disabled = true;

    const orderData = {
        customer_name: name,
        customer_phone: phone,
        customer_novaposhta: novaposhta,
        customer_other_product: otherProduct || 'Не вказано',
        product_name: 'Зубна паста Glister',
        product_price: '243 грн',
        order_date: new Date().toLocaleString('uk-UA'),
        customerName: name,
        customerPhone: phone,
        customerNovaPoshta: novaposhta,
        customerOtherProduct: otherProduct || 'Не вказано',
        productName: 'Зубна паста Glister',
        productPrice: '243 грн',
        orderDate: new Date().toLocaleString('uk-UA')
    };

    let emailSuccess = false;
    let telegramSuccess = false;

    const telegramPromise = sendToTelegram(orderData).then(result => {
        telegramSuccess = result.success;
        return result;
    });

    const emailPromise = emailjs.send('service_15o58fb', 'template_wi33vyz', orderData)
        .then(function(response) {
            console.log('✅ Email успішно відправлено!', response.status);
            emailSuccess = true;
            return { success: true };
        })
        .catch(function(error) {
            console.error('❌ Помилка Email:', error);
            return { success: false, error: error };
        });

    try {
        await Promise.all([telegramPromise, emailPromise]);

        if (emailSuccess || telegramSuccess) {
            const channels = [];
            if (emailSuccess) channels.push('Email');
            if (telegramSuccess) channels.push('Telegram');
            console.log(`✅ Замовлення відправлено через: ${channels.join(' та ')}`);
            showSuccessMessage(name, emailSuccess, telegramSuccess);
            orderForm.reset();
        } else {
            console.error('❌ Помилка відправки замовлення');
            showErrorMessage();
        }
    } catch (error) {
        console.error('❌ Критична помилка:', error);
        showErrorMessage();
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ============================================
// МОДАЛЬНІ ВІКНА
// ============================================
function showSuccessMessage(customerName, emailSent = false, telegramSent = false) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8); display: flex;
        align-items: center; justify-content: center;
        z-index: 9999; animation: fadeIn 0.3s ease;
    `;

    const message = document.createElement('div');
    message.style.cssText = `
        background: white; padding: 40px; border-radius: 20px;
        text-align: center; max-width: 500px; animation: slideIn 0.3s ease;
    `;

    let successText = '';
    if (emailSent && telegramSent) {
        successText = 'Ваше замовлення успішно відправлено через Email та Telegram! Ми зв\'яжемося з вами найближчим часом.';
    } else if (emailSent) {
        successText = 'Ваше замовлення успішно відправлено на Email! Ми зв\'яжемося з вами найближчим часом.';
    } else if (telegramSent) {
        successText = 'Ваше замовлення успішно відправлено в Telegram! Ми зв\'яжемося з вами найближчим часом.';
    } else {
        successText = 'Ваше замовлення прийнято. Очікуйте на дзвінок!';
    }

    message.innerHTML = `
        <div style="font-size:64px;margin-bottom:20px;">✅</div>
        <h2 style="font-size:28px;font-weight:700;color:#1a1a2e;margin-bottom:15px;">
            ${customerName}, дякуємо за замовлення!
        </h2>
        <p style="font-size:18px;color:#666;margin-bottom:30px;">${successText}</p>
        <button onclick="this.parentElement.parentElement.remove()"
                style="background:linear-gradient(135deg,#00a8e8 0%,#007bb5 100%);
                       color:white;padding:15px 40px;border:none;border-radius:50px;
                       font-size:16px;font-weight:700;cursor:pointer;">
            Закрити
        </button>
    `;

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });

    setTimeout(() => {
        if (document.body.contains(overlay)) {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        }
    }, 5000);
}

function showErrorMessage() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8); display: flex;
        align-items: center; justify-content: center;
        z-index: 9999; animation: fadeIn 0.3s ease;
    `;

    const message = document.createElement('div');
    message.style.cssText = `
        background: white; padding: 40px; border-radius: 20px;
        text-align: center; max-width: 500px; animation: slideIn 0.3s ease;
    `;

    message.innerHTML = `
        <div style="font-size:64px;margin-bottom:20px;">⚠️</div>
        <h2 style="font-size:28px;font-weight:700;color:#1a1a2e;margin-bottom:15px;">
            Помилка відправки
        </h2>
        <p style="font-size:18px;color:#666;margin-bottom:20px;">Не вдалося відправити замовлення.</p>
        <p style="font-size:16px;color:#666;margin-bottom:30px;">
            Зв'яжіться з нами через Viber:<br>
            <a href="viber://chat?number=%2B380737251639" style="color:#7360f2;font-weight:700;text-decoration:none;">
                +380 73 725 16 39
            </a>
        </p>
        <button onclick="this.parentElement.parentElement.remove()"
                style="background:linear-gradient(135deg,#00a8e8 0%,#007bb5 100%);
                       color:white;padding:15px 40px;border:none;border-radius:50px;
                       font-size:16px;font-weight:700;cursor:pointer;">
            Закрити
        </button>
    `;

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });

    setTimeout(() => {
        if (document.body.contains(overlay)) {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        }
    }, 7000);
}

// ============================================
// АНІМАЦІЇ
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-50px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// ============================================
// ДОДАТКОВІ ЕФЕКТИ
// ============================================

// Header Scroll Effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        header.style.padding = '10px 0';
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.padding = '15px 0';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Phone Input Mask
const phoneInput = document.querySelector('input[type="tel"]');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0 && value[0] !== '3') {
            value = '380' + value;
        }
        if (value.length > 12) value = value.slice(0, 12);

        let formatted = '+';
        if (value.length > 0) formatted += value.substring(0, 3);
        if (value.length > 3) formatted += ' ' + value.substring(3, 5);
        if (value.length > 5) formatted += ' ' + value.substring(5, 8);
        if (value.length > 8) formatted += ' ' + value.substring(8, 10);
        if (value.length > 10) formatted += ' ' + value.substring(10, 12);

        e.target.value = formatted;
    });
}

// Intersection Observer for Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.benefit-card, .feature-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

console.log('🎉 Glister Landing Page завантажено успішно!');
console.log('📧 Email: ' + (typeof emailjs !== 'undefined' ? '✅ Підключено' : '❌ Не налаштовано'));
console.log('📱 Telegram Worker: ' + (TELEGRAM_CONFIG.workerUrl.includes('YOUR_WORKER') ? '⚠️ Не налаштовано' : '✅ Налаштовано'));
