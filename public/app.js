const emailInput = document.getElementById("email");
const sendBtn = document.getElementById("send-otp");
const otpInput = document.getElementById("otp-input");
const verifyBtn = document.getElementById("verify-otp");
const otpSection = document.getElementById("otp-section");

emailInput.addEventListener("keydown", e => { if (e.key === "Enter") sendOTP(); });
otpInput.addEventListener("keydown", e => { if (e.key === "Enter") verifyOTP(); });
sendBtn.addEventListener("click", sendOTP);
verifyBtn.addEventListener("click", verifyOTP);

async function sendOTP() {
  const email = emailInput.value.trim().toLowerCase();
  const res = await fetch("/.netlify/functions/request-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  if (res.ok) {
    alert("OTP sent! Check your inbox.");
    otpSection.style.display = "block";
  } else alert("Error sending OTP");
}

async function verifyOTP() {
  const email = emailInput.value.trim().toLowerCase();
  const code = otpInput.value.trim();
  const res = await fetch("/.netlify/functions/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  if (res.ok) alert("Login successful!");
  else alert("Invalid or expired OTP");
}
