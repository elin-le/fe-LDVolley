// images: up to 3 URLs per product. These are random placeholder photos (picsum.photos):
// replace img(id) with your own links, e.g. images: ['https://.../a.jpg', 'https://.../b.jpg', 'https://.../c.jpg']
const img = (id) => [1, 2, 3].map((n) => `https://picsum.photos/seed/ldv-${id}-${n}/800/1000`)
const p = (id, category, vi, en, price, tone, dvi, den, best = false) =>
  ({ id, category, name: { vi, en }, desc: { vi: dvi, en: den }, price, tone, best, images: img(id), wholesale: Math.round((price * 0.8) / 1000) * 1000, minQty: 10 })

export const products = [
  p('p1', 'balls', 'Bóng thi đấu LD Pro', 'LD Pro Match Ball', 890000, 'from-wine-600 to-wine-700', 'Bóng thi đấu trong nhà, bề mặt bám tay, bay ổn định khi phát và đập bóng.', 'Indoor match ball with a grippy surface and stable flight on serves and spikes.', true),
  p('p2', 'shoes', 'Giày Spike Elite', 'Spike Elite Shoes', 1850000, 'from-navy-800 to-navy-900', 'Đế cao su bám sân, đệm gót êm giúp bật nhảy cao và tiếp đất an toàn.', 'Grippy rubber outsole and a cushioned heel for high jumps and safe landings.'),
  p('p3', 'pads', 'Băng gối Guard X', 'Guard X Knee Pads', 320000, 'from-navy-800 to-wine-700', 'Đệm xốp dày bảo vệ đầu gối khi cứu bóng, co giãn thoải mái.', 'Thick foam padding for floor digs, with a comfortable stretch fit.'),
  p('p4', 'apparel', 'Áo đấu Court Line', 'Court Line Jersey', 450000, 'from-wine-700 to-navy-900', 'Vải nhẹ thoáng khí, co giãn bốn chiều, khô nhanh khi vào set quyết định.', 'Light, breathable four-way stretch fabric that dries fast in deciding sets.', true),
  p('p5', 'balls', 'Bóng bãi biển Sand Tour', 'Sand Tour Beach Ball', 650000, 'from-wine-700 to-wine-600', 'Bóng bãi biển chống nước, mềm tay, dễ quan sát dưới nắng.', 'Water-resistant, soft-touch beach ball that stays visible in bright sun.'),
  p('p6', 'shoes', 'Giày Block Light', 'Block Light Shoes', 1450000, 'from-navy-900 to-navy-800', 'Nhẹ, ôm chân, phù hợp libero và chuyền hai cần di chuyển nhanh.', 'Lightweight and snug, built for liberos and setters who move fast.'),
  p('p7', 'pads', 'Bó cổ chân Ankle Lock', 'Ankle Lock Brace', 280000, 'from-wine-600 to-navy-800', 'Cố định cổ chân khi tiếp đất, mỏng nên vẫn đi vừa giày thi đấu.', 'Stabilises the ankle on landing and is slim enough for match shoes.'),
  p('p8', 'apparel', 'Quần short Serve', 'Serve Shorts', 360000, 'from-navy-800 to-wine-600', 'Lưng thun êm, ống rộng vừa phải để xoay người và đập bóng.', 'Soft waistband and a relaxed leg for turning and hitting.'),
]
