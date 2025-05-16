import crypto from "crypto";

const resetoken = crypto.randomBytes(20).toString("hex");
console.log(resetoken);

const resettokeHash = crypto.createHash("sha256").update(resetoken).digest("hex");
console.log(resettokeHash)
