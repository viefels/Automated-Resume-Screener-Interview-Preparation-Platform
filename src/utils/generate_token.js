import crypto from "node:crypto";
import { configDotenv } from "dotenv";
configDotenv();

function hasThreeConsecutive(code) {
  for (let i = 0; i <= code.length - 3; i++) {
    const d1 = Number(code[i]);
    const d2 = Number(code[i + 1]);
    const d3 = Number(code[i + 2]);

    if (d1 === d2 && d2 === d3) {
      return true;
    }

    if (d2 === d1 + 1 && d3 === d2 + 1) {
      return true;
    }

    if (d2 === d1 - 1 && d3 === d2 - 1) {
      return true;
    }
  }

  return false;
}

export function hashOtp(otp){
  const hashedOtp = crypto
                    .createHmac("sha256", process.env.OTP_SECRET)
                    .update(otp)
                    .digest("hex");
  
  return { hashedOtp}
}

export default function generateSecureOtp(length = 6) {
  const minOtp = 10 ** (length - 1);
  const maxOtp = 10 ** length - 1;
  while (true) {
    const rawNumber = crypto.randomInt(minOtp, maxOtp + 1);
    const code = rawNumber.toString().padStart(6, "0");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000 );
    if (!hasThreeConsecutive(code)) {
      return {otp: code, ...hashOtp(code), expiresAt};
    }
  }
}


