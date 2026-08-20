function buyPremium(username) {
  if (!username) {
    alert("Пожалуйста, введите ваш ник перед покупкой!");
    return;
  }
  
  // Пример генерации ссылки для платежки Aaio
  // В реальном проекте параметры (merchant_id, secret, id заказа) настраиваются в ЛК платежки
  const merchantId = "ТВОЙ_ID_МЕРЧАНТА";
  const amount = "299"; // Цена премиума в рублях
  const orderId = username; // Передаем ник игрока, чтобы сервер понял, кому выдать PREM
  
  const paymentUrl = `https://aaio.io{merchantId}&amount=${amount}&order_id=${orderId}`;
  
  // Открываем платежную систему в новом окне
  window.open(paymentUrl, '_blank');
}