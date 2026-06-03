// Simulates a real async cart API call — random ~20% failure rate
export async function mockAddToCartAPI(payload) {
  await new Promise(r => setTimeout(r, 900 + Math.random() * 400));

  if (Math.random() < 0.2) {
    throw new Error('Oops — something went wrong on our end. Try again.');
  }

  return { success: true, cartId: crypto.randomUUID(), ...payload };
}
